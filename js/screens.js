'use strict';
/* 워드스텝 v2 — 탭 화면: 오늘, 학습 지도, 내 단어, 나 */

/* ── 오늘 ── */
function resumeCardHTML(){const s=savedSession();if(!s)return '';const pct=Math.round(s.i/s.items.length*100);
 return `<section class="card stack" style="border-color:var(--yellow);background:#FFFBEA"><div class="card-title"><span class="h-sm" style="color:var(--yellow-t)">하다 만 학습이 있어요</span><span class="tag y" style="background:var(--yellow-soft);color:var(--yellow-t)">${s.i}/${s.items.length}</span></div>
 <b class="ell" style="font-size:17px">${esc(s.title||'학습')}</b><div class="bar" style="height:10px"><i style="width:${pct}%;background:var(--yellow)"></i></div>
 <div class="btns two62"><button class="btn" data-a="dropSession" style="margin:0">처음부터</button><button class="btn primary" data-a="resume" style="margin:0">이어서 하기</button></div></section>`}
ACT.resume=()=>{if(!resumeSession())toast('이어 할 학습이 없어요.')};
ACT.dropSession=()=>{if(!confirm('하던 학습을 지우고 처음부터 할까요? 이미 맞힌 단어 기록은 남아요.'))return;const s=state.session;state.session=null;persist();if(s?.kind==='test')startTest(s.unit);else if(s?.kind==='step')startStep(s.unit,s.step);else render()};
function courseProgress(){const total=allWords().length,lw=learned().length,mastered=learned().filter(e=>W(e.id).lv>=5).length,passed=C.units.filter((_,u)=>unitDone(u)).length,u=currentUnit(),steps=stepsOf(u),k=steps.findIndex((_,j)=>!stepDone(u,j));return {total,lw,mastered,passed,units:C.units.length,u,k,steps:steps.length}}
function progressCardHTML(){const p=courseProgress();if(!p.total)return '';const pct=Math.round(p.lw/p.total*100);
 return `<button class="card stack" data-a="tab" data-v="path" style="text-align:left;width:100%;cursor:pointer"><div class="card-title"><span class="h-sm">내 진도 · ${esc(COURSES[C.id]?.name||'')} 과정</span>${I(IC.next,16,2.4,'style="color:#9AA1AE"')}</div>
 <div class="tiles3"><div class="stat g"><span>지금 단원</span><b>${p.u+1}<small style="font-size:14px;font-weight:500;color:var(--muted)">/${p.units}</small></b></div><div class="stat b"><span>통과한 시험</span><b>${p.passed}개</b></div><div class="stat y"><span>익힌 단어</span><b>${p.lw}</b></div></div>
 <div><div class="goal-row" style="margin-bottom:6px;font-size:13px"><span class="muted">${esc(C.units[p.u]?.name||'')} · ${p.k<0?'시험만 남았어요':(p.k+1)+'번째 걸음'}</span><span>전체 ${pct}%</span></div><div class="bar" style="height:10px"><i style="width:${pct}%"></i></div></div></button>`}
