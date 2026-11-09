import type {Request,Response,NextFunction} from 'express';

const unsafeKeys=new Set(['totag-enterprise-jwt-secret-key-2026-production','dev-secret-key-change-in-production']);
export function jwtSigningSecret(env:NodeJS.ProcessEnv=process.env):string{
 const value=env.JWT_SECRET;
 if(!value||value.length<32||unsafeKeys.has(value))throw Error('Configure a strong private JWT signing secret before enabling staff authentication.');
 return value;
}
const corporateOrigins=['https://totaggroup.com','https://www.totaggroup.com','https://totag.network','https://www.totag.network','https://totagits.github.io'];
export function approvedCorporateOrigin(origin:string|undefined,environment=process.env.NODE_ENV){
 if(!origin)return false;
 return corporateOrigins.includes(origin)||(environment!=='production'&&['http://localhost:5000','http://127.0.0.1:5000','http://localhost:3000','http://127.0.0.1:3000'].includes(origin));
}
export function corporateCors(req:Request,res:Response,next:NextFunction){
 const origin=req.get('Origin');res.vary('Origin');
 if(origin&&!approvedCorporateOrigin(origin))return res.status(403).json({error:'This website origin is not permitted.'});
 if(origin){res.setHeader('Access-Control-Allow-Origin',origin);res.setHeader('Access-Control-Allow-Credentials','true');}
 res.setHeader('Access-Control-Allow-Methods','GET, POST, PUT, DELETE, PATCH, OPTIONS');
 res.setHeader('Access-Control-Allow-Headers','Content-Type, Authorization, X-Requested-With');
 if(req.method==='OPTIONS')return res.sendStatus(204);
 next();
}
export function corporateAdminAllowed(user:{id?:string;role?:string}|undefined,env:NodeJS.ProcessEnv=process.env){
 const approved=String(env.TOTAG_CORPORATE_ADMIN_USER_IDS||'').split(',').map(s=>s.trim()).filter(Boolean);
 return Boolean(user?.id&&user.role==='admin'&&approved.includes(user.id));
}
