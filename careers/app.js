function parseCsv(text){
  var rows=[],row=[],cur='',q=false;
  for(var i=0;i<text.length;i++){
    var ch=text[i];
    if(q){if(ch==='"'){if(text[i+1]==='"'){cur+='"';i++}else q=false}else cur+=ch}
    else{
      if(ch==='"')q=true;
      else if(ch===','){row.push(cur);cur=''}
      else if(ch==='\n'){row.push(cur);rows.push(row);row=[];cur=''}
      else if(ch!=='\r')cur+=ch;
    }
  }
  if(cur.length||row.length){row.push(cur);rows.push(row)}
  var start=0;
  for(var r=0;r<rows.length;r++){
    var joined=rows[r].join(' ').toLowerCase();
    if((joined.indexOf('key')>=0&&joined.indexOf('content')>=0)||joined.indexOf('titleen')>=0||joined.indexOf('productname')>=0){start=r;break}
  }
  var headers=(rows[start]||[]).map(function(h){return String(h||'').trim()});
  var out=[];
  for(var i=start+1;i<rows.length;i++){
    if(!rows[i].join(''))continue;
    if(String(rows[i][0]||'').indexOf('※')===0)continue;
    if(String(rows[i][0]||'').indexOf('이 탭')===0)continue;
    var obj={};
    headers.forEach(function(h,idx){if(h)obj[h]=rows[i][idx]||''});
    out.push(obj);
  }
  return out;
}
function isActive(item){var s=String(item.Status||'').trim().toLowerCase();return s==='active'}
function setText(id,value){var el=document.getElementById(id);if(!el)return;if(!value){el.style.display='none';return}el.style.display='';el.textContent=value}
function fetchCsv(gid){
  return fetch(careersCsvUrl(gid)).then(function(res){if(!res.ok)throw new Error('sheet '+gid);return res.text()}).then(parseCsv);
}
function jobCard(j, applyUrl, applyLabel){
  var title=j.Title||j.TitleEN||'';
  var en=j.TitleEN&&j.TitleEN!==j.Title?j.TitleEN:'';
  var meta=[j.Team,j.Location,j.Type].filter(Boolean).join(' · ');
  var desc=j.Description||j.DescriptionEN||'';
  var btn=applyUrl?'<a class="btn" href="'+applyUrl+'" target="_blank" rel="noopener">'+(applyLabel||'Lamar sekarang')+'</a>':'';
  return '<article class="job"><div class="job-meta">'+meta+'</div><h3>'+title+'</h3>'+(en?'<div class="job-en">'+en+'</div>':'')+'<p>'+desc+'</p>'+btn+'</article>';
}
function loadCareers(){
  var notice=document.getElementById('notice');
  Promise.all([
    fetchCsv(CAREERS_CONFIG.GIDS.siteContent).catch(function(){return []}),
    fetchCsv(CAREERS_CONFIG.GIDS.jobs).catch(function(){return []})
  ]).then(function(all){
    var content={};
    all[0].forEach(function(r){
      var key=String(r.Key||'').trim();
      if(!key||key.indexOf('※')===0)return;
      content[key]=r.Content||'';
    });
    setText('page-title',content.careers_page_title||'Bergabung dengan Komitrando');
    setText('page-sub',content.careers_page_subtitle);
    setText('page-intro',content.careers_intro);
    setText('page-note',content.careers_note);
    var jobs=all[1].filter(isActive);
    jobs.sort(function(a,b){return (parseInt(a.SortOrder,10)||999)-(parseInt(b.SortOrder,10)||999)});
    var box=document.getElementById('jobs');
    if(!jobs.length){
      box.innerHTML='<p class="empty">'+(content.careers_empty||'Saat ini belum ada lowongan aktif.')+'</p>';
      return;
    }
    var url=String(content.careers_form_url||'').trim();
    var label=content.careers_apply_label||'Lamar sekarang';
    box.innerHTML=jobs.map(function(j){return jobCard(j,url,label)}).join('');
  }).catch(function(err){
    console.log(err);
    notice.classList.add('show');
  });
}
document.addEventListener('DOMContentLoaded',loadCareers);
