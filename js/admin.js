'use strict';
/* 워드스텝 v2 — 관리자·보호자 화면, Gemini 사진 인식, 시작 */

/* ── PIN 잠금 ── */
let adminOpen=false;
async function pinHash(pin,salt){const key=await crypto.subtle.importKey('raw',new TextEncoder().encode(pin),'PBKDF2',false,['deriveBits']);const bits=await crypto.subtle.deriveBits({name:'PBKDF2',salt:new TextEncoder().encode(salt),iterations:120000,hash:'SHA-256'},key,256);return Array.from(new Uint8Array(bits),v=>v.toString(16).padStart(2,'0')).join('')}
ACT.admin=()=>{if(adminOpen)scr('admin');else scr('pin')};
SCREENS.pin=()=>{const setup=!state.pinHash;return `<main class="screen narrow"><header class="hdr3"><button class="iconbtn" data-a="tab" data-v="me" aria-label="뒤로">${I(IC.back,24,2.4)}</button><h1 class="t-display">관리자 메뉴</h1><span></span></header>
 <form id="pinForm" class="card stack"><p style="margin:0">${setup?'이 기기에서 쓸 관리자 PIN을 정해 주세요.':'관리자 PIN을 입력하세요.'}</p><label class="field">숫자 PIN (6~12자리)<input id="pin" class="input" type="password" inputmode="numeric" pattern="[0-9]{6,12}" minlength="6" maxlength="12" required></label>${setup?'<label class="field">PIN 확인<input id="pin2" class="input" type="password" inputmode="numeric" required></label>':''}<button class="btn big primary">열기</button><p class="note no" id="pinNote" role="status"></p></form></main>`};
SCREENS.pin.after=()=>{$('#pin').focus();$('#pinForm').onsubmit=async e=>{e.preventDefault();const p=$('#pin').value;if(!state.pinHash&&p!==$('#pin2').value){$('#pinNote').textContent='두 PIN을 같게 입력하세요.';return}
 const salt=state.pinSalt||crypto.randomUUID(),h=await pinHash(p,salt);if(state.pinHash&&state.pinHash!==h){$('#pinNote').textContent='PIN을 다시 확인하세요.';return}
 if(!state.pinHash){state.pinSalt=salt;state.pinHash=h;persist()}adminOpen=true;scr('admin')}};
document.addEventListener('visibilitychange',()=>{if(document.hidden&&adminOpen){adminOpen=false;if(['admin','scan'].includes(V.screen))go('me')}});

