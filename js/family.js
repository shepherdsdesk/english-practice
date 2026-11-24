'use strict';
/* 워드스텝 v2 — 처음 시작, 기기 연결(링크·QR), 보호자 홈, 가족 연결 상태 */

/* ── 처음 시작 화면 ── */
function needsWelcome(){return !state.onboarded&&!state.cloudRole&&!Object.keys(state.courses||{}).length}
SCREENS.welcome=()=>`<main class="screen focus narrow" style="padding-top:48px">
 <section class="center" style="gap:10px">${mascot(120,'happy')}<h1 class="t-display nw" style="font-size:28px">어서 와요, 워드스텝!</h1><p>한 걸음씩 익히는 영어 단어 앱이에요.<br>누가 쓰는지 알려 주세요.</p></section>
 <section class="stack" style="gap:12px">
  <button class="coupon" data-a="wPick" data-v="student" style="color:var(--blue);border-style:solid;border-color:var(--line)"><span class="ci" style="background:var(--blue-soft);color:var(--blue-d)">${I(IC.book,28)}</span><span class="ct"><b style="color:var(--ink)">학생이에요</b><small>부모님께 받은 코드가 있어요</small></span>${I(IC.next,18,2.4,'style="color:#9AA1AE"')}</button>
  <button class="coupon" data-a="wPick" data-v="parent" style="color:var(--orange);border-style:solid;border-color:var(--line)"><span class="ci" style="background:var(--orange-soft);color:var(--orange-d)">${I(IC.users,28)}</span><span class="ct"><b style="color:var(--ink)">보호자예요</b><small>아이 공부를 보고 쿠폰을 허락해요</small></span>${I(IC.next,18,2.4,'style="color:#9AA1AE"')}</button>
  <button class="coupon" data-a="wPick" data-v="solo" style="color:var(--brand);border-style:solid;border-color:var(--line)"><span class="ci" style="background:var(--brand-soft);color:var(--brand-t)">${I(IC.star,26)}</span><span class="ct"><b style="color:var(--ink)">혼자 써 볼게요</b><small>코드 없이 바로 시작해요</small></span>${I(IC.next,18,2.4,'style="color:#9AA1AE"')}</button>
 </section>
 <p class="note" style="text-align:center">관리자는 "혼자 써 볼게요"로 들어가서 나 → 관리자 메뉴를 여세요.</p></main>`;
SCREENS.welcome.focus=true;
ACT.wPick=v=>{if(v==='solo'){scr('setup');return}scr('pair',{as:v,back:'welcome'})};
SCREENS.setup=()=>{const m=modeInfo();return `<main class="screen focus narrow" style="padding-top:36px">
 <header class="hdr3"><button class="iconbtn" data-a="open" data-v="welcome" aria-label="뒤로">${I(IC.back,24,2.4)}</button><h1 class="t-display">시작 준비</h1><span></span></header>
 <section class="card stack"><label class="field" for="localName">이름 (선택)</label><input id="localName" class="input" maxlength="12" placeholder="예: 하빈" value="${esc(state.localName||'')}"><p class="note">인사할 때 불러 줄 이름이에요.</p></section>
 <section class="card stack"><span class="h-sm">나이 모드</span><div class="pick" role="radiogroup" aria-label="나이 모드" style="grid-template-columns:repeat(3,minmax(0,1fr))">${MODES.map(x=>`<button role="radio" aria-checked="${x.id===state.mode}" data-a="sMode" data-v="${x.id}">${x.name}</button>`).join('')}</div><span class="note ok">${esc(m.note)}</span></section>
 <div class="grow"></div><button class="btn big primary" data-a="sGo">시작하기</button></main>`};
SCREENS.setup.focus=true;
ACT.sMode=v=>{const n=$('#localName')?.value;if(n!=null)state.localName=n.trim();state.mode=v;render()};
ACT.sGo=async()=>{state.localName=($('#localName')?.value||'').trim();state.onboarded=true;try{await useCourse(modeInfo().courses[0])}catch{}persist();go('today')};