SCREENS.today=()=>{
 if(C.id==='kids')return kidsToday();
 const d=today(),goal=state.goal||20,pct=Math.min(100,Math.round(d.q/goal*100));
 const nw=nextNewWords(5).length,due=dueWords().length,weak=weakWords().length,g=nextGrammar();
 const who=callName();
 const rows=[
  ['start',IC.plus,'g','새 단어',nw?nw+'개':'모두 익힘'],
  ['review',IC.redo,'b','잊을 때쯤 복습',due+'개'],
  ...(weak?[['weak',IC.target,'r','약한 단어 5분 세트',weak+'개']]:[]),
  ...(g>=0?[['gramNext',IC.gram,'o','오늘의 문법 한 가지','1개']]:[]),
  ['talkTab',IC.chat,'p','영어 대화',(window.WORDSTEP_DIALOGS?WORDSTEP_DIALOGS.length:15)+'가지']];
 const wk=weekDays(),todayK=dayKey();
 return `<main class="screen">
 <header class="top-chips"><button class="chip btn-chip" data-a="tab" data-v="me"><span style="width:8px;height:8px;border-radius:4px;background:var(--brand)"></span>${esc(COURSES[C.id]?.name||'')} 과정</button><span class="r">${state.cloudRole?`<button class="chip b btn-chip" data-a="open" data-v="league">${I(IC.trophy,16,1.6)}리그${leagueRank()?' '+leagueRank()+'등':''}</button>`:''}<span class="chip y">${I(IC.flame,18)}${streak()}일 연속</span></span></header>
 <div class="split"><div>
 <section class="card hello">${mascot(88)}<div style="min-width:0"><p>${who?esc(who)+', 반가워요!':'반가워요!'}</p><h1 class="t-display">오늘도 한 걸음<br>같이 걸어 볼까요?</h1></div></section>
 ${resumeCardHTML()}${connectTipHTML()}${cheerHTML()}
 <section class="card"><div class="goal-row"><span>오늘 목표</span><span>${Math.min(d.q,goal)} / ${goal} 문제</span></div><div class="bar"><i style="width:${pct}%"></i></div></section>
 <section class="card tight"><div class="week">${wk.map((k,i)=>`<div>${'월화수목금토일'[i]}<i class="${state.days[k]?.q?'on':''} ${k===todayK?'today':''}"></i></div>`).join('')}</div></section>
 </div><div>
 ${progressCardHTML()}
 <h2 class="sec-label">오늘 할 일</h2>
 <section class="card flush list">${rows.map(([a,ic,c,t,v])=>`<button class="lrow" data-a="${a}"><span class="ico ${c}">${I(ic,22)}</span><span class="t">${t}</span><span class="v">${v}</span></button>`).join('')}</section>
 </div></div>
 ${savedSession()?`<button class="btn big primary" data-a="resume">이어서 하기</button>`:`<button class="btn big primary" data-a="start">${d.q>=goal?'목표 달성! 더 공부하기':'오늘 학습 시작'}</button>`}
 </main>`;
};
function kidsToday(){
 const letters=allWords().filter(isLetter);const nxt=nextNewWords(1)[0]||letters.find(e=>(W(e.id)?.lv||0)<5)||letters[0];
 const ex=nxt?.extra?.ex;const who=callName();
 return `<main class="screen">
 <header class="hello" style="gap:12px">${mascot(72)}<div class="card tight t-display" style="flex:1;font-size:22px;padding:12px 16px">${who?esc(who)+', ':''}같이 놀자!</div></header>
 ${resumeCardHTML()}${connectTipHTML()}
 ${nxt?`<section class="card letter-card"><span class="t-display muted" style="font-size:18px">${isLetter(nxt)?'오늘의 글자':'오늘의 단어'}</span>${isLetter(nxt)?`<div class="letter-big"><span class="u">${esc(nxt.word)}</span><span class="l">${esc(nxt.word.toLowerCase())}</span></div>`:`<div class="t-display" style="font-size:56px;color:var(--blue)" lang="en">${esc(nxt.word)}</div>`}${ex?`<div class="t-display" style="font-size:30px" lang="en"><span style="color:var(--blue)">${esc(ex[0][0])}</span>${esc(ex[0].slice(1))} <span class="muted" style="font-size:20px">${esc(ex[1])}</span></div>`:`<div class="t-display muted" style="font-size:22px">${esc(nxt.meaning)}</div>`}</section>`:''}
 <section class="tiles3">
  <button class="btn blue t-display" style="height:96px;flex-direction:column;gap:6px;font-size:19px;font-weight:400;border-radius:24px" data-a="open" data-v="abc">${I(IC.speaker,30)}ABC 노래</button>
  <button class="btn t-display" style="height:96px;flex-direction:column;gap:6px;font-size:19px;font-weight:400;border-radius:24px;background:var(--orange);border-color:var(--orange);color:#fff;box-shadow:0 6px 0 var(--orange-d)" data-a="kidsWrite">${I(IC.pencil,30)}따라 쓰기</button>
  <button class="btn t-display" style="height:96px;flex-direction:column;gap:6px;font-size:19px;font-weight:400;border-radius:24px;background:var(--purple);border-color:var(--purple);color:#fff;box-shadow:0 6px 0 var(--purple-d)" data-a="match">${I(IC.star,30)}짝 맞추기</button>
 </section>
 <button class="card tight stack" data-a="stickers" style="text-align:left;width:100%;cursor:pointer;display:flex"><div class="card-title"><span class="t-display nw" style="font-size:18px">알파벳 스티커 판</span><span class="tag y" style="background:var(--yellow-soft);color:var(--yellow-t)">${letters.filter(stickerOn).length} / 26</span></div><div class="sticker-grid mini">${letters.slice(0,26).map(e=>stickerHTML(e,true)).join('')}</div></button>
 <div class="grow"></div><button class="btn big primary" data-a="start">놀이 시작</button></main>`;
}
ACT.kidsWrite=()=>{const pool=learned().filter(isLetter);const nxt=nextNewWords(1)[0];const list=pool.length?shuffle(pool).slice(0,4):nxt&&isLetter(nxt)?[nxt]:stickerLetters().slice(0,1);if(!list.length)return;mkSession('trace',list.flatMap(e=>[{id:e.id,t:'L-trace'},{id:e.id,t:'L-trace',lower:true}]),{title:'따라 쓰기'})};
ACT.start=()=>startDaily();
ACT.review=()=>startReviewAll();
ACT.weak=()=>startWeak();
ACT.gramNext=()=>{const g=nextGrammar();if(g>=0)openGrammar(g)};
ACT.talkTab=()=>{state.pathSeg='talk';go('path')};
function cheerHTML(){const c=state.cheer;if(!c||c.seen)return '';return `<section class="card tight" style="background:var(--yellow-soft);border-color:transparent;display:grid;grid-template-columns:minmax(0,1fr) auto;gap:10px;align-items:center"><span><b class="nw" style="display:block;font-size:13px;color:var(--yellow-t)">${esc(c.from||'보호자')}의 칭찬 한마디</b><span style="font-weight:700">${esc(c.text)}</span></span><button class="iconbtn" data-a="cheerOk" aria-label="닫기">${I(IC.x,20)}</button></section>`}
ACT.cheerOk=()=>{if(state.cheer)state.cheer.seen=true;persist();document.querySelector('.cheer-pop')?.remove();if(!S)render()};
let leagueCache=null;
function leagueRank(){if(!leagueCache)return 0;const i=leagueCache.findIndex(x=>x.uid===state.cloudUid);return i>=0?i+1:0}