/* ── 관리자 ── */
SCREENS.admin=()=>{
 if(!adminOpen)return SCREENS.pin();
 const cloudAdmin=state.cloudRole==='admin';const g=gemini();
 return `<main class="screen narrow"><header class="hdr3"><button class="iconbtn" data-a="adminClose" aria-label="닫기">${I(IC.back,24,2.4)}</button><h1 class="t-display">관리자 메뉴</h1><span></span></header>
 ${cloudAdmin?`<h2 class="sec-label">가족 관리</h2>
 <section class="card stack"><div class="seg" role="radiogroup" aria-label="발급 대상">${[['student','학생'],['parent','보호자']].map(([k,l])=>`<button role="radio" aria-checked="${(V.p.role||'student')===k}" data-a="irole" data-v="${k}">${l}</button>`).join('')}</div>
  <form id="issueForm" style="display:grid;grid-template-columns:minmax(0,1fr) auto;gap:8px"><label class="sr" for="iname">이름</label><input id="iname" class="input" maxlength="32" placeholder="${(V.p.role||'student')==='student'?'학생':'보호자'} 이름" required><button class="btn primary" style="margin:0;box-shadow:none">코드 발급</button></form><div id="issued"></div></section>
 <section class="card flush" id="members"><p class="empty">가족 목록을 불러오고 있어요.</p></section><p class="note" id="memberNote" role="status"></p>
 <h2 class="sec-label">우리 단어장</h2>
 <section class="card stack"><button class="photo-add" data-a="open" data-v="scan" style="padding:12px"><span class="ci">${I(IC.camera,28)}</span><span style="display:flex;flex-direction:column;gap:3px;min-width:0"><b class="nw">사진으로 단어 추가</b><small class="muted nw ell">${g.key?'Gemini 키 준비됨':'Gemini 키를 넣으면 쓸 수 있어요'}</small></span>${I(IC.next,16,2.4)}</button>
  <form id="wbForm" class="stack"><label class="field">직접 넣기 (한 줄에 하나씩 "영어 - 뜻")<textarea id="wbIn" class="input" rows="4" placeholder="apple - 사과&#10;river - 강&#10;grace - 은혜" autocapitalize="off" spellcheck="false"></textarea></label><button class="btn primary">단어 추가</button></form><p class="note" id="wbNote" role="status">지금 ${state.customWords.length}개 · 학생 폰의 "우리 단어장" 과정으로 공부해요</p>
  ${state.customWords.length?`<details><summary class="note" style="cursor:pointer">넣은 단어 보기</summary><div class="list" style="margin-top:8px">${state.customWords.slice().reverse().map(x=>`<div class="lrow two" style="min-height:48px;padding:4px 0"><span class="ell"><b lang="en">${esc(x.w)}</b> <small class="muted">${esc(x.m)}</small></span><button class="btn sm" data-a="wbDel" data-v="${esc(x.w)}">삭제</button></div>`).join('')}</div></details>`:''}</section>
 <h2 class="sec-label">앱 주소 보내기</h2>
 <section class="card stack"><p class="note">학생 휴대폰에는 학생용, 보호자 휴대폰에는 보호자용 주소를 보내세요.</p><div class="btns two"><button class="btn" data-a="share" data-v="0">학생용 주소</button><button class="btn" data-a="share" data-v="1">보호자용 주소</button></div><p class="note" id="shareNote" role="status"></p></section>`
 :`<section class="card stack"><b>가족 연결 전이에요</b><p class="note">가족 관리, 우리 단어장, 쿠폰은 관리자 계정으로 연결된 기기에서 쓸 수 있어요. 연결 코드가 있으면 먼저 연결해 주세요.</p>${state.cloudRole?'':'<button class="btn" data-a="open" data-v="pair">연결 코드 입력</button>'}</section>`}
 <h2 class="sec-label">AI 사진 인식 키</h2>
 <section class="card stack" style="border-color:#F4C99E"><div class="card-title"><span class="h-sm">Gemini API 키</span><span class="tag o">관리자 전용</span></div>
  <form id="gemForm" class="stack"><label class="sr" for="gkey">Gemini API 키</label><input id="gkey" class="input" type="password" autocomplete="off" placeholder="${g.key?'키 저장됨 · 바꾸려면 새로 입력':'AIza로 시작하는 키'}"><label class="field">모델 이름<input id="gmodel" class="input" value="${esc(g.model)}" autocomplete="off" spellcheck="false"></label><div class="btns two"><button class="btn primary" style="margin:0">저장</button><button type="button" class="btn" data-a="gemDel" ${g.key?'':'disabled'} style="margin:0">키 지우기</button></div></form>
  <p class="warnbox">${I(IC.info,18)}<span>키는 이 기기의 브라우저에만 저장되고 앱 저장소에는 올라가지 않아요. 키는 Google AI Studio에서 직접 만드세요. Gemini 약관상 18세 미만이 쓰는 앱에는 넣을 수 없어서, 학생 화면에서는 AI를 쓰지 않고 관리자 화면에서만 써요. 무료 등급은 올린 사진을 Google이 활용할 수 있으니 이름·얼굴이 나오지 않게 단어 부분만 찍으세요.</span></p><p class="note" id="gemNote" role="status"></p></section>
 <h2 class="sec-label">처음부터 다시 시작</h2>
 <section class="card stack"><p class="note">학습 기록만 지우거나, 이 기기를 설치 직후 상태로 되돌릴 수 있어요.</p><div class="btns two"><button class="btn" data-a="wipeRec">기록만 삭제</button><button class="btn danger" data-a="wipeAll">전체 초기화</button></div><p class="note" id="wipeNote" role="status"></p></section>
 </main>`;
};
SCREENS.admin.after=()=>{
 if(!adminOpen)return SCREENS.pin.after();
 $('#gemForm').onsubmit=e=>{e.preventDefault();const k=$('#gkey').value.trim(),m=$('#gmodel').value.trim()||'gemini-2.5-flash';const g=gemini();if(k&&!/^[A-Za-z0-9_\-]{20,}$/.test(k)){$('#gemNote').textContent='키 모양을 다시 확인하세요.';return}
  try{localStorage.setItem('wordstep-gemini',JSON.stringify({key:k||g.key,model:m}))}catch{}$('#gkey').value='';$('#gemNote').textContent='저장했어요. 이 기기에만 보관돼요.';$('#gemNote').className='note ok'};
 if(state.cloudRole!=='admin')return;
 $('#issueForm').onsubmit=issueCode;
 $('#wbForm').onsubmit=async e=>{e.preventDefault();const add=parseWordLines($('#wbIn').value);if(!add.length){$('#wbNote').textContent='한 줄에 하나씩 "apple - 사과"처럼 적어 주세요.';return}
  try{await saveWordbook(add);$('#wbIn').value='';toast(add.length+'개를 넣었어요.');render()}catch{$('#wbNote').textContent='저장하지 못했어요. 인터넷 연결을 확인하세요.'}};
 watchMembers();
};
ACT.adminClose=()=>{adminOpen=false;go('me')};
ACT.irole=v=>{V.p.role=v;render()};
function gemini(){try{const g=JSON.parse(localStorage.getItem('wordstep-gemini')||'{}');return {key:g.key||'',model:g.model||'gemini-2.5-flash'}}catch{return {key:'',model:'gemini-2.5-flash'}}}
ACT.gemDel=()=>{try{localStorage.removeItem('wordstep-gemini')}catch{}toast('키를 지웠어요.');render()};
async function issueCode(e,restoreFrom=null,nameArg=null,roleArg=null){
 e?.preventDefault?.();const name=nameArg||$('#iname').value.trim();if(!name)return;const role=roleArg||V.p.role||'student';
 const code=Array.from(crypto.getRandomValues(new Uint32Array(8)),x=>x%10).join('');
 try{const c=await cloud(),u=await me();const data={name,role,family:u.family,created:c.store.serverTimestamp()};if(restoreFrom)data.restoreFrom=restoreFrom;await c.store.setDoc(fdoc(c,'invites',code),data);
  if($('#iname'))$('#iname').value='';
  const box=$('#issued');if(box)box.innerHTML=`<div class="issued" style="margin-top:4px"><span class="tag ${role==='student'?'b':'o'}">${role==='student'?'학생용':'보호자용'}${restoreFrom?' · 진도 이어받기':''}</span><b>${esc(name)}</b><strong>${code.match(/.{4}/g).join(' ')}</strong><small class="muted">${role==='student'?'학생':'보호자'} 기기의 "나 → 연결 코드 입력"에 넣으세요.</small></div>`;
  box?.scrollIntoView({block:'center'});
 }catch{toast('발급하지 못했어요. 연결을 확인하고 다시 시도하세요.')}
}
function watchMembers(){
 (async()=>{try{const c=await cloud(),u=await me();if(!u)return;
  const q=c.store.query(c.store.collection(c.db,'invites'),c.store.where('family','==',u.family));
  const statsP=c.store.getDocs(c.store.collection(c.db,'families',u.family,'stats')).then(s=>Object.fromEntries(s.docs.map(d=>[d.id,d.data()]))).catch(()=>({}));
  const stop=c.store.onSnapshot(q,async snap=>{const box=$('#members');if(!box)return;const stats=await statsP;
   const rows=snap.docs.map(d=>({code:d.id,...d.data()})).filter(r=>r.claimed!==u.uid&&r.role!=='admin').sort((a,b)=>(b.created?.toMillis?.()||0)-(a.created?.toMillis?.()||0));
   if(!rows.length){box.innerHTML='<p class="empty">아직 발급한 코드가 없어요.</p>';return}
   const cmds={};await Promise.all(rows.filter(r=>r.claimed&&r.role==='student').map(async r=>{try{cmds[r.claimed]=(await c.store.getDoc(fdoc(c,'families',u.family,'commands',r.claimed))).data()||{}}catch{}}));
   box.innerHTML=rows.map(r=>{const st=r.claimed?stats[r.claimed]:null;const when=(r.claimed?r.claimedAt:r.created)?.toDate?.();const theo=(cmds[r.claimed]?.unlocks||[]).includes('theo');
    return `<div class="member"><span class="who"><b>${esc(r.name)}</b><span class="tag ${r.role==='student'?'b':'o'}">${r.role==='student'?'학생':'보호자'}</span></span><span class="tag ${r.claimed?'g':'gray'}">${r.claimed?'연결됨':'대기 중'}</span>
    <small>${r.code.replace(/(\d{4})(?=\d)/,'$1 ')}${when?' · '+when.toLocaleDateString('ko-KR',{month:'numeric',day:'numeric'})+(r.claimed?' 연결':' 발급'):''}${st?' · '+esc(st.course||'')+' · 다 외운 단어 '+(st.mastered||0)+'개':''}</small>
    <div class="acts">${r.claimed&&r.role==='student'?`<button class="btn" data-a="mReset" data-v="${r.claimed}">진도 초기화</button><button class="btn" data-a="mTheo" data-v="${r.claimed}|${theo?0:1}">${theo?'신학 용어 닫기':'신학 용어 열기'}</button><button class="btn" data-a="mMove" data-v="${r.claimed}|${esc(r.name)}">새 기기로 옮기기</button>`:''}<button class="btn" data-a="mUnlink" data-v="${r.code}|${r.claimed||''}">${r.claimed?'연결 해제':'코드 취소'}</button></div></div>`}).join('');
  },()=>{const b=$('#members');if(b)b.innerHTML='<p class="empty">가족 목록을 불러오지 못했어요.</p>'});
  V._cleanup=stop;
 }catch{}})();
}
function twoTap(el,msg){if(el.dataset.armed){delete el.dataset.armed;return true}document.querySelectorAll('[data-armed]').forEach(b=>{delete b.dataset.armed;b.classList.remove('danger');b.textContent=b.dataset.label});el.dataset.label=el.textContent;el.dataset.armed='1';el.classList.add('danger');el.textContent='한 번 더 누르면 실행';$('#memberNote').textContent=msg;setTimeout(()=>{if(el.dataset.armed){delete el.dataset.armed;el.classList.remove('danger');el.textContent=el.dataset.label}},5000);return false}
ACT.mReset=async(v,el)=>{if(!twoTap(el,'진도를 처음부터 다시 시작할까요? 아이 폰이 다음에 앱을 열 때 지워져요.'))return;try{const c=await cloud(),u=await me();await c.store.setDoc(fdoc(c,'families',u.family,'commands',v),{resetAt:c.store.serverTimestamp()},{merge:true});$('#memberNote').textContent='진도 초기화를 보냈어요.'}catch{$('#memberNote').textContent='보내지 못했어요. 연결을 확인하세요.'}};
ACT.mTheo=async v=>{const [uid,on]=v.split('|');try{const c=await cloud(),u=await me();const ref=fdoc(c,'families',u.family,'commands',uid);const cur=(await c.store.getDoc(ref)).data()?.unlocks||[];const next=on==='1'?[...new Set([...cur,'theo'])]:cur.filter(x=>x!=='theo');await c.store.setDoc(ref,{unlocks:next},{merge:true});toast(on==='1'?'신학 용어 과정을 열었어요.':'신학 용어 과정을 닫았어요.');render()}catch{toast('바꾸지 못했어요. 연결을 확인하세요.')}};
ACT.mMove=(v,el)=>{const [uid,name]=[v.slice(0,v.indexOf('|')),v.slice(v.indexOf('|')+1)];if(!twoTap(el,name+' 학생의 진도를 이어받는 새 코드를 만들까요? 새 기기에서 이 코드를 넣으면 지금까지 진도가 그대로 옮겨져요.'))return;issueCode(null,uid,name,'student')};
ACT.mUnlink=async(v,el)=>{const [code,uid]=v.split('|');if(!twoTap(el,uid?'기기 연결을 해제할까요? 해제하면 그 기기는 보고를 보낼 수 없어요.':'코드를 취소할까요?'))return;try{const c=await cloud();const b=c.store.writeBatch(c.db);if(uid)b.delete(fdoc(c,'members',uid));b.delete(fdoc(c,'invites',code));await b.commit();$('#memberNote').textContent=uid?'연결을 해제했어요.':'코드를 취소했어요.'}catch{$('#memberNote').textContent='처리하지 못했어요. 연결을 확인하세요.'}};
function parseWordLines(text){return text.split(/\n+/).map(line=>{const m=line.match(/^\s*([A-Za-z][A-Za-z '\-.]*?)\s*(?:\s-\s|[:=\t]|\s–\s|\s—\s)\s*(.+?)\s*$/)||line.match(/^\s*([A-Za-z][A-Za-z '.\-]*?)\s+([^\x00-\x7F].*?)\s*$/);return m?{w:m[1].trim(),m:m[2].trim()}:null}).filter(Boolean)}
async function saveWordbook(add,remove=null){
 const c=await cloud(),u=await me();const map=new Map((state.customWords||[]).map(x=>[x.w.toLowerCase(),x]));add.forEach(x=>map.set(x.w.toLowerCase(),x));if(remove)map.delete(remove.toLowerCase());
 const words=cleanWords([...map.values()]);await c.store.setDoc(fdoc(c,'families',u.family,'wordbook','custom'),{words,updated:c.store.serverTimestamp()});state.customWords=words;persist();if(C.id==='custom')buildCourse('custom');
}
ACT.wbDel=async v=>{try{await saveWordbook([],v);toast(v+' 단어를 지웠어요.');render()}catch{toast('지우지 못했어요.')}};
function appUrl(parent){return location.origin+location.pathname.replace(/index\.html$/,'')+(parent?'?parent':'')}
ACT.share=async v=>{const parent=v==='1',url=appUrl(parent),note=$('#shareNote');try{if(navigator.share){await navigator.share({title:parent?'워드스텝 (보호자용)':'워드스텝',url});return}}catch(e){if(e?.name==='AbortError')return}
 try{await navigator.clipboard.writeText(url);note.textContent=(parent?'보호자용':'학생용')+' 주소를 복사했어요. '+url}catch{note.textContent=url}};
