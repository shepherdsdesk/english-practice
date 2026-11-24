const prefix='english-practice:'+self.registration.scope+':';
const cacheName=prefix+'v23-kids';
const assets=['./','./index.html','./firebase-config.js','./manifest.webmanifest','./icon-180.png','./icon-192.png','./icon-512.png','./css/app.css','./js/basic.js','./js/core.js','./js/ui.js','./js/learn.js','./js/screens.js','./js/kids.js','./js/family.js','./js/admin.js','./js/qrcode.js'];
// 새 버전을 받을 때 브라우저의 HTTP 캐시를 건너뛰고 서버에서 직접 받습니다.
self.addEventListener('install',e=>e.waitUntil(caches.open(cacheName).then(c=>c.addAll(assets.map(u=>new Request(u,{cache:'reload'})))).then(()=>self.skipWaiting())));
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith(prefix)&&k!==cacheName).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',e=>{
  const req=e.request;
  if(req.method!=='GET'||!req.url.startsWith(self.registration.scope))return;
  const url=new URL(req.url);
  const fresh=req.mode==='navigate'||/\/(index\.html|firebase-config\.js)?$/.test(url.pathname)||/\/(courses|js|css)\/[a-z0-9-]+\.(js|css)$/.test(url.pathname);
  if(fresh){
    // 화면과 학습 자료는 인터넷이 되면 항상 최신 것을, 안 되면 저장본을 보여 줍니다.
    e.respondWith(fetch(req,{cache:'no-store'}).then(res=>{
      if(res.ok){const copy=res.clone();caches.open(cacheName).then(c=>c.put(req.mode==='navigate'?'./index.html':req,copy))}
      return res;
    }).catch(async()=>{const c=await caches.open(cacheName);return (await c.match(req,{ignoreSearch:true}))||(await c.match('./index.html'))}));
    return;
  }
  e.respondWith(caches.open(cacheName).then(async c=>(await c.match(req))||fetch(req)));
});
