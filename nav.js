function syncHeader(){
  var header=document.getElementById('site-header');
  if(!header)return;
  var home=document.getElementById('section-home');
  var onHome=home&&home.classList.contains('active');
  header.classList.toggle('solid', !onHome || window.scrollY>48);
}
(function(){
  var original=window.showSection;
  window.showSection=function(name){
    original(name);
    syncHeader();
  };
})();
document.addEventListener('scroll',syncHeader,{passive:true});
document.addEventListener('DOMContentLoaded',syncHeader);