ACT.wipeRec=(v,el)=>{if(!el.dataset.armed){el.dataset.armed=1;el.classList.add('danger');el.textContent='한 번 더';$('#wipeNote').textContent='익힌 단어, 시험 점수, 하루 기록을 지울까요? 설정과 기기 연결은 남아요.';return}
 state.courses={};state.days={};state.talkDone=[];persist();save();$('#wipeNote').textContent='학습 기록을 지웠어요.';el.textContent='기록만 삭제';el.classList.remove('danger');delete el.dataset.armed};
ACT.wipeAll=async(v,el)=>{if(!el.dataset.armed){el.dataset.armed=1;el.textContent='정말 초기화';$('#wipeNote').textContent='학습 기록, 설정, PIN, 기기 연결까지 모두 지울까요? 되돌릴 수 없어요.';return}
 wiping=true;$('#wipeNote').textContent='초기화하고 있어요.';try{if(state.cloudRole){const c=await cloud();await c.authApi.signOut(c.auth)}}catch{}
 try{Object.keys(localStorage).forEach(k=>localStorage.removeItem(k))}catch{}try{indexedDB.databases&&(await indexedDB.databases()).forEach(d=>d.name&&indexedDB.deleteDatabase(d.name))}catch{}location.replace(location.pathname)};

