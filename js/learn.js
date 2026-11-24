'use strict';
/* 워드스텝 v2 — 학습 세션, 문제 유형, 단원 시험, 문법 6단계, 영어 대화 */

let S=null; // 지금 진행 중인 학습

function isLetter(e){return !!e?.extra?.letter}
function canSpeak(){return !!Rec&&!S?.noSpeak}
function typeFor(e,{test=false}={}){
 if(isLetter(e)){const lv=W(e.id)?.lv||0;if(test)return pick(['L-listen','L-pic','L-case','L-order']);return pick(lv<=1?['L-listen','L-case','L-pic']:['L-pic','L-order','L-case','L-trace','L-listen'])}
 if(kidsWord(e)){const lv=W(e.id)?.lv||0;if(test)return pick(['K-pic','K-word']);return pick(lv<=1?['K-pic']:lv===2?['K-pic','K-word']:['K-word','order','K-pic'])}
 const lv=W(e.id)?.lv||0,ex=!!exampleOf(e);
 if(test)return pick(['listen','meaning','reverse','spell',...(ex?['cloze']:[])]);
 if(lv<=1)return pick(['listen','meaning']);
 if(lv===2)return pick(['reverse','order',...(ex?['cloze']:[])]);
 if(lv===3)return pick(['spell',ex?'cloze':'reverse']);
 return pick(['spell',...(canSpeak()?['speak']:['listen']),...(ex?['cloze']:[])]);
}
function newItems(e){if(kidsWord(e))return [{id:e.id,t:'intro'},{id:e.id,t:'K-pic'}];return isLetter(e)?[{id:e.id,t:'L-intro'},{id:e.id,t:'L-trace'},{id:e.id,t:'L-pic'},{id:e.id,t:'L-case'}]:[{id:e.id,t:'intro'},{id:e.id,t:'listen'}]}
function mkSession(kind,items,extra={}){
 state.onboarded=true;
 S={kind,items,i:0,ok:0,graded:0,wrong:new Map(),requeued:new Set(),newIds:new Set(items.filter(x=>x.t==='intro'||x.t==='L-intro').map(x=>x.id)),start:Date.now(),answer:null,noSpeak:false,...extra};
 S.learnedBefore=learned().length;S.stickersBefore=stickerSnapshot();
 saveSession();scr('q');
}
/* ── 진행 중인 학습 저장과 이어 하기 ── */
function saveSession(){
 if(!S){state.session=null;persist();return}
 const i=S.answer?S.i+1:S.i;
 if(i>=S.items.length){state.session=null;persist();return}
 const {answer,sel,...rest}=S;
 state.session={...rest,i,items:S.items.map(({mic,heard,typed,picked,...x})=>x),wrong:[...S.wrong],requeued:[...S.requeued],newIds:[...S.newIds],course:C.id,saved:Date.now()};
 persist();
}
function savedSession(){const s=state.session;if(!s||s.course!==C.id||!Array.isArray(s.items)||s.i>=s.items.length)return null;if(Date.now()-(s.saved||0)>14*86400000){state.session=null;return null}return s}
function sessionLabel(s){return (s.title||'학습')+' · '+(s.i+1)+'/'+s.items.length}
function resumeSession(){const s=savedSession();if(!s)return false;S={...s,wrong:new Map(s.wrong||[]),requeued:new Set(s.requeued||[]),newIds:new Set(s.newIds||[]),answer:null,sel:null,start:Date.now()};scr('q');return true}
function sameSession(kind,u,k){const s=savedSession();return s&&s.kind===kind&&s.unit===u&&(k==null||s.step===k)}
document.addEventListener('visibilitychange',()=>{if(document.hidden&&S){endTime();saveSession()}});
addEventListener('pagehide',()=>{if(S){endTime();saveSession()}});
/* 오늘의 학습: 복습할 단어 + 새 단어 */
function startDaily(){
 if(sameSession('daily')){resumeSession();return}
 const goal=state.goal||20;const due=dueWords();const nw=nextNewWords(Math.max(2,Math.min(5,Math.round(goal/4))));
 const items=[],tail=[];
 nw.forEach(e=>{const [a,...rest]=newItems(e);items.push(a);tail.push(...rest)});
 const room=Math.max(0,goal-items.length-tail.length);
 const reviews=due.slice(0,Math.max(room,nw.length?0:Math.min(goal,due.length))).map(e=>({id:e.id,t:typeFor(e)}));
 // 새 단어 소개 → 복습 → 새 단어 문제 순서로 섞어요.
 const mixed=[...items];reviews.forEach((r,i)=>{mixed.push(r);if(tail.length&&i%2===1)mixed.push(tail.shift())});mixed.push(...tail);
 if(!mixed.length){const pool=shuffle(learned()).slice(0,Math.min(goal,10));if(!pool.length){toast('이 과정을 모두 익혔어요!');return}pool.forEach(e=>mixed.push({id:e.id,t:typeFor(e)}))}
 mkSession('daily',mixed,{title:'오늘의 학습'});
}
/* 학습 지도의 한 걸음: 단어 5개를 4단계로 */
function startStep(u,k){
 if(sameSession('step',u,k)){resumeSession();return}
 const words=stepsOf(u)[k];if(!words)return;
 const a=[],b=[],c=[];
 words.forEach(e=>{if(isLetter(e)){a.push({id:e.id,t:'L-intro'},{id:e.id,t:'L-trace'},{id:e.id,t:'L-trace',lower:true});b.push({id:e.id,t:'L-pic'},{id:e.id,t:'L-listen'});c.push({id:e.id,t:'L-case'},{id:e.id,t:'L-order'});return}
  if(kidsWord(e)){a.push({id:e.id,t:'intro'},{id:e.id,t:'K-pic'});b.push({id:e.id,t:'K-word'});c.push({id:e.id,t:'order'});return}
  a.push({id:e.id,t:'intro'},{id:e.id,t:'listen'});b.push({id:e.id,t:pick(['meaning','reverse'])},{id:e.id,t:'order'});c.push({id:e.id,t:'spell',hint:0})});
 mkSession('step',[...a,...shuffle(b),...shuffle(c)],{unit:u,step:k,title:C.units[u].name+' · '+(k+1)+'번째 걸음'});
}
function startWeak(){const w=weakWords();if(!w.length){toast('약한 단어가 없어요. 아주 잘하고 있어요!');return}mkSession('weak',shuffle(w.flatMap(e=>isLetter(e)?[{id:e.id,t:'L-listen'},{id:e.id,t:'L-pic'}]:kidsWord(e)?[{id:e.id,t:'K-pic'},{id:e.id,t:'K-word'}]:[{id:e.id,t:'meaning'},{id:e.id,t:'spell',hint:1}])),{title:'약한 단어 5분 세트'})}
function startReviewAll(){const d=dueWords();if(!d.length){toast('지금 복습할 단어가 없어요.');return}mkSession('review',d.slice(0,20).map(e=>({id:e.id,t:typeFor(e)})),{title:'잊을 때쯤 복습'})}
function startTest(u){
 if(sameSession('test',u)){resumeSession();return}
 const words=C.units[u]?.words||[];if(!words.length)return;
 let pool=shuffle(words).slice(0,10);while(pool.length<10&&words.length)pool.push(pick(words));
 mkSession('test',pool.map(e=>({id:e.id,t:typeFor(e,{test:true}),noHint:true})),{unit:u,title:(u+1)+'단원 시험'});
}
function startRetry(u,ids){mkSession('retry',ids.flatMap(id=>{const e=C.byId.get(id);return isLetter(e)?[{id,t:'L-intro'},{id,t:'L-pic'},{id,t:'L-trace'}]:kidsWord(e)?[{id,t:'intro'},{id,t:'K-pic'},{id,t:'K-word'}]:[{id,t:'intro'},{id,t:'order'},{id,t:'spell',hint:1}]}),{unit:u,title:'틀린 단어 연습'})}

