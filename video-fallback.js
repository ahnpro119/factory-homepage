(function(){
  var WAIT=8000;
  function dropVideo(video){
    if(!video) return;
    try{video.pause()}catch(e){}
    video.removeAttribute('src');
    video.querySelectorAll('source').forEach(function(s){s.removeAttribute('src')});
    try{video.load()}catch(e){}
    video.style.display='none';
  }
  function arm(video, onFail){
    if(!video || video.getAttribute('data-armed')) return;
    video.setAttribute('data-armed','1');
    var done=false;
    function ok(){ if(done) return; done=true; clearTimeout(t); }
    function fail(){ if(done) return; done=true; clearTimeout(t); onFail(); }
    video.addEventListener('canplay', ok);
    video.addEventListener('playing', ok);
    video.addEventListener('error', fail);
    var t=setTimeout(function(){
      if(video.readyState>=2) ok();
      else fail();
    }, WAIT);
  }
  function ensureHeroStill(){
    var hero=document.querySelector('.hero');
    var v=document.querySelector('.hero-video');
    if(!hero||!v) return null;
    var still=document.querySelector('.hero-still');
    if(still) return still;
    still=document.createElement('img');
    still.className='hero-still';
    still.alt='';
    still.style.cssText='position:absolute;inset:0;width:100%;height:100%;object-fit:cover;z-index:0;display:none';
    hero.insertBefore(still, v);
    return still;
  }
  function setupHero(){
    var v=document.querySelector('.hero-video');
    if(!v) return;
    var still=ensureHeroStill();
    arm(v, function(){
      dropVideo(v);
      if(still && still.getAttribute('src')) still.style.display='block';
    });
  }
  function setupCard(card){
    var v=card.querySelector('.product-hover-video');
    if(!v) return;
    arm(v, function(){
      card.classList.add('video-failed');
      card.classList.remove('has-video','is-playing');
      dropVideo(v);
      if(v.parentNode) v.parentNode.removeChild(v);
    });
  }
  function scan(){
    document.querySelectorAll('.product-card.has-video').forEach(setupCard);
  }
  window.applyHeroPoster=function(url){
    url=String(url||'').trim();
    if(!url) return;
    var v=document.querySelector('.hero-video');
    var still=ensureHeroStill();
    if(v) v.setAttribute('poster', url);
    if(still) still.src=url;
  };
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',setupHero);
  else setupHero();
  function bind(){
    var grid=document.getElementById('products-grid');
    if(grid) new MutationObserver(scan).observe(grid,{childList:true,subtree:true});
    scan();
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',bind);
  else bind();
})();