/* ── 사진으로 단어 추가 (Gemini, 관리자 전용) ── */
let scan={rows:[],status:'',busy:false,thumb:''};
SCREENS.scan=()=>{
 if(!adminOpen&&state.cloudRole==='admin'){return SCREENS.pin()}
 if(state.cloudRole!=='admin')return `<main class="screen narrow"><div class="card empty">관리자 기기에서만 쓸 수 있어요.</div></main>`;
 const g=gemini();const n=scan.rows.filter(r=>r.on).length;
 return `<main class="screen narrow"><header class="hdr3"><button class="iconbtn" data-a="scanBack" aria-label="뒤로">${I(IC.back,24,2.4)}</button><h1 class="t-display">사진으로 단어 추가</h1><span></span></header>
 ${g.key?'':`<p class="warnbox">${I(IC.info,18)}<span>먼저 관리자 메뉴에서 Gemini API 키를 넣어 주세요.</span></p>`}
 <section class="card" style="display:grid;grid-template-columns:96px minmax(0,1fr);gap:14px;align-items:center;padding:12px">
  <div style="width:96px;height:96px;border-radius:14px;background:#EEF0F5 center/cover no-repeat;${scan.thumb?`background-image:url(${scan.thumb})`:''};display:flex;align-items:center;justify-content:center;color:#6B7280">${scan.thumb?'':I('<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 16l5-5 4 4 3-3 6 6"/>',26,2)}</div>
  <div style="display:flex;flex-direction:column;gap:6px;min-width:0"><span class="note ${scan.rows.length?'ok':''}" role="status">${esc(scan.status||'단어장 사진을 찍거나 골라 주세요')}</span>${scan.rows.length?`<span class="t-display" style="font-size:20px">단어 ${scan.rows.length}개 찾음</span><span class="note">틀린 곳은 눌러서 고칠 수 있어요</span>`:''}</div></section>
 <div class="btns two"><button class="btn" data-a="pickPhoto" data-v="1" ${!g.key||scan.busy?'disabled':''}>${I(IC.camera,20)}카메라</button><button class="btn" data-a="pickPhoto" data-v="0" ${!g.key||scan.busy?'disabled':''}>앨범에서 고르기</button></div>
 <input type="file" id="photoCam" accept="image/*" capture="environment" hidden><input type="file" id="photoLib" accept="image/*" hidden>
 ${scan.rows.length?`<section class="card flush"><div class="scanrow" style="min-height:40px;background:#F6F7FB;font-size:12px;font-weight:700;color:var(--muted)"><span></span><span>영어</span><span>뜻</span><span></span></div>${scan.rows.map((r,i)=>`<div class="scanrow" style="${r.on?'':'opacity:.45'}"><input type="checkbox" ${r.on?'checked':''} data-row="${i}" aria-label="${esc(r.w)} 선택"><input class="input" value="${esc(r.w)}" data-w="${i}" lang="en" aria-label="영어" autocapitalize="off" spellcheck="false"><input class="input" value="${esc(r.m)}" data-m="${i}" aria-label="뜻"><button class="iconbtn" data-a="say" data-v="${esc(r.w)}" aria-label="듣기">${I(IC.speaker1,18)}</button></div>`).join('')}</section>`:''}
 <p class="warnbox">${I(IC.info,18)}<span>이름·얼굴이 나오지 않게 단어 부분만 찍어 주세요.</span></p>
 <div class="grow"></div>
 ${scan.rows.length?`<div class="btns two62"><button class="btn" data-a="scanReset">다시 찍기</button><button class="btn primary" data-a="scanSave" ${n?'':'disabled'}>${n}개 단어 추가</button></div>`:''}
 </main>`;
};
SCREENS.scan.after=()=>{
 for(const id of ['photoCam','photoLib']){const f=$('#'+id);if(f)f.onchange=()=>runScan(f.files[0])}
 document.querySelectorAll('[data-row]').forEach(x=>x.onchange=()=>{scan.rows[x.dataset.row].on=x.checked;V.forceRefresh=true;render();V.forceRefresh=false});
 document.querySelectorAll('[data-w]').forEach(x=>x.oninput=()=>scan.rows[x.dataset.w].w=x.value.trim());
 document.querySelectorAll('[data-m]').forEach(x=>x.oninput=()=>scan.rows[x.dataset.m].m=x.value.trim());
};
ACT.scanBack=()=>{if(adminOpen)scr('admin');else go('words')};
ACT.pickPhoto=v=>$(v==='1'?'#photoCam':'#photoLib')?.click();
ACT.scanReset=()=>{scan={rows:[],status:'',busy:false,thumb:''};render()};
ACT.scanSave=async(v,el)=>{const add=scan.rows.filter(r=>r.on&&r.w&&r.m).map(r=>({w:r.w,m:r.m}));if(!add.length)return;el.disabled=true;
 try{await saveWordbook(add);toast(add.length+'개 단어를 우리 단어장에 넣었어요.');scan={rows:[],status:'',busy:false,thumb:''};go('words')}catch{el.disabled=false;toast('저장하지 못했어요. 인터넷 연결을 확인하세요.')}};
