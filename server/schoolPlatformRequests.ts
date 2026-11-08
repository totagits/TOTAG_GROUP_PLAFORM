import express from 'express';
import {createHmac} from 'node:crypto';
import {validateSchoolRequest} from '../shared/schoolRequest.js';

// This bridge never reads the corporate or school databases, grants accounts,
// accepts payments or initializes a provider. Its key remains server-side.
export function schoolPlatformRequests(options:{origin?:string;secret?:string;fetcher?:typeof fetch;allowedOrigins?:string[];allowLoopback?:boolean}={}){
 const router=express.Router(),secret=options.secret??process.env.TOTAG_SCHOOL_INTAKE_SECRET;
 const configuredOrigin=options.origin??process.env.TOTAG_SCHOOL_CONSOLE_URL;
 const origins=options.allowedOrigins??['https://totaggroup.com','https://www.totaggroup.com','https://totag.network','https://www.totag.network'];
 let target:string|null=null;
 try{const url=new URL(configuredOrigin||'');if((url.protocol==='https:'||options.allowLoopback&&url.protocol==='http:'&&['localhost','127.0.0.1'].includes(url.hostname))&&url.pathname==='/'&&!url.username&&!url.password&&!url.search&&!url.hash&&secret&&secret.length>=43)target=url.origin+'/api/intake/school-requests';}catch{}
 const attempts=new Map<string,{count:number;until:number}>();
 router.use((_req,res,next)=>{res.set({'Cache-Control':'no-store','X-Content-Type-Options':'nosniff'});next();});
 router.get('/status',(_req,res)=>res.json({acceptingRequests:Boolean(target)}));
 router.post('/',async(req,res)=>{
  if(!origins.includes(req.get('Origin')||''))return res.status(403).json({error:'Submit the request from the TOTAG website.'});
  const now=Date.now();attempts.forEach((v,k)=>{if(v.until<now)attempts.delete(k);});
  const key=req.ip||'unknown',item=attempts.get(key)||{count:0,until:now+900000};
  if(item.count>=5||attempts.size>=10000)return res.status(429).json({error:'Please wait before sending another request.'});item.count++;attempts.set(key,item);
  if(!target)return res.status(503).json({error:'Online school requests are not available yet. Please contact tis@totaggroup.com.'});
  if(!req.is('application/json')||Buffer.byteLength(JSON.stringify(req.body??{}))>20000)return res.status(400).json({error:'Use a school request within the allowed size.'});
  let request;try{request=validateSchoolRequest(req.body);}catch{return res.status(400).json({error:'Check the school request fields and contact consent.'});}
  const raw=JSON.stringify(request),timestamp=String(Date.now()),signature=createHmac('sha256',secret!).update(timestamp+'.'+raw).digest('hex');
  try{
   const response=await(options.fetcher??fetch)(target,{method:'POST',redirect:'error',signal:AbortSignal.timeout(10000),headers:{'Content-Type':'application/json','X-TOTAG-Timestamp':timestamp,'X-TOTAG-Signature':signature},body:raw});
   const result=await response.json();
   if(!response.ok||!/^SCH-\d{4}-[A-F0-9]{12}$/.test(result.reference))throw Error('Intake unavailable');
   return res.status(201).json({reference:result.reference,message:'Your request has been received for TOTAG review. No site or account has been activated.'});
  }catch{return res.status(503).json({error:'Your request could not be confirmed. Keep these details and retry; the same request will not be duplicated.'});}
 });
 return router;
}