/* ── 기기 연결 (코드 · 링크 · QR) ── */
let pairPeek=null; // 코드로 미리 본 초대 정보
SCREENS.pair=p=>{
 const code=(p.code||'').replace(/\D/g,'');const pretty=code.length>4?code.slice(0,4)+' '+code.slice(4):code;
 const who=p.as==='parent'?'보호자':p.as==='student'?'학생':'';
 const peek=pairPeek&&pairPeek.code===code?pairPeek:null;
 return `<main class="screen focus narrow"><header class="hdr3"><button class="iconbtn" data-a="pairBack" aria-label="뒤로">${I(IC.back,24,2.4)}</button><h1 class="t-display">기기 연결</h1><span></span></header>
 <section class="card stack center" style="padding:28px 20px">${mascot(84)}
  ${peek?.ok?`<span class="tag ${peek.role==='student'?'b':'o'}" style="height:30px;font-size:13px">${peek.role==='student'?'학생용':'보호자용'} 코드</span><p style="margin:0;font-size:18px"><b>${esc(peek.name)}</b>${peek.role==='student'?' 학생으로':' 보호자로'} 연결해요</p>`
   :`<p style="margin:0;font-size:16px">${who?who+'용 ':''}<b>8자리 연결 코드</b>를 넣어 주세요.<br><span class="note">관리자(부모님)에게 받은 링크를 눌렀다면 자동으로 들어가요.</span></p>`}
  <form id="pairForm" class="stack" style="width:100%"><label class="sr" for="code">연결 코드</label><input id="code" class="input code-input" inputmode="numeric" autocomplete="one-time-code" maxlength="9" placeholder="0000 0000" value="${esc(pretty)}"><button class="btn big primary">연결하기</button></form>
  <p class="note ${peek&&!peek.ok?'no':''}" id="pairNote" role="status">${peek&&!peek.ok?esc(peek.msg):''}</p></section>
 <section class="card stack"><span class="h-sm">연결하면 이렇게 돼요</span>
  <div class="lrow" style="padding:0;min-height:44px;border:0"><span class="ico g">${I(IC.cloud,20)}</span><span class="t" style="white-space:normal;font-weight:500">진도가 자동으로 저장돼요</span><span></span></div>
  <div class="lrow" style="padding:0;min-height:44px;border:0"><span class="ico o">${I(IC.users,20)}</span><span class="t" style="white-space:normal;font-weight:500">부모님이 공부 기록을 볼 수 있어요</span><span></span></div>
  <div class="lrow" style="padding:0;min-height:44px;border:0"><span class="ico b">${I(IC.gift,20)}</span><span class="t" style="white-space:normal;font-weight:500">시험을 통과하면 쿠폰을 받아요</span><span></span></div></section></main>`;
};
SCREENS.pair.focus=true;
SCREENS.pair.after=p=>{
 const f=$('#pairForm'),box=$('#code'),note=$('#pairNote');
 box.oninput=()=>{const d=box.value.replace(/\D/g,'').slice(0,8);box.value=d.length>4?d.slice(0,4)+' '+d.slice(4):d;if(d.length===8&&pairPeek?.code!==d){V.p.code=d;peekInvite(d)}};
 f.onsubmit=ev=>{ev.preventDefault();connectWith(box.value.replace(/\D/g,''),f.querySelector('button'),note)};
 const code=(p.code||'').replace(/\D/g,'');if(code.length===8&&pairPeek?.code!==code)peekInvite(code);else if(!code)box.focus();
};
ACT.pairBack=()=>{const b=V.p.back;if(b==='welcome'&&!state.cloudRole)scr('welcome');else go('me')};
async function peekInvite(code){
 pairPeek={code,ok:false,msg:'코드를 확인하고 있어요.'};
 try{const c=await cloud(),user=c.auth.currentUser||(await c.authApi.signInAnonymously(c.auth)).user;const v=(await c.store.getDoc(fdoc(c,'invites',code))).data();
  if(!v)pairPeek={code,ok:false,msg:'없는 코드예요. 숫자를 다시 확인해 주세요.'};
  else if(v.claimed&&v.claimed!==user.uid)pairPeek={code,ok:false,msg:'이미 다른 기기에서 쓴 코드예요. 관리자에게 새 코드를 받아 주세요.'};
  else pairPeek={code,ok:true,name:v.name,role:v.role};
 }catch{pairPeek={code,ok:false,msg:'인터넷 연결을 확인해 주세요.'}}
 if(V.screen==='pair'){V.forceRefresh=true;render();V.forceRefresh=false}
}
async function connectWith(code,btn,note){
 if(!/^\d{8}$/.test(code)){note.className='note no';note.textContent='숫자 8자리를 확인하세요.';return}
 btn.disabled=true;note.className='note';note.textContent='연결하고 있어요.';
 try{const c=await cloud(),user=c.auth.currentUser||(await c.authApi.signInAnonymously(c.auth)).user;const ref=fdoc(c,'members',user.uid);
  let member=(await c.store.getDoc(ref)).data();let restore=null;
  if(!member){const inv=fdoc(c,'invites',code);await c.store.runTransaction(c.db,async tx=>{const v=(await tx.get(inv)).data();if(!v||v.claimed)throw Error('invalid');restore=v.restoreFrom||null;tx.set(ref,{name:v.name,family:v.family,role:v.role,code});tx.update(inv,{claimed:user.uid,claimedAt:c.store.serverTimestamp()})})}
  const u=await identify();state.onboarded=true;persist();
  if(restore&&u){note.textContent='예전 진도를 가져오고 있어요.';if(await restoreProgress(c,u.family,restore)){await useCourse(state.course);toast('예전 진도를 이어받았어요!')}}
  if(location.search)history.replaceState(null,'',location.pathname);
  flushReports();syncCloud();familyCache=null;
  go(u?.role==='student'?'today':'family');toast((u?.name?u.name+' · ':'')+'연결됐어요!');
 }catch{note.className='note no';note.textContent='연결하지 못했어요. 코드를 다시 확인하세요. 이미 쓴 코드는 다시 쓸 수 없어요.';btn.disabled=false}
}