/* ── 학습 지도 ── */
const ZIG=[0,-64,-24,40,64,8,-48];
SCREENS.path=()=>{
 const seg=state.pathSeg||'words';
 const segs=`<div class="seg" role="tablist" aria-label="학습 종류">${[['words','단어 길'],['grammar','문법'],['talk','영어 대화']].map(([k,l])=>`<button role="tab" aria-selected="${seg===k}" data-a="pseg" data-v="${k}">${l}</button>`).join('')}</div>`;
 let body='';
 if(seg==='grammar'){
  if(!C.grammar.length)body='<div class="card empty">이 과정에는 문법이 없어요. 기초·중급·고급·중등·고등·대학 과정에서 문법을 공부할 수 있어요.</div>';
  else{const p=prog();body=`<div class="glist">${C.groups.map(([label,from,to])=>`<h3>${esc(label)}</h3><div class="card flush">${C.grammar.slice(from,to).map((g,k)=>{const i=from+k,done=p.grammar.includes(i);return `<button class="lrow" data-a="gram" data-v="${i}"><span class="ico ${done?'g':'o'}">${I(done?IC.check:IC.gram,20)}</span><span class="t">${i+1}. ${esc(g[0])}</span><span class="v">${done?'완료':''}</span></button>`}).join('')}</div>`).join('')}</div>`}
 }else if(seg==='talk')body=talkListHTML();
 else body=pathWords();
 return `<main class="screen narrow"><header class="hdr"><h1 class="t-display">학습 지도</h1><span class="chip">${esc(COURSES[C.id]?.name||'')}</span></header>${segs}${body}</main>`;
};
ACT.pseg=v=>{state.pathSeg=v;persist();render()};
function pathWords(){
 if(!C.units.length)return '<div class="card empty">아직 단어가 없어요.</div>';
 const u=Math.min(state.pathUnit?.[C.id]??currentUnit(),C.units.length-1),unit=C.units[u],openU=unitOpen(u);
 const steps=stepsOf(u);let curK=steps.findIndex((_,k)=>!stepDone(u,k));
 const nodes=steps.map((ws,k)=>{const done=stepDone(u,k),cur=openU&&k===curK,lock=!openU||(!done&&k>curK&&curK>=0&&!unitDone(u)&&!sameSession('step',u,k));
  const off=ZIG[k%ZIG.length];
  const label=ws[0]&&isLetter(ws[0])?ws.map(e=>e.word).join(' '):'';
  const paused=sameSession('step',u,k);
  return `<div class="node-wrap" style="transform:translateX(${off}px)">${paused?`<span class="bubble" style="color:var(--yellow-t)">하던 걸음 · 이어서 하기</span>`:cur?`<span class="bubble">${k+1}번째 걸음 · 지금 여기!</span>`:''}<button class="node${done?'':cur?' cur':lock?' lock':''}" data-a="step" data-v="${u}|${k}" ${lock?'aria-disabled="true"':''} aria-label="${k+1}번째 걸음${done?' 완료':lock?' 잠김':''}">${I(done?IC.check:cur?IC.star:lock?IC.lock:IC.star,done?34:cur?40:28,done?3:2.2)}</button>${label?`<span class="node-label" lang="en">${esc(label)}</span>`:''}</div>`}).join('');
 const score=prog().tests[u]||0,allSteps=steps.every((_,k)=>stepDone(u,k));
 const testNode=`<div class="node-wrap" style="transform:translateX(8px)"><button class="node test${score>=80?' passed':''}" data-a="testNode" data-v="${u}" aria-label="${u+1}단원 시험">${I(IC.test,32)}</button><span class="node-label" style="color:var(--blue-d)">${u+1}단원 시험${sameSession('test',u)?' · 이어서 하기':score?' · 최고 '+score+'점':''}</span></div>`;
 const doneSteps=steps.filter((_,k)=>stepDone(u,k)).length,p=courseProgress();
 const overview=`<section class="card stack"><div class="card-title"><span class="h-sm">전체 ${p.units}단원 중 ${p.passed}개 통과</span><span class="note nw">익힌 단어 ${p.lw}/${p.total}</span></div>
 <div style="display:grid;grid-template-columns:repeat(10,minmax(0,1fr));gap:5px">${C.units.map((_,j)=>{const ok=unitDone(j),on=j===u,open=unitOpen(j);return `<button data-a="unitGo" data-v="${j}" aria-label="${j+1}단원${ok?' 통과':open?'':' 잠김'}" style="height:30px;border-radius:9px;border:${on?'2px solid var(--ink)':'0'};padding:0;font-size:12px;font-weight:800;background:${ok?'var(--brand)':open?'var(--yellow)':'#E9ECF3'};color:${ok?'#fff':open?'#5A3B00':'#9AA1AE'}">${j+1}</button>`}).join('')}</div>
 <div style="display:flex;gap:12px;font-size:12px;color:var(--muted);flex-wrap:wrap"><span class="nw"><i style="display:inline-block;width:10px;height:10px;border-radius:3px;background:var(--brand);margin-right:4px"></i>통과</span><span class="nw"><i style="display:inline-block;width:10px;height:10px;border-radius:3px;background:var(--yellow);margin-right:4px"></i>공부 중</span><span class="nw"><i style="display:inline-block;width:10px;height:10px;border-radius:3px;background:#E9ECF3;margin-right:4px"></i>잠김</span></div></section>`;
 return `<div class="unit-pick"><button class="iconbtn" data-a="unit" data-v="-1" ${u<=0?'disabled':''} aria-label="이전 단원">${I(IC.back,22)}</button><span>${u+1} / ${C.units.length}단원</span><button class="iconbtn" data-a="unit" data-v="1" ${u>=C.units.length-1?'disabled':''} aria-label="다음 단원">${I(IC.next,22)}</button></div>
 ${overview}<section class="unit-banner"><div style="min-width:0"><small>${u+1}단원 · 걸음 ${doneSteps}/${steps.length} · 시험 ${score>=80?'통과':score?score+'점':'아직'}</small><h2 class="t-display">${esc(unit.name)}</h2></div><button class="btn sm" data-a="open" data-v="unitWords">${I(IC.book,18)}단어 보기</button></section>
 ${openU?'':`<p class="warnbox">${I(IC.lock,18)}<span>${u}단원 시험을 통과하면 열려요.</span></p>`}
 <div class="path">${nodes}${testNode}</div>${!allSteps&&openU?'<p class="note" style="text-align:center">걸음을 다 마치지 않아도 시험에 먼저 도전할 수 있어요</p>':''}`;
}
ACT.unitGo=v=>{(state.pathUnit??={})[C.id]=Number(v);persist();render()};
ACT.unit=v=>{const u=Math.min(state.pathUnit?.[C.id]??currentUnit(),C.units.length-1)+Number(v);(state.pathUnit??={})[C.id]=Math.max(0,Math.min(C.units.length-1,u));persist();render()};
ACT.step=(v,el)=>{const [u,k]=v.split('|').map(Number);if(el.getAttribute('aria-disabled')){toast(unitOpen(u)?'앞의 걸음을 먼저 마쳐요.':u+'단원 시험을 통과하면 열려요.');return}startStep(u,k)};
ACT.testNode=v=>{const u=Number(v);if(!unitOpen(u)){toast(u+'단원 시험을 통과하면 열려요.');return}startTest(u)};
SCREENS.unitWords=()=>{const u=Math.min(state.pathUnit?.[C.id]??currentUnit(),C.units.length-1),unit=C.units[u];
 return `<main class="screen narrow"><header class="hdr3"><button class="iconbtn" data-a="tab" data-v="path" aria-label="뒤로">${I(IC.back,24,2.4)}</button><h1 class="t-display">${esc(unit.name)}</h1><span></span></header><section class="card flush">${unit.words.map(e=>`<div class="lrow" style="grid-template-columns:minmax(0,1fr) auto 44px"><span style="min-width:0"><b lang="en" style="display:block">${esc(e.word)}</b><small class="muted">${esc(e.meaning)}</small></span>${lvdots(W(e.id)?.lv||0)}${sayBtn(e.word)}</div>`).join('')}</section></main>`};

