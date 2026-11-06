import { Router, type Request, type Response, type NextFunction } from "express";
import { z } from "zod";
import crypto from "node:crypto";
import { pool } from "./db";
import { storage } from "./storage";

// Mounted behind signed Catering staff authentication in kitchenRoutes.ts.
// Existing catering_staff accounts remain the identity source; do not create duplicate users.
type StaffRequest=Request & {staff?:{id:number;role:string}};
const router=Router();
const managerRoles=["account_manager","operations_supervisor"];
const shiftRoles=[...managerRoles,"head_chef","food_safety_supervisor","inventory_manager","logistics_coordinator","team_lead"];
const newShift=z.object({
  staffId:z.number().int().positive(),
  station:z.string().trim().min(2).max(120),
  startsAt:z.string().datetime({offset:true}),
  endsAt:z.string().datetime({offset:true}),
  duty:z.string().trim().max(500).optional()
}).strict();
let initialization:Promise<void>|undefined;
function problem(res:Response,code:number,error:string){return res.status(code).json({success:false,error});}
const asyncRoute=(fn:(req:StaffRequest,res:Response,next:NextFunction)=>Promise<unknown>)=>
 (req:StaffRequest,res:Response,next:NextFunction)=>{Promise.resolve(fn(req,res,next)).catch(next);};