function shrink(file,max=1600){return new Promise((ok,fail)=>{const img=new Image();img.onload=()=>{const s=Math.min(1,max/Math.max(img.width,img.height));const cv=document.createElement('canvas');cv.width=Math.round(img.width*s);cv.height=Math.round(img.height*s);cv.getContext('2d').drawImage(img,0,0,cv.width,cv.height);URL.revokeObjectURL(img.src);ok(cv.toDataURL('image/jpeg',.85))};img.onerror=fail;img.src=URL.createObjectURL(file)})}
async function runScan(file){
 if(!file||scan.busy)return;const g=gemini();if(!g.key){toast('Gemini 키를 먼저 넣어 주세요.');return}
 scan.busy=true;scan.status='사진을 준비하고 있어요.';scan.rows=[];render();
 try{const url=await shrink(file);scan.thumb=url;scan.status='Gemini가 단어를 찾고 있어요.';render();
  const prompt='이 사진은 영어 단어장이나 학습지입니다. 사진에 보이는 영어 단어(또는 짧은 표현)와 그 한국어 뜻을 모두 찾아 주세요. 사진에 한국어 뜻이 적혀 있으면 그대로 쓰고, 없으면 초등학생도 이해할 수 있는 짧은 한국어 뜻을 붙여 주세요. 사람 이름, 페이지 번호, 문장 전체는 빼 주세요. 반드시 JSON 배열만 답하세요. 형식: [{"w":"apple","m":"사과"}]';
  const body={contents:[{parts:[{text:prompt},{inline_data:{mime_type:'image/jpeg',data:url.split(',')[1]}}]}],generationConfig:{responseMimeType:'application/json',temperature:0.1}};
  const res=await fetch('https://generativelanguage.googleapis.com/v1beta/models/'+encodeURIComponent(g.model)+':generateContent',{method:'POST',headers:{'Content-Type':'application/json','x-goog-api-key':g.key},body:JSON.stringify(body)});
  const data=await res.json().catch(()=>({}));
  if(!res.ok){const msg=data?.error?.message||'';throw Error(res.status===400&&/API key/i.test(msg)?'키가 올바르지 않아요. 관리자 메뉴에서 키를 다시 확인하세요.':res.status===429?'무료 사용량을 넘었어요. 잠시 뒤 다시 해 주세요.':res.status===404?'모델 이름을 찾을 수 없어요. 관리자 메뉴에서 모델 이름을 확인하세요.':'인식하지 못했어요 ('+res.status+').')}
  const text=data?.candidates?.[0]?.content?.parts?.map(p=>p.text||'').join('')||'[]';
  let arr=[];try{arr=JSON.parse(text.replace(/^```json|```$/g,'').trim())}catch{const m=text.match(/\[[\s\S]*\]/);arr=m?JSON.parse(m[0]):[]}
  const seen=new Set();scan.rows=cleanWords(arr).filter(x=>{const k=x.w.toLowerCase();if(seen.has(k))return false;seen.add(k);return /[a-z]/i.test(x.w)}).map(x=>({...x,on:true}));
  scan.status=scan.rows.length?'Gemini가 정리했어요':'단어를 찾지 못했어요. 밝은 곳에서 다시 찍어 주세요.';
 }catch(e){scan.status=e.message&&!/fetch/i.test(e.message)?e.message:'인식하지 못했어요. 인터넷 연결을 확인해 주세요.'}
 finally{scan.busy=false;render()}
}