/* ── 내 단어 ── */
SCREENS.words=()=>{
 const f=state.wordsFilter||'all';const L=learned();const mid=L.filter(e=>W(e.id).lv<5),top=L.filter(e=>W(e.id).lv>=5);
 const list=(f==='mid'?mid:f==='top'?top:L);const lim=V.p.more?2000:120;
 const admin=state.cloudRole==='admin';
 return `<main class="screen narrow"><header class="hdr"><h1 class="t-display">내 단어</h1><span class="v nw muted" style="font-weight:700">${esc(COURSES[C.id]?.name||'')} · ${L.length}개</span></header>
 ${admin?`<button class="photo-add" data-a="open" data-v="scan"><span class="ci">${I(IC.camera,28)}</span><span style="display:flex;flex-direction:column;gap:3px;min-width:0"><b class="nw">사진으로 단어 추가</b><small class="muted nw ell">단어장을 찍으면 뜻까지 정리해요</small></span><span class="tag o">관리자</span></button>`:''}
 <div class="seg" role="tablist" aria-label="단어 분류">${[['all','전체 '+L.length],['mid','익히는 중 '+mid.length],['top','다 외움 '+top.length]].map(([k,l])=>`<button role="tab" aria-selected="${f===k}" data-a="wfilter" data-v="${k}">${l}</button>`).join('')}</div>
 ${list.length?`<section class="card flush">${list.slice(0,lim).map(e=>`<div class="lrow" style="grid-template-columns:minmax(0,1fr) auto 44px;min-height:68px"><button style="all:unset;cursor:pointer;min-width:0;display:flex;flex-direction:column;gap:2px" data-a="word" data-v="${e.id}"><b lang="en" style="font-size:17px;font-weight:900">${esc(e.word)}</b><small class="muted ell">${esc(e.meaning)}</small></button>${lvdots(W(e.id).lv)}${sayBtn(e.word)}</div>`).join('')}</section>${list.length>lim?`<button class="btn full" data-a="wmore">${list.length-lim}개 더 보기</button>`:''}`
 :`<div class="card empty">${mascot(72)}<p>아직 ${f==='top'?'다 외운':'익힌'} 단어가 없어요.<br>오늘 학습을 시작해 볼까요?</p><button class="btn primary" data-a="start">오늘 학습 시작</button></div>`}
 </main>`;
};
ACT.wfilter=v=>{state.wordsFilter=v;persist();V.p={};render()};
ACT.wmore=()=>{V.p.more=true;render()};
ACT.word=v=>scr('word',{id:Number(v),back:{screen:null}});
SCREENS.word=p=>{
 const e=C.byId.get(p.id);if(!e)return SCREENS.words();const w=W(e.id)||{lv:0,due:0,r:0,w:0};const ex=exampleOf(e);const t=dayNum();
 const left=Math.max(0,w.due-t);const date=new Date();date.setDate(date.getDate()+left);
 return `<main class="screen narrow"><header class="hdr3" style="grid-template-columns:44px 1fr auto"><button class="iconbtn" data-a="tab" data-v="words" aria-label="뒤로">${I(IC.back,24,2.4)}</button><span></span>${state.cloudRole?`<span class="tag g" style="height:30px;gap:6px">${I(IC.cloud,14,2.4)}${state.lastSync?'클라우드에 저장됨':'저장 준비 중'}</span>`:''}</header>
 <section class="card stack"><div class="wordcard" style="background:none;border:0;padding:0"><div style="min-width:0"><div class="w" lang="en">${esc(e.word)}</div><div class="m">${esc(e.meaning)}</div></div>${sayBtn(e.word,true)}</div>${ex?`<div style="border-top:2px solid var(--line2);padding-top:12px"><p class="gl-en" lang="en" style="font-size:16px">${esc(ex[0])}</p><p class="gl-ko">${esc(ex[1])}</p></div>`:''}</section>
 <section class="card stack"><div class="card-title"><span class="h-sm">익힘 단계</span><span class="nw" style="font-weight:700;color:var(--brand-t)">${w.lv} / 5 · ${LV_NAMES[w.lv]}</span></div><div class="lvbar">${[1,2,3,4,5].map(k=>`<i class="${k<=w.lv?'on':''}"></i>`).join('')}</div><div class="lvnames">${LV_NAMES.slice(1).map((n,k)=>`<span class="${k+1===w.lv?'now':''}">${n}</span>`).join('')}</div></section>
 <section class="card stack"><div class="card-title"><span class="h-sm">다음 복습</span><span class="nw" style="font-weight:700;color:var(--blue-d)">${w.lv?(left?left+'일 뒤 · '+(date.getMonth()+1)+'월 '+date.getDate()+'일':'오늘'):'아직 안 배움'}</span></div><div class="ivals">${[1,2,3,4,5].map(k=>`<span class="${k<w.lv?'done':k===w.lv?'next':''}">${IVAL[k]}일</span>`).join('')}</div><p class="note">맞히면 간격이 늘고, 틀리면 1일로 돌아가요</p></section>
 <section class="kv"><div style="flex-direction:row;justify-content:space-between;align-items:center"><span>맞힘</span><b style="color:var(--brand-t)">${w.r}번</b></div><div style="flex-direction:row;justify-content:space-between;align-items:center"><span>틀림</span><b style="color:var(--orange-d)">${w.w}번</b></div></section></main>`;
};

