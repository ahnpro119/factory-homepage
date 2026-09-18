(function(){
  var css='.insight-archive{margin-top:48px;max-width:720px}.insight-archive .kicker{margin-bottom:8px}.insight-teaser{display:grid;grid-template-columns:88px 1fr;gap:16px;padding:16px 0;border-bottom:1px solid #ececec;align-items:center}.insight-teaser h3{font-family:Caveat,cursive;font-size:24px;font-weight:600;margin:0}.insight-teaser .insight-sum{font-family:Inter,sans-serif;font-size:14px;color:#5c5e62;margin-top:4px}.insight-thumb{width:88px;height:88px;object-fit:cover;border-radius:8px;background:#f4f4f4;display:block}.insight-lab{margin:56px auto 0;max-width:420px;text-align:center}.insight-lab-arrow{font-family:Caveat,cursive;font-size:28px;color:#171a20;transform:rotate(8deg);display:inline-block;margin-bottom:2px}.insight-lab a{display:inline-block;text-decoration:none;color:#171a20}.insight-lab-mark{font-family:Caveat,cursive;font-size:42px;font-weight:700;letter-spacing:.02em;line-height:1}.insight-lab-sub{font-family:Caveat,cursive;font-size:20px;color:#5c5e62;margin-top:2px}';
  var s=document.createElement('style'); s.textContent=css; document.head.appendChild(s);
})();
function insightFull(r){
  var img=imgTag(r.ImageURL,'insight-img');
  var tags=String(r.Tags||'').trim();
  var body=String(r.Body||'').replace(/</g,'');
  body=body.replace(/\n*\s*ahn\s*(?=\n|$)/gi,'').replace(/\n*\s*Next:\s*[^\n]*/gi,'').replace(/\n{3,}/g,'\n\n').trim();
  var sum=String(r.Summary||'').replace(/</g,'');
  var title=String(r.Title||'').replace(/</g,'');
  var cap=String(r.ImageCaption||r.Caption||'').replace(/</g,'').trim();
  var src=String(r.Sources||r.Source||'').replace(/</g,'').trim();
  var author=String(r.Author||'').replace(/</g,'').trim();
  var meta=(r.Date||'')+(tags?((r.Date?' \u00b7 ':'')+tags):'');
  var media=img?(img+(cap?'<p class="insight-caption">'+cap+'</p>':'')):'';
  var foot='';
  if(author) foot+='<p class="insight-author">'+author+'</p>';
  if(src) foot+='<p class="insight-source">'+src+'</p>';
  return '<article class="insight">'+(meta?'<div class="insight-meta">'+meta+'</div>':'')+'<h3>'+title+'</h3>'+(sum?'<p class="insight-sum">'+sum+'</p>':'')+media+(body?'<p class="insight-body">'+body+'</p>':'')+foot+'</article>';
}
function insightTeaser(r){
  var title=String(r.Title||'').replace(/</g,'');
  var sum=String(r.Summary||'').replace(/</g,'');
  var tags=String(r.Tags||'').trim();
  var meta=(r.Date||'')+(tags?((r.Date?' \u00b7 ':'')+tags):'');
  var thumb=imgTag(r.ImageURL,'insight-thumb');
  return '<article class="insight-teaser">'+(thumb?'<div class="insight-teaser-media">'+thumb+'</div>':'')+'<div><div class="insight-meta">'+meta+'</div><h3>'+title+'</h3>'+(sum?'<p class="insight-sum">'+sum+'</p>':'')+'</div></article>';
}
function ensureInsightLab(){
  var wrap=document.querySelector('#section-insights .wrap');
  if(!wrap||wrap.querySelector('.insight-lab')) return;
  var lab=document.createElement('div');
  lab.className='insight-lab';
  lab.innerHTML='<div class="insight-lab-arrow">\u2198 behind the cut</div><a href="https://www.instagram.com/ahn119_lab/" target="_blank" rel="noopener noreferrer"><div class="insight-lab-mark">ahn119 lab</div><div class="insight-lab-sub">floor notes on Instagram</div></a>';
  wrap.appendChild(lab);
}
function renderInsights(list){
  var box=document.getElementById('insights-list');
  if(!box)return;
  list=(list||[]).filter(function(r){return isActive(r)&&String(r.Title||'').trim()});
  list.sort(function(a,b){
    var da=String(a.Date||''), db=String(b.Date||'');
    if(da!==db) return db.localeCompare(da);
    return (parseInt(a.SortOrder,10)||999)-(parseInt(b.SortOrder,10)||999);
  });
  if(!list.length){
    box.innerHTML='<p class="lead">Notes will appear here as we publish them.</p>';
    ensureInsightLab();
    return;
  }
  var featured=insightFull(list[0]);
  var older=list.slice(1).map(insightTeaser).join('');
  var archive=older?'<div class="insight-archive"><div class="kicker">Earlier notes</div>'+older+'</div>':'';
  box.innerHTML=featured+archive;
  ensureInsightLab();
}
