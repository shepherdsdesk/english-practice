'use strict';
/* 워드스텝 v2 — 유치(알파벳) 과정: 글자 한 과, 따라 쓰기, 그림 문제, 짝 맞추기, 스티커 판, ABC 노래 */

function picOf(e){return e?.extra?.pic||WORDSTEP_COURSES[C.id]?.pics?.[e?.word]||''}
function lWords(e){return e?.extra?.words||[]}
function letterPhrase(e){const ws=lWords(e);return e.word+'. '+ws.map(w=>w[0]).join(', ')}
function kidsWord(e){return C.id==='kids'&&!isLetter(e)}

/* 글자 한 과 */
Q['L-intro']=(it,e)=>{const ws=lWords(e);return {title:'오늘의 글자를 만나요',html:`<div class="card letter-card">
 <div class="letter-big"><span class="u">${esc(e.word)}</span><span class="l">${esc(e.word.toLowerCase())}</span></div>
 <div style="display:flex;gap:8px;justify-content:center;flex-wrap:wrap"><span class="tag b" style="height:32px;font-size:15px;padding:0 12px">이름: ${esc(e.meaning)}</span><span class="tag o" style="height:32px;font-size:15px;padding:0 12px">소리: ${esc(e.extra.sound||'')}</span></div>
 ${sayBtn(letterPhrase(e),true,'글자와 단어 듣기')}</div>
 <div class="kid-words">${ws.map(([w,m,p])=>`<button class="kid-word" data-a="say" data-v="${esc(w)}"><span class="pic" aria-hidden="true">${p}</span><b lang="en">${e.extra.end?esc(w):`<span style="color:var(--blue)">${esc(w[0])}</span>${esc(w.slice(1))}`}</b><small>${esc(m)}</small></button>`).join('')}</div>
 ${e.extra.end?'<p class="note" style="text-align:center">X는 단어 끝에서 "크스" 소리가 나요</p>':''}`,foot:`<button class="btn big primary" data-a="introOk">알겠어요</button>`}};
Q['L-intro'].after=(it,e)=>setTimeout(()=>say(letterPhrase(e)),250);

/* 그림 보고 첫 글자 */
Q['L-pic']=(it,e)=>{it.w??=pick(lWords(e))||[e.word,'',''];it.list??=letterOpts(e.word);const [w,m,p]=it.w;
 return {title:e.extra.end?'이 단어 속 글자를 골라요':'무슨 글자로 시작할까요?',html:`<div class="card center" style="gap:6px"><span class="pic-big" aria-hidden="true">${p}</span><span class="t-display" style="font-size:22px">${esc(m)}</span>${sayBtn(w,true,'단어 듣기')}</div>`+optsHTML(it.list,{lang:'en'}),foot:confirmBtn(S.sel!=null)}};
Q['L-pic'].after=it=>setTimeout(()=>say(it.w[0]),250);

/* 빠진 글자 찾기 (A _ C) */
Q['L-order']=(it,e)=>{const i=ABC.indexOf(e.word);const seq=i===0?[0,1,2]:i===25?[23,24,25]:[i-1,i,i+1];it.list??=letterOpts(e.word);
 return {title:'빈칸에 들어갈 글자를 골라요',html:`<div class="card" style="display:flex;justify-content:center;gap:12px;padding:24px 12px">${seq.map(k=>k===i?`<span class="seq-box blank-box">${S.sel!=null?esc(it.list[S.sel]):'?'}</span>`:`<span class="seq-box">${ABC[k]}</span>`).join('')}</div>`+optsHTML(it.list,{lang:'en'}),foot:confirmBtn(S.sel!=null)}};

/* 손가락으로 따라 쓰기 */
Q['L-trace']=(it,e)=>{const ch=it.lower?e.word.toLowerCase():e.word;
 return {title:`<span lang="en">${esc(ch)}</span>를 손가락으로 따라 써요`,html:`<div class="trace-wrap"><canvas id="trace" width="600" height="600" aria-label="${esc(ch)} 따라 쓰기 칸"></canvas></div>
 <p class="note" style="text-align:center" id="traceNote">회색 글자 위를 꾹 눌러서 따라 그려요</p>
 <div class="btns two"><button class="btn" data-a="traceClear" style="margin:0">지우기</button>${sayBtn(e.word,false,'글자 듣기')}</div>`,foot:`<button class="btn big primary" data-a="traceDone">다 썼어요</button>`}};