function manager(req:StaffRequest,res:Response,next:NextFunction){
 if(!req.staff||!managerRoles.includes(req.staff.role))return problem(res,403,"Only Kitchen management may administer staff shifts");
 next();
}
async function initDb(){
 await pool.query(`CREATE TABLE IF NOT EXISTS kitchen_staff_shifts (
  id UUID PRIMARY KEY, staff_id INTEGER NOT NULL, station TEXT NOT NULL,
  starts_at TIMESTAMPTZ NOT NULL, ends_at TIMESTAMPTZ NOT NULL,
  duty TEXT NOT NULL DEFAULT '', status TEXT NOT NULL DEFAULT 'draft'
  CHECK(status IN ('draft','published','cancelled','completed')),
  assigned_by INTEGER NOT NULL, created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CHECK(ends_at>starts_at)
 )`);
 await pool.query(`CREATE TABLE IF NOT EXISTS kitchen_staff_timecards (
  id UUID PRIMARY KEY,shift_id UUID NOT NULL UNIQUE REFERENCES kitchen_staff_shifts(id),
  staff_id INTEGER NOT NULL,clock_in TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  clock_out TIMESTAMPTZ, approved_by INTEGER,approved_at TIMESTAMPTZ,
  CHECK(clock_out IS NULL OR clock_out>=clock_in)
 )`);
 await pool.query(`CREATE TABLE IF NOT EXISTS kitchen_staff_shift_events (
  id BIGSERIAL PRIMARY KEY,shift_id UUID NOT NULL REFERENCES kitchen_staff_shifts(id),
  action TEXT NOT NULL,note TEXT NOT NULL DEFAULT '',actor_staff_id INTEGER NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
 )`);
 await pool.query("CREATE INDEX IF NOT EXISTS kitchen_staff_shifts_staff_time_idx ON kitchen_staff_shifts(staff_id,starts_at DESC)");
}
function ensure(){if(!initialization)initialization=initDb().catch(e=>{initialization=undefined;throw e;});return initialization;}
router.get("/members",manager,asyncRoute(async(_req,res)=>{
 const all=await storage.getAllCateringStaff();
 return res.json({success:true,members:all.filter(s=>shiftRoles.includes(s.role)).map(s=>({
  id:s.id,name:s.firstName+" "+s.lastName,role:s.role,
  email:s.email,phone:s.phone,isActive:s.isActive
 }))});
}));
router.get("/shifts",asyncRoute(async(req,res)=>{
 await ensure();
 const isManager=managerRoles.includes(req.staff!.role);
 const result=await pool.query(`SELECT s.id,s.staff_id AS "staffId",s.station,
  s.starts_at AS "startsAt",s.ends_at AS "endsAt",s.duty,s.status,
  s.assigned_by AS "assignedBy",s.created_at AS "createdAt",
  t.clock_in AS "clockIn",t.clock_out AS "clockOut",
  t.approved_by AS "approvedBy",t.approved_at AS "approvedAt",
  CASE WHEN t.clock_out IS NOT NULL THEN ROUND(EXTRACT(EPOCH FROM(t.clock_out-t.clock_in))/3600,2) ELSE NULL END::float AS "hoursWorked"
  FROM kitchen_staff_shifts s LEFT JOIN kitchen_staff_timecards t ON t.shift_id=s.id
  WHERE ($1::boolean OR s.staff_id=$2) ORDER BY s.starts_at DESC LIMIT 250`,
  [isManager,req.staff!.id]);
 return res.json({success:true,shifts:result.rows});
}));
router.post("/shifts",manager,asyncRoute(async(req,res)=>{
 await ensure();
 const p=newShift.safeParse(req.body);
 if(!p.success)return problem(res,400,"Provide assigned staff, station and valid shift dates");
 const v=p.data;
 const start=Date.parse(v.startsAt),end=Date.parse(v.endsAt);
 if(!Number.isFinite(start)||!Number.isFinite(end)||end<=start||end-start>24*3600000)
  return problem(res,400,"Shift must have a valid duration of up to 24 hours");
 if(start<Date.now()-3600000)return problem(res,400,"Cannot create a shift in the past");
 const account=await storage.getCateringStaffById(v.staffId);
 if(!account||!account.isActive||!shiftRoles.includes(account.role))return problem(res,400,"Select an active Catering employee");
 const conflict=await pool.query(`SELECT id FROM kitchen_staff_shifts WHERE staff_id=$1
  AND status IN ('draft','published') AND starts_at<$3 AND ends_at>$2 LIMIT 1`,
  [v.staffId,v.startsAt,v.endsAt]);
 if(conflict.rowCount)return problem(res,409,"Employee already has an overlapping duty shift");
 const id=crypto.randomUUID();
 await pool.query(`INSERT INTO kitchen_staff_shifts (id,staff_id,station,starts_at,ends_at,duty,assigned_by)
  VALUES($1,$2,$3,$4,$5,$6,$7)`,
  [id,v.staffId,v.station,v.startsAt,v.endsAt,v.duty||"",req.staff!.id]);
 await pool.query(`INSERT INTO kitchen_staff_shift_events(shift_id,action,note,actor_staff_id)
   VALUES($1,'draft_created',$2,$3)`,[id,v.duty||"New shift draft",req.staff!.id]);
 return res.status(201).json({success:true,id,status:"draft"});
}));
router.patch("/shifts/:id/publish",manager,asyncRoute(async(req,res)=>{
 await ensure();
 if(!z.string().uuid().safeParse(req.params.id).success)return problem(res,400,"Invalid shift");
 const updated=await pool.query(`UPDATE kitchen_staff_shifts SET status='published',updated_at=NOW()
   WHERE id=$1 AND status='draft' RETURNING id`,[req.params.id]);
 if(!updated.rowCount)return problem(res,409,"Only draft shifts may be published");
 await pool.query(`INSERT INTO kitchen_staff_shift_events(shift_id,action,note,actor_staff_id)
  VALUES($1,'published','Roster published',$2)`,[req.params.id,req.staff!.id]);
 return res.json({success:true,status:"published"});
}));
router.post("/shifts/:id/clock-in",asyncRoute(async(req,res)=>{
 await ensure();
 if(!z.string().uuid().safeParse(req.params.id).success)return problem(res,400,"Invalid shift");
 const shift=(await pool.query("SELECT * FROM kitchen_staff_shifts WHERE id=$1",[req.params.id])).rows[0];
 if(!shift||shift.staff_id!==req.staff!.id||shift.status!=="published")return problem(res,403,"No active published shift assigned to you");
 const start=new Date(shift.starts_at).getTime(),end=new Date(shift.ends_at).getTime(),now=Date.now();
 if(now<start-2*3600000||now>end)return problem(res,409,"Clock-in is only available around the assigned shift");
 const id=crypto.randomUUID();
 try{
  await pool.query("INSERT INTO kitchen_staff_timecards(id,shift_id,staff_id) VALUES($1,$2,$3)",
    [id,shift.id,req.staff!.id]);
 }catch(e:any){if(e?.code==="23505")return problem(res,409,"Already clocked in for this shift");throw e;}
 await pool.query(`INSERT INTO kitchen_staff_shift_events(shift_id,action,note,actor_staff_id)
   VALUES($1,'clock_in','Clocked in using server time',$2)`,[shift.id,req.staff!.id]);
 return res.status(201).json({success:true,shiftId:shift.id});
}));
router.post("/shifts/:id/clock-out",asyncRoute(async(req,res)=>{
 await ensure();
 const updated=await pool.query(`UPDATE kitchen_staff_timecards SET clock_out=NOW()
  WHERE shift_id=$1 AND staff_id=$2 AND clock_out IS NULL RETURNING shift_id`,
  [req.params.id,req.staff!.id]);
 if(!updated.rowCount)return problem(res,409,"No open timecard for this shift");
 await pool.query(`INSERT INTO kitchen_staff_shift_events(shift_id,action,note,actor_staff_id)
   VALUES($1,'clock_out','Clocked out using server time',$2)`,[req.params.id,req.staff!.id]);
 return res.json({success:true,shiftId:req.params.id});
}));
router.patch("/shifts/:id/approve",manager,asyncRoute(async(req,res)=>{
 await ensure();
 const client=await pool.connect();
 try{
  await client.query("BEGIN");
  const shift=(await client.query("SELECT * FROM kitchen_staff_shifts WHERE id=$1 FOR UPDATE",[req.params.id])).rows[0];
  const time=(await client.query("SELECT * FROM kitchen_staff_timecards WHERE shift_id=$1 FOR UPDATE",[req.params.id])).rows[0];
  if(!shift||shift.status!=="published"||!time?.clock_out){
   await client.query("ROLLBACK");return problem(res,409,"Shift requires a published roster and completed timecard");
  }
  if(shift.staff_id===req.staff!.id){await client.query("ROLLBACK");return problem(res,403,"Staff cannot approve their own timecard");}
  await client.query("UPDATE kitchen_staff_timecards SET approved_by=$2,approved_at=NOW() WHERE shift_id=$1",
    [req.params.id,req.staff!.id]);
  await client.query("UPDATE kitchen_staff_shifts SET status='completed',updated_at=NOW() WHERE id=$1",[req.params.id]);
  await client.query(`INSERT INTO kitchen_staff_shift_events(shift_id,action,note,actor_staff_id)
    VALUES($1,'approved','Completed timecard approved for payroll preparation',$2)`,
    [req.params.id,req.staff!.id]);
  await client.query("COMMIT");
  return res.json({success:true,status:"completed"});
 }catch(e){await client.query("ROLLBACK");throw e;}finally{client.release();}
}));
router.get("/audit",manager,asyncRoute(async(_req,res)=>{
 await ensure();
 const result=await pool.query(`SELECT id,shift_id AS "shiftId",action,note,
  actor_staff_id AS "actorStaffId",created_at AS "createdAt"
  FROM kitchen_staff_shift_events ORDER BY id DESC LIMIT 150`);
 return res.json({success:true,events:result.rows});
}));
export default router;
