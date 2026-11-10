const $=s=>document.querySelector(s);
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
const P={
  local:{short:'Motor 3D local'},
  gemini:{short:'Gemini + 3D local',llm:1,model:'gemini-flash-latest',ml:'Modelo de Gemini',mh:'La capa gratuita de Gemini no incluye video: Gemini dirige la película y tu navegador la graba.',link:'https://aistudio.google.com/apikey'},
  openrouter:{short:'OpenRouter + 3D local',llm:1,model:'openrouter/free',ml:'Modelo de OpenRouter',mh:'«openrouter/free» elige un modelo gratis disponible. También vale cualquier ID que termine en :free.',url:'https://openrouter.ai/api/v1/chat/completions',link:'https://openrouter.ai/settings/keys'},
  groq:{short:'Groq + 3D local',llm:1,model:'llama-3.3-70b-versatile',ml:'Modelo de Groq',mh:'Los modelos gratuitos cambian; mira la lista en console.groq.com.',url:'https://api.groq.com/openai/v1/chat/completions',link:'https://console.groq.com/keys'},
  mistral:{short:'Mistral + 3D local',llm:1,model:'mistral-small-latest',ml:'Modelo de Mistral',mh:'',url:'https://api.mistral.ai/v1/chat/completions',link:'https://console.mistral.ai/api-keys'},
  oai:{short:'IA compatible + 3D local',llm:1,model:'',ml:'Nombre del modelo',mh:'Sirve para Cerebras, GitHub Models, Together y cualquier API con formato OpenAI.'},
  fal:{short:'fal.ai',video:1,model:'fal-ai/ltx-video',ml:'Modelo de fal.ai',mh:'Cualquier modelo de texto a video de fal.ai/models. Copia su ID.',link:'https://fal.ai/dashboard/keys'},
  hf:{short:'Hugging Face',video:1,model:'ali-vilab/text-to-video-ms-1.7b',ml:'Modelo de Hugging Face',mh:'La disponibilidad de modelos de video gratuitos cambia. Si falla, prueba otro ID.',link:'https://huggingface.co/settings/tokens'},
  custom:{short:'API de video personalizada',video:1,model:'',ml:'URL del endpoint',mh:'Ejemplo: https://api.miempresa.com/v1/video'}
};
const S={none:'',cine:'3D render, cinematic lighting, high detail, ',toon:'3D animated cartoon, Pixar-like, soft lighting, ',poly:'low-poly 3D animation, ',iso:'isometric 3D render, '};
const D={prov:'local',keys:{},models:{},url:'',lists:{},style:'cine',shape:'auto',move:'spin',dur:15,genre:'none',htheme:'free',hend:'free',review:false,story:true,amb:'auto',trans:'auto',subs:'white',subsz:'38',tod:'auto',lens:'auto',hand:'auto',flick:'off',scare:'off',heart:false,vhs:false,stalk:'off',gore:'off',lensblood:false,steps:'off',whisp:'off',torch:'off',tsize:'normal',tpl:'off',cam:'off',nights:'3',frz:'off',fzs:'tone',eyes:'off',creak:'off',breath:false,tick:false,thick:false,zoom:'off',tilt:'off',wake:'03:33',cred:false,dir:'',music:'auto',vol:60,look:'auto',bars:'none',vig:true,grain:true,blur:false,fx:'auto',res:'720',fps:'30',pov:'off',povlook:'glance',povbob:'walk',povhands:false,hush:false,riser:false,blackout:'off',hbvig:false,sanity:false,rtitle:false,hbeat:'free',hext:'off',hthr:'free',hvic:'free',hshow:'free',gx:'off',gy:'off',life:'normal',beast:'both',env:true,atk:true,cmode:'off',view:'off',stat:'off',subl:false,card:'off',endc:false,drone:'off',musicbox:false,knock:false,auth:'Authorization: Bearer {key}',body:'{"prompt":"{prompt}"}'};
let cfg=(()=>{try{return Object.assign({},D,JSON.parse(localStorage.getItem('v3d')||'{}'))}catch(e){return{...D}}})();
const save=()=>{try{localStorage.setItem('v3d',JSON.stringify(cfg))}catch(e){}};

function fill(){
  const p=cfg.prov,d=P[p];
  $('#prov').value=p;
  $('#key').value=cfg.keys[p]||'';
  $('#model').value=cfg.models[p]||d.model||'';
  $('#modelL').textContent=d.ml||'Modelo';
  $('#modelH').textContent=d.mh||'';
  if(d.link)$('#keyHelp').href=d.link;
  ['style','shape','move','dur','auth','body','url','genre','htheme','hend','review','story','amb','trans','subs','subsz','tod','lens','hand','flick','scare','heart','vhs','stalk','gore','lensblood','steps','whisp','torch','tsize','tpl','cam','nights','frz','fzs','eyes','creak','breath','tick','thick','zoom','tilt','wake','cred','dir','music','vol','look','bars','vig','grain','blur','fx','res','fps','pov','povlook','povbob','povhands','hush','riser','blackout','hbvig','sanity','rtitle','hbeat','hext','hthr','hvic','hshow','gx','gy','life','beast','env','atk','cmode','view','stat','subl','card','endc','drone','musicbox','knock'].forEach(k=>{const e=$('#'+k);if(e.type==='checkbox')e.checked=!!cfg[k];else e.value=cfg[k]});
  const tags=[p,d.link?'link':'',p==='local'||d.llm?'render':'',p!=='local'?'key':'',d.llm?'llm':'',d.video?'video':'',CAN.includes(p)?'list':''];
  document.querySelectorAll('[data-p]').forEach(e=>e.hidden=!e.dataset.p.split(' ').some(t=>tags.includes(t)));
  $('#loadH').textContent='';$('#mq').value='';drawList();
  $('#chip').textContent='Motor: '+d.short;
}
$('#menu').addEventListener('input',e=>{
  const t=e.target,p=cfg.prov;
  if(t.id==='edit')return;
  if(t.id==='mq'||t.id==='mfree'){drawList();return}
  if(t.id==='mlist'){cfg.models[p]=t.value;$('#model').value=t.value;save();return}
  if(t.id==='prov'){cfg.prov=t.value;fill()}
  else if(t.id==='key')cfg.keys[p]=t.value.trim();
  else if(t.id==='model')cfg.models[p]=t.value.trim();
  else if(t.id)cfg[t.id]=t.type==='checkbox'?t.checked:t.id==='dur'?Math.min(60,Math.max(3,+t.value||6)):t.value;
  save();
});
const menu=$('#menu'),shade=$('#shade');
const setMenu=o=>{menu.classList.toggle('open',o);shade.hidden=!o;(o?$('#prov'):$('#open')).focus()};
$('#open').onclick=()=>setMenu(true);
const HB={flick:'off',scare:'off',heart:false,vhs:false,stalk:'off',gore:'off',lensblood:false,steps:'off',whisp:'off',torch:'off',tsize:'normal',pov:'off',povlook:'glance',povbob:'walk',povhands:false,hush:false,riser:false,blackout:'off',hbvig:false,sanity:false,rtitle:false,hbeat:'free',hext:'off',hthr:'free',hvic:'free',hshow:'free',gx:'off',gy:'off',cmode:'off',view:'off',stat:'off',subl:false,card:'off',endc:false,drone:'off',musicbox:false,knock:false};
const PRE={
  gothic:{...HB,musicbox:true,card:'warn',genre:'horror',dur:30,story:true,look:'cold',music:'mystery',tod:'night',fx:'mist',amb:'wind',trans:'fade',hand:'steady',lens:'normal',bars:'2.39',vig:true,grain:true,fps:'24',flick:'soft',scare:'end',stalk:'ghost',steps:'slow',whisp:'far'},
  slasher:{...HB,genre:'horror',dur:30,story:true,look:'horror',music:'tense',tod:'night',fx:'rain',amb:'rain',trans:'cut',hand:'handheld',lens:'wide',bars:'1.85',vig:true,grain:true,fps:'24',flick:'hard',scare:'mid',heart:true,stalk:'monster',gore:'lots',lensblood:true,steps:'near'},
  found:{...HB,view:'cam',stat:'some',card:'found',endc:true,knock:true,genre:'horror',dur:30,story:true,look:'noir',music:'none',tod:'night',fx:'none',amb:'night',trans:'cut',hand:'handheld',lens:'wide',bars:'none',vig:true,grain:true,fps:'30',subs:'off',flick:'hard',scare:'end',heart:true,vhs:true,gore:'some',steps:'near',whisp:'close',torch:'shaky',tsize:'narrow'},
  pov:{...HB,knock:true,drone:'hum',stat:'some',genre:'horror',dur:40,story:true,look:'horror',music:'tense',tod:'night',fx:'mist',amb:'wind',trans:'cut',hand:'handheld',lens:'wide',bars:'2.39',vig:true,grain:true,fps:'30',subs:'off',flick:'soft',scare:'end',heart:true,steps:'slow',whisp:'far',torch:'shaky',tsize:'normal',stalk:'ghost',creak:'rare',breath:true,eyes:'few',pov:'on',povlook:'glance',povbob:'walk',povhands:true,hush:true,riser:true,hbvig:true,sanity:true,rtitle:true,blackout:'mid'},
  off:{...HB,genre:'none'}
};
const PN={pov:'Primera persona: explorador',gothic:'Gótico clásico',slasher:'Slasher',found:'Metraje encontrado',off:'Terror apagado'};
$('#prep333').onclick=()=>{Object.assign(cfg,{...HB,tpl:'bedroom',cam:'lapse',nights:'3',frz:'1',fzs:'tone',look:'nightcam',music:'none',amb:'none',fx:'none',vhs:true,grain:true,vig:true,blur:false,hand:'steady',bars:'none',subs:'off',trans:'cut',dur:30,fps:'30',res:'720'});save();fill();setMenu(false);say('Corto 3:33 preparado. Pulsa «Generar video».')};
$('#applyPreset').onclick=()=>{const k=$('#preset').value;Object.assign(cfg,PRE[k]);save();fill();$('#presetH').textContent='Aplicado: '+PN[k]+'. Revisa las herramientas de abajo y cambia lo que quieras.'};
$('#close').onclick=shade.onclick=()=>setMenu(false);
addEventListener('keydown',e=>{if(e.key==='Escape'&&menu.classList.contains('open'))setMenu(false)});

const stage=$('#stage'),vid=$('#vid');
const show=m=>stage.className='stage '+m;
const say=t=>$('#st').textContent=t;
const prog=(v)=>{const b=$('#pbar');b.classList.toggle('ind',v==='ind');$('#pg').style.width=v==='ind'?'':(v*100)+'%'};
const errText=async r=>{let t='';try{t=(await r.text()).slice(0,200)}catch(e){}return new Error('Error '+r.status+(t?': '+t:''))};
const findUrl=o=>{const m=JSON.stringify(o).match(/https?:[^"\\]+\.(mp4|webm|mov)[^"\\]*/i);return m&&m[0]};

async function genFal(prompt,model,key){
  const h={Authorization:'Key '+key,'Content-Type':'application/json'};
  const r=await fetch('https://queue.fal.run/'+model,{method:'POST',headers:h,body:JSON.stringify({prompt})});
  if(!r.ok)throw await errText(r);
  const j=await r.json();
  for(let i=0;i<150;i++){
    await sleep(3000);
    const s=await fetch(j.status_url,{headers:h}).then(x=>x.json());
    say('fal.ai: '+(s.status==='IN_QUEUE'?'en cola'+(s.queue_position!=null?' (posición '+s.queue_position+')':''):'renderizando')+'…');
    if(s.status==='COMPLETED'){
      const o=await fetch(j.response_url,{headers:h}).then(x=>x.json());
      const u=(o.video&&o.video.url)||findUrl(o);
      if(!u)throw new Error('El servicio terminó pero no devolvió un video. Revisa el modelo o tus créditos.');
      return u;
    }
  }
  throw new Error('Tiempo de espera agotado.');
}
async function genHF(prompt,model,key){
  for(let i=0;i<6;i++){
    const r=await fetch('https://router.huggingface.co/hf-inference/models/'+model,{method:'POST',headers:{Authorization:'Bearer '+key,'Content-Type':'application/json'},body:JSON.stringify({inputs:prompt})});
    if(r.status===503){say('Hugging Face está cargando el modelo…');await sleep(10000);continue}
    if(!r.ok)throw await errText(r);
    return URL.createObjectURL(await r.blob());
  }
  throw new Error('El modelo sigue sin estar disponible. Prueba más tarde u otro modelo.');
}
async function genCustom(prompt,url,key){
  if(!url)throw new Error('Indica la URL del endpoint en Configuración.');
  const h={'Content-Type':'application/json'},i=cfg.auth.indexOf(':');
  if(i>0)h[cfg.auth.slice(0,i).trim()]=cfg.auth.slice(i+1).replace('{key}',key).trim();
  const body=cfg.body.replace('{key}',key).replace('{prompt}',JSON.stringify(prompt).slice(1,-1));
  const r=await fetch(url,{method:'POST',headers:h,body});
  if(!r.ok)throw await errText(r);
  if((r.headers.get('content-type')||'').startsWith('video'))return URL.createObjectURL(await r.blob());
  const u=findUrl(await r.json());
  if(!u)throw new Error('La respuesta no contiene un enlace de video.');
  return u;
}

/* ---------- Instrucciones para la IA directora ---------- */
const sys=()=>`Eres un director de cine 3D con oficio. Pones en escena una película de ${cfg.dur} segundos que cuenta una historia con sentido: cada movimiento tiene un motivo y cada plano muestra lo que importa en ese momento. Responde SOLO con un objeto JSON válido, sin texto adicional ni markdown.

FORMATO:
{"title":"título breve","look":"natural|warm|cold|noir|vintage|neon|horror","music":"epic|calm|mystery|joy|tense","cast":{"hero":{"asset":"robot","color":"#hex","color2":"#hex","scale":1}},"scenes":[{"weather":"none|rain|snow|fireflies|mist|dust|embers","background":"#hex","fog":{"color":"#hex","near":5,"far":30},"ambient":0.5,"sun":{"color":"#hex","intensity":1,"pos":[4,6,5]},"lights":[{"type":"point|spot","color":"#hex","pos":[x,y,z],"intensity":1,"look":[x,y,z]}],"objects":[OBJ,...],"shots":[{"dur":3,"camera":CAM,"caption":"subtítulo breve","transition":"cut|fade"}]}]}

OBJ: {"shape":"box|sphere|cone|cylinder|torus|knot|ico|plane|pyramid|dome|tetra|octa|dodeca|ring|gut|limb|carbody","color":"#hex","pos":[x,y,z],"scale":[x,y,z],"rot":[gradosX,gradosY,gradosZ],"anim":"spin|bounce|float|orbit|walk|sway|pulse|turn|swing|swing2|roll|none","speed":1,"metal":0.3,"rough":0.4,"glow":0,"opacity":1,"path":[[x,y,z],...],"face":true}
- Cada forma mide 1 unidad antes de escalarla. "scale" puede ser un número (escala uniforme).
- "turn" gira solo sobre el eje vertical; "swing" y "swing2" balancean en fases opuestas (para brazos o piernas articulados desde su extremo superior); "roll" gira como una rueda.
- "glow" (0 a 3) hace que brille (lámparas, sol, neón). "opacity" (0 a 1) sirve para cristal o agua.
- "path" son los puntos por los que el objeto viaja desde "pos" durante toda la escena. "face":true lo gira hacia donde avanza (su frente es +z).
- Para personajes y objetos compuestos usa un grupo: {"pos":[..],"anim":"walk","path":[..],"children":[OBJ,...]}, sin "shape". Los hijos usan coordenadas relativas al grupo y pueden tener su propio "anim" (por ejemplo "sway" en los brazos).

ASSETS PREARMADOS: son personajes y objetos ya modelados y animados. Úsalos en "objects" en vez de armarlos a mano:
{"asset":"robot","color":"#hex","color2":"#hex","pos":[x,y,z],"scale":1,"rot":[0,gradosY,0],"speed":1,"path":[[x,y,z],...],"face":true,"act":"wave"}
Catálogo (todos apoyan la base en y=0 y miran hacia +z; entre paréntesis la altura aproximada): sas (modelo 3D real de soldado con máscara antigás, 1.8 de alto; úsalo como protagonista o como fuerza de seguridad), robot (3), person (2), dog (1.3), bird (0.5; se coloca en el aire), tree (3.4), pine (3.8), flower (0.9), rock (0.8), cloud (1.5; se coloca en el aire), mountain (5; base de 8x8), house (3.5), car (1.4; largo 3.6), boat (3.2), rocket (3.5), lamp (3.4), ghost (2.5; flota y es translúcido), monster (4.2; brazos largos y ojos rojos), grave (1.9), deadtree (3.8), mansion (7.4; ancho 5), puddle (charco plano de 1.8; con "color" sirve para otros líquidos), trail (rastro de gotas y manchas de 5 de largo; gíralo con "rot" para que lleve a un lugar), bed (cama de 2.2 por 3.2; la cabecera está hacia -z). Gore: viscera (pila de vísceras húmedas de 1 de alto; color2 para otro tejido), carcass (res abierta con costillas en el suelo, 1.2 de alto), hanged (cuerpo colgado de una viga, 3.2 de alto), limb (brazo cercenado en un charco, 1 de largo), head (cabeza cortada en el suelo con sangre, 0.6 de alto), wreck (coche destrozado y ensangrentado de 1.5 de alto con charco, ideal en carreteras y bosques), field (campo de trigo o maíz de 8 por 10 con tallos de 1.8; úsalo como escondite o para el ataque), barn (granero rojo de 4 de ancho con puerta, 4.5 de alto, con charco en la entrada). Terror: clown (2.7), doll (1.6; cabeza que se inclina), spider (1.3; 3 de ancho con patas), skeleton (2.3), scarecrow (3.6), slender (4.3; hombre altísimo sin rostro), zombie (2.5; brazos al frente), tentacle (4.2; tentáculos que se retuercen desde el suelo), pentagram (símbolo rojo brillante plano de 3.2), coffin (ataúd entreabierto de 2.1 de largo con una mano), pumpkin (1.1; calabaza con luz), candle (0.9), door (puerta con marco de 2.6 de alto y 1.4 de ancho; se abre sola cuando un personaje se acerca; gírala con "rot" para colocarla en una pared), bat (0.4; murciélago que bate las alas, se coloca en el aire; con "anim":"orbit" gira sobre la escena). clown, skeleton, slender y zombie caminan por un path como person.
- "color" es el color principal y "color2" el secundario (pantalón, techo, acento...). Si los omites usan colores propios.
- Si un asset avanza por un "path", robot, person y dog mueven brazos y piernas solos, car gira las ruedas y rocket enciende su llama. No hace falta poner "anim". Con "face":true miran hacia donde van.
- "act":"wave" hace que robot y person saluden. "act":"idle" deja quieto a un personaje o posa al bird (el bird bate las alas por defecto).
- Usa assets para todo lo que esté en el catálogo y arma a mano solo lo que falte. Puedes repetirlos con distintos colores, tamaños y rotaciones para poblar la escena.

PERSONAJES CON ACCIÓN (lo que da sentido a la película):
- Define cada personaje UNA vez en "cast" con un id y úsalo en todas las escenas donde aparezca: {"cast":"hero","pos":[x,0,z],"moves":[...]}. Así conserva su aspecto y su identidad entre planos.
- "moves" es la línea de tiempo del personaje en segundos DESDE EL INICIO DE LA ESCENA. Cada paso es {"t":segundo en que debe LLEGAR,"to":[x,y,z],"act":"wave|jump|idle","face":"id de otro objeto"}. Parte de "pos" en t=0. Para esperar quieto, repite la misma posición. El motor mueve piernas y brazos solo mientras camina y se detiene al llegar; no uses "path" ni "anim" en personajes con "moves".
- "act" se ejecuta cuando llega y está quieto: "wave" saluda, "jump" salta de alegría. "face" lo gira para mirar a otro personaje u objeto que tenga "id".
- Velocidad: caminar 1.5 unidades/s, correr 3, vehículos 4. Calcula t = distancia / velocidad.
- El decorado (árboles, casas, rocas, farolas) no se mueve. Solo se animan como ambiente nubes, pájaros, llamas y luces.

CAM: {"move":"static|orbit|dolly|pull|pan|crane|track","size":"wide|medium|close","follow":"id","focus":1.2,"distance":8,"height":2,"angle":0,"look":[0,0,0],"fov":45,"shake":0}
- "follow" hace que la cámara siga a ese personaje u objeto y lo mantenga en cuadro. "size" fija el encuadre: wide ubica el lugar, medium muestra la acción, close muestra emociones y reacciones. "angle" en grados elige el lado desde el que se ve (0 delante, 180 detrás).
O cámara libre: {"from":[x,y,z],"to":[x,y,z],"look":[x,y,z],"fov":45}

REGLAS DE DIRECCIÓN:
- Respeta la HISTORIA si te la dan: un plano por cada momento importante, en su orden y con su subtítulo. Traduce cada momento en acciones visibles y en un encuadre que las muestre.
- Antes de escribir decide dónde empieza cada personaje y a dónde va. Todo movimiento tiene destino y motivo (ir hacia alguien o algo, huir, llegar, volver). Nunca vueltas sin sentido.
- Sincronía: los "moves" de una escena ocurren mientras suceden sus planos. La suma de "dur" de los planos de la escena es la duración de la escena y ningún "t" la supera. Cada acción empieza cuando empieza su plano.
- Cámara con intención: abre con un plano wide que ubique, usa medium siguiendo al protagonista ("follow") durante la acción, close para la reacción o la emoción, y cierra con un plano que resuelva. Cambia de plano solo cuando cambia la acción.
- Continuidad: los mismos personajes en todo el "cast"; mismo lugar = misma escena. En un diálogo se miran ("face"). Quien sale por un lado entra por el lado contrario en la escena siguiente.
- Usa de 1 a 3 escenas y de 4 a 8 planos en total, de 2 a 6 s cada uno. La suma de todos los "dur" es unos ${cfg.dur} s.
- Atmósfera acorde con la emoción: luces de color, niebla y fondo. Pon un plane como suelo (rot [-90,0,0], escala grande).
- Cada escena con 10 a 40 objetos (cada asset cuenta como uno). El decorado cuenta algo: el camino, la meta, el obstáculo. Todo dentro de ±10 unidades; las montañas de fondo pueden llegar a ±20.
- Subtítulos cortos que refuercen lo que se ve sin repetirlo.
- Elige "look" y "music" según el género y el ánimo. Usa "weather" cuando la historia lo pida.
- JSON compacto, sin comentarios.${cfg.pov==='live'?liveTxt:cfg.pov!=='off'?povTxt:''}${GEN[cfg.genre]?'\n- GÉNERO: '+GEN[cfg.genre].p+' Respeta este estilo en luces, cámara, colores y ritmo.':''}${cfg.genre==='horror'?HK+htools():''}${BTXT()}${ENVTXT}${cfg.atk?ATXT:''}
- Si el mensaje trae una PELÍCULA ACTUAL en JSON, devuelve la película completa en el mismo formato con los cambios pedidos y conserva todo lo demás.`;

const SH={box:()=>new THREE.BoxGeometry(1,1,1),sphere:()=>new THREE.SphereGeometry(.5,56,40),cone:()=>new THREE.ConeGeometry(.5,1,32),cylinder:()=>new THREE.CylinderGeometry(.5,.5,1,48),torus:()=>new THREE.TorusGeometry(.5,.2,24,72),knot:()=>new THREE.TorusKnotGeometry(.4,.14,120,16),ico:()=>new THREE.IcosahedronGeometry(.6,0),plane:()=>new THREE.PlaneGeometry(1,1),
  pyramid:()=>new THREE.ConeGeometry(.7071,1,4).rotateY(Math.PI/4),
  dome:()=>new THREE.SphereGeometry(.5,32,16,0,Math.PI*2,0,Math.PI/2),
  tetra:()=>new THREE.TetrahedronGeometry(.6),octa:()=>new THREE.OctahedronGeometry(.6),dodeca:()=>new THREE.DodecahedronGeometry(.55),
  ring:()=>new THREE.RingGeometry(.3,.5,48),
  gut:()=>{const P=[];for(let i=0;i<=10;i++){const t=i/10;P.push(new THREE.Vector3(Math.sin(t*Math.PI*2.2)*.35,Math.cos(t*Math.PI*1.7)*.12,(t-.5)*.9))}return new THREE.TubeGeometry(new THREE.CatmullRomCurve3(P),160,.09,18,false)},
  limb:()=>{const P=[];for(let i=0;i<=24;i++){const t=i/24,r=.03+.1*Math.sin(Math.PI*Math.min(1,t*1.1+.05))*Math.min(1,t/.06)+(t>.92?(1-t)*.5:0)+.02*Math.sin(t*11);P.push(new THREE.Vector2(Math.abs(r),-.5+t))}return new THREE.LatheGeometry(P,28)},
  carbody:()=>{const s2=new THREE.Shape();s2.moveTo(-1,0);s2.lineTo(1,0);s2.lineTo(1,.35);s2.quadraticCurveTo(.95,.45,.8,.48);s2.lineTo(.5,.8);s2.lineTo(-.4,.8);s2.lineTo(-.75,.48);s2.quadraticCurveTo(-.95,.45,-1,.35);s2.lineTo(-1,0);const g=new THREE.ExtrudeGeometry(s2,{depth:1,bevelEnabled:true,bevelSize:.04,bevelThickness:.04,bevelSegments:3,curveSegments:8});g.translate(0,0,-.5);return g}};
const FLAT=['ico','tetra','octa','dodeca','pyramid'];
const num=(v,d,a,b)=>{v=+v;return isFinite(v)?Math.min(b,Math.max(a,v)):d};
const vec=(v,d,L=30)=>[0,1,2].map(i=>num(v&&v[i],d[i],-L,L));
const hex=c=>/^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(c)?c:'#8899ff';
const sm=u=>u*u*(3-2*u);

/* ---------- Biblioteca de personajes y objetos ----------
   Cada asset devuelve una lista de formas (grupos articulados incluidos).
   Base en y=0, frente hacia +z. "color" = principal, "color2" = secundario. */
