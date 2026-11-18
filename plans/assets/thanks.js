(function(){
var PG=document.body.dataset.paygate,st=document.getElementById('st'),ul=document.getElementById('files'),q=new URLSearchParams(location.search);
var sid=q.get('session_id'),a=q.get('a'),SID=/^cs_(live|test)_[A-Za-z0-9]{10,200}$/,TOK=/^[A-Za-z0-9_-]{20,600}\.[A-Za-z0-9_-]{43}$/;
function msg(t){st.textContent=t}
function render(j){
  document.getElementById('h').textContent='Your downloads are ready';msg(j.name);ul.textContent='';
  j.files.forEach(function(f){var li=document.createElement('li'),s=document.createElement('span');s.textContent=f.label;
    var m=document.createElement('span');m.className='fmt';m.textContent=f.fmt+(f.remaining!=null?' · '+f.remaining+' downloads left':'');s.appendChild(m);li.appendChild(s);
    if(f.url){var b=document.createElement('a');b.className='btn sm';b.href=f.url;b.textContent='Download';b.rel='noopener';li.appendChild(b)}
    else{var x=document.createElement('span');x.className='small';x.textContent='Limit reached — email us';li.appendChild(x)}
    ul.appendChild(li)});
  var e=document.getElementById('exp');e.hidden=false;e.textContent='These download buttons work for 24 hours. Come back to this page any time in the next 30 days for fresh ones.';
  if(j.access_url){document.getElementById('keep').hidden=false;document.getElementById('acc').href=j.access_url;
    try{history.replaceState(null,'',j.access_url)}catch(_){}} // swap session_id for the private access link in the address bar
}
function claim(body,tries){
  fetch(PG+'/api/claim',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(body)})
  .then(function(r){return r.json().then(function(j){return{s:r.status,j:j}})})
  .then(function(x){
    if(x.s===200)return render(x.j);
    if(x.s===402&&tries<6){msg('Waiting for your bank to confirm the payment…');return setTimeout(function(){claim(body,tries+1)},2500)}
    if(x.s===429){msg('Too many attempts. Please wait a minute and refresh.');return}
    msg(x.s===402?'Your payment is still processing. Refresh this page in a few minutes. Still stuck? Email pnsgloballlc@gmail.com with your receipt.':'We couldn\'t open this purchase from this link. Email pnsgloballlc@gmail.com with your receipt.');
  }).catch(function(){if(tries<3)return setTimeout(function(){claim(body,tries+1)},2000);msg('Connection problem. Refresh this page, or email pnsgloballlc@gmail.com with your receipt.')});
}
if(sid&&SID.test(sid))claim({session_id:sid},0);else if(a&&TOK.test(a))claim({a:a},0);else msg('Open this page from your purchase or your bookmarked link. Lost it? Email pnsgloballlc@gmail.com with your receipt.');
})();
