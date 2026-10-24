/* Carries ad source (yclid, utm_*) from the landing URL to astrolloai.ru links and reports clicks to Metrika. No third-party storage. */
(function(){var K="pro-astro-source",KEYS=['utm_source','utm_medium','utm_campaign','utm_content','utm_term','yclid'],DAY=864e5,C='113486581';
function clean(k,v){if(typeof v!=='string')return null;v=v.normalize('NFC').replace(/[\u0000-\u001f\u007f]/g,'').trim();if(!v)return null;
if(k==='yclid')return /^\d{1,255}$/.test(v)?v:null;return v.slice(0,k==='utm_source'||k==='utm_medium'?100:255);}
var now=Date.now(),saved=null;try{saved=JSON.parse(localStorage.getItem(K)||'null');}catch(e){}
var q=new URLSearchParams(location.search),fresh={};KEYS.forEach(function(k){var a=q.getAll(k);if(a.length===1){var v=clean(k,a[0]);if(v)fresh[k]=v;}});
if(Object.keys(fresh).length){saved={at:now,touch:fresh};try{localStorage.setItem(K,JSON.stringify(saved));}catch(e){}}
var touch={};if(saved&&saved.touch&&typeof saved.at==='number'&&saved.at<=now){var age=now-saved.at;if(age<=30*DAY){KEYS.forEach(function(k){if(k==='yclid'&&age>7*DAY)return;var v=clean(k,saved.touch[k]);if(v)touch[k]=v;});}}
function central(a){try{var u=new URL(a.href);return u.origin==='https://astrolloai.ru'?u:null;}catch(e){return null;}}
var attribute=function attributedUrl(href, domain, touch = {}) {
  let url;
  try { url = new URL(href); } catch { return href; }
  if (url.origin !== 'https://astrolloai.ru') return href;
  const fallback = {
    utm_source: domain,
    utm_medium: 'referral',
    utm_campaign: 'showcase',
    utm_content: [url.searchParams.get('feature') || url.pathname.replace(/^\/+|\/+$/g, '') || 'home', url.searchParams.get('placement')].filter(Boolean).join('_'),
  };
  for (const [key, value] of Object.entries(fallback)) {
    if (!url.searchParams.get(key)?.trim()) url.searchParams.set(key, value.slice(0, key === 'utm_source' ? 100 : 255));
  }
  // A validated incoming/saved campaign always wins over the static referral fallback.
  for (const [key, value] of Object.entries(touch)) url.searchParams.set(key, value);
  return url.toString();
},domain="pro-astro.ru";
function apply(a){if(!a.matches||!a.matches('a[href]'))return;var next=attribute(a.href,domain,touch);if(next!==a.href)a.href=next;}
function goal(a){var u=central(a);if(!u||!C||typeof window.ym!=='function')return;var p=u.pathname,params={page:location.pathname};
try{if(p==='/app/onboarding'){params.feature=u.searchParams.get('feature')||'';params.placement=u.searchParams.get('placement')||'';window.ym(+C,'reachGoal','cta_click',params);}
else if(p==='/pricing'){window.ym(+C,'reachGoal','pricing_click',params);}else if(p==='/login'){window.ym(+C,'reachGoal','login_click',params);}}catch(e){}}
function scan(root){if(root.matches&&root.matches('a[href]'))apply(root);if(root.querySelectorAll)root.querySelectorAll('a[href]').forEach(apply);}
scan(document);
// Hydration, client-side navigation and lazy content can replace or insert anchors.
new MutationObserver(function(records){records.forEach(function(record){if(record.type==='attributes')apply(record.target);else record.addedNodes.forEach(scan);});}).observe(document.documentElement,{childList:true,subtree:true,attributes:true,attributeFilter:['href']});
['click','auxclick','contextmenu'].forEach(function(type){document.addEventListener(type,function(e){var a=e.target&&e.target.closest&&e.target.closest('a');if(a){apply(a);if(type==='click'||(type==='auxclick'&&e.button===1))goal(a);}},true);});
})();