const cl=(v,d)=>/^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(v)?v:d;
const bx=(shape,color,pos,scale,x)=>Object.assign({shape,color,pos,scale},x);
const pv=(pos,rot,anim,speed,kids)=>({pos,rot,anim,speed,children:kids});
const mv=o=>!!(o.path||o.to||o.moves||o.act==='drive'||o.act==='fly');
const wk=o=>o.act==='walk'||o.anim==='walk'||(o.act!=='idle'&&o.act!=='wave'&&!!(o.path||o.to||o.moves));
const M0={metal:0,rough:.85};
const LIB={
  robot:o=>{
    const c=cl(o.color,'#c9ced6'),e=cl(o.color2,'#22d3ee'),k=num(o.speed,1,0,10),w=wk(o),m={metal:.7,rough:.3};
    const arm=(s,an,rot,sp)=>pv([s*.7,1.85,0],rot,an,sp||k,[bx('box',c,[0,-.45,0],[.26,.9,.26],m)]);
    const leg=(s,an)=>pv([s*.25,.8,0],[0,0,0],an,k,[bx('box','#7b8290',[0,-.4,0],[.34,.8,.34],m)]);
    return[
      bx('box',c,[0,1.35,0],[1,1.1,.7],m),
      bx('box',c,[0,2.2,0],[.8,.6,.6],m),
      bx('sphere',e,[-.2,2.25,.31],[.18,.18,.18],{glow:2}),
      bx('sphere',e,[.2,2.25,.31],[.18,.18,.18],{glow:2}),
      bx('box',e,[0,1.35,.36],[.4,.25,.02],{glow:1.2}),
      bx('cylinder','#555',[0,2.7,0],[.06,.4,.06]),
      bx('sphere',e,[0,2.95,0],[.14,.14,.14],{glow:2}),
      arm(1,w?'swing2':'none',[0,0,0]),
      o.moves?arm(-1,'larm',[0,0,0]):o.act==='wave'?arm(-1,'sway',[0,0,-150],4*k):arm(-1,w?'swing':'none',[0,0,0]),
      leg(1,w?'swing':'none'),leg(-1,w?'swing2':'none')];
  },
  person:o=>{
    const c=cl(o.color,'#e4572e'),p=cl(o.color2,'#2b3a67'),sk='#e0ac86',k=num(o.speed,1,0,10),w=wk(o);
    const arm=(s,an,rot,sp)=>pv([s*.4,1.55,0],rot,an,sp||k,[bx('box',c,[0,-.3,0],[.15,.6,.15],M0),bx('sphere',sk,[0,-.65,0],[.14,.14,.14],M0)]);
    const leg=(s,an)=>pv([s*.15,.8,0],[0,0,0],an,k,[bx('box',p,[0,-.4,0],[.22,.8,.22],M0),bx('box','#222',[0,-.76,.05],[.24,.1,.34],M0)]);
    return[
      bx('box',c,[0,1.2,0],[.6,.8,.32],M0),
      bx('sphere',sk,[0,1.82,0],[.4,.4,.4],M0),
      bx('dome','#3b2a1a',[0,1.85,-.01],[.43,.43,.43],M0),
      arm(1,w?'swing2':'none',[0,0,0]),
      o.moves?arm(-1,'larm',[0,0,0]):o.act==='wave'?arm(-1,'sway',[0,0,-150],4*k):arm(-1,w?'swing':'none',[0,0,0]),
      leg(1,w?'swing':'none'),leg(-1,w?'swing2':'none')];
  },
  dog:o=>{
    const c=cl(o.color,'#b5835a'),d=cl(o.color2,'#6b4423'),k=num(o.speed,1,0,10),w=wk(o);
    const leg=(x,z,an)=>pv([x,.5,z],[0,0,0],w?an:'none',k,[bx('box',c,[0,-.25,0],[.13,.5,.13],M0)]);
    return[
      bx('box',c,[0,.7,0],[.5,.45,1],M0),
      bx('box',c,[0,.98,.62],[.4,.38,.42],M0),
      bx('box',d,[0,.92,.9],[.22,.18,.22],M0),
      bx('sphere','#111',[0,.97,1.02],[.08,.08,.08]),
      bx('sphere','#111',[-.1,1.05,.83],[.06,.06,.06]),
      bx('sphere','#111',[.1,1.05,.83],[.06,.06,.06]),
      bx('box',d,[-.2,1.22,.58],[.1,.22,.1],M0),
      bx('box',d,[.2,1.22,.58],[.1,.22,.1],M0),
      pv([0,.85,-.5],[40,0,0],o.act==='idle'?'none':'wag',1,[bx('box',d,[0,0,-.18],[.08,.08,.36],M0)]),
      leg(.17,.35,'swing'),leg(-.17,.35,'swing2'),leg(.17,-.35,'swing2'),leg(-.17,-.35,'swing')];
  },
  bird:o=>{
    const c=cl(o.color,'#4a90d9'),d=cl(o.color2,'#f5a623'),k=num(o.speed,1,0,10),f=o.act!=='idle';
    const wing=s=>pv([s*.2,.08,0],[0,0,0],f?(s>0?'flap':'flap2'):'none',k,[bx('box',c,[s*.45,0,0],[.9,.04,.38])]);
    return[
      bx('sphere',c,[0,0,0],[.45,.4,.8]),
      bx('sphere',c,[0,.18,.42],[.3,.3,.3]),
      bx('cone',d,[0,.16,.68],[.1,.22,.1],{rot:[90,0,0]}),
      bx('sphere','#111',[-.1,.24,.55],[.05,.05,.05]),
      bx('sphere','#111',[.1,.24,.55],[.05,.05,.05]),
      bx('box',d,[0,0,-.55],[.22,.04,.4]),
      wing(1),wing(-1)];
  },
  tree:o=>{
    const c=cl(o.color,'#3f8f3f'),d=cl(o.color2,'#6b4a2b');
    return[
      bx('cylinder',d,[0,.7,0],[.35,1.4,.35],M0),
      bx('sphere',c,[0,2.1,0],[1.9,1.7,1.9],M0),
      bx('sphere',c,[.55,2.8,.2],[1.3,1.2,1.3],M0),
      bx('sphere',c,[-.5,2.7,-.3],[1.2,1.1,1.2],M0)];
  },
  pine:o=>{
    const c=cl(o.color,'#2d6a4f'),d=cl(o.color2,'#5b3f26');
    return[
      bx('cylinder',d,[0,.5,0],[.3,1,.3],M0),
      bx('cone',c,[0,1.5,0],[2,1.5,2],M0),
      bx('cone',c,[0,2.4,0],[1.55,1.3,1.55],M0),
      bx('cone',c,[0,3.2,0],[1.1,1.1,1.1],M0)];
  },
  flower:o=>{
    const c=cl(o.color,'#ff5d8f'),m=cl(o.color2,'#ffd23f'),out=[bx('cylinder','#3a9d4a',[0,.35,0],[.06,.7,.06],M0),bx('sphere',m,[0,.75,0],[.2,.2,.2],M0)];
    for(let i=0;i<6;i++){const a=i*Math.PI/3;out.push(bx('sphere',c,[Math.cos(a)*.2,.75+Math.sin(a)*.2,0],[.17,.17,.17],M0))}
    return out;
  },
  rock:o=>{
    const c=cl(o.color,'#7b8088'),x={metal:0,rough:.9};
    return[bx('ico',c,[0,.35,0],[1.3,.9,1.1],x),bx('ico',c,[.85,.2,.3],[.7,.55,.6],x),bx('ico',c,[-.7,.15,-.4],[.5,.4,.5],x)];
  },
  cloud:o=>{
    const c=cl(o.color,'#ffffff'),x={metal:0,rough:1,glow:.35};
    return[
      bx('sphere',c,[0,0,0],[1.8,1.3,1.3],x),
      bx('sphere',c,[1.1,-.15,.1],[1.3,1,1.1],x),
      bx('sphere',c,[-1.1,-.2,0],[1.2,.9,1],x),
      bx('sphere',c,[.4,.45,-.1],[1.1,.9,1],x)];
  },
  mountain:o=>{
    const c=cl(o.color,'#6b7280'),s=cl(o.color2,'#f4f7fb');
    return[bx('pyramid',c,[0,2.5,0],[8,5,8],{metal:0,rough:.95}),bx('pyramid',s,[0,4,0],[3.3,2.05,3.3],M0)];
  },
  house:o=>{
    const c=cl(o.color,'#e8d9b5'),r=cl(o.color2,'#b5432f'),w='#ffe39a';
    return[
      bx('box',c,[0,1,0],[3,2,2.4],M0),
      bx('pyramid',r,[0,2.65,0],[3.7,1.3,3.1],M0),
      bx('box','#6b4423',[0,.55,1.21],[.6,1.1,.06],M0),
      bx('box',w,[-.95,1.25,1.21],[.5,.5,.06],{glow:1.2,metal:0}),
      bx('box',w,[.95,1.25,1.21],[.5,.5,.06],{glow:1.2,metal:0}),
      bx('box','#7a3b2a',[.9,3.1,-.4],[.3,.8,.3],M0)];
  },
  car:o=>{
    const c=cl(o.color,'#d33a3a'),k=num(o.speed,1,0,10),r=mv(o)?'roll':'none';
    const wheel=(x,z)=>pv([x,.35,z],[0,0,0],r,3*k,[bx('cylinder','#1b1b1b',[0,0,0],[.7,.3,.7],{rot:[0,0,90],metal:.2,rough:.8})]);
    return[
      bx('box',c,[0,.6,0],[1.7,.55,3.6],{metal:.6,rough:.3}),
      bx('box','#bfe3ff',[0,1.1,-.2],[1.45,.5,1.7],{metal:.8,rough:.1,opacity:.8}),
      bx('box','#fff3b0',[-.55,.65,1.81],[.35,.2,.05],{glow:1.8}),
      bx('box','#fff3b0',[.55,.65,1.81],[.35,.2,.05],{glow:1.8}),
      bx('box','#ff3030',[-.55,.65,-1.81],[.35,.2,.05],{glow:1.2}),
      bx('box','#ff3030',[.55,.65,-1.81],[.35,.2,.05],{glow:1.2}),
      wheel(.9,1.15),wheel(-.9,1.15),wheel(.9,-1.15),wheel(-.9,-1.15)];
  },
  boat:o=>{
    const c=cl(o.color,'#8b5a2b'),s=cl(o.color2,'#f6f1e7'),h={metal:.1,rough:.7};
    return[
      bx('box',c,[0,.3,-.2],[1.3,.6,2.6],h),
      bx('pyramid',c,[0,.3,1.4],[1.3,.9,.6],{rot:[90,0,0],metal:.1,rough:.7}),
      bx('box','#5a3a1a',[0,.62,-.2],[1.1,.06,2.4],h),
      bx('cylinder','#4a3320',[0,1.9,.1],[.1,2.6,.1],h),
      bx('box',s,[0,2,-.35],[.04,1.7,1.3],M0)];
  },
  rocket:o=>{
    const c=cl(o.color,'#f2f2f2'),a=cl(o.color2,'#e03a3a'),out=[
      bx('cylinder',c,[0,1.5,0],[.9,2,.9],{metal:.5,rough:.3}),
      bx('cone',a,[0,3,0],[.9,1,.9],{metal:.4,rough:.4}),
      bx('box',a,[0,.6,0],[1.7,.7,.08]),
      bx('box',a,[0,.6,0],[.08,.7,1.7]),
      bx('sphere','#7fd4ff',[0,2.1,.42],[.35,.35,.1],{glow:1.2}),
      bx('cylinder','#333',[0,.35,0],[.5,.3,.5])];
    if(mv(o))out.push(bx('cone','#ffb020',[0,-.3,0],[.6,1.1,.6],{rot:[180,0,0],glow:2.5,opacity:.9,anim:'pulse',speed:4}));
    return out;
  },
  puddle:o=>{
    const c=cl(o.color,'#5c0606'),x={metal:.3,rough:.15};
    return[bx('cylinder',c,[0,.012,0],[1.8,.02,1.4],x),bx('cylinder',c,[.5,.014,.3],[1.1,.02,1.3],x),bx('cylinder',c,[-.6,.016,-.2],[.9,.02,.8],x),bx('cylinder',c,[.1,.018,-.5],[.6,.02,.5],x)];
  },
  trail:o=>{
    const c=cl(o.color,'#5c0606'),x={metal:.3,rough:.15};
    return Array.from({length:7},(_,i)=>bx('cylinder',c,[Math.sin(i*1.7)*.25,.012+i*.001,i*.75],[.9-i*.1,.02,.7-i*.07],x)).concat([bx('cylinder',c,[.5,.02,1.2],[.15,.02,.15],x),bx('cylinder',c,[-.45,.02,3],[.12,.02,.12],x)]);
  },
  bed:o=>{
    const c=cl(o.color,'#4a3b36'),b=cl(o.color2,'#cfd6e0'),x={metal:0,rough:.9};
    return[bx('box',c,[0,.25,0],[2.2,.5,3.2],x),bx('box',b,[0,.62,0],[2.1,.25,3.1],x),bx('box','#e9edf3',[0,.82,-1.2],[1.3,.2,.6],x),bx('box',c,[0,.9,-1.62],[2.2,1.1,.12],x)];
  },
  ghost:o=>{
    const c=cl(o.color,'#e8eef5'),e=cl(o.color2,'#0a0a12'),k=num(o.speed,1,0,10),f={anim:'float',speed:.8*k},g={...f,rough:1,glow:.7,opacity:.75};
    return[bx('sphere',c,[0,2,0],[1,1,1],g),bx('cone',c,[0,.95,0],[1.4,1.9,1.4],g),
      bx('sphere',e,[-.2,2.1,.42],[.16,.26,.1],f),bx('sphere',e,[.2,2.1,.42],[.16,.26,.1],f),bx('sphere',e,[0,1.7,.44],[.22,.34,.1],f),
      bx('sphere',c,[-.75,1.4,.2],[.25,.9,.25],{...g,rot:[0,0,25]}),bx('sphere',c,[.75,1.4,.2],[.25,.9,.25],{...g,rot:[0,0,-25]})];
  },
  monster:o=>{
    const c=cl(o.color,'#14161c'),e=cl(o.color2,'#ff2a2a'),k=num(o.speed,1,0,10),w=wk(o),m={metal:.1,rough:.9};
    const arm=(s,an)=>pv([s*.75,2.5,0],[0,0,0],an,k,[bx('cylinder',c,[0,-.9,0],[.22,1.8,.22],m),bx('cone','#cbd0d6',[0,-2,0],[.2,.5,.2],{rot:[180,0,0]})]);
    const leg=(s,an)=>pv([s*.35,1.2,0],[0,0,0],an,k,[bx('cylinder',c,[0,-.6,0],[.3,1.2,.3],m)]);
    return[bx('cylinder',c,[0,2,0],[1.1,1.9,.8],m),bx('sphere',c,[0,3.15,.1],[.75,.8,.75],m),
      bx('sphere',e,[-.18,3.2,.45],[.14,.1,.08],{glow:3}),bx('sphere',e,[.18,3.2,.45],[.14,.1,.08],{glow:3}),
      bx('cone',c,[-.3,3.7,0],[.15,.5,.15],m),bx('cone',c,[.3,3.7,0],[.15,.5,.15],m),
      arm(1,w?'swing2':'sway'),arm(-1,w?'swing':'sway'),leg(1,w?'swing':'none'),leg(-1,w?'swing2':'none')];
  },
  grave:o=>{
    const c=cl(o.color,'#8a8f98'),x={metal:0,rough:.95};
    return[bx('box','#2a2118',[0,.05,.6],[1.1,.12,1.8],x),bx('box',c,[0,.7,0],[.9,1.2,.22],x),bx('dome',c,[0,1.3,0],[.9,.55,.22],x)];
  },
  deadtree:o=>{
    const c=cl(o.color,'#2b2320'),x={metal:0,rough:1},br=(p,r,s)=>bx('cylinder',c,p,s,{...x,rot:r});
    return[bx('cylinder',c,[0,1.6,0],[.4,3.2,.4],x),br([.6,2.6,0],[0,0,-50],[.14,1.6,.14]),br([-.6,3,0],[0,0,55],[.14,1.8,.14]),
      br([.2,3.6,.4],[40,0,-15],[.1,1.2,.1]),br([-.2,2.2,-.4],[-40,0,25],[.1,1.3,.1]),br([1.2,3.3,0],[0,0,-20],[.07,.9,.07])];
  },
  mansion:o=>{
    const c=cl(o.color,'#2a2630'),w=cl(o.color2,'#ffc04d'),x={metal:0,rough:.9},win=(px,py)=>bx('box',w,[px,py,1.51],[.45,.7,.05],{glow:1.8});
    return[bx('box',c,[0,2,0],[5,4,3],x),bx('pyramid','#17141c',[0,5,0],[5.6,2,3.6],x),bx('cylinder',c,[3,3.2,0],[1.3,6.4,1.3],x),bx('cone','#17141c',[3,7.2,0],[1.7,1.6,1.7],x),
      bx('box','#0c0a0e',[0,.9,1.51],[.8,1.8,.05],x),win(-1.6,2.8),win(0,2.8),win(1.6,2.8),win(-1.6,1.2),win(1.6,1.2),bx('box',w,[3,5,.66],[.4,.7,.05],{glow:1.8})];
  },
  lamp:o=>{
    const c=cl(o.color,'#3a3f47'),g=cl(o.color2,'#ffd27a');
    return[
      bx('cylinder',c,[0,.1,0],[.35,.2,.35]),
      bx('cylinder',c,[0,1.6,0],[.1,3.2,.1]),
      bx('box',c,[.3,3.2,0],[.7,.08,.1]),
      bx('sphere',g,[.6,3.1,0],[.32,.32,.32],{glow:2.5}),
      bx('dome',c,[.6,3.2,0],[.45,.3,.45])];
  },
  clown:o=>{
    const c=cl(o.color,'#c0392b'),e=cl(o.color2,'#f4f1e8'),k=num(o.speed,1,0,10),w=wk(o),m={metal:0,rough:.8},K='#0a0a0a';
    const arm=(s,an)=>pv([s*.5,1.5,0],[0,0,0],an,k,[bx('cylinder',c,[0,-.45,0],[.2,.9,.2],m),bx('sphere',e,[0,-.95,0],[.24,.24,.24],m)]);
    const leg=(s,an)=>pv([s*.2,.8,0],[0,0,0],an,k,[bx('cylinder','#2a6f3a',[0,-.4,0],[.24,.8,.24],m),bx('box','#d4a017',[0,-.8,.12],[.3,.14,.5],m)]);
    return[bx('cylinder',c,[0,1.15,0],[.8,1.1,.5],m),bx('sphere',e,[0,2.2,0],[.62,.7,.62],m),bx('sphere','#ff1a1a',[0,2.15,.34],[.16,.16,.16],{glow:.8}),
      bx('sphere',K,[-.17,2.32,.28],[.12,.1,.08],m),bx('sphere',K,[.17,2.32,.28],[.12,.1,.08],m),bx('box','#b00000',[0,1.98,.3],[.4,.08,.08],{...m,glow:.5}),
      bx('sphere','#1fa84a',[-.42,2.35,0],[.26,.26,.26],m),bx('sphere','#1fa84a',[.42,2.35,0],[.26,.26,.26],m),
      arm(1,w?'swing2':'sway'),arm(-1,w?'swing':'sway'),leg(1,w?'swing':'none'),leg(-1,w?'swing2':'none')];
  },
  doll:o=>{
    const c=cl(o.color,'#e9d9cf'),e=cl(o.color2,'#7a1f2b'),k=num(o.speed,1,0,10),m={metal:0,rough:.6},K='#050505';
    return[bx('cone',e,[0,.45,0],[.8,.9,.8],m),bx('cylinder',c,[0,.95,0],[.25,.25,.25],m),bx('cylinder',c,[-.38,.78,0],[.1,.5,.1],{...m,rot:[0,0,35]}),bx('cylinder',c,[.38,.78,0],[.1,.5,.1],{...m,rot:[0,0,-35]}),
      pv([0,1.2,0],[0,0,0],'sway',.5*k,[bx('sphere',c,[0,0,0],[.5,.5,.5],m),bx('sphere','#2a1a12',[0,.2,-.05],[.56,.4,.5],m),
        bx('sphere',K,[-.1,.04,.22],[.11,.14,.06],m),bx('sphere',K,[.1,.04,.22],[.11,.14,.06],m),bx('sphere','#ff2a2a',[.1,.04,.26],[.03,.03,.03],{glow:3}),bx('box','#5a0d0d',[0,-.14,.24],[.14,.03,.04],m)])];
  },
  spider:o=>{
    const c=cl(o.color,'#15110f'),e=cl(o.color2,'#ff2a2a'),k=num(o.speed,1,0,10),m={metal:.1,rough:.8},L=[];
    [-1,1].forEach(s=>[-.6,-.2,.2,.6].forEach((z,i)=>L.push(bx('cylinder',c,[s*.85,.55,z*.9],[.09,1.5,.09],{...m,rot:[0,-(-20+i*13)*s,s*62],anim:(i+(s>0?1:0))%2?'sway':'none',speed:k*3}))));
    return[bx('sphere',c,[0,.8,-.4],[1.2,.9,1.5],m),bx('sphere',c,[0,.85,.55],[.7,.6,.6],m),
      bx('sphere',e,[-.16,.95,.82],[.12,.12,.08],{glow:3}),bx('sphere',e,[.16,.95,.82],[.12,.12,.08],{glow:3}),bx('sphere',e,[-.05,1.05,.8],[.08,.08,.06],{glow:3}),bx('sphere',e,[.05,1.05,.8],[.08,.08,.06],{glow:3}),...L];
  },
  skeleton:o=>{
    const c=cl(o.color,'#e6e0cf'),k=num(o.speed,1,0,10),w=wk(o),m={metal:0,rough:.9},K='#050505';
    const arm=(s,an)=>pv([s*.45,1.6,0],[0,0,0],an,k,[bx('cylinder',c,[0,-.4,0],[.07,.8,.07],m),bx('cylinder',c,[0,-.9,0],[.06,.6,.06],m)]);
    const leg=(s,an)=>pv([s*.18,.95,0],[0,0,0],an,k,[bx('cylinder',c,[0,-.45,0],[.09,.9,.09],m)]);
    return[bx('cylinder',c,[0,1.2,0],[.08,.9,.08],m),bx('torus',c,[0,1.55,0],[.8,.5,.4],{...m,rot:[90,0,0]}),bx('torus',c,[0,1.35,0],[.7,.45,.35],{...m,rot:[90,0,0]}),bx('torus',c,[0,1.15,0],[.5,.35,.3],{...m,rot:[90,0,0]}),
      bx('box',c,[0,.95,0],[.5,.14,.25],m),bx('sphere',c,[0,1.95,0],[.42,.46,.42],m),bx('box',c,[0,1.72,.1],[.28,.12,.2],m),bx('sphere',K,[-.1,1.98,.17],[.12,.14,.08],m),bx('sphere',K,[.1,1.98,.17],[.12,.14,.08],m),
      arm(1,w?'swing2':'sway'),arm(-1,w?'swing':'sway'),leg(1,w?'swing':'none'),leg(-1,w?'swing2':'none')];
  },
  scarecrow:o=>{
    const c=cl(o.color,'#6b4a2b'),e=cl(o.color2,'#c9a54a'),k=num(o.speed,1,0,10),m={metal:0,rough:1},K='#050505';
    return[bx('cylinder',c,[0,1.5,0],[.12,3,.12],m),bx('cylinder',c,[0,2.3,0],[.1,2.2,.1],{...m,rot:[0,0,90]}),bx('box','#3b3a2e',[0,1.9,.02],[.9,1.2,.3],{...m,anim:'sway',speed:.5*k}),
      bx('sphere','#c8b58a',[0,2.85,0],[.55,.6,.55],m),bx('cylinder','#2b2118',[0,3.2,0],[.9,.06,.9],m),bx('cylinder','#2b2118',[0,3.4,0],[.5,.4,.5],m),
      bx('sphere',K,[-.12,2.9,.25],[.1,.14,.06],m),bx('sphere',K,[.12,2.9,.25],[.1,.14,.06],m),bx('cone',e,[-1.1,2.15,0],[.14,.5,.14],{...m,rot:[0,0,90]}),bx('cone',e,[1.1,2.15,0],[.14,.5,.14],{...m,rot:[0,0,-90]})];
  },
  slender:o=>{
    const c=cl(o.color,'#0b0b0e'),e=cl(o.color2,'#e9e6df'),k=num(o.speed,1,0,10),w=wk(o),m={metal:0,rough:.9};
    const arm=(s,an)=>pv([s*.42,3.1,0],[0,0,0],an,k,[bx('cylinder',c,[0,-1.2,0],[.12,2.4,.12],m)]);
    const leg=(s,an)=>pv([s*.18,1.7,0],[0,0,0],an,k,[bx('cylinder',c,[0,-.85,0],[.17,1.7,.17],m)]);
    return[bx('box',c,[0,2.6,0],[.8,1.5,.4],m),bx('box','#6b0f0f',[0,2.6,.21],[.08,1.1,.02],m),bx('sphere',e,[0,3.65,0],[.5,.62,.5],{metal:0,rough:.6,glow:.15}),
      arm(1,w?'swing2':'sway'),arm(-1,w?'swing':'sway'),leg(1,w?'swing':'none'),leg(-1,w?'swing2':'none')];
  },
  zombie:o=>{
    const c=cl(o.color,'#7c9a6a'),e=cl(o.color2,'#3b3f2f'),k=num(o.speed,1,0,10),w=wk(o),m={metal:0,rough:.95};
    const arm=s=>pv([s*.5,1.55,0],[-80,0,0],'sway',k*.6,[bx('cylinder',c,[0,-.45,0],[.2,.9,.2],m)]);
    const leg=(s,an)=>pv([s*.22,.9,0],[0,0,0],an,k,[bx('cylinder',e,[0,-.45,0],[.26,.9,.26],m)]);
    return[bx('box',e,[0,1.3,0],[.8,1,.4],{...m,anim:'sway',speed:.4*k}),bx('sphere',c,[0,2,.05],[.5,.55,.5],m),bx('sphere','#e8e8c0',[-.1,2.05,.25],[.1,.1,.06],{glow:1.5}),bx('sphere','#e8e8c0',[.1,2.05,.25],[.1,.1,.06],{glow:1.5}),bx('box','#3a0a0a',[0,1.86,.27],[.22,.06,.04],m),
      arm(1),arm(-1),leg(1,w?'swing':'none'),leg(-1,w?'swing2':'none')];
  },
  tentacle:o=>{
    const c=cl(o.color,'#3b1f4a'),e=cl(o.color2,'#c8e04a'),k=num(o.speed,1,0,10),m={metal:.2,rough:.5};
    const t=(x,z,s)=>pv([x,0,z],[0,0,0],'sway',s*k,[bx('cone',c,[0,.7,0],[.45,1.4,.45],m),pv([0,1.35,0],[0,0,0],'sway',s*k*1.4,[bx('cone',c,[0,.6,0],[.3,1.2,.3],m),pv([0,1.15,0],[0,0,0],'sway',s*k*1.9,[bx('cone',e,[0,.5,0],[.18,1,.18],{...m,glow:.6})])])]);
    return[t(0,0,.7),t(-.7,.3,.9),t(.7,-.2,.6),t(.2,.8,1.1)];
  },
  pentagram:o=>{
    const c=cl(o.color,'#b00000'),r=1.6,x={metal:0,rough:1,glow:1.5},P=i=>[Math.cos((90+72*i)*Math.PI/180)*r,Math.sin((90+72*i)*Math.PI/180)*r],L=[];
    for(let i=0;i<24;i++){const a=i*Math.PI/12;L.push(bx('box',c,[Math.cos(a)*r,.03,Math.sin(a)*r],[.42,.02,.07],{...x,rot:[0,-(a*180/Math.PI+90),0]}))}
    for(let i=0;i<5;i++){const a=P(i),b=P((i+2)%5),dx=b[0]-a[0],dz=-(b[1]-a[1]);L.push(bx('box',c,[(a[0]+b[0])/2,.03,-(a[1]+b[1])/2],[Math.hypot(dx,dz),.02,.07],{...x,rot:[0,Math.atan2(-dz,dx)*180/Math.PI,0]}))}
    return L;
  },
  coffin:o=>{
    const c=cl(o.color,'#3a2616'),m={metal:.1,rough:.8};
    return[bx('box',c,[0,.4,0],[.9,.7,2.1],m),bx('box','#0a0705',[0,.76,0],[.7,.04,1.9],m),bx('box',c,[0,.85,.55],[.95,.08,1.2],{...m,rot:[0,25,0]}),bx('cylinder','#cfc6b0',[0,.85,-.4],[.1,.55,.1],{...m,rot:[65,0,0],anim:'sway',speed:.7})];
  },
  pumpkin:o=>{
    const c=cl(o.color,'#e8731a'),g=cl(o.color2,'#ffd23a'),m={metal:0,rough:.7};
    return[bx('sphere',c,[0,.5,0],[1.1,.9,1.1],{...m,glow:.25}),bx('cylinder','#3b5a1f',[0,1.02,0],[.14,.2,.14],m),bx('cone',g,[-.25,.62,.5],[.18,.2,.1],{glow:3,rot:[0,0,180]}),bx('cone',g,[.25,.62,.5],[.18,.2,.1],{glow:3,rot:[0,0,180]}),
      bx('box',g,[0,.28,.52],[.6,.1,.06],{glow:3,anim:'pulse',speed:1.5}),bx('box',g,[-.2,.36,.52],[.1,.12,.06],{glow:3}),bx('box',g,[.2,.36,.52],[.1,.12,.06],{glow:3})];
  },
  bat:o=>{const c=cl(o.color,'#1a1620'),k=num(o.speed,1,0,10),m={metal:0,rough:.9};
    return[bx('sphere',c,[0,0,0],[.3,.28,.42],m),bx('sphere','#ff2a2a',[-.06,.06,.18],[.05,.05,.04],{glow:3}),bx('sphere','#ff2a2a',[.06,.06,.18],[.05,.05,.04],{glow:3}),
      pv([.12,.04,0],[0,0,0],'flap',k*1.6,[bx('box',c,[.38,0,0],[.76,.03,.4],m)]),pv([-.12,.04,0],[0,0,0],'flap2',k*1.6,[bx('box',c,[-.38,0,0],[.76,.03,.4],m)])]},
  candle:o=>[bx('cylinder',cl(o.color,'#e8e0c8'),[0,.3,0],[.14,.6,.14],{metal:0,rough:.9}),bx('sphere','#ffb347',[0,.7,0],[.1,.2,.1],{glow:3,anim:'pulse',speed:2.5})]
};