Q['L-trace'].after=(it,e)=>{const cv=$('#trace');if(!cv)return;const ch=it.lower?e.word.toLowerCase():e.word;const ctx=cv.getContext('2d');
 const font=`900 ${it.lower?400:430}px 'Noto Sans KR', 'Jua', sans-serif`;
 const guide=()=>{ctx.clearRect(0,0,600,600);ctx.fillStyle='#EEF0F5';ctx.fillRect(0,0,600,600);ctx.strokeStyle='#D5D9E2';ctx.setLineDash([12,12]);ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(0,450);ctx.lineTo(600,450);ctx.moveTo(0,150);ctx.lineTo(600,150);ctx.stroke();ctx.setLineDash([]);ctx.font=font;ctx.textAlign='center';ctx.textBaseline='alphabetic';ctx.fillStyle='#C9CEDA';ctx.fillText(ch,300,450)};
 const ink=document.createElement('canvas');ink.width=ink.height=600;const ic=ink.getContext('2d');ic.lineCap=ic.lineJoin='round';ic.lineWidth=46;ic.strokeStyle='#3D7BEA';
 const draw=()=>{guide();ctx.drawImage(ink,0,0)};
 const mask=document.createElement('canvas');mask.width=mask.height=600;const mc=mask.getContext('2d');mc.font=font;mc.textAlign='center';mc.fillText(ch,300,450);
 it._trace={ink,ic,mask,draw};draw();
 let last=null;const pos=ev=>{const r=cv.getBoundingClientRect();return [(ev.clientX-r.left)*600/r.width,(ev.clientY-r.top)*600/r.height]};
 cv.onpointerdown=ev=>{if(S.answer)return;cv.setPointerCapture(ev.pointerId);last=pos(ev);ic.beginPath();ic.arc(last[0],last[1],23,0,7);ic.fillStyle='#3D7BEA';ic.fill();draw()};
 cv.onpointermove=ev=>{if(!last)return;const p=pos(ev);ic.beginPath();ic.moveTo(last[0],last[1]);ic.lineTo(p[0],p[1]);ic.stroke();last=p;draw()};
 cv.onpointerup=cv.onpointercancel=()=>{last=null};
 setTimeout(()=>say(e.word),250);
};
ACT.traceClear=()=>{const t=cur()?._trace;if(!t)return;t.ic.clearRect(0,0,600,600);t.draw()};
ACT.traceDone=()=>{const it=cur(),e=curWord(),t=it._trace;if(!t||S.answer)return;
 const m=t.mask.getContext('2d').getImageData(0,0,600,600).data,d=t.ic.getImageData(0,0,600,600).data;let letter=0,cov=0,ink=0,inside=0;
 for(let i=3;i<m.length;i+=16){const L=m[i]>40,K=d[i]>40;if(L){letter++;if(K)cov++}if(K){ink++;if(L)inside++}}
 const coverage=letter?cov/letter:0,precision=ink?inside/ink:0;
 if(ink<letter*.15){$('#traceNote').className='note no';$('#traceNote').textContent='조금 더 그려 볼까요? 회색 글자를 따라 꾹 그려요.';return}
 answer(coverage>=.5&&precision>=.3,coverage>=.5?'잘 따라 썼어요':'글자를 더 따라 그려요')};

