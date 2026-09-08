(function(){
  var css=document.createElement('style');
  css.textContent='.product-img{padding:0!important}.product-media{position:relative;height:280px;background:#f4f4f4}.product-media .product-img,.product-media .product-img.placeholder{height:280px}.product-hover-video{position:absolute;inset:0;width:100%;height:100%;object-fit:contain;padding:0;background:#f4f4f4;opacity:0;pointer-events:none;transition:opacity .2s ease}.product-card.has-video:hover .product-hover-video,.product-card.has-video.is-playing .product-hover-video{opacity:1}.product-card.has-video{cursor:default}';
  document.head.appendChild(css);
})();
function isTouchProductView(){
  return window.matchMedia('(hover: none), (pointer: coarse)').matches || window.innerWidth<=800;
}
function videoSrc(url){
  url=String(url||'').trim();
  if(!url || url.indexOf('http')!==0) return null;
  if(/(?:youtube\.com|youtu\.be)/.test(url)) return null;
  return url;
}
var playingCard=null;
function playCardVideo(card){
  if(!card) return;
  if(playingCard&&playingCard!==card) stopCardVideo(playingCard);
  var vid=card.querySelector('.product-hover-video');
  if(!vid) return;
  playingCard=card;
  card.classList.add('is-playing');
  vid.muted=true;
  var run=vid.play();
  if(run&&run.catch) run.catch(function(){});
}
function stopCardVideo(card){
  if(!card) return;
  var vid=card.querySelector('.product-hover-video');
  if(!vid) return;
  vid.pause();
  try{vid.currentTime=0}catch(e){}
  card.classList.remove('is-playing');
  if(playingCard===card) playingCard=null;
}
(function(){
  var original=window.productCard;
  if(!original) return;
  window.productCard=function(p){
    var html=original(p);
    var src=videoSrc(p&&p.VideoURL);
    if(!src) return html;
    var safe=src.replace(/&/g,'&').replace(/"/g,'"');
    html=html.replace('class="product-card"','class="product-card has-video"');
    html=html.replace(/(<img class="product-img"[^>]*>|<div class="product-img placeholder">[\s\S]*?<\/div>)/,
      '<div class="product-media">$1<video class="product-hover-video" muted loop playsinline preload="metadata" src="'+safe+'"></video></div>');
    return html;
  };
})();
document.addEventListener('mouseover',function(e){
  if(isTouchProductView()) return;
  var card=e.target.closest('.product-card.has-video');
  if(!card) return;
  if(e.relatedTarget&&card.contains(e.relatedTarget)) return;
  playCardVideo(card);
});
document.addEventListener('mouseout',function(e){
  if(isTouchProductView()) return;
  var card=e.target.closest('.product-card.has-video');
  if(!card) return;
  if(e.relatedTarget&&card.contains(e.relatedTarget)) return;
  stopCardVideo(card);
});
var midObserver=null;
function watchMidScreenVideos(){
  if(midObserver){midObserver.disconnect();midObserver=null;}
  if(!('IntersectionObserver' in window)) return;
  midObserver=new IntersectionObserver(function(entries){
    if(!isTouchProductView()) return;
    entries.forEach(function(entry){
      if(entry.isIntersecting) playCardVideo(entry.target);
      else stopCardVideo(entry.target);
    });
  },{root:null,threshold:0.45,rootMargin:'-22% 0px -22% 0px'});
  document.querySelectorAll('.product-card.has-video').forEach(function(card){
    midObserver.observe(card);
  });
}
function bindGridWatch(){
  var grid=document.getElementById('products-grid');
  if(!grid) return;
  watchMidScreenVideos();
  new MutationObserver(function(){watchMidScreenVideos();}).observe(grid,{childList:true,subtree:true});
}
if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',bindGridWatch);
else bindGridWatch();