/* ── 나 ── */
SCREENS.me=()=>{
 const m=modeInfo(),choices=courseChoices();const L=Object.values(state.courses).reduce((n,p)=>n+Object.values(p.words).filter(w=>w.lv>=5).length,0);
 const role={admin:['관리자','o'],parent:['보호자','o'],student:['학생','b']}[state.cloudRole]||['이 기기','gray'];
 const nm=state.cloudName||(state.cloudRole==='admin'?'관리자':state.cloudRole==='parent'?'보호자':'나');
 const myC=(state.myCoupons||[]).filter(c=>c.status!=='used').slice(0,6);
 return `<main class="screen narrow">
 <section class="card" style="display:grid;grid-template-columns:64px minmax(0,1fr) auto;gap:14px;align-items:center;padding:16px"><span class="t-display" style="width:64px;height:64px;border-radius:32px;background:var(--brand-soft);color:var(--brand-t);display:flex;align-items:center;justify-content:center;font-size:28px">${esc([...nm][0]||'나')}</span><span style="display:flex;flex-direction:column;gap:4px;min-width:0"><span class="t-display ell" style="font-size:22px">${esc(nm)}</span><span class="note nw">다 외운 단어 ${L}개 · ${streak()}일 연속</span></span><span class="tag ${role[1]}">${role[0]}</span></section>
 <section class="card stack"><div class="card-title"><span class="h-sm">나이 모드</span><span class="note nw">화면과 과정이 함께 바뀌어요</span></div>
  <div class="pick" role="radiogroup" aria-label="나이 모드" style="grid-template-columns:repeat(3,minmax(0,1fr))">${MODES.map(x=>`<button role="radio" aria-checked="${x.id===state.mode}" data-a="mode" data-v="${x.id}">${x.name}</button>`).join('')}</div>
  <span class="note ok">${esc(m.note)}</span>
  <div class="card-title" style="margin-top:4px"><span class="h-sm">학습 과정</span></div>
  <div class="pick" role="radiogroup" aria-label="학습 과정" style="grid-template-columns:repeat(${Math.min(3,choices.length)},minmax(0,1fr))">${choices.map(id=>`<button role="radio" aria-checked="${id===C.id}" data-a="course" data-v="${id}">${esc(COURSES[id].name)}</button>`).join('')}</div></section>
 <section class="card flush list">
  <div class="lrow two"><span class="t">하루 목표</span><div class="seg" style="width:200px">${[10,20,30].map(n=>`<button aria-checked="${(state.goal||20)===n}" data-a="goal" data-v="${n}">${n}문제</button>`).join('')}</div></div>
  <div class="lrow two"><span class="t">발음 속도</span><div class="seg" style="width:200px">${[[1,'보통'],[0.8,'천천히']].map(([n,l])=>`<button aria-checked="${(state.rate||1)===n}" data-a="rate" data-v="${n}">${l}</button>`).join('')}</div></div>
  <div class="lrow two"><span class="t">효과음</span><button class="switch" role="switch" aria-checked="${!!state.sfx}" aria-label="효과음" data-a="sfx"></button></div>
 </section>
 ${state.cloudRole==='student'?`<h2 class="sec-label">내 쿠폰</h2><section class="card flush">${myC.length?myC.map(c=>`<div class="lrow two"><span style="min-width:0"><b style="display:block">${esc(c.title)}</b><small class="muted">${{earned:'아직 안 씀',requested:'보호자 허락을 기다려요',approved:'허락됐어요! 써도 돼요',later:'다음에 쓰기로 했어요'}[c.status]||''}</small></span>${c.status==='earned'||c.status==='later'?`<button class="btn sm primary" data-a="cuse" data-v="${esc(c.id)}">쓰기</button>`:c.status==='approved'?`<button class="btn sm" data-a="cdone" data-v="${esc(c.id)}">다 썼어요</button>`:'<span class="tag b">기다리는 중</span>'}</div>`).join(''):'<p class="empty">단원 시험을 통과하면 쿠폰을 받아요.</p>'}</section>`:''}
 <section class="card flush list">
  ${state.cloudRole?`<button class="lrow chev" data-a="open" data-v="league"><span class="t">가족 주간 리그</span><span class="v">${leagueRank()?leagueRank()+'등':''}</span>${I(IC.next,16,2.4)}</button>`:''}
  ${state.cloudRole==='parent'||state.cloudRole==='admin'?`<button class="lrow chev" data-a="open" data-v="report"><span class="t">주간 리포트</span><span class="v">보호자</span>${I(IC.next,16,2.4)}</button><button class="lrow chev" data-a="open" data-v="reports"><span class="t">학습 보고함</span><span class="v"></span>${I(IC.next,16,2.4)}</button>`:''}
  ${state.cloudRole?'':`<button class="lrow chev" data-a="open" data-v="pair"><span class="t">가족과 연결하기</span><span class="v">코드·링크</span>${I(IC.next,16,2.4)}</button>`}
  <button class="lrow chev" data-a="admin"><span class="t">관리자 메뉴</span><span class="v">${state.pinHash?'PIN':''}</span>${I(IC.next,16,2.4)}</button>
  ${installable()?`<button class="lrow chev" data-a="install"><span class="t">홈 화면에 추가</span><span class="v"></span>${I(IC.next,16,2.4)}</button>`:''}
 </section>
 ${familyStatusHTML()}</main>`;
};
SCREENS.me.after=()=>{if(state.cloudRole&&!leagueCache)loadLeague().then(()=>{if(V.tab==='me'&&!V.screen)render()});if(state.cloudRole&&!familyCache)loadFamilyMembers().then(()=>{if(V.tab==='me'&&!V.screen)refresh()})};
ACT.mode=async v=>{state.mode=v;const first=modeInfo().courses[0];try{await useCourse(modeInfo().courses.includes(C.id)?C.id:first)}catch{toast('과정을 불러오지 못했어요. 인터넷 연결을 확인해 주세요.')}render()};
ACT.course=async v=>{try{await useCourse(v);render()}catch{toast('과정을 불러오지 못했어요. 인터넷 연결을 확인해 주세요.')}};
ACT.goal=v=>{state.goal=Number(v);persist();render()};
ACT.rate=v=>{state.rate=Number(v);persist();render();say('pencil')};
ACT.sfx=()=>{state.sfx=!state.sfx;persist();render();sfx(true)};
async function setCoupon(id,status){try{const c=await cloud(),u=await me();await c.store.updateDoc(fdoc(c,'families',u.family,'couponLog',id),{status,changed:c.store.serverTimestamp()})}catch{toast('보내지 못했어요. 인터넷 연결을 확인해 주세요.')}}
ACT.cuse=v=>{setCoupon(v,'requested').then(()=>toast('보호자에게 알렸어요!'))};
ACT.cdone=v=>setCoupon(v,'used');