/* 그림 단어 (유치 단어 단원) */
Q['K-pic']=(it,e)=>{it.list??=kidsPicOpts(e);return {title:'잘 듣고 맞는 그림을 골라요',html:`<div class="listen"><button class="main" data-a="say" data-v="${esc(e.word)}" aria-label="다시 듣기">${I(IC.speaker,52)}</button></div>`+picOptsHTML(it.list),foot:confirmBtn(S.sel!=null)}};
Q['K-pic'].after=(it,e)=>setTimeout(()=>say(e.word),250);
Q['K-word']=(it,e)=>{it.list??=distract(e,'word');return {title:'그림에 맞는 영어를 골라요',html:`<div class="card center" style="gap:6px"><span class="pic-big" aria-hidden="true">${picOf(e)}</span><span class="t-display" style="font-size:22px">${esc(e.meaning)}</span></div>`+optsHTML(it.list,{lang:'en'}),foot:confirmBtn(S.sel!=null)}};
function kidsPicOpts(e){const pool=shuffle(allWords().filter(x=>!isLetter(x)&&x.id!==e.id&&picOf(x)&&picOf(x)!==picOf(e)));const same=pool.filter(x=>x.unit===e.unit);return shuffle([picOf(e),...[...new Set([...same,...pool].map(picOf))].slice(0,3)])}
function picOptsHTML(list){const a=S.answer;return `<div class="opts">${list.map((o,i)=>{let cls='opt pic-opt';if(a){if(o===a.correct)cls+=' right';else if(i===S.sel)cls+=' wrong';else cls+=' dim'}return `<button type="button" class="${cls}" data-a="sel" data-v="${i}" aria-pressed="${S.sel===i}" ${a?'disabled':''}>${o}</button>`}).join('')}</div>`}

/* ── 스티커 판 ── */
function stickerOn(e){return (W(e.id)?.lv||0)>=1}
function stickerGold(e){return (W(e.id)?.lv||0)>=3}
function stickerLetters(){return allWords().filter(isLetter)}
function stickerHTML(e,small=false){const on=stickerOn(e),gold=stickerGold(e),p=lWords(e)[0]?.[2]||'';
 if(small)return `<span class="sticker sm${on?' on':''}${gold?' gold':''}">${esc(e.word)}</span>`;
 return `<button class="sticker${on?' on':''}${gold?' gold':''}" data-a="${on?'say':'stickerLocked'}" data-v="${esc(on?letterPhrase(e):e.word)}" aria-label="${esc(e.word)} ${on?'스티커':'아직'}">${gold?'<i class="crown" aria-hidden="true">★</i>':''}${on?`<span class="sp" aria-hidden="true">${p}</span>`:''}<b>${esc(e.word)}</b></button>`}
SCREENS.stickers=()=>{const ls=stickerLetters(),n=ls.filter(stickerOn).length;
 return `<main class="screen narrow"><header class="hdr3"><button class="iconbtn" data-a="tab" data-v="today" aria-label="뒤로">${I(IC.back,24,2.4)}</button><h1 class="t-display">알파벳 스티커 판</h1><span></span></header>
 <section class="card stack center"><span class="t-display" style="font-size:22px">${n} / 26</span><div class="bar" style="width:100%"><i style="width:${Math.round(n/26*100)}%;background:var(--yellow)"></i></div><p class="note">글자를 배우면 스티커가 붙고, 복습해서 잘 외우면 금별이 달려요.</p></section>
 <section class="sticker-grid">${ls.map(e=>stickerHTML(e)).join('')}</section>
 ${n===26?`<section class="card center" style="background:var(--yellow-soft);border-color:transparent"><b class="t-display" style="font-size:24px">알파벳 박사 완성!</b></section>`:''}</main>`};
SCREENS.stickers.after=()=>{if(stickerLetters().every(stickerOn)&&!V.p.party){V.p.party=true;confetti();SND.fanfare()}};
ACT.stickerLocked=v=>{say(v);toast(v+' 글자를 더 공부하면 스티커가 붙어요')};
ACT.stickers=()=>scr('stickers');

/* ── 짝 맞추기 (대문자·소문자 카드) ── */
let mg=null;
ACT.match=()=>{const pool=learned().filter(isLetter);const base=pool.length>=4?shuffle(pool).slice(0,4):stickerLetters().slice(0,4);
 mg={cards:shuffle(base.flatMap(e=>[{k:e.word,t:e.word},{k:e.word,t:e.word.toLowerCase()}])).map((c,i)=>({...c,i,open:false,done:false})),first:null,lock:false,moves:0,start:Date.now()};scr('match')};
