// Family Table Farms plans store: keeps the UTM tags a visitor arrived with (e.g. from a YouTube description) and passes them to Stripe
// Payment Links as utm_* + client_reference_id (<item>_<source>_<content>), and pre-fills the launch code until it expires. No cookies, no third parties.
(function(){
var K='ftf_utm',P=['utm_source','utm_medium','utm_campaign','utm_content','utm_term'],q=new URLSearchParams(location.search),u={};
try{u=JSON.parse(sessionStorage.getItem(K)||'{}')}catch(_){}
if(P.some(function(p){return q.get(p)})){u={};P.forEach(function(p){var v=q.get(p);if(v)u[p]=v.replace(/[^A-Za-z0-9._-]/g,'').slice(0,60)})}
try{sessionStorage.setItem(K,JSON.stringify(u))}catch(_){}
var clean=function(s){return String(s||'').replace(/[^A-Za-z0-9_-]/g,'').slice(0,60)};
document.querySelectorAll('a[data-buy]').forEach(function(a){
  var url=new URL(a.getAttribute('href'));
  P.forEach(function(p){if(u[p])url.searchParams.set(p,u[p])});
  url.searchParams.set('client_reference_id',[clean(a.dataset.buy),clean(u.utm_source||'site'),clean(u.utm_content||u.utm_medium||'direct')].join('_').slice(0,200));
  var exp=a.dataset.promoUntil;if(document.body.dataset.prefillPromo==='on'&&a.dataset.promo&&exp&&Date.now()<Date.parse(exp))url.searchParams.set('prefilled_promo_code',a.dataset.promo);
  a.href=url.toString();
});
document.querySelectorAll('input[name=utm]').forEach(function(i){i.value=P.map(function(p){return u[p]?p+'='+u[p]:''}).filter(Boolean).join('&')||'direct'});
document.querySelectorAll('[data-promo-banner]').forEach(function(b){if(Date.now()>=Date.parse(b.dataset.promoBanner))b.hidden=true});
})();