/* ── 보호자: 주간 리포트 ── */
let family={stats:null,coupons:null};
async function loadFamily(){try{const c=await cloud(),u=await me();if(!u)return;
 const [st,cl]=await Promise.all([c.store.getDocs(c.store.collection(c.db,'families',u.family,'stats')),c.store.getDocs(c.store.collection(c.db,'families',u.family,'couponLog'))]);
 family.stats=st.docs.map(d=>({uid:d.id,...d.data()})).filter(x=>x.role==='student');family.coupons=cl.docs.map(d=>({id:d.id,...d.data(),time:d.data().time?.toMillis?.()||0})).sort((a,b)=>b.time-a.time)}catch{family.stats=family.stats||[];family.coupons=family.coupons||[]}}
SCREENS.report=p=>{
 const list=family.stats;const head=`<header class="hdr3"><button class="iconbtn" data-a="tab" data-v="me" aria-label="뒤로">${I(IC.back,24,2.4)}</button><h1 class="t-display">주간 리포트</h1><span></span></header>`;
 if(!list)return `<main class="screen narrow">${head}<p class="empty">불러오고 있어요.</p></main>`;
 if(!list.length)return `<main class="screen narrow">${head}<div class="card empty">아직 연결된 학생의 기록이 없어요.</div></main>`;
 const sel=list.find(x=>x.uid===p.uid)||list[0];let days={},weak=[];try{days=JSON.parse(sel.days||'{}');weak=JSON.parse(sel.weak||'[]')}catch{}
 const wk=weekDays();const q=wk.reduce((s,k)=>s+(days[k]?.q||0),0),c=wk.reduce((s,k)=>s+(days[k]?.c||0),0),ms=wk.reduce((s,k)=>s+(days[k]?.ms||0),0),studied=wk.filter(k=>days[k]?.q).length,nw=wk.reduce((s,k)=>s+(days[k]?.nw||0),0);
 const mins=Math.round(ms/60000),maxMin=Math.max(10,...wk.map(k=>(days[k]?.ms||0)/60000));
 const coupons=(family.coupons||[]).filter(x=>x.uid===sel.uid).slice(0,4);
 const m0=new Date(wk[0]+'T00:00:00'),m6=new Date(wk[6]+'T00:00:00');
 return `<main class="screen narrow">${head}
 ${list.length>1?`<div class="seg" role="tablist">${list.map(x=>`<button role="tab" aria-selected="${x.uid===sel.uid}" data-a="rsel" data-v="${x.uid}">${esc(x.name||'학생')}</button>`).join('')}</div>`:''}
 <section class="card-title"><span><span class="note nw">${m0.getMonth()+1}월 ${m0.getDate()}일 ~ ${m6.getMonth()+1}월 ${m6.getDate()}일</span><h2 class="t-display" style="margin:0;font-size:24px">${esc(sel.name||'')}의 이번 주</h2></span><span class="tag o">보호자용</span></section>
 <section class="kv"><div><span>공부한 날</span><b>${studied}일 <small class="muted" style="font-size:14px;font-weight:500">/ 7일</small></b></div><div><span>푼 문제</span><b style="color:var(--brand-t)">${q}개</b></div><div><span>정답률</span><b>${q?Math.round(c/q*100):0}%</b></div><div><span>공부 시간</span><b>${mins>=60?Math.floor(mins/60)+'시간 '+(mins%60)+'분':mins+'분'}</b></div></section>
 <section class="card stack"><span class="h-sm">요일별 공부 시간</span><div class="bars">${wk.map((k,i)=>{const m=(days[k]?.ms||0)/60000;return `<div><i class="${m?'':'zero'}" style="height:${Math.max(4,Math.round(m/maxMin*56))}px"></i><span>${'월화수목금토일'[i]}</span></div>`}).join('')}</div></section>
 <section class="card stack"><span class="h-sm">자꾸 틀리는 단어</span>${weak.length?`<div style="display:flex;flex-wrap:wrap;gap:8px">${weak.map(([w,m])=>`<span class="tag o" style="height:34px;font-size:14px;padding:0 12px">${esc(w)} ${esc(m)}</span>`).join('')}</div>`:'<span class="note">아직 없어요. 아주 잘하고 있어요!</span>'}</section>
 <section class="card flush">${coupons.length?coupons.map(x=>`<div class="lrow two" style="min-height:48px"><span class="t">쿠폰 · ${esc(x.title)}</span><span class="note nw">${{earned:'아직 안 씀',requested:'사용 요청',approved:'허락함',later:'다음에',used:'사용 완료'}[x.status]||''}</span></div>`).join(''):'<p class="empty" style="padding:16px">이번 주 쿠폰 기록이 없어요.</p>'}</section>
 <section class="card stack"><label class="field" for="cheerText">칭찬 한마디 보내기</label><div style="display:grid;grid-template-columns:minmax(0,1fr) auto;gap:8px"><input id="cheerText" class="input" maxlength="60" placeholder="오늘도 정말 멋졌어!"><button class="btn primary" style="margin:0;box-shadow:none" data-a="cheer" data-v="${sel.uid}">보내기</button></div></section>
 <p class="note" style="text-align:center">누적 · 익힌 단어 ${sel.learned||0}개 · 다 외운 단어 ${sel.mastered||0}개 · ${sel.streak||0}일 연속</p></main>`;
};
SCREENS.report.after=p=>{if(!p.loaded){p.loaded=true;loadFamily().then(()=>{if(V.screen==='report')render()})}};
ACT.rsel=v=>{V.p.uid=v;render()};
ACT.cheer=async(v,el)=>{const t=$('#cheerText').value.trim();if(!t)return;el.disabled=true;try{const c=await cloud(),u=await me();await c.store.setDoc(fdoc(c,'families',u.family,'cheers',crypto.randomUUID()),{to:v,from:u.name||(u.role==='admin'?'관리자':'보호자'),text:t.slice(0,60),time:c.store.serverTimestamp()});$('#cheerText').value='';toast('칭찬을 보냈어요!')}catch{toast('보내지 못했어요.')}finally{el.disabled=false}};
async function checkCheers(){if(state.cloudRole!=='student')return;try{const c=await cloud(),u=await me();const q=c.store.query(c.store.collection(c.db,'families',u.family,'cheers'),c.store.where('to','==',u.uid));const s=await c.store.getDocs(q);
 const last=s.docs.map(d=>({id:d.id,...d.data(),t:d.data().time?.toMillis?.()||0})).sort((a,b)=>b.t-a.t)[0];if(last&&last.id!==state.cheer?.id){state.cheer={id:last.id,from:last.from,text:last.text,seen:false};persist();if(V.tab==='today'&&!V.screen)render()}}catch{}}

