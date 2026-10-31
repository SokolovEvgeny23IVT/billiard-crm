const C='billiard-v1';
const CORE=['index.html','manifest.webmanifest','icon-192.png','icon-512.png','icon-180.png'];
const FONT_CSS='https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,500;0,600;0,700;1,500;1,600&family=Jost:wght@300;400;500;600&display=swap';
async function cacheFonts(c){try{const r=await fetch(FONT_CSS);const t=await r.clone().text();await c.put(FONT_CSS,r);
const urls=[...t.matchAll(/url\((https:[^)]+)\)/g)].map(m=>m[1]);
await Promise.all(urls.map(u=>fetch(u).then(x=>c.put(u,x)).catch(()=>{})))}catch(e){}}
self.addEventListener('install',e=>{e.waitUntil(caches.open(C).then(async c=>{await c.addAll(CORE);await cacheFonts(c)}).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==C).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{const r=e.request;if(r.method!=='GET')return;const u=new URL(r.url);
const store=(x)=>{if(x&&(x.ok||x.type==='opaque')){const cp=x.clone();caches.open(C).then(c=>c.put(r,cp))}return x};
if(u.origin===location.origin&&r.mode==='navigate'){
e.respondWith(caches.open(C).then(async c=>{const m=await c.match('index.html');
const n=fetch(r).then(x=>{if(x.ok)c.put('index.html',x.clone());return x}).catch(()=>null);
if(m){e.waitUntil(n);return m}return (await n)||Response.error()}));return}
if(u.origin===location.origin||/^fonts\.(googleapis|gstatic)\.com$/.test(u.hostname)){
e.respondWith(caches.match(r).then(m=>m||fetch(r).then(store)))}});
