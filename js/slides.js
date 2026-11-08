/* Builds the teaching slides for a lesson. Pure functions: lesson data in, slide objects out. */
(function(){
const E=s=>String(s==null?'':s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
const P=n=>String(n).padStart(2,'0');
const file=(id,key)=>`L${P(id)}-${key}`;
const dir=id=>`images/L${P(id)}/`;
function art(id,key,cls,label){
  const f=file(id,key);
  return `<div class="art ${cls||''}"><div class="art-empty"><b>Image to come</b><small>${f}.png</small>${label?`<em>${E(label)}</em>`:''}</div><img alt="" data-base="${dir(id)}${f}" data-i="0" src="${dir(id)}${f}.png" onerror="window.imgFail(this)"></div>`;
}
window.imgFail=function(img){
  const ex=['png','jpg','jpeg','webp'];let i=(+img.dataset.i||0)+1;
  if(i<ex.length){img.dataset.i=i;img.src=img.dataset.base+'.'+ex[i];}else img.style.display='none';
};
const KORU=(c)=>`<div class="koru-deco ${c}"><svg viewBox="0 0 200 200"><path d="M40 190 C10 120 30 30 100 25 C160 22 185 80 150 115 C125 140 85 120 100 90 C108 74 130 80 128 95" fill="none" stroke="currentColor" stroke-width="16" stroke-linecap="round"/></svg></div>`;
const mins=t=>{const m=String(t).match(/(\d+)\D*(\d+)?/);return m?Math.round((+m[1]+(+m[2]||+m[1]))/2):10;};
const links=l=>(l.images||[]).filter(x=>x.url).map(x=>`<a class="reallink" href="${E(x.url)}" target="_blank" rel="noopener">🔗 ${E(x.title)} <small>${E(x.source)}</small></a>`).join('');

window.buildSlides=function(l){
  const T=window.TEACH[l.id],id=l.id,S=[];
  const mk=l.phases[2].time,mkMin=mins(mk);
  const add=o=>{o.n=S.length+1;S.push(o);};

  add({type:'title',name:'Title',mood:'dawn',min:1,
    html:`<div class="slide s-title">${art(id,'title','full dim')}<div class="content">${KORU("k3")}<div class="t-wrap"><span class="kicker">Lesson ${id} of 10</span><h1>${E(l.title)}</h1><div class="sub">${E(l.subtitle)}</div></div></div></div>`,
    say:[`Welcome everyone. Today is lesson ${id} of our Māori art unit: <b>${E(l.title)}</b> — ${E(l.subtitle.toLowerCase())}.`,`In your own words, tell the class what we will do: ${l.focus.replace(/<[^>]+>/g,'')}`],
    do:'Wait until the class is settled and looking at the screen. Smile. Give a 10-second welcome.'});

  add({type:'ready',name:'Get ready',mood:'calm',min:2,skip:false,
    html:`<div class="slide s-ready"><div class="content"><h2>Get ready</h2><div class="r-grid"><div class="r-card"><h3>📦 You need</h3><ul>${l.materials.map(m=>`<li>${E(m)}</li>`).join('')}</ul></div><div class="r-card"><h3>⏱ Timing</h3><ul>${l.phases.map(p=>`<li><b>${E(p.name)}</b> — ${E(p.time)}</li>`).join('')}</ul><h3 class="mt">🧑‍🎓 Skills</h3><div class="chips">${l.competencies.map(c=>`<span class="chip">${E(c)}</span>`).join('')}</div></div></div></div></div>`,
    say:['This slide is for you as much as the class. Check you have everything on the list before you begin.','Handing out materials takes longer than you expect — put them in trays on each table first.'],
    do:'Hand out or set out materials now, or tell the class where to find them. Don’t start the talking until materials are down.'});

  add({type:'hook',name:'Think about it',mood:'night',min:2,
    html:`<div class="slide s-hook">${art(id,'title','full ambient')}<div class="content"><div class="qglyph">?</div><div class="h-col"><div class="h-label">Think about it</div><div class="h-text">${E(T.hook)}</div><div class="h-ask">Talk to a partner. 30 seconds.</div></div></div></div>`,
    say:[`Read the question slowly: <i>“${E(T.hook)}”</i>`,'Say: “Turn to the person next to you and share an idea. There are no wrong answers.”','After 30 seconds, ask two or three pairs to share.'],
    do:'Set a 30-second timer. Walk around and listen. Don’t correct answers — just say “interesting”.'});

  add({type:'whaka',name:'Whakataukī',mood:'calm',min:2,
    html:`<div class="slide s-whaka"><div class="content">${KORU("k1")}${KORU("k2")}<div class="w-label">Whakataukī · Māori proverb</div><div class="w-maori">${E(l.whakatauki.maori)}</div><div class="w-line"></div><div class="w-mean">${E(l.whakatauki.meaning)}</div></div></div>`,
    say:['A whakataukī is a proverb — a wise saying passed down for many generations.','Read the Māori line slowly, one syllable at a time. Vowels: <b>a</b> = “ah”, <b>e</b> = “eh”, <b>i</b> = “ee”, <b>o</b> = “aw”, <b>u</b> = “oo”. <b>wh</b> sounds like “f”. A line over a vowel (ā ē ī ō ū) means hold it a little longer.',`Then read the English: <i>${E(l.whakatauki.meaning.split('. ')[0])}.</i>`,'Ask: “What do you think this means for artists?” Take two answers.'],
    do:'Say it twice, then ask the class to say it with you. A mistake is fine — the effort shows respect. For a recording, search the Te Aka Māori Dictionary or ask a Māori colleague or parent.'});

  T.know.forEach((k,i)=>add({type:'know',name:k[0],mood:'dawn',min:2,skip:i>=3,
    html:`<div class="slide s-know">${art(id,i%2?'look2':'look1','side')}<div class="content"><div class="k-n">${i+1}<small>/ ${T.know.length}</small></div><div class="k-head">${E(k[0])}</div><div class="k-body">${E(k[1])}</div></div></div>`,
    say:[`<b>${E(k[0])}</b>`,E(k[1]),'Put it in your own words if that feels easier — you don’t need to read word-for-word.'],
    do:'Pause after reading. Ask: “Does anyone have a question?” If you don’t know an answer, say: “Good question — let’s find out together.”'}));

  add({type:'vocab',name:'Key words',mood:'calm',min:3,
    html:`<div class="slide s-vocab"><div class="content"><h2>Key words</h2><div class="v-grid">${T.vocab.map(v=>`<div class="v-card"><div class="v-w">${E(v[0])}</div><div class="v-s">${E(v[1])}</div><div class="v-m">${E(v[2])}</div></div>`).join('')}</div></div></div>`,
    say:['Say each word, then the class says it back. The capital letters show where to put the stress.',...T.vocab.map(v=>`<b>${E(v[0])}</b> (${E(v[1])}) — ${E(v[2])}`),'Tip: pin these four words on the wall or write them on the whiteboard for the whole lesson.'],
    do:'Say each word twice with the class. Ask a child to point to something in the room that is “new” or “old” if it helps meaning stick.'});

  T.look.forEach((x,i)=>add({type:'look',name:x.t,mood:'night',min:3,skip:i===2,
    html:`<div class="slide s-look">${art(id,'look'+(i+1),'framed')}<div class="content"><div class="lk-tag">${E(x.t)}</div><div class="lk-box see"><b>Notice</b>${E(x.see)}</div><div class="lk-box ask"><b>Ask</b>${E(x.ask)}</div><div class="lk-links">${links(l)}</div></div></div>`,
    say:[`Tell the class: <i>“${E(x.see)}”</i>`,`Ask: <b>${E(x.ask)}</b>`,'Give thinking time (count to 10 in your head) before taking answers. Quiet children often have the best ideas.','If you want to show REAL examples, tap one of the 🔗 links at the bottom to open real photos from Te Ara or museum websites.'],
    do:'Use “I notice… I wonder…” sentence starters. Write 3–4 words from the children on the board.'}));

  add({type:'demo',name:'Watch me',mood:'dawn',min:5,steps:T.demo.length,
    html:`<div class="slide s-demo">${art(id,'demo','framed left')}<div class="content"><div class="dm-head">Watch me</div><ol class="dm-steps">${T.demo.map((s,i)=>`<li data-step="${i}">${E(s)}</li>`).join('')}</ol><div class="dm-hint">→ next step</div></div></div>`,
    say:['This is the most important part. Do each step LIVE in front of the class — the children learn most by watching you try.','Each press of the → key reveals the next step.',...T.demo.map((s,i)=>`Step ${i+1}: ${E(s)}`),'Narrate what you are doing: “I’m starting with a curve… now I’m adding…”'],
    do:'Have paper and pencil ready under a document camera or on a whiteboard. Mistakes are good — say “That didn’t work, let’s fix it” and show how.'});

  add({type:'make',name:'Your turn',mood:'dawn',min:mkMin,timer:mkMin*60,
    html:`<div class="slide s-make">${art(id,'make','framed right')}<div class="content"><div class="mk-head">Your turn</div><div class="mk-time">${E(mk)}</div><ol class="mk-steps">${T.make.map(s=>`<li>${E(s)}</li>`).join('')}</ol><div class="mk-timer" id="mkTimer">⏱ ${mkMin}:00 · press T</div></div></div>`,
    say:[l.phases[2].teacher,'Say: “You have about '+mkMin+' minutes. When you finish, check the steps on the screen.”','Press <b>T</b> to start the on-screen countdown.'],
    do:'Walk the room the whole time. Spend about 30 seconds with each table. Praise effort and specific details: “I like how you made that curve flow.”',
    tips:T.tips});

  add({type:'ask',name:'Questions to ask',mood:'calm',min:0,skip:true,
    html:`<div class="slide s-ask"><div class="content"><h2>Questions to ask as you walk around</h2><ul class="a-list">${l.teacherPrompts.map(q=>`<li>${E(q)}</li>`).join('')}</ul></div></div>`,
    say:['Leave this slide up while children work. Pick one or two questions and ask them quietly as you walk around.','Ask one question, then wait. Silence is okay.'],
    do:'Choose questions that fit the child. For quiet or unsure children, start with “Tell me about this part.”'});

  add({type:'share',name:'Share & reflect',mood:'night',min:mins(l.phases[3].time),
    html:`<div class="slide s-share">${art(id,'finish','full ambient')}<div class="content"><div class="sh-tag">Share & reflect</div><div class="sh-big">${E(T.share)}</div></div></div>`,
    say:[l.phases[3].teacher,`Read the prompt: <b>${E(T.share)}</b>`,'Finish with: “Thank you for your mahi — it was great to watch you work.”'],
    do:'Keep sharing short — partner talk first, then 2 volunteers share with the whole class.'});

  add({type:'faith',name:'Faith reflection',mood:'calm',min:2,skip:true,
    html:`<div class="slide s-faith"><div class="content"><div class="f-label">Faith reflection</div><div class="f-verse">${E(l.faith.verse)}</div><div class="f-ref">${E(l.faith.ref)}</div><div class="f-ref2">${l.faith.reflection.replace(/<(?!\/?(strong|b|em|i)\b)[^>]*>/g,'')}</div></div></div>`,
    say:[`Read the verse: ${E(l.faith.verse)} (${E(l.faith.ref)})`,l.faith.reflection.replace(/<[^>]+>/g,''),'This is separate from the Māori cultural learning — it is a quiet moment of reflection for our Christian-character school.'],
    do:'Keep it short — about 60 seconds. Invite a quiet moment (or a short prayer, if that fits your class).'});

  add({type:'finish',name:'Check & tidy',mood:'dawn',min:3,
    html:`<div class="slide s-finish"><div class="content"><h2>I can…</h2><ul class="c-list">${l.checklist.map(c=>`<li>${E(c)}</li>`).join('')}</ul><div class="c-tidy">🧹 Tidy up · 🙏 Thank each other · 🎨 Put art in the drying area</div></div></div>`,
    say:['Read through the checklist and ask children to silently tick each one in their heads (or on paper).','Remind them how to tidy materials and where finished work goes.'],
    do:'Allow 3–5 minutes for tidy-up. Use a countdown or a song so cleaning is part of the lesson.'});

  return S;
};
window.slideInfo={mins,file,dir};
})();