/* ── 보호자: 쿠폰 관리 ── */
SCREENS.coupons=p=>{
 const cfg=couponConfig;const head=`<header class="hdr"><button class="iconbtn" data-a="tab" data-v="me" aria-label="뒤로">${I(IC.back,24,2.4)}</button><h1 class="t-display" style="flex:1">쿠폰 관리</h1><span class="tag o">보호자용</span></header>`;
 if(!cfg||!family.coupons)return `<main class="screen narrow">${head}<p class="empty">불러오고 있어요.</p></main>`;
 const reqs=family.coupons.filter(x=>x.status==='requested');
 return `<main class="screen narrow">${head}
 ${reqs.map(x=>`<section class="card stack" style="border-color:var(--blue)"><span class="qkind b">사용 요청</span><b style="font-size:17px">${esc(josa(x.name||'학생','이','가'))} ${esc(josa(`'${x.title}'`,'을','를'))} 쓰고 싶어요</b><div class="btns two"><button class="btn" data-a="capprove" data-v="${x.id}|later" style="margin:0">다음에</button><button class="btn primary" data-a="capprove" data-v="${x.id}|approved" style="margin:0">사용 허락</button></div></section>`).join('')}
 <div class="card-title"><h2 class="sec-label" style="margin:0">아이에게 보여 줄 쿠폰</h2><span class="note nw">켠 것만 아이가 골라요</span></div>
 <section class="card flush">${cfg.items.map((it,i)=>{const on=it.on.some(Boolean);return `<div class="lrow" style="grid-template-columns:minmax(0,1fr) auto 52px;min-height:52px;${on?'':'opacity:.55'}"><span class="t">${esc(COUPON_KINDS[it.k]?.[0]||it.k)}</span><span class="chiprow">${it.sizes.map((s,j)=>`<button aria-pressed="${!!it.on[j]}" data-a="csize" data-v="${i}|${j}">${esc(s)}</button>`).join('')}</span><button class="switch" role="switch" aria-checked="${on}" aria-label="${esc(COUPON_KINDS[it.k]?.[0]||'')}" data-a="citem" data-v="${i}"></button></div>`}).join('')}
 ${(cfg.custom||[]).map((x,i)=>`<div class="lrow" style="grid-template-columns:minmax(0,1fr) auto 52px;min-height:52px"><span class="t">${esc(x.title)}</span><button class="btn sm" data-a="cdel" data-v="${i}" style="margin:0;box-shadow:none">삭제</button><button class="switch" role="switch" aria-checked="${!!x.on}" data-a="ccust" data-v="${i}" aria-label="${esc(x.title)}"></button></div>`).join('')}</section>
 <form id="cnew" style="display:grid;grid-template-columns:minmax(0,1fr) auto;gap:8px"><label class="sr" for="cnewIn">새 쿠폰 이름</label><input id="cnewIn" class="input" maxlength="20" placeholder="새 쿠폰 (예: 영화 보기)"><button class="btn primary" style="margin:0;box-shadow:none">${I(IC.plus,16,3)}새 쿠폰</button></form>
 <section class="card stack"><span class="h-sm">쿠폰 받는 조건</span><div class="lrow two" style="padding:0;min-height:44px"><span class="t">작은 쿠폰 (30분·1개)</span><span class="v">시험 ${cfg.low}점 이상</span></div><div class="lrow two" style="padding:0;min-height:44px"><span class="t">큰 쿠폰 (1시간·2개)</span><select class="input" style="width:120px;min-height:40px" id="chigh">${[85,90,95,100].map(n=>`<option value="${n}" ${cfg.high===n?'selected':''}>${n}점 이상</option>`).join('')}</select></div></section>
 <p class="note" id="cNote" role="status"></p></main>`;
};
SCREENS.coupons.after=p=>{
 if(!p.loaded){p.loaded=true;Promise.all([loadCouponConfig(),loadFamily()]).then(()=>{if(V.screen==='coupons')render()});return}
 const f=$('#cnew');if(f)f.onsubmit=e=>{e.preventDefault();const t=$('#cnewIn').value.trim();if(!t)return;(couponConfig.custom??=[]).push({title:t.slice(0,20),on:true});saveCoupons()};
 const h=$('#chigh');if(h)h.onchange=()=>{couponConfig.high=Number(h.value);saveCoupons()};
};
let couponSave=null;
function saveCoupons(){render();clearTimeout(couponSave);couponSave=setTimeout(async()=>{try{const c=await cloud(),u=await me();await c.store.setDoc(fdoc(c,'families',u.family,'coupons','config'),{data:JSON.stringify(couponConfig),updated:c.store.serverTimestamp()});const n=$('#cNote');if(n){n.className='note ok';n.textContent='저장했어요.'}}catch{const n=$('#cNote');if(n){n.className='note no';n.textContent='저장하지 못했어요. 연결을 확인하세요.'}}},500)}
ACT.csize=v=>{const [i,j]=v.split('|').map(Number);const it=couponConfig.items[i];it.on[j]=!it.on[j];saveCoupons()};
ACT.citem=v=>{const it=couponConfig.items[Number(v)];const on=it.on.some(Boolean);it.on=it.on.map(()=>!on);saveCoupons()};
ACT.ccust=v=>{const x=couponConfig.custom[Number(v)];x.on=!x.on;saveCoupons()};
ACT.cdel=v=>{couponConfig.custom.splice(Number(v),1);saveCoupons()};
ACT.capprove=async v=>{const [id,st]=v.split('|');try{const c=await cloud(),u=await me();await c.store.updateDoc(fdoc(c,'families',u.family,'couponLog',id),{status:st,changed:c.store.serverTimestamp()});const x=family.coupons.find(y=>y.id===id);if(x)x.status=st;toast(st==='approved'?'허락했어요. 아이에게 알렸어요.':'다음에 쓰자고 알렸어요.');render()}catch{toast('보내지 못했어요.')}};

