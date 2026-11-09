import test from 'node:test';
import assert from 'node:assert/strict';
import {randomBytes} from 'node:crypto';
import jwt from 'jsonwebtoken';
import express from 'express';
import {once} from 'node:events';
import {jwtSigningSecret,approvedCorporateOrigin,corporateCors} from './securityPolicy';
import {generateToken,generateResetToken,verifyToken} from './auth';
import {requireCorporateAdministrator} from './corporateAdminGuard';

test('corporate access rejects default signing keys, misplaced tokens, forged origins and tenant-only administrators',async()=>{
 const key=randomBytes(32).toString('hex');
 for(const v of [undefined,'short','totag-enterprise-jwt-secret-key-2026-production'])assert.throws(()=>jwtSigningSecret(v?{JWT_SECRET:v}:{}));
 assert.equal(approvedCorporateOrigin('https://totaggroup.com','production'),true);
 assert.equal(approvedCorporateOrigin('https://totaggroup.com.attacker.invalid','production'),false);
 assert.equal(approvedCorporateOrigin('https://attacker.github.io','production'),false);
 assert.equal(approvedCorporateOrigin('http://localhost:3000','production'),false);
 const prior=process.env.JWT_SECRET,priorIds=process.env.TOTAG_CORPORATE_ADMIN_USER_IDS;
 process.env.JWT_SECRET=key;process.env.TOTAG_CORPORATE_ADMIN_USER_IDS='test-corporate-admin';
 const user={userId:'test-tenant-admin',tenantId:'fictional-tenant',email:'test@example.invalid',role:'admin',permissions:[],isTenantAdmin:true};
 const app=express();app.use(corporateCors);app.get('/private',requireCorporateAdministrator,(_req,res)=>res.json({ok:true}));
 const server=app.listen(0,'127.0.0.1');await once(server,'listening');const url='http://127.0.0.1:'+(server.address() as any).port+'/private';
 const get=(token?:string,origin='https://totaggroup.com')=>fetch(url,{headers:{Origin:origin,...(token?{Authorization:`Bearer ${token}`}:{})}});
 try{
  const reset=generateResetToken();assert.equal(verifyToken(reset),null);
  const forged=jwt.sign({...user,userId:'test-corporate-admin',type:'access'},'totag-enterprise-jwt-secret-key-2026-production',{issuer:'totag-it-services',audience:'totag-enterprise-clients',expiresIn:'5m'});
  assert.equal((await get()).status,401);assert.equal((await get(forged)).status,401);assert.equal((await get(reset)).status,401);
  assert.equal((await get(generateToken(user))).status,403);
  const admin=generateToken({...user,userId:'test-corporate-admin'});
  assert.equal((await get(admin,'https://totaggroup.com.attacker.invalid')).status,403);
  const response=await get(admin);assert.equal(response.status,200);assert.equal(response.headers.get('Access-Control-Allow-Origin'),'https://totaggroup.com');
 }finally{
  if(prior===undefined)delete process.env.JWT_SECRET;else process.env.JWT_SECRET=prior;
  if(priorIds===undefined)delete process.env.TOTAG_CORPORATE_ADMIN_USER_IDS;else process.env.TOTAG_CORPORATE_ADMIN_USER_IDS=priorIds;
  await new Promise<void>(resolve=>server.close(()=>resolve()));
 }
});
