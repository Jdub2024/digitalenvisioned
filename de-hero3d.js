/*! Digital Envisioned — lazy 3D hero (ES module). Loaded ONLY by de-brand.js when a .de-hero[data-3d]
 * section scrolls into view on a capable device. Pulls three.js r149 (self-hosted three.min.js) on demand.
 * Scene: slowly rotating gold wireframe icosahedron "hologram" + cyan point halo. Pauses off-screen.
 */
function loadThree(base){
  if(window.THREE) return Promise.resolve(window.THREE);
  return new Promise(function(res,rej){var s=document.createElement("script");s.src=base+"vendor/three.min.js";s.async=true;
    s.onload=function(){res(window.THREE);};s.onerror=rej;document.head.appendChild(s);});
}
export function mount(hero,opts){
  var base=(opts&&opts.base)||"/de-brand/";
  return loadThree(base).then(function(T){
    var c=document.createElement("canvas"); c.className="de-hero-fx"; c.setAttribute("aria-hidden","true"); hero.insertBefore(c,hero.firstChild);
    var r=new T.WebGLRenderer({canvas:c,alpha:true,antialias:false,powerPreference:"low-power"});
    r.setPixelRatio(Math.min(window.devicePixelRatio||1,1.5));
    var scene=new T.Scene(), cam=new T.PerspectiveCamera(45,1,.1,100); cam.position.set(0,0,6);
    var geo=new T.IcosahedronGeometry(1.6,1);
    var holo=new T.LineSegments(new T.WireframeGeometry(geo),new T.LineBasicMaterial({color:0xF59E0B,transparent:true,opacity:.55}));
    var core=new T.Mesh(geo,new T.MeshBasicMaterial({color:0x22D3EE,transparent:true,opacity:.06}));
    var n=600,pos=new Float32Array(n*3);for(var i=0;i<n;i++){var rr=2.4+Math.random()*1.6,a=Math.random()*6.283,b=Math.acos(2*Math.random()-1);
      pos[i*3]=rr*Math.sin(b)*Math.cos(a);pos[i*3+1]=rr*Math.sin(b)*Math.sin(a);pos[i*3+2]=rr*Math.cos(b);}
    var pg=new T.BufferGeometry();pg.setAttribute("position",new T.BufferAttribute(pos,3));
    var pts=new T.Points(pg,new T.PointsMaterial({color:0x22D3EE,size:.025,transparent:true,opacity:.7}));
    var g=new T.Group();g.add(holo,core,pts);g.position.x=window.innerWidth>900?1.8:0;scene.add(g);
    function size(){var b=hero.getBoundingClientRect();r.setSize(b.width,b.height,false);cam.aspect=b.width/Math.max(b.height,1);cam.updateProjectionMatrix();}
    size(); window.addEventListener("resize",size,{passive:true});
    var on=true,raf=0,t0=performance.now();
    function loop(t){ if(!on){raf=0;return;} var k=(t-t0)/1000; g.rotation.y=k*.18; g.rotation.x=Math.sin(k*.3)*.15; holo.material.opacity=.45+Math.sin(k*2)*.08; r.render(scene,cam); raf=requestAnimationFrame(loop);}
    new IntersectionObserver(function(e){on=e[0].isIntersecting&&!document.hidden;if(on&&!raf)raf=requestAnimationFrame(loop);}).observe(hero);
    document.addEventListener("visibilitychange",function(){on=!document.hidden;if(on&&!raf)raf=requestAnimationFrame(loop);});
    requestAnimationFrame(function(){c.classList.add("is-on");});
  });
}
