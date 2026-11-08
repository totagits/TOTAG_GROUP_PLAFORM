import test from 'node:test';
import assert from 'node:assert/strict';
import express from 'express';
import {once} from 'node:events';
import {createHmac} from 'node:crypto';
import {schoolPlatformRequests} from './schoolPlatformRequests';
const body={schemaVersion:1,requestId:'12345678-1234-4123-8123-123456789012',schoolName:'TEST School',contactName:'Fictional contact',email:'contact@example.invalid',schoolLocation:'Fictional location',requestedAreas:['Website'],message:'Fictional school website request for isolated tests.',consent:true};
const secret='fictional-local-intake-secret-not-for-live-use-123456789';
test('corporate bridge forwards only validated requests with server signature and confirms persisted receipts',async()=>{
 let calls=0,fail=false;
 const fetcher=(async(url:any,options:any)=>{calls++;assert.equal(url,'https://console.example.invalid/api/intake/school-requests');assert.equal(options.redirect,'error');assert.equal(options.headers['X-TOTAG-Signature'],createHmac('sha256',secret).update(options.headers['X-TOTAG-Timestamp']+'.'+options.body).digest('hex'));assert.equal(JSON.parse(options.body).schoolName,'TEST School');if(fail)throw Error('not available');return Response.json({reference:'SCH-2026-ABCDEF123456'},{status:201});}) as typeof fetch;
 const app=express();app.use(express.json());app.use('/requests',schoolPlatformRequests({origin:'https://console.example.invalid',secret,fetcher}));
 app.use('/disabled',schoolPlatformRequests({origin:'http://unsafe.example.invalid',secret,fetcher}));
 const server=app.listen(0,'127.0.0.1');await once(server,'listening');const url='http://127.0.0.1:'+(server.address() as any).port;
 const post=(path:string,data:any=body,origin='https://totaggroup.com')=>fetch(url+path,{method:'POST',headers:{Origin:origin,'Content-Type':'application/json'},body:JSON.stringify(data)});
 try{
  assert.equal((await(await fetch(url+'/requests/status')).json()).acceptingRequests,true);
  assert.equal((await post('/requests',body,'https://totaggroup.com.attacker.invalid')).status,403);
  assert.equal((await post('/requests',{...body,password:'secret'})).status,400);assert.equal(calls,0);
  let response=await post('/requests');assert.equal(response.status,201);assert.equal((await response.json()).reference,'SCH-2026-ABCDEF123456');
  fail=true;response=await post('/requests');assert.equal(response.status,503);assert.equal((await response.json()).reference,undefined);
  assert.equal((await(await fetch(url+'/disabled/status')).json()).acceptingRequests,false);assert.equal((await post('/disabled')).status,503);
 }finally{await new Promise<void>(resolve=>server.close(()=>resolve()));}
});