/* ---------- Modelos mejorados ---------- */
SH.capsule=()=>{const p=[];for(let i=0;i<=8;i++){const a=i/8*Math.PI/2;p.push(new THREE.Vector2(Math.sin(a)*.5,-.25-Math.cos(a)*.25))}for(let i=0;i<=8;i++){const a=i/8*Math.PI/2;p.push(new THREE.Vector2(Math.cos(a)*.5,.25+Math.sin(a)*.25))}return new THREE.LatheGeometry(p,24)};
SH.taper=()=>new THREE.CylinderGeometry(.5,.32,1,18);
SH.lump=()=>new THREE.IcosahedronGeometry(.5,3);
const tp=(c,p,s,x)=>bx('taper',c,p,s,x),cp=(c,p,s,x)=>bx('capsule',c,p,s,x),fi=(c,x,y,l,r)=>bx('cone',c,[x,y,.02],[.035,l,.035],{rot:r||[180,0,0],rough:.8});
Object.assign(LIB,{
monster:o=>{
  const c=cl(o.color,'#14161c'),e=cl(o.color2,'#ff2a2a'),k=num(o.speed,1,0,10),w=wk(o),m={metal:.15,rough:.75},mn={...m,nz:.07},B='#cbd0d6',T='#e8e0cc',X=[-.2,-.1,0,.1,.2];
  const arm=(s,an)=>pv([s*.95,3.05,0],[0,0,s*5],an,k,[bx('sphere',c,[0,0,0],[.7,.7,.7],mn),tp(c,[0,-.7,0],[.48,1.4,.48],mn),bx('sphere',c,[0,-1.4,0],[.34,.34,.34],m),tp(c,[0,-2,0],[.36,1.2,.36],mn),bx('sphere',c,[0,-2.65,0],[.42,.5,.38],mn),...[-.14,0,.14].map(x=>bx('cone',B,[x,-2.9,.05],[.07,.4,.06],{rot:[180,0,0],metal:.5,rough:.3}))]);
  const leg=(s,an)=>pv([s*.42,1.55,0],[0,0,0],an,k,[tp(c,[0,-.7,0],[.62,1.4,.62],mn),bx('box',c,[0,-1.5,.2],[.55,.16,.85],m),...[-.15,0,.15].map(x=>bx('cone',B,[x,-1.5,.68],[.08,.25,.08],{rot:[90,0,0]}))]);
  return[cp(c,[0,2.65,0],[1.5,2.1,1.05],{...mn,rot:[10,0,0]}),bx('lump',c,[0,3.85,.35],[.9,.85,1],{...mn,nz:.12}),
    ...[0,1,2,3].map(i=>bx('cone',B,[0,3.4-i*.4,-.62],[.14,.5,.14],{rot:[-70,0,0],metal:.3,rough:.4})),
    bx('box',c,[0,3.5,.6],[.6,.12,.7],{...m,rot:[15,0,0]}),...X.map(x=>bx('cone',T,[x,3.58,.88],[.05,.2,.05],{rot:[180,0,0]})),...X.map(x=>bx('cone',T,[x*.8,3.62,.82],[.05,.16,.05])),
    bx('sphere',e,[-.22,3.95,.78],[.16,.07,.08],{glow:4}),bx('sphere',e,[.22,3.95,.78],[.16,.07,.08],{glow:4}),
    bx('box',c,[-.22,4.05,.8],[.3,.05,.06],{...m,rot:[0,0,-20]}),bx('box',c,[.22,4.05,.8],[.3,.05,.06],{...m,rot:[0,0,20]}),
    bx('cone','#2a2a30',[-.4,4.45,.15],[.16,.7,.16],{...m,rot:[-10,0,25]}),bx('cone','#2a2a30',[.4,4.45,.15],[.16,.7,.16],{...m,rot:[-10,0,-25]}),
    arm(1,w?'armB':'armB0'),arm(-1,w?'armA':'armA0'),leg(1,w?'swing':'none'),leg(-1,w?'swing2':'none')];
},
zombie:o=>{
  const c=cl(o.color,'#7c9a6a'),e=cl(o.color2,'#3b3f2f'),k=num(o.speed,1,0,10),w=wk(o),m={metal:0,rough:.95},mn={...m,nz:.05};
  const arm=s=>pv([s*.52,1.75,0],[-80,0,0],(s>0?(w?'armB':'armB0'):(w?'armA':'armA0')),k*.6,[tp(c,[0,-.4,0],[.22,.8,.22],mn),bx('sphere',c,[0,-.82,0],[.17,.17,.17],m),tp(c,[0,-1.15,0],[.17,.62,.17],mn),cp(c,[0,-1.5,0],[.16,.26,.09],m),...[-.05,0,.05].map(x=>fi(c,x,-1.72,.2))]);
  const leg=(s,an)=>pv([s*.22,.95,0],[0,0,0],an,k,[tp(e,[0,-.47,0],[.3,.95,.3],m),bx('box','#2a2a22',[0,-.92,.1],[.26,.1,.42],m)]);
  return[cp(e,[0,1.5,0],[.78,1.1,.46],{...m,rot:[8,0,0],anim:'sway',speed:.4*k}),...[0,1,2].map(i=>bx('box','#d8d2b8',[.14,1.6-i*.11,.22],[.3,.035,.05],m)),bx('sphere','#4a0a0a',[-.22,1.35,.21],[.22,.22,.06],m),
    bx('lump',c,[0,2.2,.1],[.52,.58,.55],{...mn,rot:[18,0,0],nz:.08}),bx('sphere','#e8e8c0',[-.1,2.26,.33],[.1,.1,.06],{glow:1.5}),bx('sphere','#e8e8c0',[.1,2.26,.33],[.1,.1,.06],{glow:1.5}),
    bx('box','#3a0a0a',[0,2.06,.34],[.2,.1,.05],m),...[-.06,0,.06].map(x=>bx('box','#cfc6a0',[x,2.1,.355],[.03,.04,.02],m)),bx('sphere','#2a2218',[-.12,2.46,0],[.18,.12,.2],m),
    arm(1),arm(-1),leg(1,w?'swing':'none'),leg(-1,w?'swing2':'none')];
},
skeleton:o=>{
  const c=cl(o.color,'#e6e0cf'),k=num(o.speed,1,0,10),w=wk(o),m={metal:0,rough:.85},K='#050505';
  const arm=(s,an)=>pv([s*.42,1.65,0],[0,0,0],an,k,[bx('sphere',c,[0,0,0],[.14,.14,.14],m),bx('cylinder',c,[0,-.3,0],[.06,.6,.06],m),bx('sphere',c,[0,-.62,0],[.1,.1,.1],m),bx('cylinder',c,[0,-.95,0],[.05,.6,.05],m),bx('box',c,[0,-1.3,0],[.1,.14,.04],m),...[-.03,0,.03].map(x=>fi(c,x,-1.43,.14))]);
  const leg=(s,an)=>pv([s*.15,.95,0],[0,0,0],an,k,[bx('cylinder',c,[0,-.25,0],[.07,.5,.07],m),bx('sphere',c,[0,-.5,0],[.11,.11,.11],m),bx('cylinder',c,[0,-.72,0],[.06,.46,.06],m),bx('box',c,[0,-.93,.08],[.1,.06,.24],m)]);
  return[bx('cylinder',c,[0,1.3,-.05],[.07,.9,.07],m),bx('cylinder',c,[0,1.8,0],[.07,.2,.07],m),
    ...[0,1,2,3,4].map(i=>bx('torus',c,[0,1.68-i*.1,0],[.7-i*.05,.42-i*.03,.3],{...m,rot:[90,0,0]})),bx('box',c,[0,1.5,.2],[.06,.5,.04],m),
    bx('torus',c,[0,.98,0],[.5,.3,.3],{...m,rot:[90,0,0]}),bx('sphere',c,[-.2,.95,0],[.2,.18,.18],m),bx('sphere',c,[.2,.95,0],[.2,.18,.18],m),
    bx('sphere',c,[0,2.05,0],[.42,.46,.44],m),bx('box',c,[0,1.86,.12],[.3,.1,.26],m),bx('box','#f2eed8',[0,1.9,.25],[.26,.05,.03],m),
    bx('sphere',K,[-.1,2.08,.17],[.12,.15,.09],m),bx('sphere',K,[.1,2.08,.17],[.12,.15,.09],m),bx('cone',K,[0,1.98,.2],[.06,.1,.05],{...m,rot:[180,0,0]}),
    arm(1,w?'armB':'armB0'),arm(-1,w?'armA':'armA0'),leg(1,w?'swing':'none'),leg(-1,w?'swing2':'none')];
},
clown:o=>{
  const c=cl(o.color,'#c0392b'),e=cl(o.color2,'#f4f1e8'),k=num(o.speed,1,0,10),w=wk(o),m={metal:0,rough:.8},K='#0a0a0a',G='#1fa84a';
  const arm=(s,an)=>pv([s*.6,1.75,0],[0,0,0],an,k,[tp(c,[0,-.4,0],[.28,.8,.28],m),bx('sphere',e,[0,-.85,0],[.22,.22,.22],m),cp(e,[0,-1.1,0],[.18,.34,.14],m),...[-.05,0,.05].map(x=>fi(e,x,-1.42,.3))]);
  const leg=(s,an)=>pv([s*.22,.85,0],[0,0,0],an,k,[tp('#2a6f3a',[0,-.42,0],[.32,.85,.32],m),cp('#d4a017',[0,-.8,.22],[.3,.72,.16],{...m,rot:[90,0,0]})]);
  return[cp(c,[0,1.25,0],[.95,1.35,.7],m),...[0,1,2].map(i=>bx('sphere',e,[0,1.6-i*.3,.34],[.12,.12,.08],m)),bx('torus',e,[0,1.9,0],[.9,.9,.4],{...m,rot:[90,0,0]}),
    bx('sphere',e,[0,2.4,0],[.6,.68,.6],m),bx('sphere',G,[-.42,2.55,0],[.3,.3,.3],m),bx('sphere',G,[.42,2.55,0],[.3,.3,.3],m),bx('sphere',G,[-.18,2.8,0],[.2,.2,.2],m),bx('sphere',G,[.18,2.8,0],[.2,.2,.2],m),
    bx('sphere',K,[-.17,2.47,.27],[.14,.16,.08],m),bx('sphere',K,[.17,2.47,.27],[.14,.16,.08],m),bx('sphere','#ffdd00',[-.17,2.45,.31],[.04,.05,.03],{glow:3}),bx('sphere','#ffdd00',[.17,2.45,.31],[.04,.05,.03],{glow:3}),
    bx('sphere','#ff1a1a',[0,2.35,.34],[.17,.17,.17],{glow:.8}),bx('box',K,[0,2.17,.29],[.4,.1,.05],m),bx('box','#b00000',[-.22,2.24,.29],[.14,.06,.05],{...m,rot:[0,0,35]}),bx('box','#b00000',[.22,2.24,.29],[.14,.06,.05],{...m,rot:[0,0,-35]}),
    ...[-.15,-.05,.05,.15].map(x=>bx('cone','#f2eed8',[x,2.2,.315],[.035,.1,.03],{...m,rot:[180,0,0]})),bx('cone','#2a6f3a',[.1,3.05,0],[.35,.5,.35],{...m,rot:[0,0,15]}),
    arm(1,w?'armB':'armB0'),arm(-1,w?'armA':'armA0'),leg(1,w?'swing':'none'),leg(-1,w?'swing2':'none')];
},
slender:o=>{
  const c=cl(o.color,'#0b0b0e'),e=cl(o.color2,'#e9e6df'),k=num(o.speed,1,0,10),w=wk(o),m={metal:0,rough:.9};
  const arm=(s,an)=>pv([s*.45,3.3,0],[0,0,0],an,k,[tp(c,[0,-.8,0],[.13,1.6,.13],m),bx('sphere',c,[0,-1.6,0],[.13,.13,.13],m),tp(c,[0,-2.2,0],[.11,1.2,.11],m),...[-.04,0,.04].map(x=>bx('cone',c,[x,-2.9,0],[.03,.5,.03],{...m,rot:[180,0,0]}))]);
  const leg=(s,an)=>pv([s*.17,1.75,0],[0,0,0],an,k,[tp(c,[0,-.85,0],[.2,1.7,.2],m),bx('box',c,[0,-1.72,.1],[.2,.1,.4],m)]);
  return[cp(c,[0,2.7,0],[.75,1.6,.38],m),bx('box',e,[0,2.95,.19],[.18,.9,.02],m),bx('box','#6b0f0f',[0,2.85,.21],[.07,.8,.02],m),
    bx('box','#111114',[-.2,3,.2],[.14,.8,.02],{...m,rot:[0,0,8]}),bx('box','#111114',[.2,3,.2],[.14,.8,.02],{...m,rot:[0,0,-8]}),bx('cylinder',c,[0,3.45,0],[.1,.3,.1],m),
    bx('sphere',e,[0,3.8,0],[.46,.64,.46],{metal:0,rough:.55,glow:.15}),
    ...[-1,1].map(s=>bx('cone',c,[s*.3,3.4,-.5],[.07,1.6,.07],{...m,rot:[-50,0,s*25],anim:'sway',speed:.6*k})),
    arm(1,w?'armB':'armB0'),arm(-1,w?'armA':'armA0'),leg(1,w?'swing':'none'),leg(-1,w?'swing2':'none')];
},
doll:o=>{
  const c=cl(o.color,'#e9d9cf'),e=cl(o.color2,'#7a1f2b'),k=num(o.speed,1,0,10),m={metal:0,rough:.5},K='#050505';
  return[bx('cone',e,[0,.5,0],[.85,1,.85],m),bx('torus','#e9d9cf',[0,.08,0],[.85,.85,.3],{...m,rot:[90,0,0]}),cp(c,[0,.98,0],[.3,.4,.24],m),bx('box','#2a1a12',[0,.85,.2],[.28,.06,.02],m),
    tp(c,[-.36,.82,0],[.12,.5,.12],{...m,rot:[0,0,35]}),tp(c,[.36,.82,0],[.12,.5,.12],{...m,rot:[0,0,-35]}),
    pv([0,1.25,0],[0,0,0],'sway',.5*k,[bx('sphere',c,[0,0,0],[.5,.52,.5],m),bx('sphere','#2a1a12',[0,.18,-.06],[.56,.4,.5],m),
      bx('sphere','#2a1a12',[-.3,-.05,0],[.16,.16,.16],m),bx('sphere','#2a1a12',[.3,-.05,0],[.16,.16,.16],m),bx('sphere','#2a1a12',[-.32,-.2,0],[.14,.14,.14],m),bx('sphere','#2a1a12',[.32,-.2,0],[.14,.14,.14],m),
      bx('sphere',K,[-.1,.04,.22],[.12,.15,.06],m),bx('sphere',K,[.1,.04,.22],[.12,.15,.06],m),bx('sphere','#ff2a2a',[.1,.04,.26],[.035,.035,.03],{glow:3}),bx('box','#2a1a12',[-.12,.1,.25],[.015,.22,.01],{...m,rot:[0,0,20]}),
      bx('sphere','#d98a8a',[-.18,-.06,.21],[.09,.05,.02],m),bx('sphere','#d98a8a',[.18,-.06,.21],[.09,.05,.02],m),bx('box','#5a0d0d',[0,-.14,.24],[.14,.03,.04],m),...[-.05,0,.05].map(x=>bx('box','#2a1a12',[x,-.14,.26],[.01,.06,.01],m))])];
},
spider:o=>{
  const c=cl(o.color,'#15110f'),e=cl(o.color2,'#ff2a2a'),k=num(o.speed,1,0,10),m={metal:.2,rough:.55},L=[];
  [-1,1].forEach(s=>[0,1,2,3].forEach(i=>{const yaw=s>0?(i-1.5)*-22:180+(i-1.5)*22;
    L.push(pv([s*.4,.85,(i-1.5)*.3],[0,yaw,0],(i+(s>0?1:0))%2?'sway':'none',k*2.5,[bx('cylinder',c,[.29,.24,0],[.08,.75,.08],{...m,rot:[0,0,-50]}),bx('sphere',c,[.57,.48,0],[.13,.13,.13],m),bx('cylinder',c,[.86,-.18,0],[.055,1.45,.055],{...m,rot:[0,0,204]})]))}));
  return[bx('sphere',c,[0,.95,-.55],[1.2,1,1.5],{...m,nz:.05}),bx('sphere',e,[0,1.42,-.45],[.28,.06,.5],{glow:.7}),bx('sphere',c,[0,.9,.5],[.8,.6,.75],{...m,nz:.05}),
    bx('cone','#e8e0cc',[-.14,.62,.9],[.08,.3,.08],{rot:[180,0,0]}),bx('cone','#e8e0cc',[.14,.62,.9],[.08,.3,.08],{rot:[180,0,0]}),
    bx('sphere',e,[-.16,.98,.85],[.12,.12,.08],{glow:3}),bx('sphere',e,[.16,.98,.85],[.12,.12,.08],{glow:3}),bx('sphere',e,[-.06,1.1,.83],[.08,.08,.06],{glow:3}),bx('sphere',e,[.06,1.1,.83],[.08,.08,.06],{glow:3}),bx('sphere',e,[-.3,1,.78],[.07,.07,.05],{glow:3}),bx('sphere',e,[.3,1,.78],[.07,.07,.05],{glow:3}),...L];
},
ghost:o=>{
  const c=cl(o.color,'#e8eef5'),e=cl(o.color2,'#0a0a12'),k=num(o.speed,1,0,10),f={anim:'float',speed:.8*k},g={...f,rough:1,glow:.7,opacity:.72},h={...f,rough:1,glow:.4,opacity:.4};
  return[cp(c,[0,1.5,0],[1.15,2,1],g),cp(c,[0,1.5,0],[1.4,2.3,1.25],h),bx('sphere',c,[0,2.15,0],[.95,1,.95],g),
    ...[0,1,2,3,4,5,6,7].map(i=>{const a=i*Math.PI/4;return bx('cone',c,[Math.cos(a)*.62,.75+(i%3)*.12,Math.sin(a)*.62],[.5,1.3+(i%3)*.5,.5],{...h,rot:[180,0,0]})}),
    bx('capsule',e,[-.2,2.2,.42],[.15,.3,.1],f),bx('capsule',e,[.2,2.2,.42],[.15,.3,.1],f),bx('sphere','#ffffff',[-.2,2.12,.46],[.04,.06,.03],{...f,glow:2}),bx('sphere','#ffffff',[.2,2.12,.46],[.04,.06,.03],{...f,glow:2}),
    bx('capsule',e,[0,1.78,.44],[.2,.5,.1],f),
    cp(c,[-.8,1.5,.35],[.28,1.1,.28],{...g,rot:[-35,0,-20]}),cp(c,[.8,1.5,.35],[.28,1.1,.28],{...g,rot:[-35,0,20]}),
    ...[-1,1].flatMap(s=>[-.08,0,.08].map(x=>bx('cone',c,[s*(.95+x),1.0,.75],[.05,.35,.05],{...h,rot:[-120,0,0]})))];
}
});
LIB.door=o=>{
  const c=cl(o.color,'#4a2f1d'),f=cl(o.color2,'#2b1d12'),m={metal:0,rough:.85};
  return[bx('box',f,[-.7,1.3,0],[.16,2.6,.3],m),bx('box',f,[.7,1.3,0],[.16,2.6,.3],m),bx('box',f,[0,2.62,0],[1.56,.16,.3],m),
    pv([-.62,0,0],[0,0,0],'door',1,[bx('box',c,[.62,1.15,0],[1.24,2.3,.07],m),bx('box',f,[.62,1.6,.045],[.9,.8,.02],m),bx('box',f,[.62,.7,.045],[.9,.8,.02],m),bx('sphere','#c9a54a',[1.05,1.1,.07],[.1,.1,.1],{metal:.9,rough:.25})])];
};
const LS={bat:3,clown:1.3,doll:2.2,spider:2.2,skeleton:1.3,scarecrow:.8,slender:.65,zombie:1.3,tentacle:.8,pentagram:1.2,coffin:1.3,pumpkin:2.5,candle:3.5,robot:1.05,person:1.55,dog:2.8,bird:3.2,tree:.85,pine:.8,flower:3.6,rock:2.4,cloud:2,mountain:.65,house:.85,car:1.3,boat:1,rocket:.85,lamp:.95,ghost:1.4,monster:.8,grave:2.4,deadtree:.9,mansion:.5,puddle:2,trail:.8,bed:.9};
LIB.viscera=o=>{
  const c=cl(o.color,'#8a0f22'),c2=cl(o.color2,'#d81b60'),g={metal:.15,rough:.2,glow:.25,nz:.06};
  return[
    bx('gut',c,[0,.2,0],[2.2,2.2,2.2],g),
    bx('gut',c2,[.25,.14,.15],[2,2,2],{...g,rot:[0,70,0]}),
    bx('gut',c,[-.3,.1,-.2],[1.8,1.8,1.8],{...g,rot:[0,-40,8]}),
    bx('sphere',c,[0,.2,0],[.9,.5,.8],{...g,nz:.2}),
    bx('sphere','#3a0710',[-.05,.32,.25],[.25,.2,.25],{metal:0,rough:.15})];
};
LIB.hanged=o=>{
  const c=cl(o.color,'#3a2a2a'),sk='#8a7a6a',M=M0;
  return[
    bx('box','#2a1d12',[0,3.2,0],[2.2,.15,.15],M),
    bx('cylinder','#5a4a2a',[0,2.6,0],[.04,1.2,.04],M),
    bx('box',c,[0,1.5,0],[.5,.9,.25],M),
    bx('sphere',sk,[0,2.2,.02],[.36,.4,.36],{...M,rot:[0,0,0]}),
    bx('box',c,[.32,1.7,0],[.12,.8,.12],{...M,rot:[0,0,-12]}),
    bx('box',c,[-.32,1.7,0],[.12,.8,.12],{...M,rot:[0,0,8]}),
    bx('box',c,[.12,.6,0],[.14,.8,.14],M),
    bx('box',c,[-.12,.6,0],[.14,.8,.14],M)];
};
LIB.wreck=o=>{
  const c=cl(o.color,'#5a1b1b'),g={metal:.6,rough:.4},gl={color:'#1a2a3a',metal:.2,rough:.1,opacity:.6},tr={metal:0,rough:.9};
  return[
    bx('carbody',c,[0,.1,0],[.8,1.3,2.6],g),
    bx('box','#1a2a3a',[0,.85,.35],[1.2,.45,.05],{...gl,rot:[-25,0,0]}),
    bx('cylinder','#111',[.85,.3,1.1],[.6,.15,.6],{...tr,rot:[0,0,90]}),
    bx('cylinder','#111',[-.85,.3,1.1],[.6,.15,.6],{...tr,rot:[0,0,90]}),
    bx('cylinder','#111',[.85,.3,-1.1],[.6,.15,.6],{...tr,rot:[0,0,90],}),
    bx('cylinder','#111',[-.85,.2,-1.1],[.6,.15,.6],{...tr,rot:[0,0,70]}),
    bx('sphere','#3a0a0a',[0,.04,0],[2,.06,3.4],{metal:0,rough:.2,glow:.3}),
    bx('sphere','#8a0a18',[.4,.03,1.8],[.9,.05,.8],{metal:0,rough:.2,glow:.35})];
};
LIB.field=o=>{
  const c=cl(o.color,'#8a7a2a'),out=[bx('box','#4a3c1a',[0,0,-1],[8,.05,10],{metal:0,rough:1})];
  for(let r=0;r<5;r++)for(let k=0;k<6;k++)out.push(bx('cylinder',c,[-2.5+k*1,.9,-4+r*2],[.08,1.8,.08],{metal:0,rough:.9}));
  return out;
};
LIB.barn=o=>{
  const w=cl(o.color,'#6b1d1d'),r=cl(o.color2,'#3a1010'),M=M0;
  return[
    bx('box',w,[0,1.6,0],[4,3,3],M),
    bx('box',r,[0,3.25,0],[4.3,.35,3.3],M),
    bx('box','#1a0a0a',[0,.9,1.52],[1,1.8,.05],M),
    bx('box',r,[-2.05,1.6,0],[.1,3,3],M),
    bx('box',r,[2.05,1.6,0],[.1,3,3],M),
    bx('sphere','#8a0a18',[0,.04,2.6],[3,.05,1.4],{metal:0,rough:.2,glow:.3})];
};
LIB.limb=o=>{
  const c=cl(o.color,'#c98a6b'),b=cl(o.color2,'#7a0a18'),g={metal:.1,rough:.35,glow:.1};
  return[
    bx('limb',c,[0,.18,0],[1.1,1.1,1.1],{...g,rot:[0,0,80]}),
    bx('sphere',b,[.55,.12,0],[.28,.2,.28],{...g,rot:[0,0,0]}),
    bx('sphere','#e8c9a8',[-.55,.2,0],[.24,.24,.24],g),
    bx('sphere',b,[0,.04,0],[.9,.06,.7],{...g,glow:.25})];
};
LIB.head=o=>{
  const c=cl(o.color,'#d9b59a'),h=cl(o.color2,'#2b1a12'),g={metal:.05,rough:.5,glow:.1};
  return[
    bx('sphere',c,[0,.32,0],[.5,.5,.5],g),
    bx('sphere',h,[0,.42,-.05],[.52,.42,.52],{...g,rot:[0,0,0]}),
    bx('sphere','#8a0a18',[0,.04,0],[.9,.08,.8],{...g,glow:.25}),
    bx('sphere','#ffffff',[.13,.36,.22],[.1,.1,.1],{metal:0,rough:.2}),
    bx('sphere','#ffffff',[-.13,.36,.22],[.1,.1,.1],{metal:0,rough:.2})];
};
LIB.carcass=o=>{
  const b=cl(o.color,'#d8cbb0'),c=cl(o.color2,'#6b0f1a'),g={metal:.1,rough:.6};
  const ribs=[0,1,2,3,4].map(i=>bx('torus',b,[0,.55,-.5+i*.28],[.55,.45,.55],g));
  return[...ribs,
    bx('sphere',b,[0,.25,1.2],[.5,.4,.5],g),
    bx('sphere',c,[.1,.04,-.3],[.6,.08,.7],{...g,glow:.2}),
    bx('sphere',c,[0,.06,0],[.5,.1,.9],{...g,glow:.2})];
};

function localSpec(txt){
  let h=0;for(const c of txt)h=(h*31+c.charCodeAt(0))>>>0;
  const hue=(h%360)/360,hx=(d,a,b)=>'#'+new THREE.Color().setHSL((hue+d)%1,a,b).getHexString();
  const shape=cfg.shape==='auto'?['box','sphere','knot','ico','torus'][h%5]:cfg.shape,col=hx(.08,.7,.55),b=cfg.move==='bounce';
  if(LIB[shape]){
    const air=shape==='bird'||shape==='cloud',veh=['car','boat','rocket'].includes(shape),tint=['robot','person','dog','car','boat','rocket','house','lamp'].includes(shape);
    return{background:hx(0,.35,.12),camera:{move:cfg.move==='orbit'?'orbit':'static',distance:6.5},objects:[
      {asset:shape,color:tint?col:undefined,pos:[0,air?0:shape==='rocket'?-1:-1.6,0],scale:LS[shape],anim:b?'bounce':'turn',act:veh?'drive':'walk',speed:1.2},
      {shape:'torus',color:col,pos:[0,-1.6,0],rot:[90,0,0],scale:[5,5,.1]}]};
  }
  return{background:hx(0,.35,.12),camera:{move:cfg.move==='orbit'?'orbit':'static',distance:6.5},objects:[
    {shape,color:col,pos:[0,b?-.6:0,0],scale:shape==='box'?[2,2,2]:[2.4,2.4,2.4],anim:b?'bounce':'spin',speed:1.2,metal:.3,rough:.35},
    {shape:'torus',color:col,pos:[0,-1.6,0],rot:[90,0,0],scale:[5,5,.1]}]};
}