/* 초대 링크와 QR (관리자가 코드를 발급하면 보여 줘요) */
function inviteUrl(code,role){return appUrl(role==='parent')+(role==='parent'?'&':'?')+'code='+code}
async function qrSvg(text,size=168){try{await loadScript('./js/qrcode.js');const q=qrcode(0,'M');q.addData(text);q.make();const n=q.getModuleCount(),cell=Math.max(2,Math.floor(size/(n+8)));return q.createSvgTag({cellSize:cell,margin:cell*4,scalable:true}).replace('<svg ','<svg role="img" aria-label="연결 QR 코드" style="width:'+size+'px;height:'+size+'px;display:block" ')}catch{return ''}}
function inviteCardHTML(name,code,role,restore){return `<div class="issued" style="margin-top:4px;gap:8px"><span class="tag ${role==='student'?'b':'o'}">${role==='student'?'학생용':'보호자용'}${restore?' · 진도 이어받기':''}</span><b>${esc(name)}</b><strong>${code.match(/.{4}/g).join(' ')}</strong>
 <div id="qr-${code}" style="background:#fff;border-radius:12px;padding:6px;min-height:60px;display:flex;align-items:center;justify-content:center"><span class="note">QR을 만들고 있어요</span></div>
 <small class="muted">${role==='student'?'아이 폰':'보호자 폰'} 카메라로 QR을 찍거나, 링크를 보내서 누르면 코드가 자동으로 들어가요.</small>
 <div class="btns two" style="width:100%"><button class="btn" data-a="invShare" data-v="${code}|${role}|${esc(name)}" style="margin:0">링크 보내기</button><button class="btn" data-a="invCopy" data-v="${code}|${role}" style="margin:0">링크 복사</button></div></div>`}
async function fillInviteQR(code,role){const el=$('#qr-'+code);if(!el)return;const svg=await qrSvg(inviteUrl(code,role));el.innerHTML=svg||'<span class="note">QR을 만들지 못했어요. 링크를 보내 주세요.</span>'}
ACT.invShare=async v=>{const [code,role,name]=v.split('|');const url=inviteUrl(code,role);const text=(role==='student'?name+' 학생':name+' 보호자')+'의 워드스텝 연결 링크예요. 눌러서 연결해 주세요.';
 try{if(navigator.share){await navigator.share({title:'워드스텝 연결',text,url});return}}catch(e){if(e?.name==='AbortError')return}ACT.invCopy(code+'|'+role)};
