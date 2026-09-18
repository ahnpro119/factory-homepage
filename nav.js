function syncHeader(){
  var header=document.getElementById('site-header');
  if(!header)return;
  var home=document.getElementById('section-home');
  var onHome=home&&home.classList.contains('active');
  var nav=document.getElementById('site-nav');
  header.classList.toggle('solid', !onHome || window.scrollY>48 || (nav&&nav.classList.contains('open')));
}
function closeNav(){
  var nav=document.getElementById('site-nav');
  if(nav) nav.classList.remove('open');
  syncHeader();
}
(function(){
  var original=window.showSection;
  window.showSection=function(name){
    original(name);
    closeNav();
  };
})();
document.addEventListener('scroll',syncHeader,{passive:true});
document.addEventListener('DOMContentLoaded',function(){
  var nav=document.querySelector('nav');
  if(nav) nav.id='site-nav';
  var btn=document.getElementById('nav-toggle');
  if(btn&&nav){
    btn.addEventListener('click',function(){
      nav.classList.toggle('open');
      syncHeader();
    });
  }
  syncHeader();
});
