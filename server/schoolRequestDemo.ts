import express from 'express';
import path from 'node:path';
import {schoolPlatformRequests} from './schoolPlatformRequests';
// Isolated loopback preview: no .env, database, mail, Stripe or startup seeds.
const app=express(),origin='http://127.0.0.1:4106';
app.use((_req,res,next)=>{res.set({'Cache-Control':'no-store','X-Content-Type-Options':'nosniff'});next();});
app.use(express.json({limit:'20kb'}));
app.use('/api/school-platform/requests',schoolPlatformRequests({origin:'http://127.0.0.1:4105',secret:'fictional-local-intake-secret-not-for-live-use-123456789',allowedOrigins:[origin],allowLoopback:true}));
app.use('/api',(_req,res)=>res.status(404).json({error:'Only fictional school requests are connected in this demonstration.'}));
app.use(express.static(path.resolve('dist/public')));
app.get('*',(_req,res)=>res.sendFile(path.resolve('dist/public/index.html')));
app.listen(4106,'127.0.0.1',()=>console.log('Fictional school request preview: '+origin+'/it-services#/it-services'));
