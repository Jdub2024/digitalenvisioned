/*! Digital Envisioned brand kit v1.0 — de-brand.js (load with `defer`; no dependencies)
 * Usage: <script src="/de-brand/de-brand.js" defer data-site="Shop" data-affiliate="0" data-header="auto" data-footer="auto"></script>
 *  data-site       site name shown next to the wordmark
 *  data-header     auto (inject only if page has no .de-header) | off
 *  data-footer     auto (append standard footer if none) | replace (hide existing <footer>, add standard) | off
 *  data-affiliate  1 => adds FTC affiliate disclosure line to the footer and rel="sponsored nofollow" to known affiliate links
 *  data-base       where the kit lives (default: folder of this script) — used to lazy-load de-hero3d.js
 * Motion: .de-reveal (scroll reveal) · .de-tilt (3D tilt, fine pointer only) · .de-hero (particle canvas)
 *         .de-hero[data-3d] (lazy three.js scene, capable devices only). Honors prefers-reduced-motion & Save-Data.
 */
(function(){
  "use strict";
  var d=document, w=window, root=d.documentElement;
  var me=d.currentScript||d.querySelector('script[src*="de-brand.js"]');
  var cfg=function(k,def){var v=me&&me.getAttribute("data-"+k);return v==null?def:v;};
  var base=cfg("base",me&&me.src?me.src.replace(/[^\/]*$/,""):"/de-brand/");
  var mq=function(q){return w.matchMedia&&w.matchMedia(q).matches;};
  var reduce=mq("(prefers-reduced-motion: reduce)");
  var conn=navigator.connection||{};
  var lite=reduce||conn.saveData||/2g/.test(conn.effectiveType||"")||(navigator.deviceMemory&&navigator.deviceMemory<3)||(navigator.hardwareConcurrency&&navigator.hardwareConcurrency<4);
  root.classList.add("de-js"); if(lite) root.classList.add("de-lite");

  var BRAND={name:"Digital Envisioned",founder:"Joshua Newton",addr:"PO Box 3063, Montgomery, AL 36109",phone:"205-578-8884",tel:"+12055788884"};
  function esc(s){return String(s).replace(/[&<>"]/g,function(c){return{"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c];});}

  /* ---- header ---- */
  function header(){
    if(cfg("header","auto")==="off"||d.querySelector(".de-header")) return;
    var site=cfg("site",""), links=[];
    try{links=JSON.parse(cfg("nav","[]"));}catch(e){}
    var nav=links.map(function(l){return '<a href="'+esc(l[1])+'">'+esc(l[0])+'</a>';}).join("");
    var h=d.createElement("header"); h.className="de-header"; h.setAttribute("role","banner");
    h.innerHTML='<div class="de-wrap"><div class="de-header-in"><a class="de-brand" href="/" aria-label="'+BRAND.name+(site?" — "+esc(site):"")+' home">'
      +'<span class="de-mark" aria-hidden="true">DE</span><span class="de-wordmark">'+BRAND.name+'</span>'+(site?'<span class="de-sitename">'+esc(site)+'</span>':'')+'</a>'
      +(nav?'<nav class="de-nav" aria-label="Main">'+nav+'</nav><button class="de-menu-btn" type="button" aria-expanded="false" aria-controls="de-drawer" aria-label="Menu">'
      +'<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16"/></svg></button>':'')
      +'</div>'+(nav?'<nav id="de-drawer" class="de-drawer" aria-label="Mobile">'+nav+'</nav>':'')+'</div>';
    d.body.insertBefore(h,d.body.firstChild);
    var b=h.querySelector(".de-menu-btn"),dr=h.querySelector(".de-drawer");
    if(b) b.addEventListener("click",function(){var o=dr.classList.toggle("is-open");b.setAttribute("aria-expanded",o);});
  }

  /* ---- footer ---- */
  function footer(){
    var mode=cfg("footer","auto"); if(mode==="off"||d.querySelector(".de-footer")) return;
    if(mode==="replace"){ [].forEach.call(d.querySelectorAll("body > footer, footer.site-footer, #footer"),function(f){f.hidden=true;}); }
    var aff=cfg("affiliate","0")==="1", y=new Date().getFullYear();
    var f=d.createElement("footer"); f.className="de-footer"; f.setAttribute("role","contentinfo");
    f.innerHTML='<div class="de-wrap">'
      +(aff?'<p class="de-disclosure"><strong>Affiliate disclosure:</strong> some links on this site are affiliate links. If you buy through them, Digital Envisioned may earn a commission at no extra cost to you. We only link to products we believe are relevant. Results vary; nothing here is a promise of income.</p>':'')
      +'<p class="de-footer-line"><strong>'+BRAND.name+'</strong> · Founded by '+BRAND.founder+' · '+BRAND.addr+' · <a href="tel:'+BRAND.tel+'">'+BRAND.phone+'</a></p>'
      +'<ul class="de-footer-links"><li><a href="/legal/privacy/">Privacy</a></li><li><a href="/legal/terms/">Terms</a></li><li><a href="/legal/refunds/">Refunds</a></li>'
      +(aff?'<li><a href="/legal/affiliate-disclosure/">Affiliate disclosure</a></li>':'')+'</ul>'
      +'<p class="de-footer-note">© '+y+' '+BRAND.name+'. All rights reserved.</p></div>';
    /* hosts whose <body> is a flex row or grid (e.g. centered landing cards) would put the footer beside the content */
    var bs=w.getComputedStyle(d.body), disp=bs.display||"";
    if(/flex/.test(disp)&&!/column/.test(bs.flexDirection||"")){ if(bs.flexWrap==="nowrap") d.body.style.flexWrap="wrap"; f.style.flex="0 0 100%"; f.style.alignSelf="flex-end"; }
    else if(/grid/.test(disp)){ f.style.gridColumn="1 / -1"; }
    f.style.width="100%"; f.style.boxSizing="border-box";
    d.body.appendChild(f);
  }

  /* ---- affiliate rel ---- */
  function affiliate(){
    if(cfg("affiliate","0")!=="1") return;
    var re=/(hop\.clickbank\.net|clickbank\.net|amzn\.to|amazon\.[a-z.]+\/.*tag=|shareasale|impact\.com|awin1|cj\.com|jvzoo|warriorplus|digistore24)/i;
    [].forEach.call(d.querySelectorAll("a[href]"),function(a){ if(re.test(a.href)){ var r=(a.getAttribute("rel")||"").split(/\s+/); ["sponsored","nofollow","noopener"].forEach(function(x){if(r.indexOf(x)<0)r.push(x);}); a.setAttribute("rel",r.join(" ").trim()); }});
  }

  /* ---- scroll reveal ---- */
  function reveal(){
    var els=d.querySelectorAll(".de-reveal"); if(!els.length) return;
    if(reduce||!("IntersectionObserver" in w)){[].forEach.call(els,function(e){e.classList.add("is-in");});return;}
    var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add("is-in");io.unobserve(e.target);}});},{rootMargin:"0px 0px -8% 0px",threshold:.08});
    [].forEach.call(els,function(e){io.observe(e);});
  }

  /* ---- 3D tilt (desktop / fine pointer only) ---- */
  function tilt(){
    if(reduce||!mq("(hover: hover) and (pointer: fine)")) return;
    [].forEach.call(d.querySelectorAll(".de-tilt"),function(el){
      var raf=0,max=parseFloat(el.getAttribute("data-tilt"))||6;
      el.addEventListener("pointermove",function(ev){ if(raf) return; raf=requestAnimationFrame(function(){raf=0;
        var r=el.getBoundingClientRect(),x=(ev.clientX-r.left)/r.width-.5,y=(ev.clientY-r.top)/r.height-.5;
        el.style.setProperty("--de-ry",(x*max).toFixed(2)+"deg"); el.style.setProperty("--de-rx",(-y*max).toFixed(2)+"deg");});});
      el.addEventListener("pointerleave",function(){el.style.setProperty("--de-rx","0deg");el.style.setProperty("--de-ry","0deg");});
    });
  }

  /* ---- particle canvas hero (≈2KB, paused off-screen / hidden tab) ---- */
  function particles(hero){
    var c=d.createElement("canvas"); c.className="de-hero-fx"; c.setAttribute("aria-hidden","true"); hero.insertBefore(c,hero.firstChild);
    var x=c.getContext("2d"); if(!x) return;
    var dpr=Math.min(w.devicePixelRatio||1,1.5), W=0,H=0,P=[],on=false,raf=0,vis=true;
    function size(){var r=hero.getBoundingClientRect();W=r.width;H=r.height;c.width=W*dpr|0;c.height=H*dpr|0;x.setTransform(dpr,0,0,dpr,0,0);
      var n=Math.min(70,Math.round(W*H/16000)); P=[];for(var i=0;i<n;i++)P.push({x:Math.random()*W,y:Math.random()*H,vx:(Math.random()-.5)*.25,vy:(Math.random()-.5)*.25,r:Math.random()*1.6+.4,g:Math.random()<.7});}
    function tick(){ if(!on){raf=0;return;} x.clearRect(0,0,W,H);
      for(var i=0;i<P.length;i++){var p=P[i];p.x+=p.vx;p.y+=p.vy;if(p.x<0||p.x>W)p.vx*=-1;if(p.y<0||p.y>H)p.vy*=-1;
        x.fillStyle=p.g?"rgba(245,158,11,.75)":"rgba(34,211,238,.6)";x.beginPath();x.arc(p.x,p.y,p.r,0,6.283);x.fill();
        for(var j=i+1;j<P.length;j++){var q=P[j],dx=p.x-q.x,dy=p.y-q.y,dd=dx*dx+dy*dy;if(dd<9000){x.strokeStyle="rgba(245,158,11,"+(.14*(1-dd/9000)).toFixed(3)+")";x.lineWidth=.6;x.beginPath();x.moveTo(p.x,p.y);x.lineTo(q.x,q.y);x.stroke();}}}
      raf=requestAnimationFrame(tick);}
    function run(v){on=v&&vis;if(on&&!raf)raf=requestAnimationFrame(tick);}
    size(); c.classList.add("is-on");
    var t; w.addEventListener("resize",function(){clearTimeout(t);t=setTimeout(size,200);},{passive:true});
    d.addEventListener("visibilitychange",function(){vis=!d.hidden;run(vis);});
    if("IntersectionObserver" in w) new IntersectionObserver(function(e){run(e[0].isIntersecting);}).observe(hero); else run(true);
  }

  /* ---- lazy three.js hero (only when visible, capable device, idle) ---- */
  function hero3d(hero){
    var go=function(){ import(base+"de-hero3d.js").then(function(m){m.mount(hero,{base:base});}).catch(function(){particles(hero);}); };
    var io=new IntersectionObserver(function(e){ if(e[0].isIntersecting){io.disconnect(); (w.requestIdleCallback||setTimeout)(go,{timeout:1500});} });
    io.observe(hero);
  }

  function heroes(){
    if(lite) return;
    [].forEach.call(d.querySelectorAll(".de-hero"),function(h){
      if(h.hasAttribute("data-3d")&&"IntersectionObserver" in w&&(navigator.deviceMemory||4)>=4) hero3d(h);
      else if(!h.hasAttribute("data-static")) particles(h);
    });
  }

  function init(){ header(); footer(); affiliate(); reveal(); tilt(); heroes(); }
  if(d.readyState==="loading") d.addEventListener("DOMContentLoaded",init); else init();
})();
