function videoSrc(url){
  url=String(url||'').trim();
  if(!url || url.indexOf('http')!==0) return null;
  var yt=url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([A-Za-z0-9_-]{6,})/);
  if(yt) return {type:'yt', id:yt[1]};
  return {type:'file', src:url};
}
function openProductVideo(url){
  var v=videoSrc(url);
  if(!v) return;
  var modal=document.getElementById('video-modal');
  var box=document.getElementById('video-modal-body');
  if(!modal||!box) return;
  if(v.type==='yt'){
    box.innerHTML='<iframe src="https://www.youtube.com/embed/'+v.id+'?autoplay=1" allow="autoplay; encrypted-media" allowfullscreen title="Product video"></iframe>';
  } else {
    box.innerHTML='<video controls autoplay playsinline src="'+v.src+'"></video>';
  }
  modal.classList.add('open');
}
function closeProductVideo(){
  var modal=document.getElementById('video-modal');
  var box=document.getElementById('video-modal-body');
  if(box) box.innerHTML='';
  if(modal) modal.classList.remove('open');
}
(function(){
  var original=window.productCard;
  if(!original) return;
  window.productCard=function(p){
    var html=original(p);
    var vu=String((p&&p.VideoURL)||'').trim();
    if(!videoSrc(vu)) return html;
    var safe=vu.replace(/&/g,'&').replace(/"/g,'"');
    return html.replace('class="product-card"','class="product-card has-video" data-video="'+safe+'" onclick="openProductVideo(this.dataset.video)"');
  };
})();
document.addEventListener('keydown',function(e){
  if(e.key==='Escape') closeProductVideo();
});