/* 리그 */
async function loadLeague(){try{const c=await cloud(),u=await me();if(!u)return null;const snap=await c.store.getDocs(c.store.collection(c.db,'families',u.family,'stats'));const wk=weekKey();
 leagueCache=snap.docs.map(d=>({uid:d.id,...d.data()})).map(x=>({...x,points:x.week===wk?x.points||0:0})).filter(x=>x.role!=='admin'||x.points>0).sort((a,b)=>b.points-a.points);return leagueCache}catch{return null}}
SCREENS.league=()=>{
 const list=leagueCache;const end=new Date(weekKey()+'T00:00:00');end.setDate(end.getDate()+7);const left=Math.max(0,Math.ceil((end-new Date())/86400000));
 const pod=[1,0,2].map(i=>list?.[i]).map((x,j)=>{if(!x)return '<div></div>';const rank=[2,1,3][j],h=[76,108,56][j],bg=['#C9D6EA','#FFC531','#F4D9BF'][j],fg=['#1F3A5F','#5A3B00','#6A3A0B'][j];return `<div><span class="av" style="width:${rank===1?60:52}px;height:${rank===1?60:52}px;background:${['var(--blue-soft)','var(--brand-soft)','var(--orange-soft)'][j]};color:${fg};${rank===1?'box-shadow:0 0 0 4px #FFC531':''}">${esc([...(x.name||'?')][0])}</span><div class="st" style="height:${h}px;background:${bg};color:${fg}"><b style="font-size:${rank===1?30:24}px">${rank}</b><small>${esc(x.name||'')}${x.uid===state.cloudUid?' (나)':''}</small></div></div>`}).join('');
 return `<main class="screen narrow"><header class="hdr3"><button class="iconbtn" data-a="back" aria-label="뒤로">${I(IC.back,24,2.4)}</button><h1 class="t-display">가족 주간 리그</h1><span></span></header>
 <section class="card" style="background:#1F3A5F;border-color:#1F3A5F;color:#fff;display:flex;justify-content:space-between;align-items:center"><span><small style="color:#C9D6EA;display:block">이번 주 리그</small><span class="t-display" style="font-size:22px">${left}일 남았어요</span></span>${I(IC.trophy,52,2,'style="color:#FFC531"')}</section>
 ${list==null?'<p class="empty">리그를 불러오고 있어요.</p>':list.length?`<section class="podium">${pod}</section><section class="card flush">${list.map((x,i)=>`<div class="rank${x.uid===state.cloudUid?' me':''}"><b style="color:${i?'var(--muted)':'#8A5A00'}">${i+1}</b><span class="t ell" style="font-weight:700">${esc(x.name||'')}${x.uid===state.cloudUid?' (나)':''}</span><b class="nw">${(x.points||0).toLocaleString('ko-KR')}점</b></div>`).join('')}</section>`:'<p class="empty">아직 이번 주 기록이 없어요.</p>'}
 <p class="note" style="text-align:center">맞힌 문제마다 점수 · 월요일마다 새로 시작해요</p></main>`;
};
SCREENS.league.after=()=>{if(leagueCache==null||!V.p.loaded){V.p.loaded=true;syncCloud().finally(()=>loadLeague().then(()=>{if(V.screen==='league')render()}))}};

/* 설치 */
let installEvt=null;
addEventListener('beforeinstallprompt',e=>{e.preventDefault();installEvt=e});
function installable(){return !matchMedia('(display-mode: standalone)').matches&&!navigator.standalone}
ACT.install=async()=>{if(installEvt){installEvt.prompt();installEvt=null;return}
 const ios=/iphone|ipad|ipod/i.test(navigator.userAgent);alert(ios?'Safari 아래쪽의 공유 버튼을 누른 뒤 "홈 화면에 추가"를 고르세요.':'브라우저 메뉴(⋮)에서 "홈 화면에 추가" 또는 "앱 설치"를 고르세요.')};
