(function(){
const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const E=s=>String(s==null?'':s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
const LS={get(k,d){try{const v=localStorage.getItem('toimaori:'+k);return v==null?d:JSON.parse(v)}catch(e){return d}},set(k,v){try{localStorage.setItem('toimaori:'+k,JSON.stringify(v))}catch(e){}}};
const L=window.LESSONS, P=n=>String(n).padStart(2,'0');
let cur=null, tab='plan', taught=new Set(LS.get('taught',[]));

/* ---------- HOME ---------- */
function renderHome(){
  $('#path').innerHTML=L.map(l=>`<button class="pcard" data-id="${l.id}"><div class="thumb"><span class="num">${l.id}</span>${taught.has(l.id)?'<span class="tick">✅</span>':''}<div class="art"><div class="art-empty"><b>Image to come</b><small>L${P(l.id)}-title.png</small></div><img alt="" data-base="images/L${P(l.id)}/L${P(l.id)}-title" data-i="0" src="images/L${P(l.id)}/L${P(l.id)}-title.png" onerror="window.imgFail(this)"></div></div><div class="txt"><h3>${E(l.title)}</h3><p>${E(l.subtitle)}</p></div></button>`).join('');
  $$('.pcard').forEach(b=>b.onclick=()=>openLesson(+b.dataset.id));
  $('#progTxt').textContent=`${taught.size} of 10 lessons taught`;
  $('#progFill').style.width=taught.size*10+'%';
}
function show(v){['home','lesson'].forEach(x=>$('#'+x).classList.toggle('hidden',x!==v));window.scrollTo(0,0);}
function openLesson(id,t){cur=L.find(l=>l.id===id);tab=t||'plan';$('#lNum').textContent=cur.id;$('#lTitle').textContent=cur.title;renderLesson();show('lesson');location.hash='lesson-'+id;}

/* ---------- LESSON PAGE ---------- */
function renderLesson(){
  $$('#tabs button').forEach(b=>b.classList.toggle('on',b.dataset.tab===tab));
  const l=cur,T=TEACH[l.id],B=$('#lessonBody');
  const total=l.phases.reduce((a,p)=>a+slideInfo.mins(p.time),0);
  const links=(l.images||[]).map(x=>`<a class="reallink" href="${E(x.url)}" target="_blank" rel="noopener">🔗 ${E(x.title)}<small>${E(x.source)}</small></a><div class="note" style="margin:0 0 8px">${E(x.note)}</div>`).join('');
  if(tab==='plan'){
    B.innerHTML=`
    <div class="prep-banner">👋 New to teaching this? Read “Before you teach” once, skim this page (10 min), gather the materials, then press <b>▶ Teach this lesson</b>. Every slide has a word-for-word guide in the 📝 notes.</div>
    <div class="card"><h3>${E(l.title)} — ${E(l.subtitle)}</h3><p>${l.focus}</p><div style="margin-top:8px">${l.competencies.map(c=>`<span class="chip">${E(c)}</span>`).join('')}</div><p class="note" style="margin-top:8px">About ${total} minutes of lesson time + ~10 minutes setup and tidy-up.</p></div>
    <div class="row2"><div class="card"><h3>📦 Materials</h3><ul>${l.materials.map(m=>`<li>${E(m)}</li>`).join('')}</ul><h4>Before the lesson</h4><ul><li>Skim the slides (click ▶ Teach and arrow through).</li><li>Set out materials in trays.</li><li>Practise the demo once on scrap paper.</li></ul></div>
    <div class="card"><h3>🗣 Say these words</h3><ul>${T.vocab.map(v=>`<li><b>${E(v[0])}</b> — ${E(v[1])}<br><span class="note">${E(v[2])}</span></li>`).join('')}</ul></div></div>
    <div class="card whaka-card"><div class="m">${E(l.whakatauki.maori)}</div><div class="e">${E(l.whakatauki.meaning)}</div></div>
    <div class="card"><h3>🧠 What you need to know</h3>${T.know.map(k=>`<h4>${E(k[0])}</h4><p>${E(k[1])}</p>`).join('')}</div>
    <div class="card"><h3>⏱ Lesson flow</h3>${l.phases.map(p=>`<div class="phase"><h4>${E(p.name)}</h4><div class="tm">${E(p.time)}</div><p>${E(p.teacher)}</p></div>`).join('')}</div>
    <div class="card"><h3>🔍 Real examples to show</h3><p class="note">Open these on the big screen for photos of real taonga (treasures) made by Māori artists.</p>${links}<h4>Also connect to</h4><ul>${l.connections.map(c=>`<li>${E(c)}</li>`).join('')}</ul></div>
    <div class="card"><h3>❓ Questions to ask</h3><ul>${l.teacherPrompts.map(q=>`<li>${E(q)}</li>`).join('')}</ul></div>
    <div class="row2"><div class="card"><h3>🤝 Extra support</h3><ul>${l.support.map(s=>`<li>${E(s)}</li>`).join('')}</ul><h4>If things go wrong</h4><ul>${T.tips.map(t=>`<li><b>${E(t[0])}</b> — ${E(t[1])}</li>`).join('')}</ul></div>
    <div class="card"><h3>🚀 Extension</h3><ul>${l.extension.map(s=>`<li>${E(s)}</li>`).join('')}</ul></div></div>
    <div class="card"><h3>✅ Assessment checklist</h3><ul>${l.checklist.map(c=>`<li>${E(c)}</li>`).join('')}</ul></div>
    <div class="card faith"><h3>🕊 Faith reflection</h3><div class="v">${E(l.faith.verse)} <small>— ${E(l.faith.ref)}</small></div><p style="margin-top:8px">${l.faith.reflection}</p></div>
    <p><button class="btn" onclick="window.print()">🖨 Print this lesson plan</button> <button class="btn alt" id="btnMark">${taught.has(l.id)?'✅ Taught — undo':'Mark as taught'}</button></p>`;
    $('#btnMark').onclick=()=>{taught.has(l.id)?taught.delete(l.id):taught.add(l.id);LS.set('taught',[...taught]);renderLesson();renderHome();};
  } else {
    const saved=LS.get('ck'+l.id,[]);
    B.innerHTML=`
    <div class="card whaka-card"><div class="m">${E(l.whakatauki.maori)}</div><div class="e">${E(l.whakatauki.meaning)}</div></div>
    <div class="card"><h3>What we are doing</h3><p>${l.focus}</p><h4>Words to know</h4><p>${T.vocab.map(v=>`<span class="chip">${E(v[0])}</span> ${E(v[2])}`).join(' · ')}</p></div>
    <div class="card"><h3>Your steps</h3>${l.phases.map(p=>`<div class="phase"><h4>${E(p.name)}</h4><div class="tm">${E(p.time)}</div><p>${E(p.student)}</p></div>`).join('')}<h4>When you make</h4><ol>${T.make.map(s=>`<li>${E(s)}</li>`).join('')}</ol></div>
    <div class="card"><h3>${E(l.tool.title)}</h3><p class="note">${E(l.tool.sub)}</p>
      <div class="pad-tools"><button class="btn small" id="mirBtn"></button><button class="btn small alt" id="clrBtn">🗑 Clear</button><button class="btn small alt" id="saveBtn">⬇ Save</button>
      ${['#1B1B18','#B24C25','#2F5D50','#D9A441','#FBF8F1'].map((c,i)=>`<button class="sw ${i?'':'on'}" data-c="${c}" style="background:${c}"></button>`).join('')}
      <label class="note">Brush <input type="range" id="brush" min="2" max="18" value="5"></label></div>
      <canvas id="drawPad" width="640" height="640"></canvas></div>
    <div class="card"><h3>✅ My checklist</h3>${l.checklist.map((c,i)=>`<label class="ck"><input type="checkbox" data-i="${i}" ${saved[i]?'checked':''}><span>${E(c)}</span></label>`).join('')}</div>
    <div class="card"><h3>🔍 See real examples</h3>${links}</div>
    <div class="card faith"><h3>🕊 Think about it</h3><div class="v">${E(l.faith.verse)} <small>— ${E(l.faith.ref)}</small></div><p style="margin-top:8px">${l.faith.reflection}</p></div>`;
    $$('.ck input').forEach(c=>c.onchange=()=>{const s=LS.get('ck'+l.id,[]);s[+c.dataset.i]=c.checked;LS.set('ck'+l.id,s);});
    initPad(l.tool.mirror);
  }
}
function initPad(mirror){
  const cv=$('#drawPad'),cx=cv.getContext('2d');let m=mirror,col='#1B1B18',br=5,draw=false,last=null;
  const clear=()=>{cx.fillStyle='#FBF8F1';cx.fillRect(0,0,640,640)};clear();
  const lab=()=>{$('#mirBtn').textContent='✦ 4-way mirror: '+(m?'ON':'OFF');$('#mirBtn').classList.toggle('alt',!m)};lab();
  const pos=e=>{const r=cv.getBoundingClientRect(),t=e.touches?e.touches[0]:e;return{x:(t.clientX-r.left)*640/r.width,y:(t.clientY-r.top)*640/r.height}};
  const pts=(x,y)=>m?[[x,y],[640-x,y],[x,640-y],[640-x,640-y]]:[[x,y]];
  const go=p=>{cx.strokeStyle=cx.fillStyle=col;cx.lineWidth=br;cx.lineCap='round';
    pts(p.x,p.y).forEach((q,i)=>{cx.beginPath();if(last){const o=pts(last.x,last.y)[i];cx.moveTo(o[0],o[1]);cx.lineTo(q[0],q[1]);cx.stroke()}else{cx.arc(q[0],q[1],br/2,0,7);cx.fill()}});last=p};
  const dn=e=>{e.preventDefault();draw=true;last=null;go(pos(e))},mv=e=>{if(!draw)return;e.preventDefault();go(pos(e))},up=()=>{draw=false;last=null};
  cv.addEventListener('mousedown',dn);cv.addEventListener('mousemove',mv);window.addEventListener('mouseup',up);
  cv.addEventListener('touchstart',dn,{passive:false});cv.addEventListener('touchmove',mv,{passive:false});cv.addEventListener('touchend',up);
  $$('.sw').forEach(s=>s.onclick=()=>{$$('.sw').forEach(x=>x.classList.remove('on'));s.classList.add('on');col=s.dataset.c});
  $('#brush').oninput=e=>br=+e.target.value;$('#clrBtn').onclick=clear;$('#mirBtn').onclick=()=>{m=!m;lab()};
  $('#saveBtn').onclick=()=>{const a=document.createElement('a');a.download='my-design-lesson-'+cur.id+'.png';a.href=cv.toDataURL('image/png');a.click()};
}

/* ---------- CARE MODAL ---------- */
function modal(html){$('#modalCard').innerHTML=html+'<p style="margin-top:16px"><button class="btn" id="mClose">Got it</button></p>';$('#modal').classList.remove('hidden');$('#mClose').onclick=()=>$('#modal').classList.add('hidden');}
function care(){modal(`<h2>Before you teach</h2>
<h3>You don’t have to be an expert</h3><p>This unit is designed so any adult can lead it. Your job is to help children look closely, talk, try, and treat Māori art with respect. “I don’t know — let’s find out” is a great thing to say.</p>
<h3>How to use it</h3><ul><li><b>Lesson plan</b> tab — read once before teaching.</li><li><b>▶ Teach this lesson</b> — a slide show. Use ← → keys. Press <b>N</b> for word-for-word notes for the slide you’re on.</li><li><b>Student</b> tab — children can work through the lesson on their own device, with a draw pad.</li></ul>
<h3>Pronouncing te reo</h3><p>Vowels: a = “ah”, e = “eh”, i = “ee”, o = “aw”, u = “oo”. <b>wh</b> sounds like “f”. <b>ng</b> is like the end of “singer”. A macron (ā ē ī ō ū) means hold the sound a bit longer. Every syllable is said clearly. A try with respect matters more than being perfect.</p>
<h3>Cultural care</h3><ul><li>Tā moko is personal and sacred to the wearer. Children can <i>study</i> it but should not copy a specific moko or draw designs on faces or skin.</li><li>Treat images of taonga (treasures) with care — no jokes, no drawing on them.</li><li>Say whose work inspired you. Never claim a traditional design as your own invention.</li><li>Where you can, invite someone from local iwi, a marae, or a Māori parent/colleague to visit, bless the unit, or look at the finished work. Meanings of patterns can differ between iwi — ask locally.</li></ul>
<h3>Faith reflection</h3><p>Each lesson has an optional Christian-faith reflection. It is separate from the Māori learning and can be skipped.</p>`);}

/* ---------- STAGE ---------- */
let S=[],si=0,step=0,short=false,t0=0,clockT=null,timerT=null,uiT=null;
const wrap=$('#stage-wrap'),stage=$('#stage');
function fit(){const s=Math.min(innerWidth/1920,innerHeight/1080);stage.style.transform=`translate(-50%,-50%) scale(${s})`;}
addEventListener('resize',fit);
function visible(){return short?S.map((s,i)=>i).filter(i=>!S[i].skip):S.map((s,i)=>i);}
function openStage(){S=buildSlides(cur);si=0;step=0;wrap.classList.remove('hidden');document.body.style.overflow='hidden';fit();render(true);t0=Date.now();clearInterval(clockT);clockT=setInterval(()=>{const s=Math.floor((Date.now()-t0)/1000);$('#clock').textContent=Math.floor(s/60)+':'+String(s%60).padStart(2,'0')},1000);poke();taught.add(cur.id);LS.set('taught',[...taught]);renderHome();}
function closeStage(){wrap.classList.add('hidden');document.body.style.overflow='';clearInterval(clockT);clearInterval(timerT);if(document.fullscreenElement)document.exitFullscreen();$('#drawer').classList.remove('open');$('#overlay').classList.add('hidden');renderLesson();}
const SPLIT='.s-title h1,.w-maori,.s-know .k-head,.lk-tag,.dm-head,.mk-head,.s-ready h2,.s-vocab h2,.s-ask h2,.s-finish h2,.sh-tag,.f-ref,.s-hook .h-ask';
function splitText(root){root.querySelectorAll(SPLIT).forEach(el=>{if(el.children.length)return;const t=el.textContent;let i=0;el.setAttribute('aria-label',t);el.innerHTML=t.split(' ').map(w=>'<span class="wd" aria-hidden="true">'+[...w].map(c=>'<span class="ch" style="--i:'+(i++)+'">'+E(c)+'</span>').join('')+'</span>').join(' ');});}
/* embers: slow rising sparks in red / gold / greenstone */
const pc=document.getElementById('particles'),px=pc.getContext('2d');let ps=[];const cols=['#E3B04B','#C2411F','#2F7D6B','#F3EADB'];
for(let i=0;i<46;i++)ps.push({x:Math.random()*1920,y:Math.random()*1080,r:2+Math.random()*5,v:.3+Math.random()*.9,d:Math.random()*6,c:cols[i%4]});
const calm=matchMedia('(prefers-reduced-motion:reduce)').matches;
function emb(){if(!wrap.classList.contains('hidden')&&!calm){px.clearRect(0,0,1920,1080);ps.forEach(p=>{p.y-=p.v;p.d+=.02;p.x+=Math.sin(p.d)*.6;if(p.y<-10){p.y=1090;p.x=Math.random()*1920}px.globalAlpha=.45;px.fillStyle=p.c;px.beginPath();px.arc(p.x,p.y,p.r,0,7);px.fill()})}requestAnimationFrame(emb)}
function render(first){
  const s=S[si];stage.dataset.mood=s.mood;
  $('#slideLayer').innerHTML=s.html;splitText($('#slideLayer'));clearInterval(timerT);
  if(s.type==='demo'){step=Math.min(step,s.steps);applySteps();}
  if(s.type==='make'){const el=$('#mkTimer');let left=s.timer,run=false;el.onclick=startT;window._startT=startT;
    function startT(){if(run){clearInterval(timerT);run=false;el.classList.remove('run');return}run=true;el.classList.add('run');tick();timerT=setInterval(tick,1000)}
    function tick(){const m=Math.floor(left/60),r=left%60;el.textContent='⏱ '+m+':'+String(r).padStart(2,'0');if(left--<=0){clearInterval(timerT);el.classList.remove('run');el.classList.add('done');el.textContent="⏱ Time's up!"}}}
  const v=visible(),pos=v.indexOf(si);
  $('#stCount').textContent=`${pos+1} / ${v.length}${short?' · short':''}`;
  $('#stProg').style.width=((pos+1)/v.length*100)+'%';
  $('#cbShort').classList.toggle('on',short);
  renderNotes();
}
function applySteps(){$$('.dm-steps li').forEach((li,i)=>{li.classList.toggle('on',i<step);li.classList.toggle('cur',i===step-1)});const h=$('.dm-hint');if(h)h.textContent=step>=S[si].steps?'':'→ next step ('+step+'/'+S[si].steps+')';}
function renderNotes(){const s=S[si];$('#drawer').innerHTML=`<button class="closeN" id="nClose">✕</button><h3>${s.n}. ${E(s.name)}</h3><div class="note" style="font-size:22px;margin-top:6px">About ${s.min} min</div><h4>📣 Say this</h4><div class="say">${s.say.map(p=>`<p>${p}</p>`).join('')}</div><h4>🙋 Do this</h4><div class="doit">${s.do}</div>${s.tips?`<h4>🛠 If things go wrong</h4>${s.tips.map(t=>`<div class="tp"><b>${E(t[0])}</b> — ${E(t[1])}</div>`).join('')}`:''}`;$('#nClose').onclick=()=>$('#drawer').classList.remove('open');}
function go(d){
  const s=S[si];
  if(s.type==='demo'){if(d>0&&step<s.steps){step++;applySteps();return}if(d<0&&step>0){step--;applySteps();return}}
  const v=visible();let p=v.indexOf(si);if(p<0)p=v.findIndex(i=>i>si)-1;
  const np=p+d;if(np<0)return;if(np>=v.length){closeStage();return}
  si=v[np];step=d<0&&S[si].type==='demo'?S[si].steps:0;render();
}
function grid(){const o=$('#overlay');o.classList.remove('hidden');o.innerHTML=`<h2>All slides <button class="btn small" id="gClose" style="font-size:22px;vertical-align:middle">Close</button></h2><div class="g-grid">${S.map((s,i)=>`<button class="g-item ${i===si?'cur':''} ${short&&s.skip?'skip':''}" data-i="${i}"><span class="gi-n">${s.n}</span><span class="gi-t">${E(s.name)}</span><span class="gi-m">${s.type}${s.skip?' · optional':''} · ~${s.min} min</span></button>`).join('')}</div>`;
  $('#gClose').onclick=()=>o.classList.add('hidden');$$('.g-item').forEach(b=>b.onclick=()=>{si=+b.dataset.i;step=0;o.classList.add('hidden');render()});}
function help(){const o=$('#overlay');o.classList.remove('hidden');o.innerHTML=`<h2>Keyboard <button class="btn small" id="gClose" style="font-size:22px;vertical-align:middle">Close</button></h2><div class="help-grid"><div><kbd>→</kbd> next / next step</div><div><kbd>←</kbd> back</div><div><kbd>N</kbd> teacher notes</div><div><kbd>G</kbd> all slides</div><div><kbd>S</kbd> short on time (skip optional)</div><div><kbd>T</kbd> start / stop timer</div><div><kbd>F</kbd> full screen</div><div><kbd>Esc</kbd> exit</div></div><p style="font-size:28px;margin-top:30px;color:#ddd">You can also swipe or tap the left / right edges. Tip: open the notes (N) on a laptop and show the slides on the projector.</p>`;$('#gClose').onclick=()=>o.classList.add('hidden');}
function fs(){if(document.fullscreenElement)document.exitFullscreen();else wrap.requestFullscreen&&wrap.requestFullscreen();}
function poke(){wrap.classList.add('show-ui');wrap.classList.remove('hide-cursor');clearTimeout(uiT);uiT=setTimeout(()=>{wrap.classList.remove('show-ui');wrap.classList.add('hide-cursor')},2800);}
wrap.addEventListener('mousemove',poke);
document.addEventListener('keydown',e=>{
  if(wrap.classList.contains('hidden')){ if(e.key==='Escape')$('#modal').classList.add('hidden'); return; }
  const k=e.key.toLowerCase();poke();
  if(k==='arrowright'||k===' '||k==='pagedown'||k==='enter'){e.preventDefault();go(1)}
  else if(k==='arrowleft'||k==='pageup'||k==='backspace'){e.preventDefault();go(-1)}
  else if(k==='n')$('#drawer').classList.toggle('open');
  else if(k==='g')grid();else if(k==='h'||k==='?')help();
  else if(k==='f')fs();else if(k==='s'){short=!short;if(short&&S[si].skip){const v=visible();si=v.find(i=>i>si)??v[v.length-1];}render();}
  else if(k==='t'&&window._startT&&S[si].type==='make')window._startT();
  else if(k==='escape'){if(!$('#overlay').classList.contains('hidden'))$('#overlay').classList.add('hidden');else if($('#drawer').classList.contains('open'))$('#drawer').classList.remove('open');else closeStage();}
});
$('#navL').onclick=()=>go(-1);$('#navR').onclick=()=>go(1);
$('#cbShort').onclick=()=>{short=!short;render()};$('#cbGrid').onclick=grid;$('#cbNotes').onclick=()=>$('#drawer').classList.toggle('open');$('#cbFull').onclick=fs;$('#cbHelp').onclick=help;$('#cbClose').onclick=closeStage;
let tx=null;wrap.addEventListener('touchstart',e=>{tx=e.touches[0].clientX},{passive:true});
wrap.addEventListener('touchend',e=>{if(tx==null)return;const d=e.changedTouches[0].clientX-tx;if(Math.abs(d)>60)go(d<0?1:-1);tx=null});

/* ---------- WIRING ---------- */
$('#btnStart').onclick=()=>{openLesson(1);openStage()};
$('#btnCare').onclick=care;
$('#btnStudentHome').onclick=()=>openLesson(1,'student');
$('#btnHome').onclick=()=>{show('home');history.replaceState(null,'',location.pathname)};
$('#btnTeach').onclick=openStage;
$$('#tabs button').forEach(b=>b.onclick=()=>{tab=b.dataset.tab;renderLesson()});
$('#modal').onclick=e=>{if(e.target.id==='modal')$('#modal').classList.add('hidden')};
renderHome();emb();
const h=location.hash.match(/lesson-(\d+)/);if(h&&L.find(l=>l.id===+h[1]))openLesson(+h[1]);
window.__app={openLesson,openStage,care};
})();