const storySys=()=>`Eres guionista de cine corto. Con la idea del usuario escribe una historia con sentido para una película 3D de ${cfg.dur} segundos. Responde SOLO con JSON válido:
{"title":"","logline":"la historia en una frase","cast":[{"id":"hero","name":"","asset":"robot|person|dog|bird|car|boat|rocket|ghost|monster${cfg.genre==='horror'?'|clown|doll|spider|skeleton|scarecrow|slender|zombie|tentacle':''}","want":"qué quiere conseguir","look":"colores y aspecto"}],"places":["lugares"],"beats":[{"scene":1,"what":"qué ocurre, con acciones simples y visibles","why":"causa o emoción","shot":"wide|medium|close","caption":"subtítulo corto"}]}
REGLAS: estructura en tres actos: presentación (quién y dónde), conflicto (un obstáculo o un deseo que se complica) y resolución (cómo termina, con un final claro). Cada momento nace del anterior por causa y efecto. El protagonista quiere algo concreto y actúa para lograrlo. Cada beat describe una acción que se pueda ver: ir hacia, llegar, saludar, mirar, saltar, esconderse, volver. Entre 4 y 8 beats en 1 a 3 escenas (lugares). Solo los tipos de personaje indicados. Nada de pensamientos ni acciones que no se vean.${GEN[cfg.genre]?' GÉNERO: '+(GEN[cfg.genre].s||GEN[cfg.genre].p):''}`;
async function ask(p,key,model,system,user){
  let r;
  if(p==='gemini'){
    r=await fetch('https://generativelanguage.googleapis.com/v1beta/models/'+model+':generateContent',{method:'POST',headers:{'x-goog-api-key':key,'Content-Type':'application/json'},body:JSON.stringify({systemInstruction:{parts:[{text:system}]},contents:[{role:'user',parts:[{text:user}]}],generationConfig:{responseMimeType:'application/json',maxOutputTokens:8192}})});
    if(!r.ok)throw await errText(r);
    const j=await r.json();
    return((((j.candidates||[])[0]||{}).content||{}).parts||[]).map(x=>x.text||'').join('');
  }
  const url=p==='oai'?cfg.url:P[p].url;
  if(!url)throw new Error('Indica la URL del endpoint en Configuración.');
  r=await fetch(url,{method:'POST',headers:{Authorization:'Bearer '+key,'Content-Type':'application/json'},body:JSON.stringify({model,messages:[{role:'system',content:system},{role:'user',content:user}],temperature:.7})});
  if(!r.ok)throw await errText(r);
  const j=await r.json();
  return(j.choices&&j.choices[0]&&j.choices[0].message&&j.choices[0].message.content)||'';
}
const parseJ=t=>{
  const m=t.match(/\{[\s\S]*\}/);
  if(!m)throw new Error('La IA no devolvió una escena válida. Vuelve a intentarlo o cambia de modelo.');
  try{return JSON.parse(m[0])}catch(e){throw new Error('La IA devolvió un JSON incompleto. Vuelve a intentarlo o cambia de modelo.')}
};
let last=null,story=null;
async function genScene(p,txt,key,model){
  const ed=$('#edit').checked&&last;let ut=txt;story=null;
  if(ed)ut='PELÍCULA ACTUAL (JSON):\n'+JSON.stringify(last)+'\n\nCAMBIOS PEDIDOS: '+txt+'\n\nDevuelve la película completa con esos cambios.';
  else if(cfg.story){
    say('La IA está escribiendo la historia…');
    try{story=parseJ(await ask(p,key,model,storySys(),txt));ut='HISTORIA (síguela al pie de la letra):\n'+JSON.stringify(story)+'\n\nIDEA ORIGINAL: '+txt}catch(e){story=null}
  }
  say(ed?'La IA está retocando la película…':'La IA está dirigiendo la película…');
  return parseJ(await ask(p,key,model,sys(),ut));
}

/* ---------- Construcción de escenas ---------- */
function buildScene(sc,cast,tsc){
  const td=TOD[cfg.tod],S=new THREE.Scene(),bg=td?td.bg:hex(sc.background||'#101524'),items=[],ids={};let n=0;
  S.background=new THREE.Color(bg);
  if(sc.fog&&typeof sc.fog==='object')S.fog=new THREE.Fog(td?bg:hex(sc.fog.color||bg),num(sc.fog.near,5,0,200),num(sc.fog.far,30,1,400));
  const mk=(o,depth,par)=>{
    o=o&&typeof o==='object'?o:{};
    if(o.asset==='sas'&&!MDL.sas)o={...o,asset:'person'};
    if(typeof o.cast==='string'&&cast&&typeof cast[o.cast]==='object'&&cast[o.cast])o={...cast[o.cast],id:o.cast,...o};
    if(typeof o.asset==='string'&&BH[o.asset]&&BW())o={...o,speed:num(o.speed,1,0,10)*1.6};
    if(typeof o.asset==='string'&&Object.prototype.hasOwnProperty.call(LIB,o.asset))o={...o,shape:undefined,children:LIB[o.asset](o)};
    const hold={mov:o.moves?0:1,act:''};
    let m;
    if(typeof o.asset==='string'&&MDL[o.asset]){m=mdlClone(o)}
    else if(depth<4&&Array.isArray(o.children)&&o.children.length){
      m=new THREE.Group();
      o.children.slice(0,40).forEach(c=>{const k=mk(c,depth+1,hold);if(k)m.add(k)});
    }else{
      if(n>=600)return null;
      const sh=SH[o.shape]?o.shape:'box',op=num(o.opacity,1,0,1),c=hex(o.color),g=num(o.glow,0,0,5);
      const P0={color:c,metalness:num(o.metal,.3,0,1),roughness:num(o.rough,.4,0,1),side:THREE.DoubleSide,flatShading:FLAT.includes(sh)};
      const mat=WET(c)?new THREE.MeshPhysicalMaterial({...P0,clearcoat:.7,clearcoatRoughness:.08}):new THREE.MeshStandardMaterial(P0);
      if(g){mat.emissive=new THREE.Color(c);mat.emissiveIntensity=g}
      if(op<1){mat.transparent=true;mat.opacity=op}
      m=new THREE.Mesh(SH[sh](),mat);
      const nz=num(o.nz,0,0,1);if(nz){const G=m.geometry,PP=G.attributes.position;for(let i=0;i<PP.count;i++){const X=PP.getX(i),Y=PP.getY(i),Z=PP.getZ(i),d=1+nz*(Math.sin(X*13+Y*7)+Math.sin(Y*11-Z*9)+Math.sin(Z*15+X*5))/3;PP.setXYZ(i,X*d,Y*d,Z*d)}G.computeVertexNormals()}
      m.castShadow=op===1&&sh!=='plane';m.receiveShadow=true;
      n++;
    }
    const p=vec(o.pos,[0,0,0]),s=vec(typeof o.scale==='number'?[o.scale,o.scale,o.scale]:o.scale,[1,1,1],100),r=vec(o.rot,[0,0,0],720).map(x=>x*Math.PI/180);
    const wp=Array.isArray(o.path)?o.path:(o.to?[o.to]:null);
    const path=wp&&wp.length?[p].concat(wp.slice(0,12).map(q=>vec(q,p))):null;
    const it={all:items,m,p,s,r,path,face:!!o.face,a:o.anim,k:num(o.speed,1,0,10),hold,par,ids,kind:o.asset,ph:p[0]*1.7+p[2]*2.3+depth};
    if(Array.isArray(o.moves)&&o.moves.length)it.mv=o.moves.slice(0,16).map(q=>{q=q&&typeof q==='object'?q:{};return{t:num(q.t,0,0,600)*tsc,to:vec(q.to,p),act:String(q.act||''),face:q.face}}).sort((a,b)=>a.t-b.t);
    if(m.userData.clip){it.mix=new THREE.AnimationMixer(m);it.mix.clipAction(m.userData.clip).play()}
    items.push(it);if(typeof o.id==='string')ids[o.id]=it;
    return m;
  };
  (sc.objects||[]).slice(0,120).forEach(o=>{const k=mk(o,0);if(k)S.add(k)});

  S.add(new THREE.AmbientLight(0xffffff,Math.max(.2,num(td?td.amb:sc.ambient,.5,0,3))));
  const sn=td?{color:td.sun,intensity:td.i,pos:td.pos}:sc.sun&&typeof sc.sun==='object'?sc.sun:{},sp=vec(sn.pos,[4,6,5]);
  const sun=new THREE.DirectionalLight(hex(sn.color||'#ffffff'),num(sn.intensity,1,0,4));
  sun.position.set(sp[0],sp[1],sp[2]);
  sun.castShadow=true;
  sun.shadow.mapSize.set(2048,2048);
  Object.assign(sun.shadow.camera,{left:-32,right:32,top:32,bottom:-32,near:.5,far:160});
  sun.shadow.camera.updateProjectionMatrix();
  sun.shadow.bias=-.0005;sun.shadow.normalBias=.03;
  S.add(sun);
  (Array.isArray(sc.lights)?sc.lights:[]).slice(0,4).forEach(l=>{
    l=l&&typeof l==='object'?l:{};
    const c=hex(l.color||'#ffffff'),i=num(l.intensity,1,0,5),q=vec(l.pos,[0,4,0]);let L;
    if(l.type==='spot'){
      L=new THREE.SpotLight(c,i,60,Math.PI/5,.4);
      const t=vec(l.look,[0,0,0]);L.target.position.set(t[0],t[1],t[2]);S.add(L.target);
    }else L=new THREE.PointLight(c,i,30);
    L.position.set(q[0],q[1],q[2]);S.add(L);
  });
  return{S,items,ids,fx:weather(S,cfg.fx==='auto'?sc.weather:cfg.fx)};
}

