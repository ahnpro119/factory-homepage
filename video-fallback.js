(function(){
  var WAIT=8000;

  function dropVideo(video){
    if(!video) return;
    try{video.pause()}catch(e){}
    video.removeAttribute('autoplay');
    video.removeAttribute('src');
    video.querySelectorAll('source').forEach(function(s){s.removeAttribute('src')});
    try{video.load()}catch(e){}
    video.style.display='none';
  }

  function alreadyDecided(video){
    return video && (video.getAttribute('data-vf')==='ok' || video.getAttribute('data-vf')==='fail');
  }

  function watchVideo(video, onFail, waitMs){
    if(!video || alreadyDecided(video) || video.getAttribute('data-armed')) return;
    video.setAttribute('data-armed','1');
    var done=false;
    function finish(ok){
      if(done) return;
      done=true;
      clearTimeout(t);
      video.setAttribute('data-vf', ok ? 'ok' : 'fail');
      if(!ok) onFail();
    }
    if(video.error){ finish(false); return; }
    if(video.readyState>=3){ finish(true); return; }
    video.addEventListener('canplay', function(){ finish(true); });
    video.addEventListener('playing', function(){ finish(true); });
    video.addEventListener('error', function(){ finish(false); });
    var t=setTimeout(function(){
      if(video.readyState>=3 && !video.error) finish(true);
      else finish(false);
    }, waitMs||WAIT);
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

  function failHero(){
    var hero=document.querySelector('.hero');
    var v=document.querySelector('.hero-video');
    var still=ensureHeroStill();
    if(hero) hero.classList.add('video-failed');
    dropVideo(v);
    if(still && still.getAttribute('src')) still.style.display='block';
  }

  function setupHero(){
    var v=document.querySelector('.hero-video');
    if(!v) return;
    ensureHeroStill();
    watchVideo(v, failHero, WAIT);
  }

  function failCard(card, video){
    if(!card) return;
    card.classList.add('video-failed');
    card.classList.remove('has-video','is-playing');
    dropVideo(video);
    if(video && video.parentNode) video.parentNode.removeChild(video);
  }

  window.watchProductVideo=function(card, video){
    if(!card || !video || card.classList.contains('video-failed')) return;
    watchVideo(video, function(){ failCard(card, video); }, WAIT);
  };

  window.failProductVideo=function(card, video){
    failCard(card, video);
  };

  window.applyHeroPoster=function(url){
    url=String(url||'').trim();
    if(!url) return;
    var v=document.querySelector('.hero-video');
    var still=ensureHeroStill();
    if(v) v.setAttribute('poster', url);
    if(still) still.src=url;
  };

  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded', setupHero);
  else setupHero();
})();
