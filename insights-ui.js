(function(){
  var css=''+
    '.insight-archive{margin-top:36px;max-width:720px}'+
    '.insight-archive .kicker{margin-bottom:8px}'+
    '.insight-teaser{display:grid;grid-template-columns:88px 1fr;gap:16px;padding:16px 0;border-bottom:1px solid #ececec;align-items:center;cursor:pointer;background:none;border-left:0;border-right:0;border-top:0;width:100%;text-align:left}'+
    '.insight-teaser h3{font-family:Caveat,cursive;font-size:24px;font-weight:600;margin:0}'+
    '.insight-teaser .insight-sum{font-family:Inter,sans-serif;font-size:14px;color:#5c5e62;margin-top:4px}'+
    '.insight-thumb{width:88px;height:88px;object-fit:cover;border-radius:8px;background:#f4f4f4;display:block}'+
    '.insight-footbar{position:relative;margin-top:48px;min-height:92px;max-width:1200px}'+
    '.insight-pager{display:flex;justify-content:center;align-items:center;gap:36px;padding:8px 120px 0}'+
    '.insight-pager button{background:none;border:none;cursor:pointer;font-family:Caveat,cursive;font-size:22px;color:#171a20;padding:6px 4px}'+
    '.insight-pager button:disabled{opacity:.28;cursor:default}'+
    '.insight-pager button:not(:disabled):hover{opacity:.65}'+
    '.insight-lab{position:absolute;right:0;bottom:0;text-align:right;transform:scale(.5);transform-origin:bottom right}'+
    '.insight-lab-arrow{font-family:Caveat,cursive;font-size:28px;color:#171a20;transform:rotate(8deg);display:inline-block;margin-bottom:2px}'+
    '.insight-lab a{display:inline-block;text-decoration:none;color:#171a20}'+
    '.insight-lab-mark{font-family:Caveat,cursive;font-size:42px;font-weight:700;letter-spacing:.02em;line-height:1}'+
    '.insight-lab-sub{font-family:Caveat,cursive;font-size:20px;color:#5c5e62;margin-top:2px}'+
    '@media(max-width:800px){.insight-pager{gap:20px;padding:8px 0 56px}.insight-lab{bottom:0}}';
  var s=document.createElement('style'); s.textContent=css; document.head.appendChild(s);
})();

var insightPosts=[];
var insightIndex=0;
var insightMode='article';

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
function insightTeaser(r,i){
  var title=String(r.Title||'').replace(/</g,'');
  var sum=String(r.Summary||'').replace(/</g,'');
  var tags=String(r.Tags||'').trim();
  var meta=(r.Date||'')+(tags?((r.Date?' \u00b7 ':'')+tags):'');
  var thumb=imgTag(r.ImageURL,'insight-thumb');
  return '<button type="button" class="insight-teaser" onclick="openInsight('+i+')">'+(thumb?'<div class="insight-teaser-media">'+thumb+'</div>':'')+'<div><div class="insight-meta">'+meta+'</div><h3>'+title+'</h3>'+(sum?'<p class="insight-sum">'+sum+'</p>':'')+'</div></button>';
}
function insightNavHtml(){
  var n=insightPosts.length;
  var prevOff=insightMode!=='article'||insightIndex>=n-1;
  var nextOff=insightMode!=='article'||insightIndex<=0;
  return '<div class="insight-footbar">'+
    '<div class="insight-pager">'+
      '<button type="button" onclick="showPrevInsight()" '+(prevOff?'disabled':'')+'>Previous</button>'+
      '<button type="button" onclick="showInsightList()">Notes</button>'+
      '<button type="button" onclick="showNextInsight()" '+(nextOff?'disabled':'')+'>Next</button>'+
    '</div>'+
    '<div class="insight-lab">'+
      '<div class="insight-lab-arrow">\u2198 behind the cut</div>'+
      '<a href="https://www.instagram.com/ahn119_lab/" target="_blank" rel="noopener noreferrer">'+
        '<div class="insight-lab-mark">ahn119 lab</div>'+
        '<div class="insight-lab-sub">floor notes on Instagram</div>'+
      '</a>'+
    '</div>'+
  '</div>';
}
function paintInsights(){
  var box=document.getElementById('insights-list');
  if(!box)return;
  if(!insightPosts.length){
    box.innerHTML='<p class="lead">Notes will appear here as we publish them.</p>'+insightNavHtml();
    return;
  }
  if(insightMode==='list'){
    box.innerHTML='<div class="insight-archive"><div class="kicker">Notes</div>'+insightPosts.map(insightTeaser).join('')+'</div>'+insightNavHtml();
    return;
  }
  box.innerHTML=insightFull(insightPosts[insightIndex])+insightNavHtml();
}
function openInsight(i){
  insightIndex=i;
  insightMode='article';
  paintInsights();
  window.scrollTo(0,0);
}
function showInsightList(){
  insightMode='list';
  paintInsights();
  window.scrollTo(0,0);
}
function showPrevInsight(){
  if(insightIndex>=insightPosts.length-1)return;
  insightIndex+=1;
  insightMode='article';
  paintInsights();
  window.scrollTo(0,0);
}
function showNextInsight(){
  if(insightIndex<=0)return;
  insightIndex-=1;
  insightMode='article';
  paintInsights();
  window.scrollTo(0,0);
}
function renderInsights(list){
  insightPosts=(list||[]).filter(function(r){return isActive(r)&&String(r.Title||'').trim()});
  insightPosts.sort(function(a,b){
    var da=String(a.Date||''), db=String(b.Date||'');
    if(da!==db) return db.localeCompare(da);
    return (parseInt(a.SortOrder,10)||999)-(parseInt(b.SortOrder,10)||999);
  });
  insightIndex=0;
  insightMode='article';
  paintInsights();
}
