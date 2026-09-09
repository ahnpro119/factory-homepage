var shipRows=[];var showAllShips=false;var SHIP_DEFAULT=8;
function showSection(name){
  document.querySelectorAll('.section').forEach(function(el){el.classList.remove('active')});
  var s=document.getElementById('section-'+name); if(s) s.classList.add('active');
  document.querySelectorAll('nav button').forEach(function(el){el.classList.remove('active')});
  var n=document.getElementById('nav-'+name); if(n) n.classList.add('active');
  window.scrollTo(0,0);
}
function csvUrl(gid){return SITE_CONFIG.PUB_BASE+'?gid='+gid+'&single=true&output=csv'}
function parseCsv(text){
  var rows=[],row=[],cur='',q=false;
  for(var i=0;i<text.length;i++){
    var ch=text[i];
    if(q){if(ch==='"'){if(text[i+1]==='"'){cur+='"';i++}else q=false}else cur+=ch}
    else{
      if(ch==='"')q=true;
      else if(ch===','){row.push(cur);cur=''}
      else if(ch==='\n'){row.push(cur);rows.push(row);row=[];cur=''}
      else if(ch!=='\r')cur+=ch;
    }
  }
  if(cur.length||row.length){row.push(cur);rows.push(row)}
  var start=0;
  for(var r=0;r<rows.length;r++){
    var joined=rows[r].join(' ').toLowerCase();
    if(joined.indexOf('productname')>=0||joined.indexOf('departureport')>=0||(joined.indexOf('key')>=0&&joined.indexOf('section')>=0)||(joined.indexOf('title')>=0&&joined.indexOf('description')>=0)||(joined.indexOf('name')>=0&&joined.indexOf('issuer')>=0)||joined.indexOf('monthlypcs')>=0||joined.indexOf('capacitymonth')>=0||joined.indexOf('sampleroms')>=0||(joined.indexOf('role')>=0&&joined.indexOf('email')>=0)||(joined.indexOf('step')>=0&&joined.indexOf('title')>=0)){start=r;break}
  }
  var headers=(rows[start]||[]).map(function(h){return String(h||'').trim()});
  var out=[];
  for(var i=start+1;i<rows.length;i++){
    if(!rows[i].join(''))continue;
    if(String(rows[i][0]||'').indexOf('※')===0)continue;
    var obj={};
    headers.forEach(function(h,idx){if(h)obj[h]=rows[i][idx]||''});
    out.push(obj);
  }
  return out;
}
function isActive(item){var s=String(item.Status||'').trim().toLowerCase();return s==='active'||s===''}
function driveId(url){var m=String(url||'').match(/\/d\/([a-zA-Z0-9_-]+)/)||String(url||'').match(/[?&]id=([a-zA-Z0-9_-]+)/);return m?m[1]:''}
function imageFallbacks(url){
  url=String(url||'').trim();
  if(!url||url.indexOf('http')!==0||url.indexOf('SAMPLE_ID')>=0) return [];
  var id=driveId(url);
  if(id) return [
    'https://lh3.googleusercontent.com/d/'+id+'=w800',
    'https://drive.google.com/thumbnail?id='+id+'&sz=w800',
    'https://drive.google.com/uc?export=view&id='+id
  ];
  return [url];
}
function imageSrc(url){return (imageFallbacks(url)[0]||'')}
function imgError(el){
  var s=el.getAttribute('data-fallbacks')||'';
  if(!s){el.style.display='none';el.onerror=null;return;}
  var next=s.split('|');
  el.setAttribute('data-fallbacks',next.slice(1).join('|'));
  el.src=next[0];
}
function imgTag(url,cls){
  var list=imageFallbacks(url);
  if(!list.length) return '';
  var rest=list.slice(1).join('|').replace(/"/g,'');
  return '<img class="'+cls+'" src="'+list[0]+'" alt="" loading="lazy" decoding="async" referrerpolicy="no-referrer" data-fallbacks="'+rest+'" onerror="imgError(this)">';
}
function fetchSheet(key){var gid=SITE_CONFIG.GIDS[key];if(!gid)return Promise.resolve([]);return fetch(csvUrl(gid)).then(function(res){if(!res.ok)throw new Error('fetch failed');return res.text()}).then(parseCsv)}
function setText(id,value){var el=document.getElementById(id);if(!el)return;if(!value){el.style.display='none';return}el.style.display='';el.textContent=value}
function uniqueSorted(list){var seen={},out=[];list.forEach(function(v){v=String(v||'').trim();if(!v||seen[v])return;seen[v]=1;out.push(v)});out.sort();return out}
function fillSelect(id,values,placeholder){var el=document.getElementById(id);var cur=el.value;el.innerHTML='<option value="">'+placeholder+'</option>'+values.map(function(v){return '<option value="'+String(v).replace(/"/g,'"')+'">'+v+'</option>'}).join('');if(cur)el.value=cur}
function filteredShips(){var from=document.getElementById('filter-from').value,to=document.getElementById('filter-to').value;return shipRows.filter(function(s){if(from&&s.DeparturePort!==from)return false;if(to&&s.DestinationPort!==to)return false;return true})}
function fmtNum(v){
  v=String(v||'').trim();
  if(!v) return '';
  if(/^\d+$/.test(v.replace(/,/g,''))){
    var n=v.replace(/,/g,'');
    return n.replace(/\B(?=(\d{3})+(?!\d))/g,',');
  }
  return v;
}
function productGroup(cat){
  cat=String(cat||'').trim().toLowerCase();
  if(cat==='handbag'||cat==='fashion')return 'Handbag';
  if(cat==='outdoor')return 'Outdoor';
  if(cat==='daily'||cat==='everyday'||cat==='school')return 'Daily';
  return '';
}
function productCard(p){
  var img=imgTag(p.ImageURL,'product-img')||'<div class="product-img placeholder">Photo in Sheet ImageURL</div>';
  var style=String(p.Style||'').trim();
  var moq=String(p.MOQ||'').trim();
  return '<div class="product-card"><div class="product-media">'+img+'</div><div class="product-info">'+(style?'<div class="product-cat">'+style+'</div>':'')+'<div class="product-name">'+(p.ProductName||'')+'</div><div class="product-mat">'+(p.Materials||'')+'</div>'+(moq?'<div class="product-moq">MOQ: '+moq+' pcs</div>':'')+'</div></div>';
}
function renderProductGroups(list){
  var order=['Handbag','Outdoor','Daily'];
  var buckets={Handbag:[],Outdoor:[],Daily:[]};
  list.forEach(function(p){
    var g=productGroup(p.Category);
    if(g)buckets[g].push(p);
  });
  order.forEach(function(g){
    buckets[g].sort(function(a,b){return (parseInt(a.SortOrder,10)||999)-(parseInt(b.SortOrder,10)||999)});
    buckets[g]=buckets[g].slice(0,4);
  });
  var html=order.filter(function(g){return buckets[g].length}).map(function(g){
    return '<section class="product-group"><h3>'+g+'</h3><div class="products-grid">'+buckets[g].map(productCard).join('')+'</div></section>';
  }).join('');
  return html||'<p class="lead">No products yet.</p>';
}
function renderShips(){var list=filteredShips();var limited=(!showAllShips&&!document.getElementById('filter-from').value&&!document.getElementById('filter-to').value&&list.length>SHIP_DEFAULT);var shown=limited?list.slice(0,SHIP_DEFAULT):list;document.getElementById('ship-body').innerHTML=shown.length?shown.map(function(s){return '<tr><td>'+(s.DeparturePort||'')+'</td><td>'+(s.DestinationPort||'')+'</td><td>'+(s.DestinationRegion||'')+'</td><td>'+(s.EstDaysMin||'')+'–'+(s.EstDaysMax||'')+' days</td><td>'+(s.ContainerType||'FCL')+'</td></tr>'}).join(''):'<tr><td colspan="5">No matching routes</td></tr>';document.getElementById('ship-more').style.display=limited?'inline-block':'none';document.getElementById('ship-count').textContent=shown.length+(limited?(' of '+list.length+' routes'):(list.length?(' '+list.length+' routes'):''))}
function renderRd(content, capRows, procRows){
  var nav=document.getElementById('nav-rnd');
  if(nav&&content.rd_nav_label) nav.textContent=content.rd_nav_label;
  setText('rd-overview-title',content.rd_overview_title||'R & D Overview');
  setText('rd-overview-intro',content.rd_overview_intro);
  setText('rd-interp-title',content.rd_interp_title);
  setText('rd-interp-1',content.rd_interp_1);
  setText('rd-interp-2',content.rd_interp_2);
  setText('rd-sampling-title',content.rd_sampling_title);
  setText('rd-sampling-1',content.rd_sampling_1);
  setText('rd-sampling-2',content.rd_sampling_2);
  setText('rd-collab-title',content.rd_collab_title);
  setText('rd-collab-1',content.rd_collab_1);
  setText('rd-collab-2',content.rd_collab_2);
  setText('rd-capability-title',content.rd_capability_title||'R & D Capability');
  setText('rd-process-title',content.rd_process_title||'R & D Process');
  setText('rd-process-intro',content.rd_process_intro);
  var hero=document.getElementById('rd-hero');
  if(hero){
    var src=imageSrc(content.rd_hero_image);
    if(src){hero.style.backgroundImage='url("'+src+'")';hero.classList.add('has-photo')}
  }
  var cols=capRows.filter(isActive).filter(function(r){return String(r.Category||'').trim()});
  var total=null;
  cols.forEach(function(r){if(String(r.Category).toLowerCase()==='total') total=r});
  if(!total) total=cols[0]||{};
  var cards=[];
  if(String(total.SampleRooms||'').trim()) cards.push({n:fmtNum(total.SampleRooms),l:'Sample rooms',s:'On-site development rooms'});
  if(String(total.CapacityMonth||'').trim()) cards.push({n:fmtNum(total.CapacityMonth)+' pcs',l:'Monthly samples',s:'Sample output capacity'});
  if(String(total.Headcount||'').trim()) cards.push({n:fmtNum(total.Headcount),l:'Sample team',s:'People in the sample room'});
  var box=document.getElementById('rd-cap-cards');
  if(box){
    box.innerHTML=cards.map(function(c){
      return '<div class="rd-fact"><b>'+c.n+'</b><strong>'+c.l+'</strong><span>'+c.s+'</span></div>';
    }).join('');
  }
  procRows=procRows.filter(isActive);
  procRows.sort(function(a,b){return (parseInt(a.SortOrder,10)||999)-(parseInt(b.SortOrder,10)||999)});
  var list=document.getElementById('rd-process-list');
  if(list){
    list.innerHTML=procRows.map(function(p){
      var step=String(p.Step||p.ID||'').replace(/^0+/,'');
      return '<li><div class="rd-step-no">Step '+step+'.</div><div><strong>'+(p.Title||'')+'</strong><p>'+(p.Description||'')+'</p></div></li>';
    }).join('');
  }
}
function loadAll(){
  var notice=document.getElementById('sheet-notice');
  Promise.all([
    fetchSheet('siteContent').catch(function(){return []}),
    fetchSheet('products').catch(function(){return []}),
    fetchSheet('shipping').catch(function(){return []}),
    fetchSheet('certifications').catch(function(){return []}),
    fetchSheet('csr').catch(function(){return []}),
    fetchSheet('factories').catch(function(){return []}),
    fetchSheet('process').catch(function(){return []}),
    fetchSheet('contact').catch(function(){return []}),
    fetchSheet('rdProcess').catch(function(){return []}),
    fetchSheet('rdCapability').catch(function(){return []})
  ]).then(function(all){
    var content={};
    all[0].forEach(function(r){var key=String(r.Key||'').trim();if(!key||key.indexOf('※')===0)return;content[key]=r.Content||r['Content (English)']||''});
    setText('hero-title',content.home_hero_title);
    setText('hero-subtitle',content.home_hero_subtitle);
    setText('hero-cta',content.home_cta_text);
    setText('about-text',content.about_intro);
    setText('about-founded',content.about_founded);
    setText('capacity-text',content.about_capacity);
    setText('qc-text',content.qc_intro);
    setText('sample-lead',content.sample_leadtime);
    setText('bulk-lead',content.bulk_leadtime);
    setText('bonded-title',content.bonded_zone_title);
    setText('bonded-text',content.bonded_zone_text);
    setText('materials-text',content.materials_text||content.materials_partners);
    setText('cert-intro',content.certifications_intro);
    setText('csr-intro',content.csr_intro);
    setText('custom-options',content.custom_options);
    setText('logistics-intro',content.logistics_intro);
    setText('incoterms',content.incoterms);
    setText('contact-intro',content.contact_intro);
    setText('payment-terms',content.payment_terms);
    setText('footer-tagline',content.footer_tagline);
    renderRd(content, all[9]||[], all[8]||[]);
    var facts=all[5].filter(isActive);
    var home=document.getElementById('home-factories');
    if(home){
      var maps={BT:'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3952.6679903314125!2d110.42193867578364!3d-7.824921177720192!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e7a5787a290076b%3A0xd0c0f035db2322ae!2sPT.%20Komitrando%20Emporio!5e0!3m2!1sko!2sid!4v1787208107725!5m2!1sko!2sid',WN:'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3951.161674932498!2d110.61451347578563!3d-7.982233479592668!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e7bb4827a673821%3A0x4f6bafadce9011e2!2sPT.%20KOMITRANDO%20WONOSARI!5e0!3m2!1sko!2sid!4v1787210270542!5m2!1sko!2sid'};
      home.innerHTML=facts.map(function(f){
        var img=imgTag(f.ImageURL,'');
        var media=img||'<div class="ph">Factory photo</div>';
        var meta=(f.Since?('Since '+f.Since):'')+(f.Lines?(' · '+f.Lines+' lines'):'')+(f.Workers?(' · '+f.Workers+' people'):'')+(f.MonthlyPcs?(' · '+f.MonthlyPcs+' pcs/month'):'');
        var map=maps[f.Code]?'<div class="map-label">'+(f.Name||f.Code)+'</div><div class="map-wrapper"><iframe src="'+maps[f.Code]+'" loading="lazy"></iframe></div>':'';
        return '<div class="factory-col"><div class="factory-panel">'+media+'<div class="factory-copy"><div class="kicker">'+(f.Code||'Factory')+'</div><h3>'+(f.Name||'')+'</h3><p>'+meta+'</p></div></div>'+map+'</div>';
      }).join('');
    }
    document.getElementById('factory-facts').innerHTML=facts.map(function(f){
      return '<div class="fact"><b>'+(f.Name||f.Code||'')+'</b><span>'+(f.Since?('Since '+f.Since+' · '):'')+(f.Lines||'')+' lines · '+(f.Workers||'')+' people'+(f.MonthlyPcs?(' · '+f.MonthlyPcs+' pcs/month'):'')+'</span></div>';
    }).join('');
    var visible=all[1].filter(isActive);
    document.getElementById('products-grid').innerHTML=renderProductGroups(visible);
    shipRows=all[2].filter(isActive);
    fillSelect('filter-from',uniqueSorted(shipRows.map(function(s){return s.DeparturePort})),'All ports');
    fillSelect('filter-to',uniqueSorted(shipRows.map(function(s){return s.DestinationPort})),'All destinations');
    renderShips();
    var certs=all[3].filter(function(c){return isActive(c)&&c.Name});
    document.getElementById('cert-list').innerHTML=certs.length?certs.map(function(c){
      return '<li><strong>'+(c.Name||'')+'</strong><span>'+(c.Issuer||c.Type||'')+'</span>'+imgTag(c.ImageURL,'proof-img')+'</li>';
    }).join(''):'<li><span>Documents available on request.</span></li>';
    document.getElementById('csr-list').innerHTML=all[4].filter(isActive).map(function(c){
      return '<li><strong>'+(c.Title||'')+'</strong><span>'+(c.Description||'')+'</span>'+imgTag(c.ImageURL,'proof-img')+'</li>';
    }).join('');
    var contacts=all[7].filter(isActive);
    document.getElementById('contact-cards').innerHTML=contacts.map(function(c){
      var mail=c.Email?'<p><a href="mailto:'+c.Email+'">'+c.Email+'</a></p>':'';
      var tel=c.Phone?'<p><a href="tel:'+String(c.Phone).replace(/\s+/g,'')+'">'+c.Phone+'</a></p>':'';
      var wa=c.WhatsApp?'<p>WhatsApp '+c.WhatsApp+'</p>':'';
      return '<div class="card"><h3>'+(c.Role||'Contact')+'</h3><p>'+(c.Name||'')+'</p>'+mail+tel+wa+'<p>'+(c.Address||'')+'</p></div>';
    }).join('')||'<p class="lead">Use the emails in the company sheet.</p>';
  }).catch(function(err){
    console.log(err); notice.classList.add('show');
    document.getElementById('products-grid').innerHTML='<p class="lead">Could not load products from Google Sheets.</p>';
  });
}
document.addEventListener('DOMContentLoaded',loadAll);