/* ── 보호자: 학습 보고함 ── */
SCREENS.reports=()=>`<main class="screen narrow"><header class="hdr3"><button class="iconbtn" data-a="tab" data-v="me" aria-label="뒤로">${I(IC.back,24,2.4)}</button><h1 class="t-display">학습 보고함</h1><span></span></header><p class="note" id="repNote" role="status">불러오고 있어요.</p><section class="card flush" id="repList"></section></main>`;
SCREENS.reports.after=()=>{(async()=>{try{const c=await cloud(),u=await me();const q=c.store.query(c.store.collection(c.db,'families',u.family,'reports'),c.store.orderBy('time','desc'),c.store.limit(40));
 const stop=c.store.onSnapshot(q,snap=>{const box=$('#repList');if(!box)return;box.innerHTML=snap.docs.map(d=>{const r=d.data();return `<div class="report-item"><small>${esc(r.time?.toDate?.().toLocaleString('ko-KR')||'')}</small>${esc(r.body)}</div>`}).join('')||'<p class="empty">아직 보고가 없어요.</p>';$('#repNote').textContent='실시간 연결 · 최근 '+snap.size+'건'},()=>{$('#repNote').textContent='보고함을 불러오지 못했어요.'});V._cleanup=stop}catch{$('#repNote').textContent='가족 연결을 확인하세요.'}})()};

/* ── 시작 ── */
async function boot(){
 const q=new URLSearchParams(location.search);
 try{await useCourse(state.course||modeInfo().courses[0])}catch{try{await useCourse('basic')}catch{}}
 if(q.has('parent')){V.tab='me';if(!state.cloudRole)V.screen='pair'}
 else if(state.cloudRole==='parent'||state.cloudRole==='admin')V.tab='me';
 render();
 if('serviceWorker' in navigator&&location.protocol==='https:'){navigator.serviceWorker.register('./sw.js').catch(()=>{});let reloaded=false;navigator.serviceWorker.addEventListener('controllerchange',()=>{if(reloaded||S)return;reloaded=true;location.reload()})}
 if(state.cloudRole||state.cloudUid){identify().then(u=>{if(u){refresh();flushReports();checkCheers();loadLeague().then(()=>{if(!V.screen&&['today','me'].includes(V.tab))refresh()})}}).catch(()=>{})}
 setInterval(()=>{if(state.cloudRole)syncCloud()},5*60*1000);
 document.addEventListener('visibilitychange',()=>{if(document.hidden&&state.cloudRole)syncCloud()});
}
boot();