/* ---------- Animación de objetos y cámara ---------- */
const WET=c=>{const h=/^#[0-9a-f]{3}$/i.test(c)?c.replace(/(.)/g,'$1$1').slice(1):c.slice(1);if(h.length!==6)return false;const r=parseInt(h.slice(0,2),16),g=parseInt(h.slice(2,4),16),b=parseInt(h.slice(4,6),16);return r>90&&r>g*2.2&&r>b*2.2};
const BH={clown:1,zombie:1,skeleton:1,slender:1,monster:1,doll:1,spider:1,scarecrow:1,ghost:1,tentacle:1};
const INS={viscera:1,carcass:1,hanged:1,candle:1,pumpkin:1,grave:1,lamp:1},INSR=1.8,INSD=1.6,INSCD=4;
const LITE={lamp:3.2,candle:2.2,pumpkin:2.6},LFEAR={monster:1,zombie:.6,spider:1.4,slender:1,doll:.7,clown:.5,skeleton:.4};
const CAMV=new THREE.Vector3(),CAMF=new THREE.Vector3(),BW=()=>cfg.beast==='both'||cfg.beast==='wild',BS=()=>cfg.beast==='both'||cfg.beast==='smart';
const BTXT=()=>cfg.beast==='off'||!lifeDark()?'':(BS()?'\n- CRIATURAS INTELIGENTES: piensan. Acechan sin prisa, rodean al héroe, esperan a que quede solo, se esconden tras el decorado y aparecen por su espalda. Usa "moves" con rodeos y pausas y "face":"hero"; nunca avanzan en línea recta hacia la cámara. Cuando la cámara las enfoca se congelan y se esconden tras casas, árboles o tumbas; se mantienen al borde del halo de lámparas, velas y calabazas, y no cruzan la luz. ACTUACIÓN por tipo: slender avanza solo cuando nadie lo mira; clown se acerca a saltos cortos y pausas burlonas; zombie llega lento y en grupo desde varios lados; monster acecha, rodea a media distancia y embiste de golpe; spider salta a sacudidas desde techo y esquinas; doll cambia de sitio entre planos sin verse caminar; skeleton patrulla un trayecto fijo; ghost atraviesa obstáculos.':'')+(BW()?'\n- CRIATURAS SALVAJES: se lanzan de golpe (3 unidades/s), cambian de dirección sin aviso, irrumpen en el cuadro y no paran hasta alcanzar a su presa. Encadena persecuciones y embestidas.':'');
const sfxN=(ac,d)=>{const n=ac.createBuffer(1,Math.ceil(ac.sampleRate*d),ac.sampleRate),a=n.getChannelData(0);for(let i=0;i<a.length;i++)a[i]=Math.random()*2-1;return n};
const VO={monster:['sawtooth',70,50,.9,.5,22],zombie:['sawtooth',110,80,.8,.8,14],clown:['square',520,380,.5,.1,9],skeleton:['square',300,260,.4,.9,40],slender:['sawtooth',60,60,.8,1,60],spider:['sawtooth',2000,1200,.5,1,40],doll:['sine',900,1100,.5,0,6],ghost:['sine',650,1500,1,.15,7],scarecrow:['sawtooth',130,90,.7,.6,16],tentacle:['sawtooth',90,60,.6,.9,30]};
function sfxVoice(ac,out,vol,k){
  const V=VO[k];if(!V)return;
  const s=ac.currentTime,d=V[3],g=ac.createGain(),f=ac.createBiquadFilter(),o=ac.createOscillator(),l=ac.createOscillator(),lg=ac.createGain();
  o.type=V[0];o.frequency.setValueAtTime(V[1],s);o.frequency.exponentialRampToValueAtTime(V[2],s+d);
  l.frequency.value=V[5];lg.gain.value=V[1]*.08;l.connect(lg);lg.connect(o.frequency);
  f.type='lowpass';f.frequency.value=Math.min(9000,V[1]*6);
  g.gain.setValueAtTime(0,s);g.gain.linearRampToValueAtTime(vol,s+.08);g.gain.exponentialRampToValueAtTime(.0001,s+d);
  o.connect(f);f.connect(g);g.connect(out);o.start(s);o.stop(s+d+.05);l.start(s);l.stop(s+d+.05);
  if(V[4]>0){const b=ac.createBufferSource(),q=ac.createBiquadFilter(),h=ac.createGain();b.buffer=sfxN(ac,d);q.type='bandpass';q.frequency.value=Math.min(6000,V[1]*2.5);h.gain.setValueAtTime(vol*V[4]*.5,s);h.gain.exponentialRampToValueAtTime(.0001,s+d);b.connect(q);q.connect(h);h.connect(out);b.start(s)}
}
function sfxSwing(ac,out,vol){
  const s=ac.currentTime,b=ac.createBufferSource(),f=ac.createBiquadFilter(),g=ac.createGain();
  b.buffer=sfxN(ac,.35);f.type='bandpass';f.Q.value=1.2;f.frequency.setValueAtTime(300,s);f.frequency.exponentialRampToValueAtTime(2200,s+.3);
  g.gain.setValueAtTime(0,s);g.gain.linearRampToValueAtTime(vol,s+.12);g.gain.exponentialRampToValueAtTime(.0001,s+.33);
  b.connect(f);f.connect(g);g.connect(out);b.start(s);
}
function sfxHit(ac,out,vol){
  const s=ac.currentTime,o=ac.createOscillator(),g=ac.createGain(),b=ac.createBufferSource(),f=ac.createBiquadFilter(),h=ac.createGain();
  o.type='sine';o.frequency.setValueAtTime(130,s);o.frequency.exponentialRampToValueAtTime(38,s+.25);
  g.gain.setValueAtTime(vol,s);g.gain.exponentialRampToValueAtTime(.0001,s+.3);o.connect(g);g.connect(out);o.start(s);o.stop(s+.32);
  b.buffer=sfxN(ac,.2);f.type='lowpass';f.frequency.value=900;h.gain.setValueAtTime(vol*.9,s);h.gain.exponentialRampToValueAtTime(.0001,s+.18);
  b.connect(f);f.connect(h);h.connect(out);b.start(s);
}
const sfx=(fn,x,z,v,k)=>{try{const ac=LV.ac;if(!ac||ac.state==='closed'||!LV.dst)return;fn(ac,LV.dst,Math.max(.12,1-Math.hypot(x-CAMV.x,z-CAMV.z)/26)*v,k)}catch(e){}};
let HITS=0;
const ATK={monster:[3.2,1.2,0,.12],zombie:[2.1,.9,0,0],skeleton:[2.2,.8,0,0],clown:[2.3,1.1,.2,.05],slender:[3.4,.7,0,0],spider:[2.4,2.2,1.1,0],doll:[1.8,1.5,.5,0],ghost:[3.2,2.6,0,.45],scarecrow:[2.2,.6,0,0],tentacle:[4,0,0,.08]};
const ATXT='\n- COMBATE: las criaturas atacan solas cuando están cerca de un personaje (cada ataque dura 1,3 s: se agazapan, se lanzan y golpean). El personaje a veces esquiva y a veces cae hacia atrás. Acerca criatura y héroe para provocar el enfrentamiento, cámara en close o medium y deja 2 a 3 s de margen; no describas el golpe en los "moves".';
const OBR={tree:.6,pine:.5,deadtree:.5,rock:1.1,house:2.4,mansion:3,grave:.8,coffin:1.2,bed:1.6,lamp:.3,car:1.8,mountain:3,pumpkin:.5},WKR={person:1,robot:1,dog:1,clown:1,zombie:1,skeleton:1,slender:1,monster:1,spider:1},HER={person:1,robot:1,dog:1},AWL={puddle:1,trail:1,pentagram:1,coffin:1};
const ENVTXT='\n- ENTORNO VIVO: los personajes esquivan y rodean solos los obstáculos (árboles, rocas, casas, tumbas, camas), así que puedes trazar caminos directos. Si una criatura o algo siniestro (charco de sangre, pentagrama, ataúd) aparece cerca del héroe, este se frena, lo mira y retrocede: aprovecha esas reacciones como momentos de tensión. Las puertas (asset door) se abren solas cuando alguien se acerca: úsalas en casas y pasillos. El protagonista (id hero) se detiene, se inclina y mira los restos (viscera, carcass, hanged), velas (candle), calabazas, tumbas y lámparas que tiene cerca antes de seguir, así que colócalos en su camino. Filma como un rodaje real: primero un plano de establecimiento amplio del escenario, luego detalles, reacciones y raccord de mirada entre el personaje y lo que descubre.';
const LIFE={robot:'b',person:'b',dog:'b',bird:'b',clown:'h',zombie:'h',skeleton:'h',slender:'h',monster:'h',doll:'h',spider:'h',tree:'p',pine:'p',deadtree:'p',scarecrow:'p',flower:'f',ghost:'g'};
const lifeDark=()=>cfg.genre==='horror'||cfg.look==='horror'||cfg.tod==='night'||cfg.scare!=='off'||cfg.stalk!=='off';
// Temblor suave (suma de senos con frecuencias no múltiplas, ~0.2 a 2 Hz): no parece vibración mecánica.
function hn(t,s){return Math.sin(t*1.3+s)*.5+Math.sin(t*2.9+s*1.7)*.3+Math.sin(t*6.1+s*2.3)*.15+Math.sin(t*13.7+s*.7)*.05}
// Ciclo de marcha: fase u en ciclos. 60% apoyo (el pie se desliza hacia atrás a velocidad constante, sin patinar), 40% balanceo suave.
function gait(u,amp){const f=((u%1)+1)%1,sf=.6;if(f<sf)return amp*(1-2*f/sf);return -amp*Math.cos(Math.PI*(f-sf)/(1-sf))}
// Aleteo: fase u en ciclos. Bajada rápida (40%) y subida lenta (60%), como un ave real; velocidad cero en los extremos.
function flapW(u,amp){const f=((u%1)+1)%1,d=.4;if(f<d)return amp*Math.cos(Math.PI*f/d);return -amp*Math.cos(Math.PI*(f-d)/(1-d))}
// Altura del centro de masa al caminar: máxima a mitad del apoyo, mínima en el cambio de pie (dos picos por ciclo).
function comBob(u,H){return H*(1+Math.cos(4*Math.PI*(u-.3)))/2}
// Salto balístico: arco parabólico (gravidad implícita g = 8H/T²), luego contacto con el suelo.
// Devuelve la altura, el aplastamiento al aterrizar (land) y el estiramiento al despegar (stretch).
function hop(tt,T,H,D){
  const P=T+D,c=((tt%P)+P)%P;
  if(c<T){const s=c/T;return{y:4*H*s*(1-s),land:0,stretch:s<.18?1-s/.18:0}}
  const u=Math.min((c-T)/Math.max(D,1e-3),1);
  return{y:0,land:Math.sin(Math.PI*u),stretch:0}
}
function pose(it,tb,sd){
  const m=it.m,k=it.k,P=it.par,gm=P?P.mov:1;
  let x=it.p[0],y=it.p[1],z=it.p[2],rx=it.r[0],ry=it.r[1],rz=it.r[2],sx=it.s[0],sy=it.s[1],sz=it.s[2];
  if(!P&&cfg.env&&it.ids.hero===it&&it.all){
    const raw=tb,dI=Math.min(Math.max(raw-(it.lI==null?raw:it.lI),0),.1);it.lI=raw;
    if(it.insT!=null){
      it.insE=(it.insE||0)+dI;it.lag=(it.lag||0)+dI;it.insA=Math.sin(Math.PI*Math.min(1,it.insE/INSD));
      if(it.insE>=INSD){it.insT=null;it.insA=0;it.cdI=INSCD}
    }else{
      it.cdI=Math.max(0,(it.cdI||0)-dI);
      if(it.cdI<=0&&it.lx!=null){
        if(!it.pI)it.pI=it.all.filter(q=>INS[q.kind]&&!q.par).map(q=>({x:q.p[0],z:q.p[2],m:q}));
        let best=null,bd=INSR;it.pI.forEach(o=>{if(o.m.insD)return;const dd=Math.hypot(o.x-it.lx,o.z-it.lz);if(dd<bd){bd=dd;best=o}});
        if(best){best.m.insD=1;it.insT=raw;it.insE=0;it.insQ=[best.x,best.z];it.insA=0}
      }
    }
    tb=raw-(it.lag||0);
  }
  if(it.mv){
    const M=it.mv;let i=0;while(i<M.length-1&&tb>M[i].t)i++;
    const g=M[i],pa=i?M[i-1].to:it.p,ta=i?M[i-1].t:0,u=Math.min(Math.max((tb-ta)/Math.max(g.t-ta,.01),0),1);
    x=pa[0]+(g.to[0]-pa[0])*u;y=pa[1]+(g.to[1]-pa[1])*u;z=pa[2]+(g.to[2]-pa[2])*u;
    const dx=g.to[0]-pa[0],dz=g.to[2]-pa[2],go=tb<g.t&&Math.hypot(dx,dz)>.05,H=it.hold;
    H.mov+=((go?1:0)-H.mov)*.25;H.act=go?'':g.act;
    let ty=null;
    if(go)ty=Math.atan2(dx,dz);else if(g.face&&it.ids[g.face]){const q=it.ids[g.face].m.position;ty=Math.atan2(q.x-x,q.z-z)}
    if(ty!==null)it.cy=it.cy==null?ty:it.cy+Math.atan2(Math.sin(ty-it.cy),Math.cos(ty-it.cy))*.2;
    if(it.cy!=null)ry=it.cy+it.r[1];
    y+=comBob(6*k*tb/(2*Math.PI),.1)*H.mov;
    if(!go&&g.act==='jump')y+=hop(tb,.5,.9,.13).y;
  }else if(it.path){
    const Q=it.path,n=Q.length-1;let u=Math.min(tb/sd,1);if(n===1)u=sm(u);
    const f=u*n,i=Math.min(Math.floor(f),n-1),w=f-i,a=Q[i],b=Q[i+1];
    x=a[0]+(b[0]-a[0])*w;y=a[1]+(b[1]-a[1])*w;z=a[2]+(b[2]-a[2])*w;
    if(it.face&&(b[0]!==a[0]||b[2]!==a[2]))ry=Math.atan2(b[0]-a[0],b[2]-a[2])+it.r[1];
  }
  if(it.insA>0){const q=it.insQ,ty=Math.atan2(q[0]-x,q[1]-z);ry+=Math.atan2(Math.sin(ty-ry),Math.cos(ty-ry))*Math.min(1,it.insA*2);rx-=.45*it.insA;sy*=1-.08*it.insA}
  switch(it.a){
    case'spin':ry+=tb*k;rx+=tb*.5*k;break;
    case'bounce':{const kk=Math.max(k,.05),h=hop(tb,.8/kk,1.5,.25/kk),q=h.land,st=h.stretch;
      y+=h.y;sy*=1-.2*q+.1*st;sx*=1+.1*q-.05*st;sz*=1+.1*q-.05*st;break}
    case'float':y+=Math.sin(tb*2*k)*.5;break;
    case'orbit':{const rad=Math.hypot(x,z),a=Math.atan2(z,x)+tb*k;x=Math.cos(a)*rad;z=Math.sin(a)*rad;break}
    case'walk':{const u=6*k*tb/(2*Math.PI);y+=comBob(u,.12);rz+=Math.sin(2*Math.PI*u)*.08;break}
    case'sway':{const x=2*k/3,R=1/Math.hypot(1-x*x,.6*x),R0=1/Math.hypot(.75,.3);
      rz+=.35*(R/R0)*Math.sin(2*k*tb-Math.atan2(.6*x,1-x*x));break}
    case'pulse':{const f=1+Math.sin(tb*4*k)*.12;sx*=f;sy*=f;sz*=f;break}
    case'armA':case'armB':case'armA0':case'armB0':{const sg=it.a[3]==='A'?1:-1,gw=it.a.length>4?0:gm,ak=P&&P.ak?Math.abs(P.atk||0):0,tg=P&&P.atk<0?-P.atk*2.6:-((P&&P.atk)||0)*1.3;rx+=Math.sin(tb*6*k)*.6*sg*gw*(1+((P&&P.run)||0)*.7)*(1-ak)+tg*ak;rz+=Math.sin(tb*2*k)*.35*(1-gw)*(1-ak);break}
    case'door':ry-=((P&&P.open)||0)*1.7;break;
    case'turn':ry+=tb*k;break;
    case'swing':rx+=gait(6*k*tb/(2*Math.PI),.6*gm*(1+((P&&P.run)||0)*.7));break;
    case'swing2':rx+=gait(6*k*tb/(2*Math.PI)+.5,.6*gm*(1+((P&&P.run)||0)*.7));break;
    case'flap':rz+=flapW(10*k*tb/(2*Math.PI),.7);break;
    case'flap2':rz+=flapW(10*k*tb/(2*Math.PI)+.5,.7);break;
    case'wag':ry+=Math.sin(tb*8*k)*.5;break;
    case'roll':it.ra=(it.ra||0)+.083*k*gm;rx+=it.ra;break;
    case'larm':if(P&&P.act==='wave'){rz=-2.6+Math.sin(tb*8)*.35;rx=0}else rx+=Math.sin(tb*6*k)*.6*gm;break;
  }
  if(cfg.life!=='off'&&it.kind&&!P&&LIFE[it.kind]){
    const A=cfg.life==='strong'?2:1,q=tb+it.ph,L=LIFE[it.kind],idle=!it.mv&&!it.path;
    if(L==='p'){rz+=Math.sin(q*.9)*.03*A;rx+=Math.sin(q*.7+1)*.015*A}
    else if(L==='f'){rz+=Math.sin(q*1.4)*.08*A;rx+=Math.sin(q*1.1)*.04*A}
    else if(L==='g'){ry+=Math.sin(q*.5)*.5*A;rz+=Math.sin(q*.8)*.05*A}
    else{const b=1+Math.sin(q*(L==='h'?3:2.2))*.012*A;sy*=b;sx/=Math.sqrt(b);sz/=Math.sqrt(b);rz+=Math.sin(q*.9)*.012*A;
      if(idle)ry+=Math.sin(q*.45)*.3*A;
      if(L==='h'){const tw=Math.max(0,Math.sin(q*3.1)*Math.sin(q*.73)-.85)*6;rz+=tw*.12*A;rx+=tw*.06*A}}
  }
  if(cfg.env&&!P&&(it.kind==='door'||it.mv||it.path)){
    const dt=Math.min(Math.max(tb-(it.le==null?tb:it.le),0),.1);it.le=tb;
    if(it.kind==='door'){
      const o=it.hold.open||0,tg=it.all.some(q=>!q.par&&(WKR[q.kind]||q.kind==='ghost')&&Math.hypot(q.m.position.x-x,q.m.position.z-z)<2.4)?1:0;
      it.hold.open=o+(tg-o)*Math.min(1,dt*3);
    }else if(WKR[it.kind]||it.ids.hero===it){
      let al=0;
      if(HER[it.kind]||it.ids.hero===it){
        if(!it.th)it.th=it.all.filter(q=>!q.par&&q!==it&&(BH[q.kind]||AWL[q.kind]));
        let a=0,tx=0,tz=0;
        it.th.forEach(q=>{const p=q.m.position,d=Math.hypot(p.x-x,p.z-z),cr=BH[q.kind],v=Math.max(0,1-d/(cr?8:3.2))*(cr?1:.35);if(v>a){a=v;tx=p.x;tz=p.z}});
        it.al=(it.al||0)+(a-(it.al||0))*Math.min(1,dt*6);al=it.al;
        if(al>.02){
          const ty=Math.atan2(tx-x,tz-z),d=Math.hypot(tx-x,tz-z)||1;
          ry+=Math.atan2(Math.sin(ty-ry),Math.cos(ty-ry))*Math.min(1,al*1.5);
          x-=(tx-x)/d*al*1.1;z-=(tz-z)/d*al*1.1;sy*=1-.07*al;rz+=Math.sin(tb*38)*.04*al;rx-=al*.12;it.hold.mov*=1-.85*al;
        }
      }
      if(!it.ob)it.ob=it.all.filter(q=>OBR[q.kind]&&!q.par&&!q.mv&&!q.path).map(q=>[q.p[0],q.p[2],OBR[q.kind]*Math.max(q.s[0],q.s[2])]);
      const x0=x,z0=z;
      it.ob.forEach(b=>{const ex=x-b[0]||.01,ez=z-b[1],d=Math.hypot(ex,ez)||.01,R=b[2]+.55;if(d<R){const f=(R-d)*(.6+.4*(R-d)/R);x+=ex/d*f;z+=ez/d*f}});
      if(it.lx!=null){
        const vx=x-it.lx,vz=z-it.lz;
        if(Math.hypot(vx,vz)>.004){const ty=Math.atan2(vx,vz);it.hy=it.hy==null?ty:it.hy+Math.atan2(Math.sin(ty-it.hy),Math.cos(ty-it.hy))*Math.min(1,dt*8)}
        if(it.hy!=null&&al<.3&&Math.hypot(x-x0,z-z0)>.03)ry=it.hy+it.r[1];
      }
      it.lx=x;it.lz=z;
    }
  }
  if(!P&&(it.ht!=null||it.dgt!=null)){
    const dv=Math.min(Math.max(tb-(it.lv==null?tb:it.lv),0),.1);it.lv=tb;
    if(it.ht!=null){it.ht+=dv/.9;const p=Math.min(1,it.ht),q=Math.sin(Math.PI*p);x+=it.hdx*1.5*q;z+=it.hdz*1.5*q;rx-=.55*q;rz+=Math.sin(tb*40)*.05*q;sy*=1-.08*q;if(it.ht>=1)it.ht=null}
    if(it.dgt!=null){it.dgt+=dv;const u=Math.min(1,Math.max(0,(it.dgt-.25)/.9)),q=Math.sin(Math.PI*u);x+=it.dsx*1.3*q;z+=it.dsz*1.3*q;rz+=it.dsg*.5*q;y+=.25*q;sy*=1-.1*q;if(it.dgt>1.4)it.dgt=null}
  }
  if(cfg.atk&&!P&&ATK[it.kind]){
    const A=ATK[it.kind],H=it.hold,dt=Math.min(Math.max(tb-(it.la==null?tb:it.la),0),.1);it.la=tb;
    if(!it.vt)it.vt=it.all.filter(q=>!q.par&&q!==it&&(HER[q.kind]||q.ids.hero===q));
    let v=null,vd=99;it.vt.forEach(q=>{const d=Math.hypot(q.m.position.x-x,q.m.position.z-z);if(d<vd){vd=d;v=q}});
    if(v&&vd<.01)vd=.01;
    if(it.cd==null){it.cd=.8+(((it.ph%1)+1)%1)*2.5;it.at=-1;it.n=0}
    let a=0;
    if(it.at<0){it.cd-=dt;if(v&&vd<A[0]&&it.cd<=0){it.at=0;it.hit=0;it.sw=0;it.n++;sfx(sfxVoice,x,z,.55,it.kind);it.dg=Math.sin(it.ph*91+it.n*37)>.1;
      if(it.dg){const sg=Math.sin(it.ph*17+it.n)>0?1:-1,dx=(v.m.position.x-x)/vd,dz=(v.m.position.z-z)/vd;v.dgt=0;v.dsx=-dz*sg;v.dsz=dx*sg;v.dsg=sg}}}
    if(it.at>=0){
      it.at+=dt;const t=it.at;
      a=t<.45?-Math.sin(t/.45*Math.PI/2):t<.7?-1+(t-.45)/.25*2:t<1.3?1-(t-.7)/.6:0;
      if(!it.sw&&t>=.45){it.sw=1;sfx(sfxSwing,x,z,.4)}
      if(!it.hit&&t>=.58){it.hit=1;if(v&&!it.dg&&vd<A[0]*1.5){v.ht=0;v.hdx=(v.m.position.x-x)/vd;v.hdz=(v.m.position.z-z)/vd;HITS=1;sfx(sfxHit,v.m.position.x,v.m.position.z,.95)}}
      if(t>=1.3){it.at=-1;it.cd=2.6+Math.abs(Math.sin(it.ph*13+it.n))*2}
      if(v){const ty=Math.atan2(v.m.position.x-x,v.m.position.z-z),L=Math.min(A[1],Math.max(0,vd-1))*Math.max(0,a);
        ry+=Math.atan2(Math.sin(ty-ry),Math.cos(ty-ry))*Math.min(1,dt*12);x+=(v.m.position.x-x)/vd*L;z+=(v.m.position.z-z)/vd*L}
      const pm=A[3]*Math.max(0,-a);
      y+=A[2]*Math.sin(Math.PI*Math.min(1,Math.max(0,(t-.35)/.8)));rx+=a*.4;sy*=1+pm;sx*=1+pm*.5;sz*=1+pm*.5;
    }
    H.atk=a;H.ak=it.at>=0?1:0;H.run=(H.run||0)+(((it.at<0&&v&&vd<10&&(it.mv||it.path))?1:0)-(H.run||0))*.2;
    if(H.run>.05)rx+=.22*H.run;
  }
  if(it.kind&&!P&&BH[it.kind]&&cfg.beast!=='off'){
    const dt=Math.min(Math.max(tb-(it.lt==null?tb:it.lt),0),.1),hr=it.ids.hero&&it.ids.hero!==it?it.ids.hero.m.position:null,T=hr||CAMV,q=tb+it.ph;it.lt=tb;
    let dx=T.x-x,dz=T.z-z,d=Math.hypot(dx,dz)||1;
    if(BS()){
      if(!it.mv&&!it.path&&it.kind!=='tentacle'){
        const vx=x-CAMV.x,vz=z-CAMV.z,vl=Math.hypot(vx,vz)||1,seen=(vx*CAMF.x+vz*CAMF.z)/vl/(Math.hypot(CAMF.x,CAMF.z)||1)>.72,sp=(BW()?1.5:.9)*dt;
        const cX=x+(it.ox||0),cZ=z+(it.oz||0);
        if(!it.cov)it.cov=it.all.filter(q=>OBR[q.kind]&&!q.par&&!q.mv&&!q.path).map(q=>[q.p[0],q.p[2],OBR[q.kind]*Math.max(q.s[0],q.s[2])]);
        if(seen){
          // Vista: se esconde tras el obstáculo cercano, a espaldas de la cámara
          let bc=null,bd=7;it.cov.forEach(c=>{const e=Math.hypot(c[0]-cX,c[1]-cZ)-c[2];if(e<bd){bd=e;bc=c}});
          if(bc){const ux=bc[0]-CAMV.x,uz=bc[1]-CAMV.z,ul=Math.hypot(ux,uz)||1,R=bc[2]+.6,tx=bc[0]+ux/ul*R,tz=bc[1]+uz/ul*R,ex=tx-cX,ez=tz-cZ,ed=Math.hypot(ex,ez);
            if(ed>.05){const st=Math.min(ed,sp*1.4);it.ox=(it.ox||0)+ex/ed*st;it.oz=(it.oz||0)+ez/ed*st}}
        }else if(d>2.4){
          // Sin ser vista: avanza y rodea al héroe en círculo a media distancia
          let ax=dx/d,az=dz/d;
          if(d<6.5){const sg=it.ph%2>1?1:-1,k=(1-(d-2.4)/4.1)*.8,bx=ax,bz=az;ax=bx-bz*sg*k;az=bz+bx*sg*k;const nl=Math.hypot(ax,az)||1;ax/=nl;az/=nl}
          it.ox=(it.ox||0)+ax*sp;it.oz=(it.oz||0)+az*sp;
        }
        x+=it.ox||0;z+=it.oz||0;dx=T.x-x;dz=T.z-z;d=Math.hypot(dx,dz)||1;
      }
      if(d<18){
        const mg=it.mv||it.path,ty=Math.atan2(dx,dz);if(it.gy==null)it.gy=ry;
        it.gy+=Math.atan2(Math.sin(ty-it.gy),Math.cos(ty-it.gy))*Math.min(1,dt*(BW()?8:3.5));
        ry=mg?ry+Math.atan2(Math.sin(it.gy-ry),Math.cos(it.gy-ry))*.4:it.gy;
      }
    }
    const LF=LFEAR[it.kind]||0;
    if(LF){
      if(!it.lis)it.lis=it.all.filter(q=>LITE[q.kind]&&!q.par).map(q=>[q.p[0],q.p[2],LITE[q.kind]]);
      it.lis.forEach(l=>{const ex=x-l[0],ez=z-l[1],ed=Math.hypot(ex,ez)||.01;if(ed<l[2]){const f=(l[2]-ed)/l[2]*LF*1.6*dt;it.fx=(it.fx||0)+ex/ed*f;it.fz=(it.fz||0)+ez/ed*f}});
    }
    x+=it.fx||0;z+=it.fz||0;
    if(BW()){
      const l=Math.pow(Math.max(0,Math.sin(q*1.1+1.3)),14),cv=Math.max(0,Math.sin(q*2.3)*Math.sin(q*.61)-.55)*3,st=it.kind==='tentacle'?0:Math.min(1.4,Math.max(0,d-1.8))*l;
      x+=dx/d*st;z+=dz/d*st;rx+=l*.4;sy*=1+l*.12;y+=l*.1;
      rz+=Math.sin(q*31)*cv*.07;rx+=Math.sin(q*27+2)*cv*.05;ry+=Math.sin(q*23)*cv*.1;
    }
  }
  if(it.mix)it.mix.setTime(tb);
  m.position.set(x,y,z);m.rotation.set(rx,ry,rz);m.scale.set(sx,sy,sz);
}
const LV={k:{},st:null,t:null,m:null,x:0,z:8,yaw:Math.PI,pitch:0,ph:0,act:false,on:false,stop:false,last:0,blk:null,ac:null,dst:null};
const LVH=matchMedia('(pointer:coarse)').matches?' · izq.: moverte, der.: mirar':' · WASD, ratón, Mayús corre, Intro termina';
const liveTxt='\n- MODO EXPLORACIÓN: el espectador camina por la escena en primera persona (teclado o dedos) y la graba; no hay protagonista ni "moves". Todo debe poder recorrerse: un camino claro desde z=8 hacia z=-8, objetos repartidos a los lados, luces que guíen y la amenaza esperando al fondo o a los lados. Usa una sola escena grande; los 3 a 5 planos solo dividen el tiempo.';
function stepSnd(ac,out,run){const s=ac.currentTime,o=ac.createOscillator(),g=ac.createGain();o.frequency.setValueAtTime(100,s);o.frequency.exponentialRampToValueAtTime(42,s+.1);g.gain.setValueAtTime(run?.5:.32,s);g.gain.exponentialRampToValueAtTime(.0001,s+.16);o.connect(g);g.connect(out);o.start(s);o.stop(s+.2)}
function liveAim(cam){
  const now=performance.now(),dt=LV.last?Math.min(.1,(now-LV.last)/1000):0;LV.last=now;
  const k=LV.k,s=LV.st||{x:0,y:0};
  let f=(k.w||k.arrowup?1:0)-(k.s||k.arrowdown?1:0)-s.y,r=(k.d?1:0)-(k.a?1:0)+s.x;
  const len=Math.min(Math.hypot(f,r),1.8),sp=(k.shift?3.4:1.8)*len,n=Math.hypot(f,r)||1;f/=n;r/=n;
  LV.yaw+=((k.arrowleft?1:0)-(k.arrowright?1:0))*1.8*dt;
  const sy=Math.sin(LV.yaw),cy=Math.cos(LV.yaw),cl=v=>Math.max(-16,Math.min(16,v));
  LV.x=cl(LV.x+(sy*f-cy*r)*sp*dt);LV.z=cl(LV.z+(cy*f+sy*r)*sp*dt);
  const mv=sp>.05,run=sp>2.6;
  if(mv){const p0=LV.ph;LV.ph+=sp*dt*3.2;if(Math.floor(LV.ph/Math.PI)!==Math.floor(p0/Math.PI)&&LV.on&&LV.ac&&LV.dst)try{stepSnd(LV.ac,LV.dst,run)}catch(e){}}
  const y=1.7+(mv?Math.sin(LV.ph)*(run?.09:.05):Math.sin(now/1000*1.3)*.008),cp=Math.cos(LV.pitch);
  cam.position.set(LV.x,y,LV.z);cam.lookAt(LV.x+sy*cp*5,y+Math.sin(LV.pitch)*5,LV.z+cy*cp*5);
  if(mv)cam.rotateZ(Math.cos(LV.ph)*.012);
  const fv=LENS[cfg.lens]||72;if(cam.fov!==fv){cam.fov=fv;cam.updateProjectionMatrix()}
}
addEventListener('keydown',e=>{if(!LV.act)return;const q=e.key.toLowerCase();LV.k[q]=true;if(q==='enter'&&LV.on)LV.stop=true;if(q.startsWith('arrow')||q===' ')e.preventDefault()});
addEventListener('keyup',e=>{LV.k[e.key.toLowerCase()]=false});
const lk=(dx,dy,g)=>{LV.yaw-=dx*g;LV.pitch=Math.max(-1.2,Math.min(1.2,LV.pitch-dy*g))};
stage.addEventListener('pointerdown',e=>{
  if(!LV.act||e.target.closest('#lvstop'))return;if(LV.on&&LV.ac)LV.ac.resume();
  if(e.pointerType==='mouse'){try{stage.requestPointerLock()}catch(x){}LV.m={x:e.clientX,y:e.clientY};return}
  const R=stage.getBoundingClientRect();(LV.t||(LV.t={}))[e.pointerId]={left:e.clientX<R.left+R.width/2,x:e.clientX,y:e.clientY,ox:e.clientX,oy:e.clientY};
  try{stage.setPointerCapture(e.pointerId)}catch(x){}
});
stage.addEventListener('pointermove',e=>{
  if(!LV.act)return;
  if(e.pointerType==='mouse'){if(document.pointerLockElement===stage)lk(e.movementX,e.movementY,.0025);else if(LV.m&&e.buttons){lk(e.clientX-LV.m.x,e.clientY-LV.m.y,.004);LV.m={x:e.clientX,y:e.clientY}}return}
  const q=LV.t&&LV.t[e.pointerId];if(!q)return;
  if(q.left)LV.st={x:(e.clientX-q.ox)/70,y:(e.clientY-q.oy)/70};else{lk(e.clientX-q.x,e.clientY-q.y,.006);q.x=e.clientX;q.y=e.clientY}
});
const lup=e=>{const q=LV.t&&LV.t[e.pointerId];if(q){if(q.left)LV.st=null;delete LV.t[e.pointerId]}if(e.pointerType==='mouse')LV.m=null};
stage.addEventListener('pointerup',lup);stage.addEventListener('pointercancel',lup);
$('#lvstop').onclick=()=>{if(LV.on)LV.stop=true};
let PT=0,PD=30;
const HRY={slow:' RITMO: slow burn, mucho silencio y planos largos; el miedo crece sin mostrar la amenaza hasta el final.',fast:' RITMO: rápido y agobiante; la amenaza aparece pronto y persigue sin descanso.'};
const povTxt='\n- PRIMERA PERSONA: la cámara son los ojos del protagonista con id "hero" (defínelo en "cast" y úsalo en todas las escenas con "moves"). No se le ve: el espectador ve lo que él ve. Haz que camine hacia el peligro con "moves" lentos, que se detenga a mirar y que la amenaza aparezca al borde del campo de visión. Los planos solo dividen el tiempo; los subtítulos son sus pensamientos.';
function povAim(cam,cs,ts,sd,ids){
  const t=PT,run=cfg.povbob==='run',sn=cfg.povbob==='sneak',fq=run?11:sn?4.5:7.5,am=run?.09:sn?.025:.05,L=cfg.povlook;
  const it=ids&&((cs.follow&&ids[cs.follow])||ids.hero||Object.values(ids).find(o=>o.mv));
  let x,y,z,yaw,w=1;
  if(it){
    const m=it.m;
    if(it.eye===undefined){const b=new THREE.Box3().setFromObject(m);it.eye=Math.max(.8,(b.max.y-b.min.y)*.88)}
    m.visible=false;x=m.position.x;y=m.position.y+it.eye;z=m.position.z;yaw=m.rotation.y;w=.3+.7*(it.hold?it.hold.mov:1);
  }else{x=Math.sin(t*.4)*.8;z=9-Math.min(t*(run?3:sn?.9:1.6),15);y=1.7;yaw=Math.PI}
  yaw+=Math.sin(t*.55)*(L==='frantic'?.9:.3);
  if(L!=='calm')[.36,.72].forEach(g=>{const u=(t-g*PD)/(L==='frantic'?1:1.8);if(u>0&&u<1)yaw+=Math.PI*.95*Math.sin(Math.PI*u)});
  const pitch=-.06+Math.sin(t*.37)*.05;
  y+=Math.sin(t*fq)*am*w;x+=Math.cos(t*fq/2)*am*.5*w;
  if(cfg.hand==='handheld'){x+=hn(t,0)*.02;y+=hn(t,4.1)*.02}
  cam.position.set(x,y,z);cam.lookAt(x+Math.sin(yaw)*5,y+Math.sin(pitch)*5,z+Math.cos(yaw)*5);
  cam.rotateZ(Math.sin(t*fq/2)*am*.25*w+Math.sin(t*.3)*.01);
  const fv=LENS[cfg.lens]||(run?78:72);if(cam.fov!==fv){cam.fov=fv;cam.updateProjectionMatrix()}
  return true;
}
function modeAim(cam,cs,ids){
  const t=PT,M=cfg.cmode;let x,y,z,lx,ly,lz,fv=60;
  if(M==='ceiling'){x=6;y=5;z=7;lx=Math.sin(t*.35)*3;ly=1;lz=0;fv=82}
  else if(M==='floor'){x=Math.sin(t*.3)*.6;y=.28;z=10-Math.min(t*.45,8);lx=Math.sin(t*.4)*1.2;ly=.7;lz=z-6;fv=78}
  else if(M==='top'){const u=Math.min(t/PD,1);x=Math.sin(t*.2)*2;y=15-6*u;z=3;lx=0;ly=0;lz=0}
  else if(M==='kubrick'){x=0;y=1.1;z=10-Math.min(t*16/PD,16);lx=0;ly=1.1;lz=z-5;fv=70}
  else{const it=ids&&(ids.hero||Object.values(ids).find(o=>o.mv));if(!it)return false;
    const m=it.m,w=m.rotation.y,sw=Math.sin(w),cw=Math.cos(w);x=m.position.x-sw*1.7+cw*.5;y=m.position.y+2.1;z=m.position.z-cw*1.7-sw*.5;lx=m.position.x+sw*3;ly=m.position.y+1.5;lz=m.position.z+cw*3;fv=58}
  if(cfg.hand==='handheld'){x+=hn(t,0)*.025;y+=hn(t,4.1)*.025}
  cam.position.set(x,y,z);cam.lookAt(lx,ly,lz);
  const f=LENS[cfg.lens]||fv;if(cam.fov!==f){cam.fov=f;cam.updateProjectionMatrix()}
  return true;
}
function aim(cam,cs,ts,sd,ids){
  cs=cs&&typeof cs==='object'?cs:{};
  if(cfg.pov==='live'){liveAim(cam);return}
  if(cfg.pov==='off'&&cfg.cmode!=='off'&&modeAim(cam,cs,ids))return;
  if(cfg.pov!=='off'&&povAim(cam,cs,ts,sd,ids))return;
  const u=sd>0?Math.min(ts/sd,1):0,e=sm(u),d=num(cs.distance,SZ[cs.size]||8,1,60),h=num(cs.height,d*.25,-10,40),sp=num(cs.speed,1,0,5),L=vec(cs.look||cs.target,[0,0,0]);
  const fo=ids&&cs.follow&&ids[cs.follow];
  if(fo){const q=fo.m.position;L[0]=q.x;L[1]=q.y+num(cs.focus,1.2,0,6);L[2]=q.z}
  let a=num(cs.angle,0,-720,720)*Math.PI/180,dd=d,hh=h,x,y,z,lx=L[0];
  const mv=cs.move||'orbit';
  if(cs.from){
    const f=vec(cs.from,[0,2,8],60),g=cs.to?vec(cs.to,f,60):f;
    x=f[0]+(g[0]-f[0])*e;y=f[1]+(g[1]-f[1])*e;z=f[2]+(g[2]-f[2])*e;
  }else{
    if(mv==='orbit')a+=ts*.4*sp;
    else if(mv==='dolly')dd=d*(1-.35*e);
    else if(mv==='pull')dd=d*(.6+.4*e);
    else if(mv==='crane')hh=h*(.4+2.1*e);
    else if(mv==='pan')lx+=(e-.5)*d;
    x=L[0]+Math.sin(a)*dd;y=L[1]+hh;z=L[2]+Math.cos(a)*dd;
    if(mv==='track')x+=(e-.5)*d;
  }
  if(fo&&!cs.from){
    let st=cam.userData.sp;if(!st||ts<st.t){st=cam.userData.sp={t:ts,p:[x,y,z],v:[0,0,0]}}
    const dt=Math.min(ts-st.t,.1),w=2.2+num(cs.speed,1,0,5)*.3;st.t=ts;
    for(let i=0;i<3;i++){const tg=[x,y,z][i];st.v[i]+=((tg-st.p[i])*w*w-2*.9*w*st.v[i])*dt;st.p[i]+=st.v[i]*dt}
    x=st.p[0];y=st.p[1];z=st.p[2];
  }
  const sk=(cfg.hand==='handheld'?.08:cfg.hand==='steady'?0:num(cs.shake,0,0,1)*.12)+(HITS=HITS*.9)*.35;
  if(sk){x+=hn(ts,0)*sk;y+=hn(ts,1.3)*sk;z+=hn(ts,2.6)*sk}
  cam.position.set(x,y,z);cam.lookAt(lx,L[1],L[2]);
  const fv=LENS[cfg.lens]||num(cs.fov,45,15,100);
  if(cam.fov!==fv){cam.fov=fv;cam.updateProjectionMatrix()}
}

/* ---------- Guion: escenas, planos y tiempos ---------- */
function plan(spec){
  const list=(Array.isArray(spec.scenes)&&spec.scenes.length?spec.scenes:(Array.isArray(spec.objects)?[{...spec,shots:[{camera:spec.camera}]}]:[]))
    .slice(0,8).filter(s=>s&&Array.isArray(s.objects)&&s.objects.length);
  if(!list.length)throw new Error('La IA no devolvió objetos para la escena. Inténtalo de nuevo.');
  const shots=[];let raw=0;
  const blocks=list.map((s,bi)=>{
    const b={s,shots:[]};
    (Array.isArray(s.shots)&&s.shots.length?s.shots:[{camera:s.camera}]).slice(0,6).forEach((h,i)=>{
      h=h&&typeof h==='object'?h:{};
      const d=num(h.dur,3,.5,30);raw+=d;
      const sh={d,cam:h.camera||s.camera||{},cap:String(h.caption||'').slice(0,160),fade:cfg.trans==='cut'?false:cfg.trans&&cfg.trans!=='auto'?shots.length>0:h.transition?h.transition==='fade':(i===0&&bi>0),b};
      b.shots.push(sh);shots.push(sh);
    });
    return b;
  });
  const k=cfg.dur/raw;let t=0;
  shots.forEach(h=>{h.d*=k;h.t0=t;t+=h.d});
  shots[0].fade=true;
  blocks.forEach(b=>{b.t0=b.shots[0].t0;b.dur=b.shots.reduce((q,h)=>q+h.d,0);b.sc=buildScene(b.s,spec.cast,k)});
  return{blocks,shots,total:t,title:String(spec.title||'').slice(0,80)};
}

/* ---------- Texto y transiciones sobre el video ---------- */
function txt(ctx,str,x,y,size,wt,maxW,sty){
  ctx.font=wt+' '+size+'px "Bricolage Grotesque",system-ui,sans-serif';
  const lines=[];let cur='';
  for(const w of str.split(/\s+/)){
    const q=cur?cur+' '+w:w;
    if(cur&&ctx.measureText(q).width>maxW){lines.push(cur);cur=w}else cur=q;
  }
  if(cur)lines.push(cur);
  const lh=size*1.25,y0=y-(lines.length-1)*lh;
  ctx.lineWidth=size*.22;ctx.strokeStyle='rgba(0,0,0,.75)';ctx.fillStyle=window.TC||(sty==='yellow'?'#ffd84a':'#fff');
  lines.forEach((l,i)=>{
    const yy=y0+i*lh;
    if(sty==='box'){const w=ctx.measureText(l).width+28;ctx.fillStyle='rgba(0,0,0,.7)';ctx.fillRect(x-w/2,yy-size*.9,w,size*1.2);ctx.fillStyle='#fff'}
    else ctx.strokeText(l,x,yy);
    ctx.fillText(l,x,yy);
  });
}
const CARD={found:['CINTA ENCONTRADA Nº 7','Grabada la noche del 13 de octubre'],warn:['ADVERTENCIA','Contiene imágenes perturbadoras'],real:['BASADO EN HECHOS REALES','Los nombres han sido cambiados']};
const VF={silent:'grayscale(1) sepia(.75) contrast(1.25)',thermal:'grayscale(1) contrast(1.6) sepia(1) hue-rotate(-50deg) saturate(6)'};
function cards(ctx,W,H,pl,t){
  ctx.textAlign='center';const c=CARD[cfg.card];
  if(c&&t<3){const a=Math.min(1,(3-t)/.6);ctx.fillStyle='rgba(0,0,0,'+a+')';ctx.fillRect(0,0,W,H);ctx.globalAlpha=a;window.TC=cfg.card==='warn'?'#c40a0a':0;txt(ctx,c[0],W/2,H*.47,58,800,1100);window.TC=0;txt(ctx,c[1],W/2,H*.57,32,400,1100);ctx.globalAlpha=1}
  if(cfg.endc){const u=Math.min(1,(t-(pl.total-2.8))/.8);if(u>0&&t<pl.total+.05){ctx.fillStyle='rgba(0,0,0,'+u+')';ctx.fillRect(0,0,W,H);ctx.globalAlpha=u;txt(ctx,'Nunca se volvió a saber de ellos.',W/2,H*.5,40,600,1100);ctx.globalAlpha=1}}
}
function viewHud(ctx,t,T,sc0){
  const V=cfg.view,z=n=>String(n).padStart(2,'0');ctx.font='600 30px ui-monospace,Menlo,monospace';ctx.textBaseline='top';ctx.fillStyle=ctx.strokeStyle='#fff';ctx.lineWidth=3;
  if(V==='cam'){
    [[50,50,1,1],[1230,50,-1,1],[50,670,1,-1],[1230,670,-1,-1]].forEach(([x,y,a,b])=>{ctx.beginPath();ctx.moveTo(x,y+40*b);ctx.lineTo(x,y);ctx.lineTo(x+40*a,y);ctx.stroke()});
    ctx.textAlign='left';if((t*1.1|0)%2===0){ctx.fillStyle='#ff2020';ctx.beginPath();ctx.arc(76,86,10,0,6.3);ctx.fill()}ctx.fillStyle='#fff';ctx.fillText('REC',96,70);
    ctx.textAlign='right';ctx.fillText(z(t/60|0)+':'+z(t%60|0)+':'+z(t*30%30|0),1230,70);
    const lo=t>T*.6,c=lo&&(t*2|0)%2===0?'#ff3030':'#fff';ctx.strokeStyle=ctx.fillStyle=c;ctx.strokeRect(1150,630,60,26);ctx.fillRect(1154,634,t>T*.8?10:t>T*.6?26:52,18);ctx.fillRect(1210,639,5,8);
    if(lo){ctx.textAlign='left';ctx.font='600 22px ui-monospace,Menlo,monospace';ctx.fillText('BATERÍA BAJA',70,632)}
  }else if(V==='thermal'){
    ctx.strokeRect(610,330,60,60);ctx.font='600 26px ui-monospace,Menlo,monospace';ctx.textAlign='left';
    const hot=sc0>=0&&t>=sc0-1.2;ctx.fillText((hot?36.6:18+Math.sin(t*.7)).toFixed(1)+' °C',690,336);ctx.fillText('TÉRMICA',60,60)
  }else{ctx.textAlign='left';ctx.font='600 26px system-ui,sans-serif';ctx.fillStyle='#ff4040';ctx.beginPath();ctx.arc(70,70,9,0,6.3);ctx.fill();ctx.fillStyle='#fff';ctx.fillText('Grabando…',92,56)}
}
function staticSnd(ac,out,at,vol){const s=ac.currentTime+.1+at,b=ac.createBuffer(1,ac.sampleRate*.3,ac.sampleRate),d=b.getChannelData(0);for(let i=0;i<d.length;i++)d[i]=Math.random()*2-1;const n=ac.createBufferSource(),f=ac.createBiquadFilter(),g=ac.createGain();n.buffer=b;f.type='highpass';f.frequency.value=2000;g.gain.setValueAtTime(vol,s);g.gain.linearRampToValueAtTime(0,s+.3);n.connect(f);f.connect(g);g.connect(out);n.start(s)}
function knock(ac,out,at,vol){for(let i=0;i<3;i++){const s=ac.currentTime+.1+at+i*.38,o=ac.createOscillator(),g=ac.createGain();o.frequency.setValueAtTime(140,s);o.frequency.exponentialRampToValueAtTime(60,s+.08);g.gain.setValueAtTime(vol,s);g.gain.exponentialRampToValueAtTime(.0001,s+.15);o.connect(g);g.connect(out);o.start(s);o.stop(s+.2)}}
function musicbox(ac,out,total,vol){const T=ac.currentTime+.1,N=[72,76,79,76,74,77,81,77,76,72,79,76],hz=n=>440*Math.pow(2,(n-69)/12);let t=0,i=0;
  while(t<total-1){const u=t/total,s=T+t,o=ac.createOscillator(),g=ac.createGain(),n=N[i%N.length]+(u>.4&&i%5===3?.5:0);
    o.type='triangle';o.frequency.value=hz(n)*(1-.03*u);g.gain.setValueAtTime(vol*(1-.5*u),s);g.gain.exponentialRampToValueAtTime(.0001,s+1.1);o.connect(g);g.connect(out);o.start(s);o.stop(s+1.2);t+=.42+.5*u*u;i++}}
function droneSnd(ac,out,kind,total,vol){const T=ac.currentTime+.1,g=ac.createGain(),o=ac.createOscillator(),f=ac.createBiquadFilter();g.gain.setValueAtTime(0,T);g.gain.linearRampToValueAtTime(vol,T+2);g.connect(out);
  o.type=kind==='hum'?'sawtooth':'sine';o.frequency.setValueAtTime(kind==='hum'?50:7800,T);if(kind==='tinnitus')o.frequency.linearRampToValueAtTime(9200,T+total);
  f.type='lowpass';f.frequency.value=kind==='hum'?400:12000;o.connect(f);f.connect(g);o.start(T);o.stop(T+total+.1)}
function overlay(ctx,W,H,pl,si,t,bo){
  const s=pl.shots[si],ts=Math.min(Math.max(t-s.t0,0),s.d);
  ctx.textAlign='center';ctx.lineJoin='round';
  if(pl.title&&t<2.8){ctx.globalAlpha=Math.max(0,Math.min(1,t/.6,(2.8-t)/.6));window.TC=cfg.rtitle?'#c40a0a':0;txt(ctx,pl.title,W/2,H*.45,76,800,1100);window.TC=0}
  if(s.cap&&cfg.subs!=='off'){ctx.globalAlpha=Math.max(0,Math.min(1,ts/.3,(s.d-ts)/.3));txt(ctx,s.cap,W/2,H-70-(bo||0),+cfg.subsz||38,600,1100,cfg.subs)}
  ctx.globalAlpha=1;
  const nx=pl.shots[si+1],last=si===pl.shots.length-1,tr=cfg.trans;
  const ain=s.fade?1-ts/Math.min(.5,s.d*.4):0,aout=(nx?nx.fade:last)?1-(s.d-ts)/Math.min(last?.6:.5,s.d*.4):0;
  const a=Math.max(0,ain,aout),mid=a>0&&((ain>=aout&&si>0)||(aout>ain&&!!nx));
  if(a>0){
    if(mid&&tr==='wipe'){ctx.fillStyle='#000';if(ain>=aout)ctx.fillRect(W*(1-Math.min(1,ain)),0,W,H);else ctx.fillRect(0,0,W*Math.min(1,aout),H)}
    else{ctx.fillStyle=(mid&&tr==='white'?'rgba(255,255,255,':'rgba(0,0,0,')+Math.min(1,a)+')';ctx.fillRect(0,0,W,H)}
  }
  cards(ctx,W,H,pl,t);
}

/* ---------- Guion editable ---------- */
const MOVES=[['static','Fija'],['orbit','Órbita'],['dolly','Acercarse'],['pull','Alejarse'],['pan','Paneo'],['crane','Grúa'],['track','Travelling']];
function review(spec){
  if(!Array.isArray(spec.scenes)||!spec.scenes.length)return Promise.resolve(spec);
  const sp=JSON.parse(JSON.stringify(spec)),box=$('#rvl'),rows=[];
  const mk=(tag,at)=>Object.assign(document.createElement(tag),at);
  const fld=(t,el)=>{const l=mk('label',{className:'f'});l.append(mk('span',{textContent:t}),el);return l};
  const tot=()=>rows.reduce((a,r)=>a+(+r.dur.value||0),0);
  box.innerHTML='';$('#rvm').textContent='';$('#rvs').textContent=story&&story.logline?'Historia: '+story.logline:'';
  sp.scenes.forEach((sc,si)=>{
    sc.shots=(Array.isArray(sc.shots)&&sc.shots.length?sc.shots:[{camera:sc.camera}]).map(h=>h&&typeof h==='object'?h:{});
    box.appendChild(mk('h3',{textContent:'Escena '+(si+1)}));
    sc.shots.forEach((h,hi)=>{
      const c=h.camera||sc.camera||{},free=!!c.from,cm=c.move||'orbit',row=mk('div',{className:'shot'});
      const cap=mk('input',{value:h.caption||'',placeholder:'Vacío = sin subtítulo'});
      const dur=mk('input',{type:'number',min:.5,max:30,step:.5,value:+h.dur||3});dur.dataset.o=dur.value;
      const mv=mk('select'),tr=mk('select');
      MOVES.forEach(([v,t])=>mv.add(new Option(t,v)));
      if(free){mv.add(new Option('Libre',''));mv.value='';mv.disabled=true}
      else{if(!MOVES.some(m=>m[0]===cm))mv.add(new Option(cm,cm));mv.value=cm}
      mv.dataset.o=mv.value;
      tr.add(new Option('Corte','cut'));tr.add(new Option('Fundido','fade'));
      tr.value=(h.transition||(hi===0&&si>0?'fade':'cut'))==='fade'?'fade':'cut';tr.dataset.o=tr.value;
      row.append(fld('Subtítulo del plano '+(hi+1),cap),fld('Duración (s)',dur),fld('Cámara',mv),fld('Transición',tr));
      box.appendChild(row);rows.push({h,sc,cap,dur,mv,tr});
    });
  });
  $('#rvt').value=sp.title||'';
  $('#rvj').value=JSON.stringify(sp,null,1);$('#rvj').dataset.o=$('#rvj').value;
  const upd=()=>{$('#rvd').textContent=tot().toFixed(1)};box.oninput=upd;upd();
  return new Promise((res,rej)=>{
    const sec=$('#rv');sec.hidden=false;$('#rvt').focus();
    $('#rvgo').onclick=()=>{
      let out=sp;const j=$('#rvj');
      if(j.value!==j.dataset.o){
        try{out=JSON.parse(j.value)}catch(e){$('#rvm').textContent='El JSON no es válido: '+e.message;return}
      }else{
        out.title=$('#rvt').value.trim();let ch=false;
        rows.forEach(r=>{
          r.h.caption=r.cap.value;
          if(r.dur.value!==r.dur.dataset.o){r.h.dur=Math.min(30,Math.max(.5,+r.dur.value||3));ch=true}
          if(!r.mv.disabled&&r.mv.value!==r.mv.dataset.o)r.h.camera={...(r.h.camera||r.sc.camera||{}),move:r.mv.value};
          if(r.tr.value!==r.tr.dataset.o)r.h.transition=r.tr.value;
        });
        if(ch){cfg.dur=+Math.min(60,Math.max(3,tot())).toFixed(1);$('#dur').value=cfg.dur;save()}
      }
      sec.hidden=true;res(out);
    };
    $('#rvno').onclick=()=>{sec.hidden=true;rej(new Error('Guion descartado. Cambia la idea o genera de nuevo.'))};
  });
}

/* ---------- Herramientas de cine ---------- */
const LOOKS={
  natural:{},
  warm:{f:'saturate(1.15) contrast(1.05)',t:['#ff9a3c',.22]},
  cold:{f:'saturate(.85) contrast(1.1)',t:['#3a6bff',.24]},
  noir:{f:'grayscale(1) contrast(1.4) brightness(.95)'},
  vintage:{f:'sepia(.6) contrast(1.05) saturate(1.1)',t:['#ffb347',.12]},
  neon:{f:'saturate(1.7) contrast(1.15)',t:['#c026d3',.2]},
  horror:{f:'saturate(.5) contrast(1.3) brightness(.85)',t:['#0b4a32',.3]},
  nightcam:{f:'grayscale(1) sepia(1) hue-rotate(58deg) saturate(2.6) brightness(1.6) contrast(1.15)'}
};
const TOD={
  dawn:{bg:'#f2b8a2',sun:'#ffb38a',i:.9,pos:[-8,2.5,5],amb:.45},
  noon:{bg:'#8ec5ff',sun:'#ffffff',i:1.3,pos:[3,9,4],amb:.6},
  sunset:{bg:'#ff8a5b',sun:'#ff7a3d',i:1,pos:[8,2,4],amb:.4},
  night:{bg:'#070b1f',sun:'#8fa8ff',i:.35,pos:[-4,7,3],amb:.18}
};
const SZ={wide:13,medium:7.5,close:4};
const LENS={wide:68,normal:45,tele:28};
function creditsRoll(ctx,W,H,title,dir,mu,u){
  const L=[[title||'Mi película',58,1],['Dirigida por',26,.6],[dir||'Estudio de video 3D',40,1]];
  if(mu)L.push(['Música',26,.6],['Banda sonora original',40,1]);
  L.push(['Gráficos',26,.6],['Three.js y WebGL',40,1]);
  const gap=84,y0=H+40-u*(H+80+L.length*gap);
  ctx.textAlign='center';ctx.lineJoin='round';
  L.forEach((l,i)=>{ctx.globalAlpha=l[2];txt(ctx,l[0],W/2,y0+i*gap,l[1],l[1]>30?600:400,1000)});
  ctx.globalAlpha=1;
}
const HT={
  house:'Casa embrujada: una mansion abandonada con ventanas encendidas, deadtree, grave y un camino con lamp; ella entra a buscar algo.',
  forest:'Bosque maldito: muchos pine, niebla baja, un camino con una lamp; la amenaza la sigue entre los árboles.',
  cemetery:'Cementerio de noche: filas de grave, deadtree, niebla; algo se levanta o camina entre las tumbas.',
  road:'Carretera de noche: un car averiado con las luces encendidas, lamp y pine; alguien camina por la carretera hacia ella.',
  lab:'Laboratorio abandonado: robot que despierta, luces rojas con glow y cajas; la amenaza es lo que creó el laboratorio.'
};
const HE={
  scare:'Final con susto: la amenaza aparece de golpe en el último plano.',
  ambig:'Final ambiguo: ella escapa, pero la sombra sigue ahí detrás.',
  twist:'Final con giro: la amenaza era ella misma o ella ya estaba muerta.',
  dark:'Final oscuro: la amenaza la atrapa y todo queda a oscuras.'
};
const HX={
  macabre:' EXTREMO MACABRO: el lugar es un altar de muerte. Decorado con grave, coffin entreabierto, skeleton, deadtree, pentagram y muchas candle; luz roja o verdosa, niebla densa y sombras largas. Hay cuerpos y restos que la protagonista descubre (planos de detalle lentos) y una amenaza (zombie, monster o tentacle) que parece venir de un ritual. Se cuenta con lo que queda después, no con lo que se ve hacer.',
  bloody:' EXTREMO SANGRIENTO: sangre visible en todas las escenas. Usa puddle y trail en el suelo de cada plano, cada vez más grandes y recientes; las víctimas (person) caen una a una y la amenaza (monster o zombie) las ataca con cortes secos, shake 0.7 y luz roja con glow. Muestra las consecuencias con planos de detalle y deja el resto al sonido y al fuera de campo.',
  extreme:' EXTREMO TOTAL: la película más cruda y macabra posible. Mundo podrido y ritual (grave, coffin, skeleton, deadtree, pentagram, candle) con puddle y trail por todas partes. Varias víctimas (person) y una masacre en el clímax: planos de 1 a 1.5 s, cut seco, shake 0.9, luz roja que parpadea y la amenaza (monster, zombie o tentacle) devorando todo a su paso. Cada escena es peor que la anterior y la sangre se acumula. Final sin piedad: la amenaza gana, nadie se salva y todo queda en silencio entre cuerpos y charcos. Es ficción de terror hecha con criaturas 3D, sin personas reales.'
};
const HTR={
  cult:' ORIGEN: un culto. Hay un ritual en marcha con pentagram en el suelo, candle en círculo y coffin; las víctimas (person) son ofrendas que llegan una a una y la entidad invocada (monster o tentacle) se manifiesta al completarse el ritual. Regla: cada sacrificio la hace más grande.',
  infect:' ORIGEN: una infección. Los muertos (zombie) se levantan lentos al principio y cada víctima mordida se convierte en uno más en el siguiente plano; la manada crece escena a escena. Regla: el contagio es inevitable y la protagonista llega tarde.',
  exper:' ORIGEN: un experimento fallido en un laboratorio abandonado. La criatura (monster o tentacle) rompió sus ataduras; hay luces rojas con glow, cajas abiertas y robot apagado. Regla: caza por el sonido, así que quien corre muere primero.',
  possess:' ORIGEN: una posesión. Un personaje conocido (person) cambia a mitad de la película: se queda quieto, mira fijo a cámara y se mueve a sacudidas hasta atacar a los demás. Regla: la amenaza tiene la cara de alguien querido y solo se nota en pequeños detalles.',
  beast:' ORIGEN: una bestia ancestral (monster) que caza de noche en un bosque con pine, deadtree y niebla. Deja rastros y restos antes de aparecer y no se detiene. Regla: siempre llega desde el fondo y nunca se la ve completa hasta el clímax.'
};
const HVC={
  one:' VÍCTIMAS: una sola (person). Todo el miedo es una persecución íntima: ella sola, la amenaza cada vez más cerca y un final cruel.',
  group:' VÍCTIMAS: un grupo de 4 o 5 amigos (person). Se separan por un error y caen uno a uno; cada escena tiene un superviviente menos y los restos del anterior en el suelo.',
  mass:' VÍCTIMAS: una multitud (muchas person). La amenaza arrasa sin que nadie escape; cada plano suma cuerpos y la huida es imposible.'
};
const HSH={
  off:' MUERTES: siempre fuera de campo. La cámara se aparta o corta a negro justo antes y solo quedan el sonido y la sangre después (puddle y trail).',
  shadow:' MUERTES: en sombras. Se ven como siluetas y movimientos contra una luz roja o una pared, sin enseñar el cuerpo; después aparece la sangre en el suelo.',
  direct:' MUERTES: de frente y sin cortar. Planos fijos y largos (3 a 5 s) donde la víctima y la amenaza están en cuadro y no se aparta la cámara; es lo más cruel y perturbador.'
};
const hTxt=()=>' TEMA: '+(HT[cfg.htheme]||'elige tú el lugar y la amenaza.')+' FINAL: '+(HE[cfg.hend]||'elige el final más inquietante.')+(HRY[cfg.hbeat]||'')+(HX[cfg.hext]||'')+(HTR[cfg.hthr]||'')+(HVC[cfg.hvic]||'')+(HSH[cfg.hshow]||'');
const GORE=()=>cfg.gore!=='off'?cfg.gore:cfg.genre!=='horror'?'off':cfg.hext==='extreme'?'lots':cfg.hext==='bloody'?'some':'some';
const GEN={
  adventure:{p:'Aventura épica. Planos amplios y heroicos, cámara dinámica (orbit, crane, track), luz dorada de sol bajo, ritmo ágil, paisajes con montañas y vegetación.',music:'epic',look:'warm'},
  scifi:{p:'Ciencia ficción. Fondos oscuros con luces de neón y objetos con glow, superficies metálicas, robots y cohetes, cámaras dolly y orbit, atmósfera futurista.',music:'tense',look:'neon'},
  horror:{music:'tense',look:'horror',
    get p(){return `TERROR DE VERDAD: el miedo nace de lo que no se ve y del ritmo, no de enseñarlo todo.
  a) ESTRUCTURA DE PLANOS: (1) wide largo, quieto y casi vacío que ubica el lugar (4-5 s); (2) un detalle fuera de lugar: luz que parpadea, puerta abierta, huellas, un charco; (3) la víctima (person) avanza con follow medium y dolly lento; (4) la amenaza (ghost o monster) aparece MUY lejos, al fondo (z menor que -8), de espaldas o casi oculta por la niebla; (5) corte: la víctima mira atrás y la amenaza ya está más cerca en la misma escena, con sus "moves" hacia ella; (6) close del rostro y silencio (fov 28-35); (7) clímax rápido: planos de 1.5-2 s, shake 0.6, la víctima corre (3 unidades/s) y la amenaza detrás; (8) final: plano quieto con una sombra o presencia detrás de ella.
  b) LUZ: fondo casi negro (#05070a), ambient 0.05-0.12, sol con intensidad 0-0.1, UNA sola luz baja o lateral (intensidad 0.8-1.5) fría #8fb4ff, verdosa #9fd8a0 o ámbar #ff9a3c si es lámpara o fuego, para sombras largas; niebla casi negra azulada con near 2 y far 12-16; una luz roja tenue solo en el clímax.
  c) CÁMARA: lenta y con intención. Calma: static o dolly lento; tensión: shake 0.15; persecución: shake 0.6. Encuadra a la víctima descentrada con espacio vacío delante. Altura baja (1.2). Usa pull para revelar un vacío y close para el miedo.
  d) AMENAZA: nunca entera ni quieta en el centro al principio. Respeta su regla (solo se mueve cuando ella no la mira, o la sigue a distancia) y no la expliques.
  e) DECORADO: suelo oscuro (plane) con 30-60 objetos repartidos en un área de unos 30 por 30 y mucho vacío: mansion o house, deadtree, grave, pine, lamp con luz débil, puddle y trail. Usa weather "mist" o "rain".
  f) SUBTÍTULOS: frases breves en presente que incomodan sin explicar («Alguien estuvo aquí.», «La puerta estaba cerrada.», «No estás sola.»).
  g) TRANSICIONES: fade en los momentos lentos y cut seco para el susto. look "horror" o "cold", music "tense" o "mystery".`+hTxt()},
    get s(){return `TERROR CON SENTIDO: la protagonista (person) quiere algo concreto (encontrar a alguien, volver a casa, recoger algo) y por eso entra al lugar peligroso. Beats: 1) lugar y normalidad inquietante; 2) primer detalle fuera de lugar; 3) ella decide seguir por un motivo claro; 4) primera señal de la amenaza, lejos y apenas visible; 5) la amenaza se acerca o ella descubre algo; 6) persecución o encuentro; 7) clímax con un susto; 8) final ambiguo o con giro. La amenaza es UNA criatura elegida por el lugar (clown, doll, spider, skeleton, scarecrow, slender, zombie, tentacle, ghost o monster) con una regla clara que se respeta y nunca se explica. Se revela por escalones: señal, silueta lejana, una parte, entera solo en el clímax; cada beat sube como mucho un escalón. El decorado la anuncia (door abierta, candle, puddle, bat, pentagram). Cada beat es una acción visible; los beats lentos van antes del susto y los cortos después.`+hTxt()}},

  comedy:{p:'Comedia. Colores vivos y saturados, personajes que rebotan, cámara static o pan, ritmo rápido con planos cortos, subtítulos graciosos.',music:'joy',look:'natural'},
  kids:{p:'Cuento infantil. Formas redondeadas, colores pastel, luz suave y cálida, personajes simpáticos, cámara tranquila, subtítulos sencillos.',music:'calm',look:'warm'},
  drama:{p:'Drama. Pocos objetos bien elegidos, planos medios y primeros planos lentos, luz contrastada, paleta sobria, subtítulos emotivos.',music:'calm',look:'cold'}
};
const HK=`\n- CAJA DE HERRAMIENTAS DE TERROR (úsala entera; cada pieza tiene su función):\n  · CRIATURAS (caminan con "moves" o "path"): clown (risa y globos; quieto al fondo y en el plano siguiente más cerca), doll (nunca se ve caminar: cambia de sitio entre planos y siempre mira a cámara), spider (techo, esquinas y suelo; rápida y a sacudidas), skeleton (rituales y tumbas), scarecrow (campo; inmóvil hasta que le dan la espalda), slender (alto y callado, al borde del bosque; solo avanza cuando no lo miran), zombie (lentos y en grupo, desde varios lados), monster (bestia de caza; revela sombra, ojos rojos, un brazo), tentacle (surge del suelo junto a grietas y charcos; no camina), ghost (flota y atraviesa; luz fría), bat (presagio en el aire con "orbit").\n  · LUGAR Y PRESAGIOS: mansion, house, door (abierta en el plano 2 sin que nadie la abriera), bed (algo a los pies o bajo la cama), coffin, grave, deadtree, pentagram con candle en círculo (ritual), pumpkin (campo), lamp (única luz y parpadea), puddle y trail (el rastro lleva hacia la amenaza), car (averiado, con faros).\n  · ESCALERA DE REVELACIÓN: señal (huella, sonido, objeto movido) → silueta lejana → una parte (ojos, mano) → entera solo en el clímax. Cada plano sube como mucho un escalón.\n  · GORE Y MACABRO: en cada escena de terror pon restos (viscera, carcass, hanged, limb, head) con más densidad; en exteriores usa coches destrozados (wreck), campos (field) y graneros (barn), con sangre en el suelo y restos alrededor junto a puddle y trail; el close va sobre la herida, la sangre fresca y la carne abierta, con luz roja o cálida que los haga brillar húmedos.\\n  · LUZ: ambient bajo, un spot bajo y lateral, "glow" rojo solo en la amenaza, fog near 2 y far 20-30, weather mist o rain.\n  · CÁMARA: follow con dolly en calma; static en un wide vacío; close con fov 28-35 en el rostro; pull para revelar un vacío; "from/to/look" para un plano a ras del suelo; shake 0-0.2 en tensión y 0.6-0.9 en el ataque; último plano quieto.\n  · MONTAJE: fade en lo lento, cut seco en el susto; planos largos antes del susto y de 1 a 2 s después.`;
const CM={ceiling:'esquina del techo, vigilando',floor:'a ras del suelo, reptando',top:'cenital, bajando desde arriba',kubrick:'travelling hacia el fondo',shoulder:'sobre el hombro del protagonista'};
const htools=()=>{
  const c=cfg,A=[],on=(k,t)=>k&&A.push(t);
  on(c.stalk!=='off','el motor ya coloca un/a "'+c.stalk+'" que avanza desde el fondo en cada escena: NO lo repitas; haz que el héroe lo vea de reojo y cuenta la historia alrededor de esa presencia');
  on(GORE()!=='off'||c.gx!=='off'||c.gy!=='off','el motor ya esparce sangre, cuerpos y restos: el héroe los descubre con planos close y reacciona; no añadas más puddle ni trail');
  on(c.eyes!=='off','hay ojos brillantes en la oscuridad: deja zonas vacías y oscuras para que se vean');
  on(c.flick!=='off','las luces parpadean solas: pon lamp y luces que lo justifiquen');
  on(c.scare!=='off','habrá un susto '+(c.scare==='mid'?'a mitad de la película':'al final')+': el plano anterior es largo, quieto y en silencio; el susto es la amenaza llenando el cuadro en un plano de 1 s con cut');
  on(c.torch!=='off','el protagonista lleva linterna: la linterna es un foco real que apunta a donde mira el protagonista; ambient bajo (0.2) y el haz descubre el entorno, con sombras y restos iluminados');
  on(c.view!=='off','la imagen simula una grabación ('+c.view+'): encuadra como si la hiciera alguien dentro de la escena, sin planos imposibles');
  on(c.cmode!=='off','cámara fija de terror ('+(CM[c.cmode]||c.cmode)+'): piensa la acción para ese punto de vista');
  on(c.blackout!=='off','habrá apagón: la amenaza se acerca a oscuras y al volver la luz está mucho más cerca');
  on(c.zoom!=='off'||c.tilt!=='off','la cámara es incómoda (zoom lento o inclinación): usa shake 0-0.2 y planos largos');
  on(c.thick,'la niebla se espesa sola: abre con niebla ligera');
  on(c.steps!=='off'||c.whisp!=='off'||c.creak!=='off'||c.breath||c.tick||c.knock||c.musicbox||c.heart||c.drone!=='off','el sonido de miedo ya está montado (pasos, susurros, crujidos, latido, golpes...): deja planos largos y quietos para que se oiga y haz que lo que se oye coincida con lo que pasa');
  on(c.card!=='off'||c.endc,'hay tarjetas de texto de metraje encontrado: la historia termina sin resolver, con alguien desaparecido o la presencia aún ahí');
  return A.length?'\n- HERRAMIENTAS DE TERROR ACTIVAS (coordínate con ellas):'+A.map(t=>'\n  · '+t).join(''):'';
};
const MU={
  epic:{r:45,b:84,c:[[0,3,7],[-4,0,3],[3,7,10],[-2,2,5]],w:'sawtooth',a:1,d:1},
  calm:{r:48,b:64,c:[[0,4,7],[-3,0,4],[5,9,12],[-5,-1,2]],w:'sine',a:1},
  mystery:{r:50,b:56,c:[[0,3,7],[-2,1,5],[-4,0,3],[1,5,8]],w:'triangle'},
  joy:{r:55,b:116,c:[[0,4,7],[5,9,12],[7,11,14],[-3,0,4]],w:'triangle',a:1},
  tense:{r:40,b:100,c:[[0,3,6],[1,4,7]],w:'sawtooth',d:1}
};
function score(ac,out,mood,total,vol){
  const m=MU[mood];if(!m||!vol)return;
  const g=ac.createGain(),lp=ac.createBiquadFilter(),T=ac.currentTime+.1,B=60/m.b;
  lp.type='lowpass';lp.frequency.value=m.w==='sawtooth'?1100:2200;
  g.gain.setValueAtTime(0,T);g.gain.linearRampToValueAtTime(vol,T+1.5);
  g.gain.setValueAtTime(vol,T+Math.max(total-2.5,1.6));g.gain.linearRampToValueAtTime(0,T+total);
  g.connect(lp);lp.connect(out);
  const hz=n=>440*Math.pow(2,(n-69)/12);
  const note=(n,t,d,type,a)=>{const o=ac.createOscillator(),e=ac.createGain();o.type=type;o.frequency.value=hz(n);
    e.gain.setValueAtTime(.0001,t);e.gain.linearRampToValueAtTime(a,t+Math.min(.1,d/3));e.gain.exponentialRampToValueAtTime(.0001,t+d);
    o.connect(e);e.connect(g);o.start(t);o.stop(t+d+.05)};
  const kick=t=>{const o=ac.createOscillator(),e=ac.createGain();o.frequency.setValueAtTime(130,t);o.frequency.exponentialRampToValueAtTime(40,t+.15);
    e.gain.setValueAtTime(.5,t);e.gain.exponentialRampToValueAtTime(.0001,t+.3);o.connect(e);e.connect(g);o.start(t);o.stop(t+.35)};
  for(let bar=0;bar*B*4<total;bar++){
    const c=m.c[bar%m.c.length],t=T+bar*B*4;
    c.forEach(n=>note(m.r+12+n,t,B*4,m.w,.08));
    note(m.r-12+c[0],t,B*4,'sine',.3);
    if(m.a)for(let i=0;i<8;i++)note(m.r+24+c[i%3],t+i*B/2,B*.6,'triangle',.07);
    if(m.d)[0,2].forEach(i=>kick(t+i*B));
  }
}
function ambience(ac,out,kind,total,vol){
  if(!kind||kind==='none'||!vol)return;
  const T=ac.currentTime+.1,g=ac.createGain(),end=T+total+.1;
  g.gain.setValueAtTime(0,T);g.gain.linearRampToValueAtTime(vol,T+1.5);
  g.gain.setValueAtTime(vol,T+Math.max(total-2,1.6));g.gain.linearRampToValueAtTime(0,T+total);
  g.connect(out);
  const lfo=(f,d,param)=>{const o=ac.createOscillator(),a=ac.createGain();o.frequency.value=f;a.gain.value=d;o.connect(a);a.connect(param);o.start(T);o.stop(end)};
  if(kind==='night'){
    const o=ac.createOscillator(),a=ac.createGain();o.frequency.value=4300;a.gain.value=.03;
    o.connect(a);a.connect(g);lfo(9,.03,a.gain);o.start(T);o.stop(end);return;
  }
  const buf=ac.createBuffer(1,ac.sampleRate*2,ac.sampleRate),d=buf.getChannelData(0);
  for(let i=0;i<d.length;i++)d[i]=Math.random()*2-1;
  const src=ac.createBufferSource(),f=ac.createBiquadFilter(),a=ac.createGain();
  src.buffer=buf;src.loop=true;
  f.type=kind==='sea'?'lowpass':'bandpass';f.frequency.value={wind:500,rain:4500,sea:600}[kind];f.Q.value=.5;
  a.gain.value={wind:.5,rain:.35,sea:.5}[kind];
  if(kind==='wind')lfo(.15,300,f.frequency);
  if(kind==='sea')lfo(.12,.35,a.gain);
  src.connect(f);f.connect(a);a.connect(g);src.start(T);src.stop(end);
}
function heart(ac,out,total,vol){
  const T=ac.currentTime+.1;let t=0;
  while(t<total){
    const u=t/total,gap=1-.5*u;
    [0,.28*gap].forEach(d=>{const o=ac.createOscillator(),e=ac.createGain(),s=T+t+d;
      o.frequency.setValueAtTime(70,s);o.frequency.exponentialRampToValueAtTime(38,s+.14);
      e.gain.setValueAtTime(vol*(.5+.5*u),s);e.gain.exponentialRampToValueAtTime(.0001,s+.22);
      o.connect(e);e.connect(out);o.start(s);o.stop(s+.25)});
    t+=gap;
  }
}
function steps(ac,out,kind,total,vol){
  const T=ac.currentTime+.1,gap={slow:.9,fast:.42,near:.85}[kind],nb=ac.createBuffer(1,ac.sampleRate*.2,ac.sampleRate),nd=nb.getChannelData(0);
  for(let i=0;i<nd.length;i++)nd[i]=Math.random()*2-1;
  let t=1.2,i=0;
  while(t<total-.5){
    const u=kind==='near'?t/total:.5,s=T+t,g=ac.createGain(),o=ac.createOscillator(),b=ac.createBufferSource(),f=ac.createBiquadFilter(),ng=ac.createGain();
    g.gain.setValueAtTime(vol*(kind==='near'?.2+.8*u:.7),s);g.gain.exponentialRampToValueAtTime(.0001,s+.18);
    o.frequency.setValueAtTime(110,s);o.frequency.exponentialRampToValueAtTime(45,s+.12);o.connect(g);
    b.buffer=nb;f.type='lowpass';f.frequency.value=900;ng.gain.value=.5;b.connect(f);f.connect(ng);ng.connect(g);
    if(ac.createStereoPanner){const p=ac.createStereoPanner();p.pan.value=(i%2?1:-1)*(kind==='near'?1-u:.6);g.connect(p);p.connect(out)}else g.connect(out);
    o.start(s);o.stop(s+.2);b.start(s);
    t+=gap*(kind==='near'?1-.4*u:1)*(.9+Math.random()*.2);i++;
  }
}
function whispers(ac,out,kind,total,vol){
  const T=ac.currentTime+.1,nb=ac.createBuffer(1,ac.sampleRate*3,ac.sampleRate),nd=nb.getChannelData(0),close=kind==='close';
  for(let i=0;i<nd.length;i++)nd[i]=Math.random()*2-1;
  let t=1;
  while(t<total-.8){
    const n=3+(Math.random()*4|0),s=T+t,len=n*.16,b=ac.createBufferSource(),f=ac.createBiquadFilter(),g=ac.createGain();
    b.buffer=nb;f.type='bandpass';f.Q.value=3;g.gain.setValueAtTime(0,s);
    for(let j=0;j<n;j++){const a=s+j*.16;f.frequency.setValueAtTime(1500+Math.random()*2500,a);g.gain.linearRampToValueAtTime(vol*(.5+Math.random()*.5),a+.04);g.gain.linearRampToValueAtTime(vol*.04,a+.13)}
    g.gain.linearRampToValueAtTime(0,s+len+.1);b.connect(f);f.connect(g);
    if(ac.createStereoPanner){const p=ac.createStereoPanner();p.pan.value=(Math.random()*2-1)*(close?.9:.5);g.connect(p);p.connect(out)}else g.connect(out);
    b.start(s,Math.random(),len+.2);
    t+=(close?1.4:2.6)+Math.random()*(close?1.4:2.8);
  }
}
function creaks(ac,out,kind,total,vol){
  const T=ac.currentTime+.1;let t=1.5+Math.random()*2;
  while(t<total-1){
    const s=T+t,d=.5+Math.random()*.8,o=ac.createOscillator(),f=ac.createBiquadFilter(),g=ac.createGain();
    o.type='sawtooth';o.frequency.setValueAtTime(70+Math.random()*60,s);o.frequency.exponentialRampToValueAtTime(40+Math.random()*30,s+d);
    f.type='bandpass';f.frequency.value=300+Math.random()*500;f.Q.value=6;
    g.gain.setValueAtTime(0,s);g.gain.linearRampToValueAtTime(vol,s+d*.2);g.gain.linearRampToValueAtTime(vol*.3,s+d*.6);g.gain.linearRampToValueAtTime(0,s+d);
    o.connect(f);f.connect(g);
    if(ac.createStereoPanner){const p=ac.createStereoPanner();p.pan.value=Math.random()*2-1;g.connect(p);p.connect(out)}else g.connect(out);
    o.start(s);o.stop(s+d+.05);
    t+=(kind==='often'?2:5)+Math.random()*(kind==='often'?3:7);
  }
}
function breath(ac,out,total,vol){
  const T=ac.currentTime+.1,nb=ac.createBuffer(1,ac.sampleRate*2,ac.sampleRate),nd=nb.getChannelData(0);
  for(let i=0;i<nd.length;i++)nd[i]=Math.random()*2-1;
  for(let t=1.2;t<total-.8;t+=3.2)[[0,1.1],[1.5,1.2]].forEach(([d,len],j)=>{
    const s=T+t+d,b=ac.createBufferSource(),f=ac.createBiquadFilter(),g=ac.createGain();
    b.buffer=nb;f.type='bandpass';f.Q.value=1.2;f.frequency.setValueAtTime(j?500:800,s);f.frequency.linearRampToValueAtTime(j?350:1100,s+len);
    g.gain.setValueAtTime(0,s);g.gain.linearRampToValueAtTime(vol*(j?1:.7),s+len*.5);g.gain.linearRampToValueAtTime(0,s+len);
    b.connect(f);f.connect(g);g.connect(out);b.start(s,0,len+.05);
  });
}
function tick(ac,out,total,vol){
  const T=ac.currentTime+.1;
  for(let i=1;i<total;i++){const s=T+i,o=ac.createOscillator(),g=ac.createGain();
    o.frequency.setValueAtTime(i%2?1800:1400,s);g.gain.setValueAtTime(vol,s);g.gain.exponentialRampToValueAtTime(.0001,s+.04);o.connect(g);g.connect(out);o.start(s);o.stop(s+.05)}
}
function thud(ac,out,at,vol){const o=ac.createOscillator(),g=ac.createGain(),s=ac.currentTime+.1+at;o.frequency.setValueAtTime(90,s);o.frequency.exponentialRampToValueAtTime(30,s+.4);g.gain.setValueAtTime(vol,s);g.gain.exponentialRampToValueAtTime(.0001,s+.5);o.connect(g);g.connect(out);o.start(s);o.stop(s+.55)}
function riser(ac,out,to,vol){const T=ac.currentTime+.1,o=ac.createOscillator(),f=ac.createBiquadFilter(),g=ac.createGain();o.type='sawtooth';o.frequency.setValueAtTime(45,T);o.frequency.exponentialRampToValueAtTime(380,T+to);f.type='lowpass';f.frequency.setValueAtTime(200,T);f.frequency.exponentialRampToValueAtTime(2500,T+to);g.gain.setValueAtTime(0,T);g.gain.linearRampToValueAtTime(vol,T+to*.9);g.gain.setValueAtTime(0,T+to);o.connect(f);f.connect(g);g.connect(out);o.start(T);o.stop(T+to+.1)}
function splat(ac,out,at,vol){
  const s=ac.currentTime+.1+at,n=ac.createBuffer(1,ac.sampleRate*.35,ac.sampleRate),d=n.getChannelData(0);
  for(let i=0;i<d.length;i++)d[i]=(Math.random()*2-1)*Math.pow(1-i/d.length,2);
  const b=ac.createBufferSource(),f=ac.createBiquadFilter(),g=ac.createGain();
  f.type='lowpass';f.frequency.value=700;g.gain.value=vol;b.buffer=n;b.connect(f);f.connect(g);g.connect(out);b.start(s);
}
function sting(ac,out,at,vol){
  const s=ac.currentTime+.1+at,g=ac.createGain();
  g.gain.setValueAtTime(vol,s);g.gain.exponentialRampToValueAtTime(.0001,s+1.1);g.connect(out);
  [233,247,311,466].forEach(f=>{const o=ac.createOscillator();o.type='sawtooth';o.frequency.value=f;o.connect(g);o.start(s);o.stop(s+1.15)});
  const n=ac.createBuffer(1,ac.sampleRate*.5,ac.sampleRate),d=n.getChannelData(0);
  for(let i=0;i<d.length;i++)d[i]=(Math.random()*2-1)*(1-i/d.length);
  const b=ac.createBufferSource();b.buffer=n;b.connect(g);b.start(s);
}
function mistTex(){
  const c=document.createElement('canvas');c.width=c.height=64;const x=c.getContext('2d'),r=x.createRadialGradient(32,32,0,32,32,32);
  r.addColorStop(0,'rgba(255,255,255,1)');r.addColorStop(1,'rgba(255,255,255,0)');x.fillStyle=r;x.fillRect(0,0,64,64);
  return new THREE.CanvasTexture(c);
}
function weather(S,kind){
  const N={rain:700,snow:500,fireflies:70,mist:60,dust:160,embers:90}[kind];
  if(!N)return null;
  const rain=kind==='rain',Rr=14,Hh=10,pos=new Float32Array(N*(rain?6:3));
  const sd=Array.from({length:N},()=>[Math.random()*2*Rr-Rr,Math.random()*Hh,Math.random()*2*Rr-Rr,.6+Math.random()]);
  const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.BufferAttribute(pos,3));
  const o=rain?new THREE.LineSegments(g,new THREE.LineBasicMaterial({color:0xaec6ff,transparent:true,opacity:.5})):
    new THREE.Points(g,new THREE.PointsMaterial({color:{snow:0xffffff,mist:0xb8c4cc,dust:0xd9cfb8,embers:0xff7a2a}[kind]||0xffe27a,size:{snow:.14,mist:3.6,dust:.07,embers:.11}[kind]||.2,transparent:true,opacity:kind==='mist'?.16:kind==='dust'?.5:.9,depthWrite:false,map:kind==='mist'?mistTex():null}));
  o.frustumCulled=false;S.add(o);
  return t=>{
    for(let i=0;i<N;i++){
      const [x,y,z,v]=sd[i];
      if(rain){const yy=((y-t*16*v)%Hh+Hh)%Hh,j=i*6;pos[j]=x;pos[j+1]=yy;pos[j+2]=z;pos[j+3]=x-.05;pos[j+4]=yy+.6;pos[j+5]=z}
      else if(kind==='snow'){const j=i*3;pos[j]=x+Math.sin(t*.8+i)*.5;pos[j+1]=((y-t*1.3*v)%Hh+Hh)%Hh;pos[j+2]=z+Math.cos(t*.6+i)*.4}
      else if(kind==='dust'){const j=i*3;pos[j]=x+Math.sin(t*.2*v+i)*.8;pos[j+1]=.3+Math.abs((y*.8+Math.sin(t*.3*v+i)*.6)%8);pos[j+2]=z+Math.cos(t*.17*v+i)*.8}
      else if(kind==='embers'){const j=i*3;pos[j]=x+Math.sin(t*.9*v+i)*.7;pos[j+1]=(y+t*.9*v)%Hh;pos[j+2]=z+Math.cos(t*.7*v+i)*.7}
      else if(kind==='mist'){const j=i*3;pos[j]=x+Math.sin(t*.15*v+i)*2;pos[j+1]=.2+y*.08;pos[j+2]=z+Math.cos(t*.12*v+i)*2}
      else{const j=i*3;pos[j]=x+Math.sin(t*.5*v+i)*1.3;pos[j+1]=.4+y*.25+Math.sin(t*v+i)*.4;pos[j+2]=z+Math.cos(t*.4*v+i)*1.3}
    }
    g.attributes.position.needsUpdate=true;
  };
}

