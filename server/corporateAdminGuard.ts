import type {Request,Response,NextFunction} from 'express';
import {extractToken,verifyToken} from './auth';
import {corporateAdminAllowed} from './securityPolicy';

// A customer tenant administrator is not a corporate portfolio administrator.
// The explicit identity allowlist is configured through an approved staff grant.
export function requireCorporateAdministrator(req:Request,res:Response,next:NextFunction){
 const token=extractToken(req),payload=token?verifyToken(token):null;
 if(!payload)return res.status(401).json({success:false,error:'Approved staff sign-in is required.'});
 if(!corporateAdminAllowed({id:payload.userId,role:payload.role}))return res.status(403).json({success:false,error:'Corporate administration is not available to this account.'});
 next();
}