/* ── 문제 화면 ── */
function cur(){return S?.items[S.i]}
function curWord(){return C.byId.get(cur()?.id)}
function distract(e,field,n=3){
 const same=(C.units[e.unit]?.words||[]).map(x=>x[field]);const all=allWords().map(x=>x[field]);
 const pool=[...new Set([...shuffle(same),...shuffle(all)])].filter(v=>v&&norm(v)!==norm(e[field]));
 return shuffle([e[field],...pool.slice(0,n)]);
}
const KIND={intro:['새 단어','g'],listen:['듣기','b'],meaning:['뜻 고르기','b'],reverse:['영어 고르기','b'],order:['글자 순서','o'],spell:['철자 쓰기','o'],speak:['말하기','p'],cloze:['예문 속 단어','g'],
 'L-intro':['오늘의 글자','g'],'L-listen':['듣기','b'],'L-case':['짝 찾기','o'],'L-first':['첫 글자 찾기','g'],'L-type':['글자 쓰기','o'],'L-pic':['그림 첫 글자','g'],'L-order':['빈칸 글자','b'],'L-trace':['따라 쓰기','o'],'K-pic':['그림 고르기','b'],'K-word':['영어 고르기','g']};
SCREENS.q=()=>{
 if(!S)return SCREENS.today();
 if(S.i>=S.items.length){finishSession();return null}
 const it=cur(),e=curWord();if(!e){S.i++;return SCREENS.q()}
 const total=S.items.length,pct=Math.round(S.i/total*100);
 const [kname,kc]=KIND[it.t]||['문제','b'];
 const head=`<header class="qhead"><button class="iconbtn" data-a="quit" aria-label="그만하기">${I(IC.x,24,2.4)}</button><div class="bar" role="progressbar" aria-valuenow="${S.i}" aria-valuemax="${total}"><i style="width:${pct}%"></i></div><span class="cnt">${S.i+1}/${total}</span></header>`;
 const body=Q[it.t](it,e);
 const sheet=S.answer?answerSheet(it,e):'';
 return `<main class="screen focus">${head}<section class="stack" style="gap:6px"><span class="qkind ${kc}">${S.kind==='test'?esc(S.title)+' · ':''}${kname}</span><h1 class="qtitle">${body.title}</h1></section>${body.html}<div class="grow"></div>${S.answer?'<div class="pad-sheet"></div>':body.foot||''}</main>${sheet}`;
};
SCREENS.q.focus=true;
SCREENS.q.after=()=>{saveSession();const it=cur();if(!it||S.answer)return;Q[it.t].after?.(it,curWord())};
const confirmBtn=(ready,label='확인')=>`<button class="btn big primary" data-a="check" ${ready?'':'disabled'}>${label}</button>`;
function optsHTML(list,{lang=''}={}){const a=S.answer;return `<div class="opts${list.some(o=>[...o].reduce((n,ch)=>n+(ch.charCodeAt(0)>255?2:1),0)>14)?' one':''}">${list.map((o,i)=>{let cls='opt',st='';if(a){if(norm(o)===norm(a.correct))cls+=' right';else if(i===S.sel)cls+=' wrong';else cls+=' dim'}return `<button type="button" class="${cls}" data-a="sel" data-v="${i}" aria-pressed="${S.sel===i}" ${a?'disabled':''} ${lang?`lang="${lang}"`:''}>${esc(o)}</button>`}).join('')}</div>`}
const Q={};
Q.intro=(it,e)=>{const ex=exampleOf(e),pc=picOf(e);return {title:'새 단어를 만나요',html:`<div class="card intro">${pc?`<span class="pic-big" aria-hidden="true">${pc}</span>`:''}<span class="w" lang="en">${esc(e.word)}</span><span class="m">${esc(e.meaning)}</span><span class="sp" lang="en">${esc([...e.word].join(' '))}</span><div class="listen"><button class="main" data-a="say" data-v="${esc(e.word)}" aria-label="다시 듣기">${I(IC.speaker,48)}</button><button class="slow" data-a="saySlow" data-v="${esc(e.word)}" aria-label="천천히 듣기">${I(IC.speaker1,24)}천천히</button></div>${ex?`<p class="gl-en" lang="en" style="text-align:center">${esc(ex[0])}</p><p class="gl-ko" style="text-align:center;margin-top:-6px">${esc(ex[1])}</p>`:''}</div>`,foot:`<button class="btn big primary" data-a="introOk">알겠어요</button>`}};
Q.intro.after=(it,e)=>setTimeout(()=>say(e.word),200);
Q.listen=(it,e)=>{it.list??=distract(e,'meaning');return {title:'잘 듣고 알맞은 뜻을 골라요',html:`<div class="listen"><button class="main" data-a="say" data-v="${esc(e.word)}" aria-label="다시 듣기">${I(IC.speaker,52)}</button><button class="slow" data-a="saySlow" data-v="${esc(e.word)}" aria-label="천천히 듣기">${I(IC.speaker1,24)}천천히</button></div>`+optsHTML(it.list),foot:confirmBtn(S.sel!=null)}};
Q.listen.after=(it,e)=>setTimeout(()=>say(e.word),200);
Q.meaning=(it,e)=>{it.list??=distract(e,'meaning');return {title:'알맞은 뜻을 골라요',html:`<div class="wordcard"><div style="min-width:0"><div class="w" lang="en">${esc(e.word)}</div></div>${sayBtn(e.word,true)}</div>`+optsHTML(it.list),foot:confirmBtn(S.sel!=null)}};
Q.reverse=(it,e)=>{it.list??=distract(e,'word');return {title:esc(josa(`'${e.meaning}'`,'을','를'))+' 영어로 골라요',html:optsHTML(it.list,{lang:'en'}),foot:confirmBtn(S.sel!=null)}};
Q.cloze=(it,e)=>{const ex=exampleOf(e);if(!ex){it.t='reverse';return Q.reverse(it,e)}
 it.list??=distract(e,'word');const re=new RegExp('\\b'+e.word.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')+'\\w*','i');const m=ex[0].match(re);
 const filled=S.sel!=null?it.list[S.sel]:'';const parts=m?[ex[0].slice(0,m.index),ex[0].slice(m.index+m[0].length)]:[ex[0]+' ',''];
 return {title:'빈칸에 맞는 단어를 골라요',html:`<div class="sentence"><p class="en" lang="en">${esc(parts[0])}<span class="blank${filled?' filled':''}">${filled?esc(filled):'&nbsp;'}</span>${esc(parts[1])}</p><p class="ko">${esc(ex[1])}</p></div>`+optsHTML(it.list,{lang:'en'}),foot:confirmBtn(S.sel!=null)}};
Q.order=(it,e)=>{
 it.tiles??=shuffle([...e.word].map((ch,i)=>({ch,i})).filter(t=>/[a-z0-9']/i.test(t.ch)));it.picked??=[];
 const shown=(()=>{let out='',k=0;for(const ch of e.word){if(!/[a-z0-9']/i.test(ch)){if(k&&k<it.picked.length)out+=ch}else{if(k<it.picked.length){const pi=it.picked[k++];out+=it.tiles.find(t=>t.i===pi).ch}else break}}return out})();
 return {title:`'${esc(e.meaning)}' 글자를 순서대로 골라요`,html:`<div class="card stack"><div class="built" lang="en">${esc(shown)||'&nbsp;'}</div><div class="tiles">${it.tiles.map(t=>`<button class="tile" data-a="tile" data-v="${t.i}" ${it.picked.includes(t.i)||S.answer?'disabled':''} lang="en">${esc(t.ch)}</button>`).join('')}</div><div class="btns" style="justify-content:center">${sayBtn(e.word)}<button class="btn sm" data-a="untile" ${S.answer?'disabled':''}>한 글자 지우기</button></div></div>`,foot:''}};
const HINTS=['보고 쓰기','첫 글자만','안 보고 쓰기'];
function boxesHTML(word,typed,level){
 const avail=Math.min(innerWidth,560)-40,n=word.length,parts=word.split(' '),longest=Math.max(...parts.map(p=>p.length));
 let gap=n>10?4:6,w=Math.floor((avail-gap*(n-1))/n),wrap=false;
 if(w<24&&parts.length>1){wrap=true;gap=5;w=Math.floor((avail-gap*(longest-1))/longest)}
 w=Math.max(16,Math.min(52,w));const h=Math.round(Math.min(60,w*1.2)),fs=Math.max(12,Math.round(w*.5)),st=`width:${w}px;height:${h}px;font-size:${fs}px;border-radius:${Math.round(w/4)}px`;
 let i=0;const box=ch=>{const k=i++;const t=typed[k];let cls='',txt='';if(t!==undefined&&t!==' '){cls='typed';txt=t}else if(k===typed.length)cls='cursor';if(!txt&&(level===0||level===1&&k===0)){txt=ch;cls+=' ghost'}return `<i class="bx ${cls}" style="${st}">${esc(txt)}</i>`};
 const groups=parts.map((p,gi)=>{const html=[...p].map(box).join('');if(gi<parts.length-1)i++;return `<span style="display:flex;gap:${gap}px">${html}</span>`});
 return `<div class="boxes" style="gap:${wrap?8:gap}px ${wrap?14:Math.round(w/2)}px;flex-wrap:${wrap?'wrap':'nowrap'}" aria-hidden="true">${groups.join('')}</div>`}
Q.spell=(it,e)=>{
 it.def??=(it.hint??(S.kind==='test'?2:(W(e.id)?.lv||0)<=2?1:2));const lvl=it.level??=it.def;
 const typed=(it.typed||'');
 return {title:esc(josa(`'${e.meaning}'`,'을','를'))+' 영어로 써요',html:`${it.noHint?'':`<div class="seg" role="radiogroup" aria-label="가리기 단계">${HINTS.map((h,i)=>`<button type="button" role="radio" aria-checked="${lvl===i}" data-a="hint" data-v="${i}" ${S.answer?'disabled':''}>${h}</button>`).join('')}</div>`}
  ${boxesHTML(e.word,typed,S.answer?0:lvl)}
  <form class="spell-input" data-f="spell"><label class="sr" for="spell">영어 철자</label><input id="spell" lang="en" autocomplete="off" autocapitalize="off" autocorrect="off" spellcheck="false" enterkeyhint="done" value="${esc(typed)}" ${S.answer?'disabled':''} placeholder="여기에 써요"></form>
  <div class="btns" style="justify-content:center">${sayBtn(e.word)}</div>`,foot:confirmBtn((typed||'').trim().length>0)}};
Q.spell.after=()=>{const f=$('#spell');if(!f)return;f.oninput=()=>{const it=cur();it.typed=f.value;const e=curWord();const b=document.querySelector('.boxes');if(b)b.outerHTML=boxesHTML(e.word,it.typed,it.level);const c=document.querySelector('[data-a=check]');if(c)c.disabled=!f.value.trim()};f.closest('form').onsubmit=ev=>{ev.preventDefault();if(f.value.trim())ACT.check()};if(matchMedia('(pointer:fine)').matches)f.focus()};
Q.speak=(it,e)=>{
 const st=it.mic||'idle';
 return {title:'듣고 따라 말해요',html:`<div class="wordcard"><div style="min-width:0"><div class="w" lang="en">${esc(e.word)}</div><div class="m">${esc(e.meaning)}</div></div>${sayBtn(e.word,true)}</div>
 <div class="center" style="gap:14px"><button class="mic${st==='on'?' on':''}" data-a="mic" aria-label="${st==='on'?'듣는 중':'눌러서 말하기'}">${I(IC.mic,52)}</button><span class="note" style="font-size:15px;font-weight:700">${st==='on'?'듣고 있어요… 다 말하면 기다려요':it.heard?'다시 말하려면 눌러요':'눌러서 말해 보세요'}</span>${it.heard?`<span class="note no">들린 말: ${esc(it.heard)}</span>`:''}</div>`,
 foot:`<button class="btn ghost full" data-a="skipSpeak">지금은 말하기 어려워요</button>`}};
/* 알파벳 */
const ABC='ABCDEFGHIJKLMNOPQRSTUVWXYZ';
function letterOpts(target,lower=false){const t=target.toUpperCase(),confuse={B:'D',D:'B',P:'Q',Q:'P',M:'N',N:'M',I:'L',L:'I',U:'V',V:'U'};const pool=shuffle([...ABC].filter(x=>x!==t&&x!==confuse[t]));const list=shuffle([t,...(confuse[t]?[confuse[t]]:[]),...pool].slice(0,4));return lower?list.map(x=>x.toLowerCase()):list}
Q['L-intro']=(it,e)=>{const [w,m]=e.extra.ex||['',''];return {title:'오늘의 글자를 만나요',html:`<div class="card letter-card"><div class="letter-big"><span class="u">${esc(e.word)}</span><span class="l">${esc(e.word.toLowerCase())}</span></div><span style="font-size:20px;font-weight:700">${esc(e.meaning)}</span>${w?`<span style="font-size:28px;font-weight:900" lang="en"><span style="color:var(--blue)">${esc(w[0])}</span>${esc(w.slice(1))}</span><span class="muted" style="font-size:18px">${esc(m)}</span>`:''}<div class="btns">${sayBtn(e.word,true,'글자 이름 듣기')}${w?`<button class="btn sm" data-a="say" data-v="${esc(w)}">단어 듣기</button>`:''}</div></div>`,foot:`<button class="btn big primary" data-a="introOk">알겠어요</button>`}};
Q['L-intro'].after=(it,e)=>setTimeout(()=>say(e.word),200);
Q['L-listen']=(it,e)=>{it.list??=letterOpts(e.word);return {title:'잘 듣고 글자를 골라요',html:`<div class="listen"><button class="main" data-a="say" data-v="${esc(e.word)}" aria-label="다시 듣기">${I(IC.speaker,52)}</button></div>`+optsHTML(it.list,{lang:'en'}),foot:confirmBtn(S.sel!=null)}};
Q['L-listen'].after=(it,e)=>setTimeout(()=>say(e.word),200);
Q['L-case']=(it,e)=>{it.list??=letterOpts(e.word,true);return {title:`<span lang="en" style="font-size:44px">${esc(e.word)}</span>의 작은 글자를 골라요`,html:optsHTML(it.list,{lang:'en'}),foot:confirmBtn(S.sel!=null)}};
Q['L-first']=(it,e)=>{const [w,m]=e.extra.ex||[e.word,''];it.list??=letterOpts(e.word,true);return {title:'첫 글자를 골라요',html:`<div class="card center"><span style="font-size:40px;font-weight:900" lang="en"><span class="blank">${S.sel!=null?esc(it.list[S.sel]):'&nbsp;'}</span>${esc(w.slice(1))}</span><span class="muted" style="font-size:18px">${esc(m)}</span>${sayBtn(w)}</div>`+optsHTML(it.list,{lang:'en'}),foot:confirmBtn(S.sel!=null)}};
Q['L-type']=(it,e)=>{const typed=it.typed||'';return {title:`'${esc(e.meaning)}' 글자를 써요`,html:`<div class="card center"><span style="font-size:96px;font-family:var(--display);color:var(--blue);line-height:1.1" lang="en">${esc(typed||'?')}</span>${sayBtn(e.word)}</div><form class="spell-input" data-f="spell"><label class="sr" for="spell">글자</label><input id="spell" maxlength="1" lang="en" autocomplete="off" autocapitalize="off" spellcheck="false" value="${esc(typed)}" ${S.answer?'disabled':''} placeholder="한 글자"></form>`,foot:confirmBtn(!!typed)}};
Q['L-type'].after=()=>{const f=$('#spell');if(!f)return;f.oninput=()=>{cur().typed=f.value;render()};f.closest('form').onsubmit=ev=>{ev.preventDefault();if(f.value)ACT.check()};f.focus();const v=f.value;f.value='';f.value=v};
// 선택형 문제를 묶어서 정의해요.

function correctOf(it,e){
 if(it.t==='K-pic')return picOf(e);
 switch(it.t){case 'listen':case 'meaning':return e.meaning;case 'reverse':case 'cloze':return e.word;case 'L-listen':return e.word;case 'L-case':case 'L-first':case 'L-type':return e.word.toLowerCase();default:return e.word}
}
ACT.sel=v=>{if(S?.answer)return;S.sel=Number(v);SND.tap();const it=cur();if(it.t==='listen'||it.t==='L-listen'){}render()};
ACT.introOk=()=>{S.i++;S.sel=null;render()};
ACT.tile=v=>{SND.tap();const it=cur(),e=curWord();it.picked.push(Number(v));const core=[...e.word].filter(ch=>/[a-z0-9']/i.test(ch)).join('');
 if(it.picked.length===core.length){const got=it.picked.map(i=>it.tiles.find(t=>t.i===i).ch).join('');answer(norm(got)===norm(core),got);return}render()};
ACT.untile=()=>{cur().picked.pop();render()};
ACT.hint=v=>{const it=cur();it.level=Number(v);render()};
ACT.check=()=>{const it=cur(),e=curWord();if(!it||S.answer)return;
 if(['spell','L-type'].includes(it.t)){const v=($('#spell')?.value||it.typed||'');it.typed=v;const ok=it.t==='L-type'?norm(v)===norm(e.word):norm(v)===norm(e.word);answer(ok,v,{hint:it.t==='spell'&&it.level<it.def});return}
 if(S.sel==null)return;const got=it.list[S.sel];answer(norm(got)===norm(correctOf(it,e)),got)};
ACT.skipSpeak=()=>{S.noSpeak=true;S.i++;S.sel=null;render()};
ACT.mic=()=>{const it=cur(),e=curWord();if(!Rec){ACT.skipSpeak();return}
 const r=new Rec();r.lang='en-US';r.interimResults=false;r.maxAlternatives=5;it.mic='on';render();
 r.onresult=ev=>{const alts=[...ev.results[0]].map(x=>x.transcript);const hit=alts.find(t=>norm(t).replace(/[^a-z' ]/g,'').split(' ').includes(norm(e.word))||norm(t).replace(/[^a-z' ]/g,'')===norm(e.word));it.heard=hit||alts[0];it.mic='idle';if(hit)answer(true,hit);else render()};
 r.onerror=()=>{it.mic='idle';it.heard=it.heard||'(잘 안 들렸어요)';render()};r.onend=()=>{if(it.mic==='on'){it.mic='idle';render()}};
 try{r.start()}catch{it.mic='idle';render()}};
function answer(ok,got,{hint=false}={}){
 const it=cur(),e=curWord();S.answer={ok,got,correct:correctOf(it,e)};S.graded++;
 const d=today();d.q++;if(ok){S.ok++;d.c++;d.xp+=10}else d.xp+=2;
 grade(e,ok,{hint});
 if(!ok){S.wrong.set(e.id,(S.wrong.get(e.id)||0)+1);if(S.kind!=='test'&&!S.requeued.has(e.id)){S.requeued.add(e.id);S.items.push({id:e.id,t:isLetter(e)?'L-listen':kidsWord(e)?'K-pic':(it.t==='speak'?'listen':it.t==='order'||it.t==='spell'?'reverse':it.t),again:true})}}
 sfx(ok);if(ok&&!isLetter(e))setTimeout(()=>say(e.word),150);
 persist();render();
}
function answerSheet(it,e){
 const a=S.answer,ex=exampleOf(e);
 const head=a.ok?pick(PRAISE.ok):pick(PRAISE.no);
 return `<section class="sheet ${a.ok?'ok':'no'}" aria-live="polite"><div class="sheet-in"><div class="head"><i>${I(a.ok?IC.check:IC.redo,26,3)}</i><h2>${esc(head)}</h2></div>
 <div class="ans">${picOf(e)&&!isLetter(e)?`<span class="pic-ans" aria-hidden="true">${picOf(e)}</span>`:''}<div style="min-width:0"><div class="nw" style="display:flex;align-items:baseline;gap:8px;flex-wrap:wrap"><span class="w" lang="en">${esc(e.word)}</span><span class="m">${esc(e.meaning)}</span></div>${ex&&!isLetter(e)?`<div class="nw ell" style="font-size:15px" lang="en">${esc(ex[0])}</div><div class="m ell">${esc(ex[1])}</div>`:''}${!a.ok&&a.got?`<div class="m">내 답: ${esc(a.got)}</div>`:''}</div>${sayBtn(isLetter(e)?e.word:(ex?.[0]||e.word))}</div>
 <button class="btn big primary" data-a="next" autofocus>계속하기</button>${!a.ok&&S.kind!=='test'?'<p class="note" style="text-align:center">이 단어는 조금 뒤에 한 번 더 나와요</p>':''}</div></section>`;
}
ACT.next=()=>{S.i++;S.answer=null;S.sel=null;render()};
ACT.quit=()=>{endTime();saveSession();const k=S?.kind;S=null;save();toast('여기까지 저장했어요. 나중에 이어서 할 수 있어요.');go(k==='step'||k==='test'||k==='retry'?'path':'today')};
function endTime(){if(S){today().ms+=Math.min(Date.now()-S.start,60*60*1000);S.start=Date.now()}}
function toast(msg){const t=document.createElement('div');t.setAttribute('role','status');t.style.cssText='position:fixed;left:50%;bottom:calc(110px + env(safe-area-inset-bottom));transform:translateX(-50%);background:#1F2430;color:#fff;padding:12px 18px;border-radius:14px;font-weight:700;font-size:14px;z-index:50;max-width:88vw;text-align:center';t.textContent=msg;document.body.append(t);setTimeout(()=>t.remove(),2600)}

/* ── 끝난 뒤 ── */
function finishSession(){
 setTimeout(()=>window.showCheer?.(),2500);
 endTime();trimDays();const s=S;S=null;state.session=null;
 const words=[...new Set(s.items.map(x=>x.id))].map(id=>C.byId.get(id)).filter(Boolean);
 if(s.kind==='test'){
  const right=s.items.length-s.wrong.size,pts=Math.round(right/s.items.length*100);
  const p=prog();p.tests[s.unit]=Math.max(p.tests[s.unit]||0,pts);persist();save();
  recordReport((s.unit+1)+'단원 시험 '+pts+'점'+(pts>=80?' · 통과':' · 다시 도전')+'\n틀린 단어 '+([...s.wrong.keys()].map(id=>C.byId.get(id)?.word).join(', ')||'없음'));
  if(pts>=80){scr('pass',{unit:s.unit,score:pts})}else scr('retry',{unit:s.unit,score:pts,wrong:[...s.wrong.keys()]});return;
 }
 const after=learned().length;
 const sb=new Set(s.stickersBefore||[]);const newStickers=stickerSnapshot().filter(x=>!sb.has(x));
 const res={newStickers,kind:s.kind,total:s.graded,ok:s.ok,newCount:s.newIds.size,before:s.learnedBefore,after,title:s.title,unit:s.unit,step:s.step,pair:pick(PRAISE.done)};
 recordReport(s.title+' 완료 · 정답 '+s.ok+'/'+s.graded+'\n공부한 단어 '+words.map(w=>w.word).join(', ')+'\n다시 볼 단어 '+([...s.wrong.keys()].map(id=>C.byId.get(id)?.word).join(', ')||'없음'));
 persist();save();
 if(s.kind==='retry'){scr('done',{...res,retryUnit:s.unit});return}
 scr('done',res);
}
SCREENS.done=p=>{
 const who=callName();
 return `<main class="screen narrow" style="padding-top:48px">${celebrate()}
 <section class="center"><h1 class="t-display">${esc(p.pair[0])}</h1><p>${esc((who?who+', ':'')+p.pair[1])}</p></section>
 <section class="tiles3"><div class="stat y"><span>정답</span><b>${p.ok}/${p.total}</b></div><div class="stat g"><span>새 단어</span><b>${p.newCount}개</b></div><div class="stat o"><span>연속</span><b>${streak()}일</b></div></section>
 ${p.newStickers?.length?`<section class="card stack center" style="background:var(--yellow-soft);border-color:transparent"><b class="t-display" style="font-size:20px;color:var(--yellow-t)">새 스티커를 받았어요!</b><div style="display:grid;grid-template-columns:repeat(auto-fit,72px);gap:10px;justify-content:center;width:100%">${p.newStickers.map(ch=>stickerHTML(stickerLetters().find(e=>e.word===ch))).join('')}</div><button class="btn sm" data-a="stickers">스티커 판 보기</button></section>`:''}<section class="card tight card-title"><span class="h-sm">익힌 단어</span><span class="nw" style="font-weight:700;color:var(--brand-t)">${p.before}개 → ${p.after}개</span></section>
 <div class="grow"></div>
 ${p.retryUnit!=null?`<button class="btn big blue" data-a="test" data-v="${p.retryUnit}">다시 시험 보기</button><button class="btn ghost full" data-a="tab" data-v="path">나중에 할래요</button>`:`<button class="btn big primary" data-a="tab" data-v="${p.kind==='step'?'path':'today'}">계속하기</button>`}</main>`;
};
function confetti(n=60){if(themeOf()==='calm'||matchMedia('(prefers-reduced-motion: reduce)').matches)return;const box=document.createElement('div');box.className='confetti';box.setAttribute('aria-hidden','true');const cols=['#FFC531','#12A578','#3D7BEA','#F08A24','#FF9FA0','#8A5CE0'];for(let i=0;i<n;i++){const e=document.createElement('i');e.style.left=Math.random()*100+'%';e.style.background=cols[i%cols.length];e.style.animationDuration=(1.6+Math.random()*1.6)+'s';e.style.animationDelay=Math.random()*.6+'s';box.append(e)}document.body.append(box);setTimeout(()=>box.remove(),4200)}
function celebrate(){setTimeout(()=>{confetti();SND.fanfare()},150);return `<div class="celebrate" style="position:relative;height:200px;display:flex;align-items:center;justify-content:center"><svg width="300" height="200" viewBox="0 0 300 200" aria-hidden="true" style="position:absolute;left:50%;top:0;transform:translateX(-50%)"><circle cx="40" cy="40" r="7" fill="#FFC531"/><circle cx="262" cy="56" r="6" fill="#3D7BEA"/><rect x="236" y="140" width="14" height="14" rx="3" fill="#FF9FA0" transform="rotate(20 243 147)"/><rect x="48" y="150" width="12" height="12" rx="3" fill="#12A578" transform="rotate(-15 54 156)"/><path d="M90 26l4 9 9 1-7 6 2 9-8-5-8 5 2-9-7-6 9-1z" fill="#FFC531"/><path d="M214 18l3 7 7 1-5 5 1 7-6-4-6 4 1-7-5-5 7-1z" fill="#FFC531"/></svg><span style="position:relative">${mascot(160,'happy')}</span></div>`}
ACT.test=v=>startTest(Number(v));
['done','retry','pass','reward'].forEach(n=>queueMicrotask(()=>{if(SCREENS[n])SCREENS[n].focus=true}));
SCREENS.retry=p=>{
 const ws=p.wrong.map(id=>C.byId.get(id)).filter(Boolean);
 return `<main class="screen narrow" style="padding-top:44px"><div class="center">${mascot(130,'cheer')}</div>
 <section class="center"><span class="tag o" style="height:32px;padding:0 14px;font-size:14px">${p.unit+1}단원 시험 ${p.score}점 · 통과는 80점부터</span><h1 class="t-display" style="color:var(--ink);font-size:28px">아깝다! 거의 다 왔어요</h1><p>틀린 ${ws.length}개만 익히면 바로 통과해요</p></section>
 <section class="card flush">${ws.map(e=>`<div class="lrow two"><b lang="en">${esc(e.word)}</b><span class="v">${esc(e.meaning)}</span></div>`).join('')}</section>
 <div class="grow"></div><button class="btn big primary" data-a="retryGo" data-v="${p.unit}">${ws.length}개 연습하고 다시 도전</button><button class="btn ghost full" data-a="tab" data-v="path">나중에 할래요</button></main>`;
};
ACT.retryGo=v=>startRetry(Number(v),V.p.wrong);
SCREENS.pass=p=>{
 const paired=state.cloudRole==='student';
 return `<main class="screen narrow" style="padding-top:44px">${celebrate()}<section class="center"><span class="tag b" style="height:32px;padding:0 14px;font-size:14px">${p.unit+1}단원 시험 ${p.score}점 · 통과!</span><h1 class="t-display">${esc(pick(['단원 정복!','시험 통과!','최고예요!']))}</h1><p>${esc((callName()?callName()+', ':'')+'다음 단원이 열렸어요.')}</p></section><div class="grow"></div>
 ${paired?`<button class="btn big primary" data-a="toReward">선물 쿠폰 고르러 가기</button>`:`<button class="btn big primary" data-a="tab" data-v="path">다음 단원으로</button>`}</main>`;
};
ACT.toReward=async()=>{const cfg=await loadCouponConfig();scr('reward',{...V.p,cfg})};
function couponOptions(cfg,score){const big=score>=(cfg.high||95);const out=[];
 (cfg.items||[]).forEach(it=>{const kind=COUPON_KINDS[it.k];if(!kind)return;let idx=-1;it.sizes.forEach((s,i)=>{if(it.on[i]&&(i===0||big))idx=i});if(idx<0)return;out.push({k:it.k,title:kind[0]+' '+it.sizes[idx],color:kind[1]})});
 (cfg.custom||[]).filter(x=>x.on).forEach(x=>out.push({k:'custom',title:x.title,color:'g'}));
 return out}
const COLOR={b:['var(--blue-d)','var(--blue-soft)','var(--blue)'],p:['var(--purple-d)','var(--purple-soft)','var(--purple)'],g:['var(--brand-d)','var(--brand-soft)','var(--brand)'],o:['var(--orange-d)','var(--orange-soft)','var(--orange)'],y:['var(--yellow-t)','var(--yellow-soft)','#F59E0B'],r:['var(--red-t)','var(--red-soft)','var(--red)']};
SCREENS.reward=p=>{
 const list=couponOptions(p.cfg||COUPON_DEFAULT,p.score);V.p.list=list;const sel=V.p.sel??0;
 if(!list.length)return `<main class="screen narrow"><div class="center" style="padding-top:60px">${mascot(120,'happy')}<h1 class="t-display">시험 통과!</h1><p>보호자가 아직 쿠폰을 준비하지 않았어요.</p></div><div class="grow"></div><button class="btn big primary" data-a="tab" data-v="path">다음 단원으로</button></main>`;
 return `<main class="screen narrow" style="padding-top:36px"><section class="center"><span class="tag b" style="height:32px;padding:0 14px;font-size:14px">${p.unit+1}단원 시험 ${p.score}점 · 통과!</span><h1 class="t-display">선물 쿠폰을 골라요</h1><p>${p.score>=(p.cfg?.high||95)?'점수가 높아서 큰 쿠폰도 고를 수 있어요':'점수에 맞는 쿠폰 중 하나를 골라요'}</p></section>
 <section class="stack" role="radiogroup" aria-label="쿠폰 고르기">${list.map((c,i)=>{const [fg,bg,line]=COLOR[c.color]||COLOR.g;const on=i===sel;return `<button type="button" class="coupon" role="radio" aria-checked="${on}" data-a="cpick" data-v="${i}" style="color:${line};${on?`border-color:${line};background:${bg}`:''}"><span class="ci" style="background:${on?'#fff':bg};color:${fg}">${I(IC[COUPON_ICON[c.k]]||IC.gift,30)}</span><span class="ct"><b style="color:var(--ink)">${esc(c.title)}</b><small>보호자에게 보여 주고 써요</small></span><span class="ck" style="${on?`background:${line}`:''}">${I(IC.check,18,3)}</span></button>`}).join('')}</section>
 <p class="note" style="text-align:center;display:flex;gap:6px;justify-content:center;align-items:center">${I(IC.bell,16)}쓸 때는 보호자에게 알림이 가요</p><div class="grow"></div>
 <button class="btn big primary" data-a="cget">${esc(list[sel].title)} 쿠폰 받기</button></main>`;
};
ACT.cpick=v=>{V.p.sel=Number(v);render()};
ACT.cget=async(v,el)=>{const c=V.p.list[V.p.sel??0];el.disabled=true;
 try{const cl=await cloud(),u=await me();await cl.store.setDoc(fdoc(cl,'families',u.family,'couponLog',crypto.randomUUID()),{uid:u.uid,name:u.name||'',title:c.title,status:'earned',time:cl.store.serverTimestamp()});SND.coin();confetti(40);toast(c.title+' 쿠폰을 받았어요!');go('me')}
 catch{el.disabled=false;toast('쿠폰을 받지 못했어요. 인터넷 연결을 확인해 주세요.')}};

/* ── 문법 6단계 (기존 레슨 이식) ── */
const GSTEPS=['이해하기','예문','고르기','쓰기','문장 만들기','정리'];
let gs={key:'',step:0,done:{}};
function gMark(en,hl=[]){return esc(en).split(/(\s+)/).map(tok=>{const bare=tok.replace(/[.,!?]+$/,'');return hl.includes(bare)?'<mark>'+bare+'</mark>'+tok.slice(bare.length):tok}).join('')}
SCREENS.grammar=p=>{
 const gi=p.i,L=WORDSTEP_LESSONS[C.id]?.[gi],item=C.grammar[gi];
 if(!item)return SCREENS.path();
 if(!L)return oldGrammar(gi,item);
 const key=C.id+':'+gi;if(gs.key!==key)gs={key,step:0,done:{}};const step=gs.step;
 let body='';
 if(step===0){body=L.story.map(t=>`<div class="card gl-story"><p>${esc(t)}</p></div>`).join('')+(L.compare?`<div class="card gl-compare"><b>우리말과 비교</b><p>${esc(L.compare)}</p></div>`:'')+(L.table?`<div class="card gl-table"><table>${L.table.map(([a,b])=>`<tr><th>${esc(a)}</th><td lang="en">${esc(b)}</td></tr>`).join('')}</table></div>`:'')}
 if(step===1)body=L.examples.map(x=>`<div class="card gl-ex"><div style="min-width:0"><p class="gl-en" lang="en">${gMark(x.en,x.hl)}</p><p class="gl-ko">${esc(x.ko)}</p></div>${sayBtn(x.en)}</div>`).join('');
 if(step===2)body=L.choose.map((x,qi)=>{const done=gs.done['c'+qi],tried=gs.done['t'+qi]||[];const ow=o=>[...o].reduce((n,ch)=>n+(ch.charCodeAt(0)>255?2:1),0);const long=x.options.some(o=>ow(o)>(x.options.length>2?6:12));
  return `<div class="card"><span class="gl-num">${qi+1}</span><p class="gl-en" lang="en">${esc(x.q)}</p>${x.ko?`<p class="gl-ko">${esc(x.ko)}</p>`:''}<div class="gl-opts${long?' long':''}">${x.options.map(o=>`<button class="opt${done&&o===x.answer?' right':tried.includes(o)?' wrong':''}" data-a="gch" data-v="${qi}|${esc(o)}" ${done||tried.includes(o)?'disabled':''} lang="en">${esc(o)}</button>`).join('')}</div>${done?`<p class="gl-why ok">정답! ${esc(x.why)}</p>`:tried.length?`<p class="gl-why no">아쉬워요. ${esc(L.wrongs?.[tried.at(-1)]||'')} 다시 골라 봐요.</p>`:''}</div>`}).join('');
 if(step===3)body=L.write.map((x,qi)=>{const st=gs.done['w'+qi];return `<div class="card"><span class="gl-num">${qi+1}</span><p class="gl-en" lang="en">${esc(x.q)}</p>${x.ko?`<p class="gl-ko">${esc(x.ko)}</p>`:''}<form class="gl-write" data-gw="${qi}"><input class="input" lang="en" autocomplete="off" autocapitalize="off" spellcheck="false" aria-label="빈칸 답" ${st?`value="${esc(x.answer)}" disabled`:''}><button class="btn primary" ${st?'disabled':''}>확인</button></form>${st?`<p class="gl-why ${st==='ok'?'ok':'no'}">${st==='ok'?'정답! ':'정답은 '+esc(x.answer)+'예요. '}${esc(x.why)}</p>`:gs.done['wt'+qi]?`<p class="gl-why no">한 번 더 생각해 봐요. 힌트: ${esc(x.why.split('.')[0])}.</p>`:''}</div>`}).join('');
 if(step===4)body=L.build.map((x,qi)=>{const done=gs.done['b'+qi];const order=gs.done['o'+qi]??=shuffle(x.words.map((w,i)=>i));const picked=done?x.words.map((_,i)=>i):(gs.done['p'+qi]??=[]);
  return `<div class="card"><span class="gl-num">${qi+1}</span><p class="gl-ko" style="font-size:15px;color:var(--ink)">${esc(x.ko)}</p><p class="gl-built" lang="en">${esc(picked.map(i=>x.words[i]).join(' '))||'…'}</p><div class="gl-tiles">${order.map(i=>`<button class="tile" data-a="gb" data-v="${qi}|${i}" ${done||picked.includes(i)?'disabled':''} lang="en">${esc(x.words[i])}</button>`).join('')}</div>${done?`<p class="gl-why ok">완벽해요! ${esc(x.why)}</p>`:`<div class="btns" style="justify-content:center;margin-top:10px"><button class="btn sm" data-a="gbUndo" data-v="${qi}">하나 지우기</button><button class="btn sm" data-a="gbShow" data-v="${qi}">정답 보기</button></div>${gs.done['bx'+qi]?'<p class="gl-why no">순서를 다시 생각해 봐요. 영어는 보통 "누가 → 한다 → 무엇을" 순서예요.</p>':''}`}</div>`}).join('');
 if(step===5)body=`<div class="card gl-summary"><small>한 줄 정리</small><p>${esc(L.summary)}</p></div>`+(L.mistake?`<div class="card gl-mistake"><b>자주 하는 실수</b><p class="gl-en no" lang="en">✗ ${esc(L.mistake.wrong)}</p><p class="gl-en ok" lang="en">○ ${esc(L.mistake.right)}</p><p class="gl-ko">${esc(L.mistake.why)}</p></div>`:'');
 const doneAll=prog().grammar.includes(gi);
 return `<main class="screen focus narrow"><header class="qhead"><button class="iconbtn" data-a="tab" data-v="path" aria-label="닫기">${I(IC.x,24,2.4)}</button><ol class="gl-steps" aria-label="학습 단계">${GSTEPS.map((n,i)=>`<li class="${i<step?'done':i===step?'now':''}"></li>`).join('')}</ol><span class="cnt">${step+1}/6</span></header>
 <section class="stack" style="gap:4px"><span class="qkind o">문법 · ${GSTEPS[step]}</span><h1 class="qtitle">${esc(item[0])}</h1></section>${body}<p class="note no" id="gNote" role="status"></p><div class="grow"></div>
 <div class="btns two">${step>0?'<button class="btn" data-a="gstep" data-v="-1">이전</button>':'<span></span>'}${step<5?'<button class="btn primary" data-a="gstep" data-v="1">다음</button>':`<button class="btn primary" data-a="gdone">${doneAll?'다음 문법으로':'학습 완료'}</button>`}</div></main>`;
};
SCREENS.grammar.focus=true;
SCREENS.grammar.after=p=>{document.querySelectorAll('[data-gw]').forEach(f=>f.onsubmit=ev=>{ev.preventDefault();const qi=Number(f.dataset.gw),x=WORDSTEP_LESSONS[C.id][p.i].write[qi],v=f.querySelector('input').value;if(!v.trim())return;
 if(norm(v)===norm(x.answer)){gs.done['w'+qi]='ok';sfx(true)}else if(gs.done['wt'+qi]){gs.done['w'+qi]='no';sfx(false)}else{gs.done['wt'+qi]=1;sfx(false)}render()})};
ACT.gch=v=>{const [qi,o]=[Number(v.split('|')[0]),v.slice(v.indexOf('|')+1)];const x=WORDSTEP_LESSONS[C.id][V.p.i].choose[qi];if(o===x.answer){gs.done['c'+qi]=true;sfx(true)}else{(gs.done['t'+qi]??=[]).push(o);sfx(false)}render()};
ACT.gb=v=>{const [qi,i]=v.split('|').map(Number);const x=WORDSTEP_LESSONS[C.id][V.p.i].build[qi];const p=gs.done['p'+qi]??=[];p.push(i);gs.done['bx'+qi]=0;
 if(p.length===x.words.length){if(p.map(k=>x.words[k]).join(' ')===x.words.join(' ')){gs.done['b'+qi]=true;sfx(true);say(x.words.join(' '))}else{gs.done['p'+qi]=[];gs.done['bx'+qi]=1;sfx(false)}}render()};
ACT.gbUndo=v=>{gs.done['p'+v]?.pop();render()};
ACT.gbShow=v=>{gs.done['b'+v]=true;render()};
ACT.gstep=v=>{const L=WORDSTEP_LESSONS[C.id][V.p.i];const step=gs.step;if(Number(v)>0){const need={2:L.choose.map((_,i)=>'c'+i),3:L.write.map((_,i)=>'w'+i),4:L.build.map((_,i)=>'b'+i)}[step]||[];const left=need.filter(k=>!gs.done[k]).length;if(left){$('#gNote').textContent='아직 '+left+'문제가 남았어요. 모두 풀고 넘어가요.';return}}gs.step=Math.max(0,Math.min(5,step+Number(v)));render();scrollTo(0,0)};
ACT.gdone=()=>{const gi=V.p.i,p=prog();if(!p.grammar.includes(gi)){p.grammar.push(gi);const d=today();d.xp+=30;d.q+=1;d.c+=1;persist();save();recordReport('문법 학습 완료 · '+C.grammar[gi][0]+'\n6단계 모두 마침');toast(pick(['정답! 문법 박사네요.','완벽해요! 이 문법은 이제 내 거예요.','최고예요! 영어 문장이 술술 나와요.']));render();return}
 if(gi+1<C.grammar.length)scr('grammar',{i:gi+1});else{toast('이 과정의 문법을 모두 마쳤어요!');go('path')}};
function oldGrammar(gi,item){const [title,explain,examples,...qs]=item;return `<main class="screen focus narrow"><header class="hdr3"><button class="iconbtn" data-a="tab" data-v="path" aria-label="닫기">${I(IC.x,24)}</button><h1 class="t-display">${esc(title)}</h1><span></span></header><div class="card"><p style="margin:0;line-height:1.7">${esc(explain)}</p><p class="gl-en" lang="en" style="margin-top:10px">${esc(examples)}</p></div><div class="grow"></div><button class="btn big primary" data-a="gdone">학습 완료</button></main>`}
function nextGrammar(){const p=prog();for(let i=0;i<C.grammar.length;i++)if(!p.grammar.includes(i))return i;return -1}
async function openGrammar(i){await ensureLessons(C.id);gs={key:'',step:0,done:{}};scr('grammar',{i})}
ACT.gram=v=>openGrammar(Number(v));

/* ── 영어 대화 (대본형) ── */
const LEVEL_NAMES={basic:'기초',mid:'중급',adv:'고급',middle:'중등',high:'고등',univ:'대학'};
const talkPartner={first(sc){return {en:sc.turns[0].p,ko:sc.turns[0].k}},replies(sc,i){return sc.turns[i].r},after(sc,i){const t=sc.turns[i],n=sc.turns[i+1];return {reaction:t.then||null,next:n?{en:n.p,ko:n.k}:null}}};
let talk=null;
function talkScore(heard,target){const words=t=>t.toLowerCase().replace(/[^a-z0-9' ]/g,' ').split(/\s+/).filter(Boolean);const h=words(heard),g=words(target);if(!g.length)return 0;let hit=0;const pool=[...h];g.forEach(w=>{const k=pool.indexOf(w);if(k>=0){hit++;pool.splice(k,1)}});return hit/Math.max(g.length,h.length)}
function talkListHTML(){
 if(!window.WORDSTEP_DIALOGS){loadScript('./courses/dialogs.js').then(()=>{if(V.tab==='path')render()}).catch(()=>{});return '<p class="empty">대화를 불러오고 있어요.</p>'}
 const order=Object.keys(LEVEL_NAMES),curLv=LEVEL_NAMES[C.id]?C.id:'basic';
 const list=[...WORDSTEP_DIALOGS].sort((a,b)=>(b.level===curLv)-(a.level===curLv)||order.indexOf(a.level)-order.indexOf(b.level));
 return `<div class="card flush">${list.map(sc=>`<button class="talk-card" data-a="talk" data-v="${esc(sc.id)}"><span class="tag ${sc.level===curLv?'g':'gray'}">${LEVEL_NAMES[sc.level]}</span><span style="min-width:0"><b>${esc(sc.title)}</b><small>${esc(sc.desc)}</small></span>${state.talkDone.includes(sc.id)?`<span class="tag g">완료</span>`:I(IC.next,16,2.4)}</button>`).join('')}</div>`;
}
ACT.talk=v=>{talk={id:v,i:0,log:[],good:0,miss:false,hideKo:state.talkHideKo||false,order:{},tried:{},done:false};scr('talk')};
SCREENS.talk=()=>{
 const sc=window.WORDSTEP_DIALOGS?.find(d=>d.id===talk?.id);if(!sc)return SCREENS.path();
 if(!talk.log.length){const f=talkPartner.first(sc);talk.log.push({who:'p',en:f.en,ko:f.ko});setTimeout(()=>say(f.en),250)}
 const chat=talk.log.map((m,k)=>m.who==='tip'?`<div class="tip"><b>이렇게 말하면 더 자연스러워요</b><p lang="en">✗ ${esc(m.en)}</p><p lang="en" style="color:var(--brand-d);font-weight:700">○ ${esc(m.better)}</p><small>${esc(m.fix)}</small></div>`
  :`<div class="bub ${m.who==='me'?'me':''}" data-a="say" data-v="${esc(m.en)}"><p class="en" lang="en">${esc(m.en)}</p>${m.ko&&!talk.hideKo?`<p class="ko">${esc(m.ko)}</p>`:''}${m.heard?`<small>들린 말: ${esc(m.heard)}</small>`:''}</div>`).join('');
 let box='';
 if(talk.done){const all=talk.good===sc.turns.length,p=pick(PRAISE.done);
  box=`<div class="card center"><span class="tag g">대화 완료</span><h2 class="t-display" style="margin:4px 0 0;font-size:26px;color:var(--brand-t)">${esc(all?p[0]:'끝까지 해냈어요!')}</h2><p class="note">자연스러운 대답 ${talk.good} / ${sc.turns.length}</p></div><h3 class="sec-label">오늘의 표현</h3><div class="card flush">${sc.keys.map(([en,ko])=>`<div class="lrow two"><span style="min-width:0"><b lang="en" style="display:block">${esc(en)}</b><small class="muted">${esc(ko)}</small></span>${sayBtn(en)}</div>`).join('')}</div><div class="btns two"><button class="btn" data-a="talk" data-v="${esc(sc.id)}">다시 하기</button><button class="btn primary" data-a="tab" data-v="path">다른 대화</button></div>`}
 else{const replies=talkPartner.replies(sc,talk.i);talk.order[talk.i]??=shuffle(replies.map((_,i)=>i));const tried=talk.tried[talk.i]||[];
  box=`<h3 class="sec-label">내 대답 고르기</h3><div class="stack">${talk.order[talk.i].map(idx=>{const r=replies[idx];return `<button class="choice" data-a="treply" data-v="${idx}" ${tried.includes(r.e)?'disabled':''}><b lang="en">${esc(r.e)}</b>${r.k&&!talk.hideKo?`<small>${esc(r.k)}</small>`:''}</button>`}).join('')}</div>${Rec?`<button class="btn full" data-a="tmic">${I(IC.mic,20)} 말해서 대답하기</button>`:''}<p class="note" id="talkNote" role="status"></p>`}
 return `<main class="screen focus narrow"><header class="hdr3" style="grid-template-columns:44px minmax(0,1fr) auto;gap:8px"><button class="iconbtn" data-a="tab" data-v="path" aria-label="닫기">${I(IC.x,24,2.4)}</button><h1 class="t-display">${esc(sc.title)}</h1><button class="btn sm" data-a="tko" style="margin:0;box-shadow:none;padding:0 10px">${talk.hideKo?'해석 보기':'해석 숨김'}</button></header><p class="note" style="text-align:center">${LEVEL_NAMES[sc.level]} · ${esc(sc.role)} · 상대: ${esc(sc.partner)}</p><section class="chat">${chat}</section>${box}</main>`;
};
SCREENS.talk.focus=true;
SCREENS.talk.after=()=>{const last=document.querySelector('.chat>:last-child');if(talk&&talk.log.length>1)(talk.done?document.querySelector('.chat'):last)?.scrollIntoView({block:'center'})};
ACT.tko=()=>{talk.hideKo=!talk.hideKo;state.talkHideKo=talk.hideKo;persist();render()};
function talkHandle(r,heard){
 const sc=WORDSTEP_DIALOGS.find(d=>d.id===talk.id);
 if(!r.ok){talk.miss=true;(talk.tried[talk.i]??=[]).push(r.e);talk.log.push({who:'tip',en:r.e,better:r.better,fix:r.fix});sfx(false);render();return}
 if(!talk.miss)talk.good++;talk.miss=false;talk.log.push({who:'me',en:r.e,ko:r.k,heard});sfx(true);
 const a=talkPartner.after(sc,talk.i),spoken=[];if(a.reaction){talk.log.push({who:'p',en:a.reaction,ko:''});spoken.push(a.reaction)}
 if(a.next){talk.i++;talk.log.push({who:'p',en:a.next.en,ko:a.next.ko});spoken.push(a.next.en)}
 else{talk.done=true;if(!state.talkDone.includes(sc.id))state.talkDone.push(sc.id);const d=today();d.xp+=20;d.q+=1;d.c+=1;persist();save();recordReport('영어 대화 완료 · '+sc.title+'\n자연스러운 대답 '+talk.good+'/'+sc.turns.length)}
 if(spoken.length)setTimeout(()=>say(spoken.join(' ')),200);render();
}
ACT.treply=v=>{const sc=WORDSTEP_DIALOGS.find(d=>d.id===talk.id);talkHandle(talkPartner.replies(sc,talk.i)[Number(v)])};
ACT.tmic=(v,el)=>{const sc=WORDSTEP_DIALOGS.find(d=>d.id===talk.id),replies=talkPartner.replies(sc,talk.i);const r=new Rec();r.lang='en-US';r.interimResults=false;r.maxAlternatives=3;const note=$('#talkNote');note.className='note';note.textContent='듣고 있어요. 고른 문장을 영어로 말해 보세요.';el.disabled=true;
 r.onresult=e=>{const alts=[...e.results[0]].map(x=>x.transcript);let best=null,score=0,heard=alts[0];for(const t of alts)for(const x of replies){if((talk.tried[talk.i]||[]).includes(x.e))continue;const s=talkScore(t,x.e);if(s>score){score=s;best=x;heard=t}}
  if(best&&score>=.6)talkHandle(best,heard);else{note.className='note no';note.textContent='잘 안 들렸어요. 들린 말: "'+heard+'" 다시 말해 볼까요?';el.disabled=false}};
 r.onerror=()=>{note.className='note no';note.textContent='마이크를 쓸 수 없어요. 대답을 눌러서 골라 주세요.';el.disabled=false};r.onend=()=>{el.disabled=false};try{r.start()}catch{el.disabled=false}};