/* ---------- Render y grabación ---------- */
function spec333(){
  const D=+cfg.dur||30,d2=Math.max(8,Math.round(D*.42)),d1=Math.max(6,D-d2),walk=Math.min(5,d2-3.5);
  const w=(shape,color,pos,scale,x)=>Object.assign({shape,color,pos,scale},x),she={asset:'person',id:'she',color:'#c9d3e6',color2:'#9aa6bf',scale:.9};
  const room=[w('plane','#2b2420',[0,0,2],[10,12,1],{rot:[-90,0,0]}),w('box','#3a3230',[0,2,-2],[10,4,.2]),w('box','#322b29',[-5,2,2],[.2,4,12]),w('box','#322b29',[5,2,2],[.2,4,12]),
    w('box','#9fb8ff',[-4.88,2.3,.5],[.05,1.6,1.2],{glow:1.4}),w('box','#1c1715',[-2.8,1.1,-1.88],[1,2.2,.05]),w('box','#241e1c',[3.6,1.4,-1.5],[1.2,2.8,.8]),w('box','#4a3b36',[1.8,.4,-1.2],[.7,.8,.6]),{asset:'bed',pos:[0,0,0]}];
  const cam={from:[0,2.7,6.3],to:[0,2.7,6.3],look:[0,.9,0],fov:55},
    base={weather:'none',background:'#05070a',fog:{color:'#05070a',near:7,far:24},ambient:.14,sun:{color:'#8fa8ff',intensity:.05,pos:[-4,6,2]},
      lights:[{type:'point',color:'#a8bfff',pos:[-3.6,3,.5],intensity:1.2},{type:'point',color:'#ffffff',pos:[0,2.5,5.5],intensity:.6}]};
  return{title:'3:33 AM',look:'nightcam',music:'none',scenes:[
    {...base,objects:[...room,{...she,id:undefined,pos:[0,.88,.6],rot:[-90,0,0],act:'idle'},w('box','#3c4d6e',[0,1,.55],[2,.28,1.9],{anim:'float',speed:.5})],shots:[{dur:d1,camera:cam,transition:'cut'}]},
    {...base,objects:[...room,w('box','#3c4d6e',[0,.8,.3],[1.9,.2,1.6],{rot:[0,0,12]}),w('box','#3c4d6e',[-1.2,.1,.9],[.9,.2,.7],{rot:[0,30,0]}),
      {...she,pos:[-1.5,0,.3],moves:[{t:1.5,to:[-1.5,0,.3]},{t:1.5+walk,to:[0,0,3.7]}]}],shots:[{dur:d2,camera:cam,transition:'cut'}]}]};
}
function camHud(ctx,t,cm,t33,N,bo){
  const[wh,wm]=(cfg.wake||'03:33').split(':').map(Number),tg=(wh<12?86400:0)+wh*3600+wm*60,sp=tg-84600;
  const lapse=cm==='lapse',now=new Date();let s,k=0,hot=false;
  if(lapse&&t<t33){const u=Math.min(t/t33,.9999)*N,f=u-(k=Math.min(N-1,u|0));hot=f>.96;s=hot?tg:84600+f*sp}
  else if(lapse){k=N-1;s=tg+(t-t33);hot=true}
  else s=now.getHours()*3600+now.getMinutes()*60+now.getSeconds()+t;
  const dt=new Date(now.getTime()-(lapse?N-k:0)*864e5+(s>=86400?864e5:0)),h=(s/3600|0)%24,z=n=>String(n).padStart(2,'0');
  const clock=z(h%12||12)+':'+z(s/60%60|0)+':'+z(s%60|0)+(h<12?' AM':' PM'),date=z(dt.getDate())+'/'+z(dt.getMonth()+1)+'/'+dt.getFullYear();
  ctx.font='600 28px ui-monospace,Menlo,monospace';ctx.textBaseline='top';ctx.lineWidth=4;ctx.strokeStyle='rgba(0,0,0,.8)';
  const put=(str,x,y,al,col)=>{ctx.textAlign=al;ctx.strokeText(str,x,y);ctx.fillStyle=col||'#fff';ctx.fillText(str,x,y)};
  put('CAM 01 · DORMITORIO',40,34+bo,'left');put(clock,1240,34+bo,'right',hot?'#ff4040':'#fff');put(date,1240,70+bo,'right');
  if((t*1.2|0)%2===0){ctx.fillStyle='#ff2020';ctx.beginPath();ctx.arc(52,92+bo,9,0,6.3);ctx.fill()}put('REC',72,78+bo,'left','#ff5050');
  if(lapse){put(t<t33?'▶▶ x'+Math.round(sp/(t33/N)/100)*100:'▶ x1',40,650-bo,'left');put('NOCHE '+(k+1)+'/'+N,1240,650-bo,'right')}
}
const MDL={},MCL={},MDLS={sas:{u:'modelos/sas_cs2_red.glb',h:1.8}};
function loadModels(){return Promise.all(Object.keys(MDLS).map(k=>new Promise(res=>{try{new THREE.GLTFLoader().load(MDLS[k].u,g=>{const root=new THREE.Group(),sc=g.scene;const sz=new THREE.Box3().setFromObject(sc).getSize(new THREE.Vector3());sc.scale.setScalar(MDLS[k].h/Math.max(sz.y,1e-3));sc.updateMatrixWorld(true);const b2=new THREE.Box3().setFromObject(sc),c=b2.getCenter(new THREE.Vector3());sc.position.set(-c.x,-b2.min.y,-c.z);root.add(sc);MDL[k]=root;MCL[k]=g.animations||[];res()},undefined,()=>res())}catch(e){res()}})))}
const MODLOAD=loadModels();
function mdlClone(o){const m=THREE.SkeletonUtils.clone(MDL[o.asset]);m.traverse(q=>{if(q.isMesh){q.castShadow=true;q.receiveShadow=true}});if(MCL[o.asset]&&MCL[o.asset].length)m.userData.clip=MCL[o.asset][0];return m}
function render(spec){return MODLOAD.then(()=>renderCore(spec))}
function renderCore(spec){
  return new Promise((res,rej)=>{
    if(!window.MediaRecorder)return rej(new Error('Tu navegador no puede grabar video. Prueba con Chrome, Edge o Firefox.'));
    if(cfg.stalk!=='off'||GORE()!=='off'||cfg.gx!=='off'||cfg.gy!=='off'||cfg.eyes!=='off'||(cfg.life!=='off'&&lifeDark())){spec=JSON.parse(JSON.stringify(spec));
      (spec.scenes?spec.scenes.map(x=>x.objects||(x.objects=[])):[spec.objects||(spec.objects=[])]).forEach((a,i)=>{const d=i%2?9:-9;if(cfg.life!=='off'&&lifeDark())for(let j=0;j<3;j++)a.push({asset:'bat',pos:[3+j*1.6,4+j*.7,-1+j],anim:'orbit',speed:.45+j*.2,scale:1.1});if(cfg.stalk!=='off')a.push({asset:cfg.stalk,pos:[d,0,-9],path:[[d,0,-9],[d/3,0,-4]],face:true,scale:1.3});
        if(GORE()!=='off'){let z=i*7919+123457;const R=()=>(z=(z*16807)%2147483647)/2147483647,n=GORE()==='lots'?14:6;
          for(let j=0;j<n;j++)a.push({asset:'puddle',pos:[R()*30-15,0,R()*25-10],scale:.7+R()*1.3,rot:[0,R()*360,0]});
          for(let j=0;j<(n>6?9:4);j++)a.push({asset:'viscera',pos:[R()*25-12,0,R()*20-10],scale:.8+R()*.6,rot:[0,R()*360,0]});
          for(let j=0;j<(n>6?4:2);j++)a.push({asset:'carcass',pos:[R()*25-12,0,R()*20-10],rot:[0,R()*360,0]});
          for(let j=0;j<(n>6?3:1);j++)a.push({asset:'hanged',pos:[R()*20-10,0,R()*15-10],rot:[0,R()*360,0]});
          for(let j=0;j<(n>6?2:1);j++)a.push({asset:'wreck',pos:[R()*30-15,0,R()*26-13],rot:[0,R()*360,0]});
          if(n>3)a.push({asset:'field',pos:[R()*20-10,0,R()*16-12],rot:[0,R()*40-20,0]});
          if(n>6)a.push({asset:'barn',pos:[R()*20-10,0,R()*20-16],rot:[0,R()*360,0]});
          for(let j=0;j<(n>3?3:1);j++)a.push({asset:'limb',pos:[R()*30-15,0,R()*26-13],rot:[0,R()*360,0],scale:.9+R()*.4});
          for(let j=0;j<(n>3?2:1);j++)a.push({asset:'head',pos:[R()*30-15,0,R()*26-13],rot:[0,R()*360,0],scale:.9+R()*.3});
          for(let j=0;j<(n>3?2:1);j++)a.push({asset:'trail',pos:[R()*20-10,0,R()*15-12],rot:[0,R()*200-100,0],scale:1})}
        if(cfg.gx!=='off'){let z=i*6247+777331;const R=()=>(z=(z*16807)%2147483647)/2147483647,all=cfg.gx==='all';
          for(let j=0;j<(all?7:3);j++){const x=R()*12-6,w=R()*9-4;
            a.push({asset:'puddle',pos:[x,0,w],scale:2+R()*1.6,rot:[0,R()*360,0]});
            a.push({asset:'person',pos:[x,.25,w],rot:[90,R()*360,0],scale:.95})}
          for(let j=0;j<(all?10:5);j++)a.push({asset:'puddle',pos:[R()*14-7,0,R()*11-5],scale:1+R()*2,rot:[0,R()*360,0]});
          for(let j=0;j<(all?5:2);j++)a.push({asset:'trail',pos:[R()*10-5,0,R()*8-5],rot:[0,R()*360,0],scale:1.3})}
        if(cfg.gy!=='off'){let z=i*9173+424243;const R=()=>(z=(z*16807)%2147483647)/2147483647,all=cfg.gy==='all';
          for(let j=0;j<(all?4:2);j++)a.push({asset:'skeleton',pos:[R()*12-6,.2,R()*9-4],rot:[90,R()*360,0],scale:.9});
          for(let j=0;j<(all?26:12);j++){const w=.18+R()*.35;a.push({shape:'sphere',color:R()>.5?'#6b0a0a':'#8a1414',pos:[R()*12-6,w*.3,R()*9-4],scale:[w*1.4,w*.7,w],rot:[0,R()*360,0],nz:.5})}}
        if(cfg.eyes!=='off'){let z=i*104729+99991;const R=()=>(z=(z*16807)%2147483647)/2147483647,n=cfg.eyes==='lots'?7:3;
          for(let j=0;j<n;j++){const x=R()*16-8,y=.9+R()*2,zz=-6-R()*4,c=R()<.7?'#ff2a2a':'#ffd24d',sp=.4+R()*.5;
            [-.14,.14].forEach(dx=>a.push({shape:'sphere',color:c,pos:[x+dx,y,zz],scale:[.1,.07,.07],glow:3,anim:'pulse',speed:sp}))}}})}
    let pl;try{pl=plan(spec)}catch(e){return rej(e)}
    const cv=$('#gl'),k=cfg.res==='1080'?1.5:1,W=1280*k,H=720*k,fps=+cfg.fps||30,ctx=cv.getContext('2d');
    const pick=(v,x,L,fb)=>v==='auto'?(L.includes(x)?x:fb):v;
    const CR=cfg.cred&&cfg.frz==='off'?6:0,T=pl.total+CR,gd=P[cfg.prov].llm?(GEN[cfg.genre]||{}):{};
    const mood=pick(cfg.music,spec.music,Object.keys(MU),gd.music||'calm'),lk=LOOKS[pick(cfg.look,spec.look,Object.keys(LOOKS),gd.look||'natural')]||{};
    const wx=cfg.fx==='auto'?(spec.scenes||[]).map(x=>x&&x.weather).find(w=>w&&w!=='none'):cfg.fx;
    const amb=cfg.amb==='auto'?({rain:'rain',snow:'wind',fireflies:'night',mist:'wind'}[wx]||'none'):cfg.amb;
    const sc0=cfg.scare==='end'?pl.total-1.4:cfg.scare==='mid'?pl.total*.55:-1,sa=t=>sc0>=0&&t>=sc0&&t<sc0+.6?1-(t-sc0)/.6:0,fl={soft:.35,hard:.8}[cfg.flick]||0,fz=cfg.frz==='off'?-1:pl.total-(+cfg.frz),cm=cfg.tpl!=='off'?'lapse':cfg.cam,N=+cfg.nights||1,t33=pl.blocks.length>1?pl.blocks[1].t0:pl.total*.6,
      bt=sc0>=0?sc0+.1:pl.total*.6,bl=(cfg.lensblood||(cfg.genre==='horror'&&GORE()==='lots'))?Array.from({length:16},()=>({x:Math.random()*W,y:Math.random()*H*.8,r:(12+Math.random()*50)*k})):null;
    cv.width=W;cv.height=H;
    const bkT=cfg.blackout==='twice'?[pl.total*.35,pl.total*.7]:cfg.blackout==='mid'?[pl.total*.45]:[],bkf=bkT.length?t=>bkT.some(a=>t>=a&&t<a+1.6&&!(t>a+.5&&t<a+.65)):null,hbT=[],pxc=document.createElement('canvas'),nzc=document.createElement('canvas'),stT=(cfg.stat==='many'?[.12,.27,.43,.6,.78,.92]:cfg.stat==='some'?[.3,.66]:[]).map(x=>x*pl.total),sbT=(cfg.subl?[.2,.47,.78]:[]).map(x=>x*pl.total);
    pxc.width=320;pxc.height=180;nzc.width=nzc.height=128;{const c=nzc.getContext('2d'),d=c.createImageData(128,128);for(let i=0;i<d.data.length;i+=4){d.data[i]=d.data[i+1]=d.data[i+2]=Math.random()*255;d.data[i+3]=255}c.putImageData(d,0,0)}
    const nzp=ctx.createPattern(nzc,'repeat');
    if(cfg.hbvig||cfg.heart)for(let q=0;q<T;){const g=1-.5*q/T;hbT.push(q,q+.28*g);q+=g}
    const gc=document.createElement('canvas');gc.width=W;gc.height=H;
    const ac2=document.createElement('canvas');ac2.width=W;ac2.height=H;const actx=ac2.getContext('2d');
    const bh=cfg.bars==='none'?0:Math.max(0,Math.round((H-W/+cfg.bars)/2));
    let vg=null,gp=null;
    if(cfg.vig){vg=ctx.createRadialGradient(W/2,H/2,H*.35,W/2,H/2,H*.95);vg.addColorStop(0,'rgba(0,0,0,0)');vg.addColorStop(1,'rgba(0,0,0,.6)')}
    if(cfg.grain){const n=document.createElement('canvas');n.width=n.height=256;const nc=n.getContext('2d'),id=nc.createImageData(256,256);for(let i=0;i<id.data.length;i+=4){id.data[i]=id.data[i+1]=id.data[i+2]=Math.random()*255;id.data[i+3]=255}nc.putImageData(id,0,0);gp=ctx.createPattern(n,'repeat')}
    function finish(si,t){
      actx.globalAlpha=cfg.blur?.45:1;actx.drawImage(gc,0,0);actx.globalAlpha=1;
      ctx.filter=VF[cfg.view]||lk.f||'none';ctx.drawImage(ac2,0,0);ctx.filter='none';
      if(lk.t){ctx.globalCompositeOperation='overlay';ctx.globalAlpha=lk.t[1];ctx.fillStyle=lk.t[0];ctx.fillRect(0,0,W,H);ctx.globalAlpha=1;ctx.globalCompositeOperation='source-over'}
      if(cfg.vhs){ctx.fillStyle='rgba(0,0,0,.16)';for(let y=0;y<H;y+=4)ctx.fillRect(0,y,W,2);
        if(Math.random()<.12){const y=Math.random()*H|0,h=6+Math.random()*50|0;ctx.drawImage(cv,0,y,W,h,(Math.random()-.5)*60,y,W,h)}}
      const q=sa(t);if(q){ctx.fillStyle=q>.85?'#fff':'#a00000';ctx.globalAlpha=Math.min(1,q*.9);ctx.fillRect(0,0,W,H);ctx.globalAlpha=1}
      if(bl&&t>=bt){const u=t-bt,fa=Math.min(1,u/.12,Math.max(0,T-t));
        bl.forEach(b=>{ctx.globalAlpha=fa*.9;const g=ctx.createRadialGradient(b.x,b.y,0,b.x,b.y,b.r);
          g.addColorStop(0,'rgba(150,6,6,1)');g.addColorStop(.7,'rgba(120,0,0,.95)');g.addColorStop(1,'rgba(90,0,0,0)');
          ctx.fillStyle=g;ctx.beginPath();ctx.arc(b.x,b.y,b.r,0,6.3);ctx.fill();
          if(b.r>25*k){const L=Math.min(u*22*k*(b.r/40),160*k);ctx.fillStyle='rgba(120,0,0,.9)';ctx.fillRect(b.x-b.r*.12,b.y,b.r*.24,L);ctx.beginPath();ctx.arc(b.x,b.y+L,b.r*.18,0,6.3);ctx.fill()}});
        ctx.globalAlpha=1}
      if(cfg.view==='webcam'){pxc.getContext('2d').drawImage(cv,0,0,320,180);ctx.imageSmoothingEnabled=false;ctx.drawImage(pxc,0,0,W,H);ctx.imageSmoothingEnabled=true;ctx.fillStyle='rgba(40,90,50,.12)';ctx.fillRect(0,0,W,H)}
      if(cfg.view==='peep'){ctx.fillStyle='#000';ctx.beginPath();ctx.rect(0,0,W,H);ctx.arc(W/2,H/2,H*.47,0,6.3,true);ctx.fill()}
      if(cfg.view==='silent'){ctx.fillStyle='rgba(255,255,255,'+(.03+Math.random()*.05)+')';ctx.fillRect(0,0,W,H);ctx.fillStyle='rgba(255,255,255,.35)';for(let i=0;i<3;i++)if(Math.random()<.5)ctx.fillRect(Math.random()*W,0,1.5*k,H);ctx.fillStyle='rgba(0,0,0,.5)';for(let i=0;i<6;i++){ctx.beginPath();ctx.arc(Math.random()*W,Math.random()*H,Math.random()*3*k,0,6.3);ctx.fill()}}
      if(['cam','thermal','webcam'].includes(cfg.view)){ctx.save();ctx.scale(k,k);viewHud(ctx,t,T,sc0);ctx.restore()}
      if(stT.some(a=>t>=a&&t<a+.3)){ctx.save();ctx.globalAlpha=.85;ctx.translate(Math.random()*128|0,Math.random()*128|0);ctx.fillStyle=nzp;ctx.fillRect(-128,-128,W+128,H+128);ctx.restore()}
      if(sbT.some(a=>t>=a&&t<a+.07)){ctx.globalCompositeOperation='difference';ctx.fillStyle='#fff';ctx.fillRect(0,0,W,H);ctx.globalCompositeOperation='source-over'}
      if(cfg.sanity){const u=Math.min(t/T,1);if(Math.random()<.03+.4*u*u){const y=Math.random()*H|0,h=8+Math.random()*80*u|0;ctx.drawImage(cv,0,y,W,h,(Math.random()-.5)*(30+120*u),y,W,h)}if(u>.5&&Math.random()<.04){ctx.fillStyle='rgba(255,0,0,.08)';ctx.fillRect(0,0,W,H)}}
      if(cfg.hbvig){let a=0;for(const b of hbT){const d=t-b;if(d>=0&&d<.35)a=Math.max(a,1-d/.35)}
        if(a>0){const g=ctx.createRadialGradient(W/2,H/2,H*.3,W/2,H/2,H*.9);g.addColorStop(0,'rgba(120,0,0,0)');g.addColorStop(1,'rgba(150,0,0,'+.55*a*(.4+.6*t/T)+')');ctx.fillStyle=g;ctx.fillRect(0,0,W,H)}}
      if(cfg.pov!=='off'&&cfg.povhands){const bo=Math.sin(t*(cfg.povbob==='run'?11:7.5))*H*.012;ctx.save();ctx.translate(W*.8,H*.9+bo);ctx.rotate(-.3);
        ctx.fillStyle='#0d0b09';ctx.fillRect(-W*.013,-H*.32,W*.026,H*.36);ctx.fillStyle='#1c1814';ctx.fillRect(-W*.02,-H*.34,W*.04,H*.05);
        ctx.fillStyle='#2b231d';ctx.beginPath();ctx.ellipse(0,0,W*.032,H*.08,0,0,6.3);ctx.fill();ctx.restore()}
      if(vg){ctx.fillStyle=vg;ctx.fillRect(0,0,W,H)}
      if(gp){ctx.save();ctx.translate(Math.random()*256|0,Math.random()*256|0);ctx.globalCompositeOperation='overlay';ctx.globalAlpha=.12;ctx.fillStyle=gp;ctx.fillRect(-256,-256,W+256,H+256);ctx.restore()}
      if(bh){ctx.fillStyle='#000';ctx.fillRect(0,0,W,bh);ctx.fillRect(0,H-bh,W,bh)}
      ctx.save();ctx.scale(k,k);overlay(ctx,1280,720,pl,si,t,bh/k);ctx.restore();
      if(cm!=='off'){ctx.save();ctx.scale(k,k);camHud(ctx,t,cm,t33,N,bh/k);ctx.restore()}
      if(CR&&t>=pl.total){ctx.save();ctx.scale(k,k);creditsRoll(ctx,1280,720,pl.title,cfg.dir,mood!=='none',Math.min((t-pl.total)/CR,1));ctx.restore()}
    }
    let R;
    try{R=new THREE.WebGLRenderer({canvas:gc,antialias:true,preserveDrawingBuffer:true})}
    catch(e){return rej(new Error('Tu navegador no puede usar gráficos 3D (WebGL).'))}
    R.setSize(W,H,false);
    R.shadowMap.enabled=true;R.shadowMap.type=THREE.PCFSoftShadowMap;R.outputEncoding=THREE.sRGBEncoding;R.toneMapping=THREE.ACESFilmicToneMapping;R.toneMappingExposure=1.15;
    const cam=new THREE.PerspectiveCamera(45,W/H,.1,300);
    const st=cv.captureStream(fps),AU=window.AudioContext||window.webkitAudioContext;let AC=null;
    if(AU&&(cfg.atk||(mood!=='none'&&+cfg.vol>0)||amb!=='none'||cfg.heart||sc0>=0||bl||cfg.steps!=='off'||cfg.whisp!=='off'||fz>=0||cfg.creak!=='off'||cfg.breath||cfg.tick||cfg.riser||cfg.hbvig||cfg.pov==='live'||cfg.musicbox||cfg.knock||cfg.drone!=='off'||stT.length||bkT.length)){
      try{AC=new AU();if(cfg.pov==='live')AC.suspend();else AC.resume();const dd=AC.createMediaStreamDestination(),dst=AC.createGain(),A0=AC.currentTime+.1;dst.connect(dd);LV.ac=AC;LV.dst=dst;
      if(fz>=0){dst.gain.setValueAtTime(1,A0+fz);dst.gain.setValueAtTime(0,A0+fz+.02);
        if(cfg.fzs==='tone'){const o=AC.createOscillator(),g=AC.createGain();o.frequency.value=1000;g.gain.setValueAtTime(0,A0+fz);g.gain.setValueAtTime(.06,A0+fz+.03);o.connect(g);g.connect(dd);o.start(A0+fz);o.stop(A0+T+.2)}}
      score(AC,dst,mood,T,cfg.vol/100*.8);ambience(AC,dst,amb,T,.3);if(cfg.heart||cfg.hbvig)heart(AC,dst,T,.5);if(sc0>=0)sting(AC,dst,sc0,.6);if(bl)splat(AC,dst,bt,.9);if(cfg.steps!=='off')steps(AC,dst,cfg.steps,T,.5);if(cfg.whisp!=='off')whispers(AC,dst,cfg.whisp,T,cfg.whisp==='close'?.35:.16);if(cfg.creak!=='off')creaks(AC,dst,cfg.creak,T,.18);if(cfg.breath)breath(AC,dst,T,.3);if(cfg.tick)tick(AC,dst,T,.25);if(cfg.riser)riser(AC,dst,sc0>=0?sc0:T*.9,.14);if(cfg.musicbox)musicbox(AC,dst,T,.12);if(cfg.knock)[.25,.55].forEach(a=>knock(AC,dst,T*a,.5));if(cfg.drone!=='off')droneSnd(AC,dst,cfg.drone,T,cfg.drone==='hum'?.07:.015);stT.forEach(a=>staticSnd(AC,dst,a,.3));bkT.forEach(a=>thud(AC,dst,a,.9));if(cfg.hush&&sc0>=0){const A=AC.currentTime+.1;dst.gain.setValueAtTime(1,A+Math.max(0,sc0-2.6));dst.gain.linearRampToValueAtTime(.05,A+Math.max(.1,sc0-2.2));dst.gain.setValueAtTime(1,A+sc0-.01)}st.addTrack(dd.stream.getAudioTracks()[0])}catch(e){AC=null}
    }
    const mt=['video/webm;codecs=vp9,opus','video/webm;codecs=vp8,opus','video/webm','video/mp4'].find(t=>MediaRecorder.isTypeSupported(t))||'',vb=k>1?12e6:6e6;
    const rec=new MediaRecorder(st,mt?{mimeType:mt,videoBitsPerSecond:vb}:{videoBitsPerSecond:vb}),parts=[];
    let err=null;
    rec.ondataavailable=e=>e.data.size&&parts.push(e.data);
    rec.onstop=()=>{
      pl.blocks.forEach(b=>b.sc.S.traverse(o=>{if(o.geometry)o.geometry.dispose();if(o.material)o.material.dispose()}));
      R.dispose();try{R.forceContextLoss()}catch(e){}
      LV.ac=null;LV.on=false;LV.act=false;$('#lvstop').hidden=true;stage.style.touchAction='';if(AC)try{AC.close()}catch(e){}
      if(err)return rej(err);
      res({url:URL.createObjectURL(new Blob(parts,{type:mt||'video/webm'})),ext:mt.includes('mp4')?'mp4':'webm'});
    };
    show('gl');const LIVE=cfg.pov==='live';if(!LIVE)rec.start();
    let t0=performance.now()+(LIVE?3000:0),started=!LIVE;const sh=pl.shots;let si=0,fzn=false;
    if(LIVE){Object.assign(LV,{blk:null,stop:false,last:0,k:{},st:null,t:null,m:null,ph:0,act:true,on:false});stage.style.touchAction='none'}
    (function loop(){
      try{
        const t=(performance.now()-t0)/1000;
        if(LIVE&&!started){if(t<0)say('Prepárate… empieza en '+Math.ceil(-t)+LVH);else{started=true;rec.start();LV.on=true;LV.stop=false;LV.last=0;if(AC)AC.resume();$('#lvstop').hidden=false}}
        if(LIVE&&started&&LV.stop){rec.stop();return}
        if(fz>=0&&t>=fz){fzn=!fzn;ctx.fillStyle=fzn?'#010101':'#000';ctx.fillRect(0,0,1,1);prog(Math.min(t/T,1));if(t>=T)rec.stop();else requestAnimationFrame(loop);return}
        while(si<sh.length-1&&t>=sh[si+1].t0)si++;
        const s=sh[si],b=s.b,ts=Math.min(Math.max(t-s.t0,0),s.d),tb=Math.max(t-b.t0,0);
        if(LIVE&&b!==LV.blk){LV.blk=b;LV.x=0;LV.z=8;LV.yaw=Math.PI;LV.pitch=0}
        b.sc.items.forEach(it=>pose(it,tb,b.dur));
        if(b.sc.fx)b.sc.fx(tb);
        if(cfg.thick&&b.sc.S.fog&&b.sc.S.fog.near!==undefined){const fg=b.sc.S.fog,u=Math.min(t/pl.total,1);
          if(fg.n0===undefined){fg.n0=fg.near;fg.f0=fg.far}fg.near=fg.n0*(1-.7*u);fg.far=Math.max(fg.near+2,fg.f0*(1-.55*u))}
        if(fl||bkf||cfg.life!=='off'){const f=(bkf&&bkf(t)?0:1)*Math.max(.05,1-fl*Math.max(0,Math.sin(t*23)*Math.sin(t*7.1)+Math.sin(t*3.3)*.5-.35)*2);
          b.sc.S.traverse(o=>{if(o.isLight&&!o.userData.keep&&(!o.isAmbientLight||bkf)){if(o.userData.i0===undefined)o.userData.i0=o.intensity;o.intensity=o.userData.i0*f*(cfg.life!=='off'&&o.isPointLight?1+(cfg.life==='strong'?.09:.06)*Math.sin(t*11+o.id)+.04*Math.sin(t*23.7+o.id*2):1)}})}
        PT=t;PD=pl.total;aim(cam,s.cam,ts,s.d,b.sc.ids);CAMV.copy(cam.position);cam.getWorldDirection(CAMF);
        if(cfg.zoom!=='off'||cfg.tilt!=='off'){const u=Math.min(t/pl.total,1);
          if(cfg.zoom==='in')cam.fov=Math.max(18,cam.fov*(1-.35*u));if(cfg.zoom==='out')cam.fov=Math.min(90,cam.fov*(1+.35*u));
          cam.updateProjectionMatrix();cam.rotateZ({soft:.1,hard:.26,grow:.3*u}[cfg.tilt]||0)}
        const q=sa(t);if(q){cam.position.x+=(Math.random()-.5)*q*.5;cam.position.y+=(Math.random()-.5)*q*.5}
        if(cfg.torch!=='off'){
          if(!b.sc.tl){const L=new THREE.SpotLight(0xffe0a6,0,40,Math.PI/6,.45,1);L.userData.keep=1;b.sc.S.add(L);b.sc.S.add(L.target);b.sc.tl=L;
            const H2=new THREE.HemisphereLight(0x8a9ac0,0x1a1410,.2);b.sc.S.add(H2)}
          const L=b.sc.tl,sw=cfg.torch==='sweep',sk=cfg.torch==='shaky',fw=new THREE.Vector3(),rt=new THREE.Vector3();
          cam.getWorldDirection(fw);rt.crossVectors(fw,new THREE.Vector3(0,1,0)).normalize();
          L.angle={narrow:Math.PI/9,normal:Math.PI/6.5,wide:Math.PI/4.5}[cfg.tsize]||Math.PI/6.5;
          L.intensity=14*(sk&&Math.sin(t*19)*Math.sin(t*5.3)>.8?.3:1);
          L.position.copy(cam.position).addScaledVector(rt,.15).addScaledVector(new THREE.Vector3(0,1,0),-.12);
          const side=sw?Math.sin(t*.7)*.8:0,jit=sk?(Math.random()-.5)*.06:0;
          L.target.position.copy(cam.position).addScaledVector(fw,12).addScaledVector(rt,side+jit);
          L.target.updateMatrixWorld();
        }
        R.render(b.sc.S,cam);
        finish(si,t);
        prog(Math.max(0,Math.min(t/T,1)));
        if(started)say('Grabando '+Math.min(Math.ceil(t),Math.round(T))+' / '+Math.round(T)+' s'+(LIVE?LVH:''));
        if(t>=T)rec.stop();else requestAnimationFrame(loop);
      }catch(e){err=e;try{rec.stop()}catch(x){rej(e)}}
    })();
  });
}

