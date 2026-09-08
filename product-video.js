(function(){
  var css=document.createElement('style');
  css.textContent='.product-media{position:relative;height:280px;background:#f4f4f4}.product-media .product-img,.product-media .product-img.placeholder{height:280px}.product-hover-video{position:absolute;inset:0;width:100%;height:100%;object-fit:contain;padding:20px;background:#f4f4f4;opacity:0;pointer-events:none;transition:opacity .2s ease}.product-card.has-video:hover .product-hover-video,.product-card.has-video.is-playing .product-hover-video{opacity:1}.product-card.has-video{cursor:default}';
  document.head.appendChild(css);
})();
function videoSrc(url){
  url=String(url||'').trim();
  if(!url || url.indexOf('http')!==0) return null;
  if(/(?:youtube\.com|youtu\.be)/.test(url)) return null;
  return url;
}
function playCardVideo(card){
  if(!card) return;
  var vid=card.querySelector('.product-hover-video');
  if(!vid) return;
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
  var card=e.target.closest('.product-card.has-video');
  if(!card) return;
  if(e.relatedTarget&&card.contains(e.relatedTarget)) return;
  playCardVideo(card);
});
document.addEventListener('mouseout',function(e){
  var card=e.target.closest('.product-card.has-video');
  if(!card) return;
  if(e.relatedTarget&&card.contains(e.relatedTarget)) return;
  stopCardVideo(card);
});
document.addEventListener('touchstart',function(e){
  var card=e.target.closest('.product-card.has-video');
  if(!card) return;
  if(card.classList.contains('is-playing')) stopCardVideo(card);
  else playCardVideo(card);
},{passive:true});
