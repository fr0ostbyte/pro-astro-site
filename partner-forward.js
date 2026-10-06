/* Carries ad source (yclid, utm_*) from the landing URL to astrolloai.ru links and reports clicks to Metrika. No third-party storage. */
(function(){var K='pro-astro-source',KEYS=['utm_source','utm_medium','utm_campaign','utm_content','utm_term','yclid'],DAY=864e5,C='113486581';
function clean(k,v){if(typeof v!=='string')return null;v=v.normalize('NFC').replace(/[\u0000-\u001f\u007f]/g,'').trim();if(!v)return null;
if(k==='yclid')return /^\d{1,255}$/.test(v)?v:null;return v.slice(0,k==='utm_source'||k==='utm_medium'?100:255);}
var now=Date.now(),saved=null;try{saved=JSON.parse(localStorage.getItem(K)||'null');}catch(e){}
var q=new URLSearchParams(location.search),fresh={};KEYS.forEach(function(k){var a=q.getAll(k);if(a.length===1){var v=clean(k,a[0]);if(v)fresh[k]=v;}});
if(Object.keys(fresh).length){saved={at:now,touch:fresh};try{localStorage.setItem(K,JSON.stringify(saved));}catch(e){}}
var touch={};if(saved&&saved.touch&&typeof saved.at==='number'&&saved.at<=now){var age=now-saved.at;if(age<=30*DAY){KEYS.forEach(function(k){if(k==='yclid'&&age>7*DAY)return;var v=clean(k,saved.touch[k]);if(v)touch[k]=v;});}}
function central(a){try{var u=new URL(a.href);return u.origin==='https://astrolloai.ru'?u:null;}catch(e){return null;}}
function apply(a){var u=central(a);if(!u||!Object.keys(touch).length)return;Object.keys(touch).forEach(function(k){u.searchParams.set(k,touch[k]);});a.href=u.toString();}
function goal(a){var u=central(a);if(!u||!C||typeof window.ym!=='function')return;var p=u.pathname,params={page:location.pathname};
try{if(p==='/app/onboarding'){params.feature=u.searchParams.get('feature')||'';params.placement=u.searchParams.get('placement')||'';window.ym(+C,'reachGoal','cta_click',params);}
else if(p==='/pricing'){window.ym(+C,'reachGoal','pricing_click',params);}else if(p==='/login'){window.ym(+C,'reachGoal','login_click',params);}}catch(e){}}
function all(){document.querySelectorAll('a[href^="https://astrolloai.ru"]').forEach(apply);}
all();document.addEventListener('click',function(e){var a=e.target&&e.target.closest&&e.target.closest('a');if(a){apply(a);goal(a);}},true);
})();