const CAN=['gemini','openrouter','groq','mistral','oai','fal','hf'];
async function fetchModels(p,key){
  const J=async r=>{if(!r.ok)throw await errText(r);return r.json()};
  if(p==='gemini'){
    let out=[],tok='';
    for(let i=0;i<5;i++){
      const d=await J(await fetch('https://generativelanguage.googleapis.com/v1beta/models?pageSize=100'+(tok?'&pageToken='+encodeURIComponent(tok):''),{headers:{'x-goog-api-key':key}}));
      out=out.concat((d.models||[]).filter(m=>(m.supportedGenerationMethods||[]).includes('generateContent')).map(m=>({id:m.name.replace('models/',''),n:m.displayName})));
      tok=d.nextPageToken;if(!tok)break;
    }
    return out;
  }
  if(p==='fal'){
    const d=await J(await fetch('https://api.fal.ai/v1/models?category=text-to-video&status=active&limit=100'));
    return(d.models||[]).map(m=>({id:m.endpoint_id,n:m.metadata&&m.metadata.display_name}));
  }
  if(p==='hf'){
    const q='https://huggingface.co/api/models?pipeline_tag=text-to-video&sort=downloads&direction=-1&limit=50';
    let d=await J(await fetch(q+'&inference_provider=hf-inference'));
    if(!d.length)d=await J(await fetch(q));
    return d.map(m=>({id:m.id}));
  }
  const base=p==='oai'?cfg.url:P[p].url;
  if(!base)throw new Error('Indica primero la URL del endpoint.');
  const d=await J(await fetch(base.replace(/\/chat\/completions\/?$/,'/models'),{headers:{Authorization:'Bearer '+key}}));
  return(d.data||[]).map(m=>({id:m.id,n:m.name,f:p==='openrouter'&&(/:free$/.test(m.id)||(m.pricing&&+m.pricing.prompt===0&&+m.pricing.completion===0))}));
}
async function loadModels(){
  const p=cfg.prov,key=cfg.keys[p]||'',btn=$('#load'),h=$('#loadH');
  if(['gemini','groq','mistral','oai'].includes(p)&&!key){h.textContent='Primero pega tu clave de API.';return}
  btn.disabled=true;h.textContent='Cargando…';
  try{
    const L=await fetchModels(p,key);
    if(p==='openrouter'&&!L.some(m=>m.id==='openrouter/free'))L.unshift({id:'openrouter/free',n:'Router de modelos gratis',f:true});
    if(!L.length)throw new Error('El servicio no devolvió modelos.');
    L.sort((x,y)=>(y.f?1:0)-(x.f?1:0)||x.id.localeCompare(y.id));
    cfg.lists[p]=L;save();drawList();
    h.textContent=L.length+' modelos encontrados. Elige uno de la lista.';
  }catch(e){h.textContent=e instanceof TypeError?'No se pudo conectar. Revisa tu clave y tu conexión.':e.message}
  finally{btn.disabled=false}
}
function drawList(){
  const p=cfg.prov,L=cfg.lists[p]||[],q=$('#mq').value.trim().toLowerCase(),free=p==='openrouter'&&$('#mfree').checked;
  const sel=$('#mlist'),cur=cfg.models[p]||'';
  $('#pick').hidden=!L.length;
  sel.innerHTML='';
  L.filter(m=>(!free||m.f)&&(m.id+' '+(m.n||'')).toLowerCase().includes(q)).slice(0,300).forEach(m=>{
    const o=document.createElement('option');
    o.value=m.id;o.textContent=(m.n&&m.n!==m.id?m.n+' ('+m.id+')':m.id)+(m.f?' (gratis)':'');
    o.selected=m.id===cur;sel.appendChild(o);
  });
}

