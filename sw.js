const prefix='english-practice:'+self.registration.scope+':';
const cacheName=prefix+'firebase-1795265684548';
const assets=['./','./index.html','./firebase-config.js','./manifest.webmanifest','./icon-180.png','./icon-192.png','./icon-512.png'];
self.addEventListener('install',e=>e.waitUntil(caches.open(cacheName).then(c=>c.addAll(assets)).then(()=>self.skipWaiting())));
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith(prefix)&&k!==cacheName).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',e=>{if(e.request.method!=='GET'||!e.request.url.startsWith(self.registration.scope))return;e.respondWith(caches.open(cacheName).then(async c=>(await c.match(e.request))||(e.request.mode==='navigate'&&await c.match('./index.html'))||fetch(e.request)))});
