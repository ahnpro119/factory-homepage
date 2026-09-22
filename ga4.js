(function(){
  var id=(window.SITE_CONFIG&&SITE_CONFIG.GA4)||'';
  if(!id||String(id).indexOf('G-')!==0) return;
  var s=document.createElement('script');
  s.async=true;
  s.src='https://www.googletagmanager.com/gtag/js?id='+encodeURIComponent(id);
  document.head.appendChild(s);
  window.dataLayer=window.dataLayer||[];
  function gtag(){dataLayer.push(arguments);}
  window.gtag=gtag;
  gtag('js', new Date());
  gtag('config', id);
})();