async function run(){
  const txt=$('#prompt').value.trim(),p=cfg.prov,key=cfg.keys[p]||'',model=cfg.models[p]||P[p].model||'';
  if(!txt&&cfg.tpl==='off'){say('Escribe primero una idea para el video.');$('#prompt').focus();return}
  if(cfg.tpl==='off'&&p!=='local'&&!key){say('Falta la clave de API. Añádela en Configuración.');setMenu(true);return}
  if((cfg.tpl!=='off'||p==='local'||P[p].llm)&&!window.THREE){say('No se pudo cargar Three.js. Revisa tu conexión a internet.');return}
  const full=(S[cfg.style]||'')+txt;
  $('#go').disabled=true;$('#out').hidden=true;vid.pause();show('idle');say('Enviando…');prog(p==='local'?0:'ind');
  try{
    let url,ext='mp4';
    if(cfg.tpl!=='off'){({url,ext}=await render(spec333()))}
    else if(p==='local'){({url,ext}=await render(localSpec(txt)))}
    else if(P[p].llm){say($('#edit').checked&&last?'La IA está retocando la película…':'La IA está dirigiendo la película…');let sp=await genScene(p,txt,key,model);if(cfg.review){prog(0);say('Revisa el guion y pulsa «Grabar película».');sp=await review(sp)};({url,ext}=await render(sp));last=sp;$('#edit').disabled=false}
    else if(p==='fal')url=await genFal(full,model,key);
    else if(p==='hf')url=await genHF(full,model,key);
    else url=await genCustom(full,model,key);
    vid.src=url;show('vid');vid.play().catch(()=>{});
    const a=$('#dl');a.href=url;a.download='video-3d.'+ext;a.target='_blank';$('#out').hidden=false;
  }catch(e){
    show('idle');
    say(e instanceof TypeError?'No se pudo conectar con el servicio. Revisa tu conexión y tu clave; algunos servicios bloquean llamadas desde el navegador (CORS). Prueba otro motor.':e.message);
  }finally{$('#go').disabled=false;prog(0)}
}
$('#go').onclick=run;
/* ---------- Automático total: la IA decide todos los ajustes ---------- */
const AK=['genre','look','music','tod','fx','amb','trans','hand','lens','bars','fps','flick','scare','stalk','gore','eyes','steps','whisp','torch','pov','beast','life','htheme','hend','hbeat','hext','hthr','hvic','hshow','gx','gy','cmode','view','stat','card','drone','creak','blackout','zoom','tilt','povlook','povbob','tsize'],AB=['heart','vhs','lensblood','breath','tick','thick','subl','endc','musicbox','knock','hush','riser','hbvig','sanity','rtitle','povhands','vig','grain'];
const aopt=k=>[...$('#'+k).options].map(o=>o.value).filter(v=>v!=='auto'&&v!=='live');
const autoSys=()=>`Eres el director de un estudio de cine de terror 3D. Con la idea del usuario decide TÚ todos los ajustes para que la película dé el mayor miedo posible: nadie más elegirá nada. Responde SOLO con JSON válido, sin texto adicional:
{"dur":número entre 20 y 45,${AK.map(k=>'"'+k+'":"valor"').join(',')},${AB.map(k=>'"'+k+'":true|false').join(',')},"why":"una frase"}
VALORES PERMITIDOS (usa solo estos):
${AK.map(k=>k+': '+aopt(k).join('|')).join('\n')}
CRITERIOS: elige "stalk" según la criatura de la idea; "pov":"on" solo si pide primera persona o exploración; usa "off" en lo que no aporte; combina luz, sonido, cámara y criaturas con coherencia y un solo tono de miedo; "beast":"both" salvo que la idea pida otra cosa. Usa TODAS las herramientas que sumen miedo (criatura, luz, cámara, sonido, imagen, apagón, tarjetas) y apaga las que contradigan el tono. en terror usa siempre gx en some y lensblood; hext en bloody o macabre; gy solo si la idea pide sangre o violencia.
RECETAS (combina una, no mezcles tonos):
- Casa embrujada: look cold, tod night, fx mist, amb wind, music mystery, musicbox true, creak rare, flick soft, stalk ghost o doll, whisp far, thick true, tilt soft, bars 2.39, htheme house.
- Persecución o slasher: look horror, fx rain, amb rain, hand handheld, lens wide, steps near, heart true, stalk monster o clown, scare mid, hbeat fast, trans cut.
- Metraje encontrado: view cam o webcam, stat some, card found, endc true, vhs true, hand handheld, torch shaky, music none, knock true.
- Primera persona: pov on, povlook glance, torch shaky, hush y riser true, blackout mid, sanity true, eyes few, breath true.
- Ritual o culto: hthr cult, hext macabre, stalk skeleton o monster, look horror, fx mist, drone hum, htheme cemetery.
- Infección: hthr infect, stalk zombie, steps near, whisp close, hvic group o mass.
- Posesión o psicológico: hthr possess, stalk doll, tilt grow, zoom in, sanity true, music none, drone tinnitus, hend twist, hshow off.
- Bosque o campo: htheme forest, stalk slender o scarecrow, fx mist, eyes few, steps slow, thick true.
- Laboratorio: htheme lab, hthr exper, stalk monster o spider, flick hard, drone hum.
- Vigilancia: cmode ceiling, view cam, stat many, tick true.`;
function applyAuto(a){
  Object.assign(cfg,HB,{eyes:'off',creak:'off',breath:false,tick:false,thick:false,zoom:'off',tilt:'off',vig:true,grain:true});
  AK.forEach(k=>{if(typeof a[k]==='string'&&aopt(k).includes(a[k]))cfg[k]=a[k]});
  AB.forEach(k=>{if(typeof a[k]==='boolean')cfg[k]=a[k]});
  cfg.dur=Math.min(60,Math.max(10,Math.round(+a.dur)||30));
  if(!cfg.genre||cfg.genre==='none')cfg.genre='horror';
  if(cfg.pov==='on')Object.assign(cfg,{povhands:true,hush:true,riser:true,hbvig:true});
}
function autoLocal(t){
  const x=t.toLowerCase(),has=r=>r.test(x),key=has(/c[aá]mara|grabaci[oó]n|metraje|found|casero/)?'found':has(/primera persona|explor|recorr/)?'pov':has(/asesin|cuchill|sangre|matar|slasher|psic[oó]pata/)?'slasher':'gothic';
  Object.assign(cfg,PRE[key]);
  const m=[[/payas/,'clown'],[/mu[nñ]eca/,'doll'],[/ara[nñ]a/,'spider'],[/esquelet/,'skeleton'],[/hombre alto|sin rostro|slender/,'slender'],[/zomb/,'zombie'],[/espantap/,'scarecrow'],[/fantasma|esp[ií]ritu/,'ghost'],[/monstruo|bestia|demonio|criatura/,'monster']].find(a=>a[0].test(x));
  if(m)cfg.stalk=m[1];
  const th=[[/bosque|selva/,'forest'],[/cementerio|tumba/,'cemetery'],[/carretera|autopista|coche/,'road'],[/laboratorio|experimento/,'lab'],[/casa|mansi[oó]n|dormitorio|habitaci[oó]n/,'house']].find(a=>a[0].test(x));
  if(th)cfg.htheme=th[1];
  if(has(/ritual|culto|secta/))Object.assign(cfg,{hthr:'cult',hext:'macabre',drone:'hum'});
  if(has(/infecci|virus|contagio|apocalipsis/))Object.assign(cfg,{hthr:'infect',stalk:'zombie',whisp:'close'});
  if(has(/pose[ií]d|exorcis/))Object.assign(cfg,{hthr:'possess',stalk:'doll',tilt:'grow',drone:'tinnitus',sanity:true});
  if(has(/experimento|laboratorio/))Object.assign(cfg,{hthr:'exper',flick:'hard',drone:'hum'});
}
async function runAuto(){
  const txt=$('#prompt').value.trim(),p=cfg.prov,key=cfg.keys[p]||'',model=cfg.models[p]||P[p].model||'',B=[$('#go'),$('#auto')];
  if(!txt){say('Escribe primero una idea para el video.');$('#prompt').focus();return}
  if(P[p].llm&&!key){say('Falta la clave de API. Añádela en Configuración.');setMenu(true);return}
  B.forEach(b=>b.disabled=true);
  try{
    if(P[p].llm){prog('ind');say('La IA está decidiendo todos los ajustes…');try{applyAuto(parseJ(await ask(p,key,model,autoSys(),txt)))}catch(e){autoLocal(txt)}}
    else if(p==='local')autoLocal(txt);
    Object.assign(cfg,{tpl:'off',review:false,story:true});$('#edit').checked=false;save();fill();
    B[0].disabled=false;await run();
  }finally{B.forEach(b=>b.disabled=false);prog(0)}
}
$('#auto').onclick=runAuto;

$('#load').onclick=loadModels;
fill();
