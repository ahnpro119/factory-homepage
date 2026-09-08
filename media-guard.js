(function(){
  var css=document.createElement('style');
  css.textContent='video::-webkit-media-controls-download-button{display:none!important}video::-internal-media-controls-download-button{display:none!important}img,video{-webkit-user-drag:none;user-select:none}';
  document.head.appendChild(css);
  document.addEventListener('contextmenu',function(e){e.preventDefault();});
  document.addEventListener('dragstart',function(e){
    var t=e.target;
    if(t&&(t.tagName==='IMG'||t.tagName==='VIDEO')) e.preventDefault();
  });
  function lockVideos(){
    document.querySelectorAll('video').forEach(function(v){
      v.setAttribute('controlsList','nodownload noremoteplayback noplaybackrate');
      v.disablePictureInPicture=true;
    });
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',lockVideos);
  else lockVideos();
  new MutationObserver(lockVideos).observe(document.documentElement,{childList:true,subtree:true});
})();