SCREENS.match=()=>{if(!mg)return SCREENS.today();const done=mg.cards.every(c=>c.done);
 return `<main class="screen focus narrow"><header class="hdr3"><button class="iconbtn" data-a="tab" data-v="today" aria-label="닫기">${I(IC.x,24,2.4)}</button><h1 class="t-display">짝 맞추기</h1><span class="note nw" style="text-align:right">${mg.moves}번</span></header>
 <p class="note" style="text-align:center;font-size:15px">큰 글자와 작은 글자의 짝을 찾아요</p>
 <section class="match-grid">${mg.cards.map(c=>`<button class="mcard${c.open||c.done?' open':''}${c.done?' done':''}" data-a="flip" data-v="${c.i}" ${c.done?'disabled':''} aria-label="${c.open||c.done?c.t:'카드'}"><span lang="en">${c.open||c.done?esc(c.t):'?'}</span></button>`).join('')}</section>
 <div class="grow"></div>${done?`<section class="center"><h2 class="t-display" style="margin:0;color:var(--brand-t);font-size:28px">다 찾았어요!</h2><p>${mg.moves}번 만에 성공</p></section><div class="btns two"><button class="btn" data-a="tab" data-v="today" style="margin:0">그만하기</button><button class="btn primary" data-a="match" style="margin:0">한 번 더</button></div>`:''}</main>`};
SCREENS.match.focus=true;
ACT.flip=v=>{if(!mg||mg.lock)return;const c=mg.cards[Number(v)];if(c.open||c.done)return;c.open=true;SND.tap();say(c.k);
 if(!mg.first){mg.first=c;render();return}
 const a=mg.first;mg.first=null;mg.moves++;
 if(a.k===c.k){a.done=c.done=true;sfx(true);const d=today();d.xp+=5;d.q++;d.c++;persist();render();if(mg.cards.every(x=>x.done)){setTimeout(()=>{confetti();SND.fanfare()},250);save()}return}
 mg.lock=true;render();setTimeout(()=>{a.open=c.open=false;mg.lock=false;if(V.screen==='match')render()},900)};

/* ── ABC 노래 ── */
const ABC_LINES=['ABCD','EFG','HIJK','LMNOP','QRS','TUV','WX','YZ'];
let abcTimer=null;
SCREENS.abc=()=>`<main class="screen focus narrow"><header class="hdr3"><button class="iconbtn" data-a="abcClose" aria-label="닫기">${I(IC.x,24,2.4)}</button><h1 class="t-display">ABC 노래</h1><span></span></header>
 <p class="note" style="text-align:center;font-size:15px">불이 켜지는 글자를 따라 불러요</p>
 <section class="abc-song">${ABC_LINES.map(l=>`<div class="abc-line">${[...l].map(ch=>`<button class="abc-key" id="abc-${ch}" data-a="abcKey" data-v="${ch}">${ch}</button>`).join('')}</div>`).join('')}</section>
 <div class="grow"></div><div class="btns two"><button class="btn" data-a="abcPlay" data-v="slow" style="margin:0">천천히</button><button class="btn primary" data-a="abcPlay" data-v="" style="margin:0">${I(IC.speaker,20)}노래 시작</button></div></main>`;
SCREENS.abc.focus=true;
ACT.abcClose=()=>{clearTimeout(abcTimer);stopSound();go('today')};
ACT.abcKey=v=>{const e=stickerLetters().find(x=>x.word===v);say(e?letterPhrase(e):v);const el=$('#abc-'+v);el?.classList.add('lit');setTimeout(()=>el?.classList.remove('lit'),900)};
ACT.abcPlay=v=>{clearTimeout(abcTimer);const step=v==='slow'?950:650;const seq=[];ABC_LINES.forEach(l=>{[...l].forEach((ch,j)=>seq.push([ch,j===l.length-1?step*1.6:step]))});
 let k=0;const tick=()=>{document.querySelectorAll('.abc-key.lit').forEach(x=>x.classList.remove('lit'));if(k>=seq.length||V.screen!=='abc'){if(k>=seq.length){confetti(30);SND.chime()}return}const [ch,wait]=seq[k++];$('#abc-'+ch)?.classList.add('lit');say(ch);abcTimer=setTimeout(tick,wait)};tick()};

/* ── 새 스티커 알림 ── */
function stickerSnapshot(){return C.id==='kids'?stickerLetters().filter(stickerOn).map(e=>e.word):[]}