ACT.invCopy=async v=>{const [code,role]=v.split('|');const url=inviteUrl(code,role);try{await navigator.clipboard.writeText(url);toast('링크를 복사했어요. 카톡에 붙여 넣어 보내세요.')}catch{prompt('이 링크를 복사해서 보내세요.',url)}};
ACT.invShow=async v=>{const [code,role,name]=[v.split('|')[0],v.split('|')[1],v.slice(v.indexOf('|',v.indexOf('|')+1)+1)];const box=$('#issued');if(!box)return;box.innerHTML=inviteCardHTML(name,code,role,false);box.scrollIntoView({block:'center'});fillInviteQR(code,role)};

/* ── 가족 정보 (통계 문서로 알아봐요) ── */
let familyCache=null;
async function loadFamilyMembers(){try{const c=await cloud(),u=await me();if(!u)return null;const [st,cl]=await Promise.all([c.store.getDocs(c.store.collection(c.db,'families',u.family,'stats')),u.role!=='student'?c.store.getDocs(c.store.collection(c.db,'families',u.family,'couponLog')):Promise.resolve(null)]);
 familyCache={members:st.docs.map(d=>({uid:d.id,...d.data()})),coupons:cl?cl.docs.map(d=>({id:d.id,...d.data(),time:d.data().time?.toMillis?.()||0})).sort((a,b)=>b.time-a.time):[],at:Date.now()};
 family.stats=familyCache.members.filter(x=>x.role==='student');family.coupons=familyCache.coupons;return familyCache}catch{return familyCache}}
function studyInfo(m){let days={};try{days=JSON.parse(m.days||'{}')}catch{}const t=dayKey(),wk=weekDays();
 const keys=Object.keys(days).filter(k=>days[k]?.q).sort();const last=keys.at(-1);let lastTxt='기록 없음';
 if(last){const diff=Math.round((new Date(t+'T00:00:00')-new Date(last+'T00:00:00'))/86400000);lastTxt=diff===0?'오늘':diff===1?'어제':diff+'일 전'}
 return {today:!!days[t]?.q,todayQ:days[t]?.q||0,weekQ:wk.reduce((s,k)=>s+(days[k]?.q||0),0),weekDays:wk.filter(k=>days[k]?.q).length,last:lastTxt,points:m.week===weekKey()?m.points||0:0}}
const ROLE_NAME={admin:'관리자',parent:'보호자',student:'학생'};

