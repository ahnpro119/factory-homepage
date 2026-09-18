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
    return;
  }
  var featured=insightFull(list[0]);
  var older=list.slice(1).map(insightTeaser).join('');
  var archive=older?'<div class="insight-archive"><div class="kicker">Earlier notes</div>'+older+'</div>':'';
  box.innerHTML=featured+archive;
}