/* ── 보호자 홈: 우리 아이 ── */
SCREENS.family=()=>{
 const fc=familyCache;const kids=fc?.members.filter(x=>x.role==='student')||[];const reqs=(fc?.coupons||[]).filter(x=>x.status==='requested');
 return `<main class="screen narrow"><header class="hdr"><h1 class="t-display">우리 아이</h1><button class="btn sm" data-a="famReload" style="margin:0;box-shadow:none">${I(IC.redo,16)}새로고침</button></header>
 ${reqs.map(x=>`<section class="card stack" style="border-color:var(--blue)"><span class="qkind b">쿠폰 사용 요청</span><b style="font-size:17px">${esc(josa(x.name||'학생','이','가'))} ${esc(josa(`'${x.title}'`,'을','를'))} 쓰고 싶어요</b><div class="btns two"><button class="btn" data-a="famCoupon" data-v="${x.id}|later" style="margin:0">다음에</button><button class="btn primary" data-a="famCoupon" data-v="${x.id}|approved" style="margin:0">사용 허락</button></div></section>`).join('')}
 ${fc==null?'<p class="empty">아이들 기록을 불러오고 있어요.</p>':kids.length?kids.map(k=>{const s=studyInfo(k);return `<section class="card stack">
  <div style="display:grid;grid-template-columns:52px minmax(0,1fr) auto;gap:12px;align-items:center"><span class="t-display" style="width:52px;height:52px;border-radius:26px;background:var(--blue-soft);color:var(--blue-d);display:flex;align-items:center;justify-content:center;font-size:24px">${esc([...(k.name||'?')][0])}</span><span style="min-width:0"><b class="ell" style="display:block;font-size:18px">${esc(k.name||'학생')}</b><small class="muted ell" style="display:block">${esc(k.course||'')} · 마지막 공부 ${s.last}</small></span><span class="tag ${s.today?'g':'gray'}" style="height:30px">${s.today?'오늘 했어요':'오늘 아직'}</span></div>
  <div class="tiles3"><div class="stat g"><span>이번 주 문제</span><b>${s.weekQ}개</b></div><div class="stat o"><span>연속</span><b>${k.streak||0}일</b></div><div class="stat b"><span>다 외운 단어</span><b>${k.mastered||0}개</b></div></div>
  <div class="btns two"><button class="btn" data-a="famReport" data-v="${k.uid}" style="margin:0">주간 리포트</button><button class="btn primary" data-a="famReport" data-v="${k.uid}|cheer" style="margin:0">칭찬 보내기</button></div></section>`}).join('')
  :`<div class="card empty">${mascot(72)}<p>아직 연결된 아이의 기록이 없어요.<br>아이 폰을 연결하고 한 번 공부하면 여기에 나타나요.</p>${state.cloudRole==='admin'?'<button class="btn primary" data-a="admin">코드 발급하러 가기</button>':''}</div>`}
 ${familyStatusHTML()}
 </main>`;
};
SCREENS.family.after=()=>{if(!familyCache||Date.now()-familyCache.at>60000)loadFamilyMembers().then(()=>{if(V.tab==='family'&&!V.screen)refresh()})};
ACT.famReload=()=>{familyCache=null;render();loadFamilyMembers().then(()=>{if(V.tab==='family'&&!V.screen)render()})};
ACT.famReport=v=>{const [uid,cheer]=v.split('|');scr('report',{uid,loaded:true,cheer:!!cheer})};
ACT.famCoupon=async v=>{await ACT.capprove(v);const [id,st]=v.split('|');const x=familyCache?.coupons.find(y=>y.id===id);if(x)x.status=st;render()};

/* 가족 연결 상태 카드 (나 탭·보호자 홈) */
function familyStatusHTML(){
 if(!state.cloudRole)return '';
 const list=familyCache?.members||[];const meUid=state.cloudUid;
 const order={admin:0,parent:1,student:2};const sorted=[...list].sort((a,b)=>(order[a.role]??3)-(order[b.role]??3));
 return `<section class="card stack"><div class="card-title"><span class="h-sm">함께하는 가족</span><span class="tag g">연결됨</span></div>
 ${sorted.length?`<div class="list">${sorted.map(x=>`<div class="lrow two" style="padding:0;min-height:44px;border-bottom:2px solid var(--line2)"><span class="t">${esc(x.name||ROLE_NAME[x.role]||'')}${x.uid===meUid?' (나)':''}</span><span class="tag ${x.role==='student'?'b':x.role==='admin'?'o':'gray'}">${ROLE_NAME[x.role]||''}</span></div>`).join('')}</div>`:'<p class="note">가족 정보를 불러오고 있어요.</p>'}
 <p class="note">가족이 앱을 한 번 열면 목록에 나타나요.</p></section>`;
}
/* 연결 안 된 기기의 안내 카드 */
function connectTipHTML(){if(state.cloudRole||state.hideConnectTip)return '';return `<section class="card tight" style="display:grid;grid-template-columns:40px minmax(0,1fr) auto;gap:12px;align-items:center;background:var(--blue-soft);border-color:transparent"><span class="ico b" style="background:#fff">${I(IC.link,20)}</span><button style="all:unset;cursor:pointer;min-width:0" data-a="open" data-v="pair"><b style="display:block;color:var(--blue-d)">가족과 연결해요</b><small class="muted" style="display:block;line-height:1.4">연결하면 진도가 저장되고 부모님이 볼 수 있어요</small></button><button class="iconbtn" data-a="hideTip" aria-label="안내 닫기">${I(IC.x,18)}</button></section>`}
ACT.hideTip=()=>{state.hideConnectTip=true;persist();render()};
