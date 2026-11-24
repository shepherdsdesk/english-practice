'use strict';
/* 워드스텝 v2 — 상태·과정·학습 엔진·소리·클라우드 기본 */

/* ── 작은 도구 ── */
const $=s=>document.querySelector(s);
const esc=t=>String(t??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[c]);
const shuffle=a=>{const c=[...a];for(let i=c.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[c[i],c[j]]=[c[j],c[i]]}return c};
const pick=a=>a[Math.floor(Math.random()*a.length)];
const norm=v=>String(v).trim().toLowerCase().replace(/[’‘]/g,"'").replace(/\s+/g,' ');
const pad=n=>String(n).padStart(2,'0');
function dayKey(d=new Date()){return d.getFullYear()+'-'+pad(d.getMonth()+1)+'-'+pad(d.getDate())}
function dayNum(d=new Date()){return Math.floor((d.getTime()-d.getTimezoneOffset()*60000)/86400000)}
function weekKey(d=new Date()){const t=new Date(d);t.setHours(0,0,0,0);t.setDate(t.getDate()-((t.getDay()+6)%7));return dayKey(t)} // 월요일 날짜
function weekDays(d=new Date()){const m=new Date(weekKey(d)+'T00:00:00');return [...Array(7)].map((_,i)=>{const x=new Date(m);x.setDate(m.getDate()+i);return dayKey(x)})}

function josa(w,a,b){const s=String(w).replace(/[^가-힣0-9a-zA-Z]+$/,'');const ch=s.charCodeAt(s.length-1);if(ch>=0xAC00&&ch<=0xD7A3)return w+((ch-0xAC00)%28?a:b);if(/[013678]$/.test(s))return w+a;if(/[2459]$/.test(s))return w+b;return w+a+'('+b+')'}
/* ── 저장 ── */
const KEY='wordstep-v2';
const OLD_KEY='habin-english-v1';
let wiping=false;
const state=(()=>{let s=null;try{s=JSON.parse(localStorage.getItem(KEY)||'null')}catch{}
  if(!s){s={v:2};let o=null;try{o=JSON.parse(localStorage.getItem(OLD_KEY)||'null')}catch{}
    if(o){ // 예전 버전에서 연결·설정을 옮겨 와요.
      for(const k of ['cloudUid','cloudRole','cloudName','pinSalt','pinHash','customWords','reports','resetSeen','voice','rate','talkDone'])if(o[k]!==undefined)s[k]=o[k];
      const today=dayNum();s.courses={};
      const take=(cid,done)=>{if(!Array.isArray(done))return;const c=s.courses[cid]??={words:{},tests:{},grammar:[]};done.filter(id=>id<1000).forEach(id=>{c.words[Math.floor(id/25)*100+id%25]={lv:1,due:today,r:1,w:0}})};
      take(o.course||'basic',o.done);Object.entries(o.progress||{}).forEach(([cid,p])=>take(cid,p.done));
      if(o.course)s.course=o.course;
    }}
  return s})();
const DEFAULTS={mode:'elem',course:'basic',goal:20,rate:1,voice:'',sfx:true,courses:{},days:{},talkDone:[],reports:[],customWords:[],unlocks:[],myCoupons:[]};
for(const [k,v] of Object.entries(DEFAULTS))if(state[k]===undefined)state[k]=structuredClone(v);
let saveTimer=null;
function persist(){if(wiping)return;try{localStorage.setItem(KEY,JSON.stringify(state))}catch{}}
function save(){persist();clearTimeout(saveTimer);saveTimer=setTimeout(()=>{syncCloud()},4000)}

/* ── 나이 모드와 과정 ── */
const MODES=[
 {id:'kids',name:'유치',courses:['kids'],theme:'kids',note:'알파벳 과정 · 큰 글씨, 그림과 소리 중심'},
 {id:'elem',name:'초등',courses:['basic','mid','adv'],theme:'fun',note:'기초 → 중급 → 고급 과정'},
 {id:'middle',name:'중등',courses:['middle'],theme:'fun',note:'중등 과정 · 단원 시험 강화'},
 {id:'high',name:'고등',courses:['high'],theme:'calm',note:'고등 과정 · 차분한 화면'},
 {id:'univ',name:'대학',courses:['univ'],theme:'calm',note:'대학 과정 · 차분한 화면'},
 {id:'work',name:'직장',courses:['biz'],theme:'calm',note:'비즈니스 영어 · 메일·회의 표현'}];
const COURSES={
 kids:{name:'알파벳',level:'유치'},basic:{name:'기초',level:'초등 기초'},mid:{name:'중급',level:'초등 중급'},adv:{name:'고급',level:'초등 고급'},
 middle:{name:'중등',level:'중학교'},high:{name:'고등',level:'고등학교'},univ:{name:'대학',level:'대학·성인'},biz:{name:'직장',level:'비즈니스'},
 theo:{name:'신학 용어',level:'관리자가 열어 준 과정',hidden:true},custom:{name:'우리 단어장',level:'관리자가 고른 단어'}};
window.WORDSTEP_COURSES=window.WORDSTEP_COURSES||{};
window.WORDSTEP_LESSONS=window.WORDSTEP_LESSONS||{};
window.WORDSTEP_EXAMPLES=window.WORDSTEP_EXAMPLES||{};
function modeInfo(id=state.mode){return MODES.find(m=>m.id===id)||MODES[1]}
function theoOpen(){return state.cloudRole==='admin'||(state.unlocks||[]).includes('theo')}
function courseChoices(){const m=modeInfo(),out=[...m.courses];if(state.customWords?.length)out.push('custom');if(theoOpen())out.push('theo');return out}
function themeOf(){return state.course==='theo'||state.course==='biz'?'calm':modeInfo().theme}

const loads={};
function loadScript(src){return loads[src]??=new Promise((ok,fail)=>{const el=document.createElement('script');el.src=src;el.onload=()=>ok(true);el.onerror=()=>{delete loads[src];el.remove();fail(Error(src))};document.head.append(el)})}
async function ensureCourse(id){
 if(id==='custom'||WORDSTEP_COURSES[id])return;
 await loadScript('./courses/'+id+'.js');
 if(!WORDSTEP_COURSES[id])throw Error('course');
}
function ensureExamples(id){if(['basic'].includes(id)&&!WORDSTEP_EXAMPLES[id])loadScript('./courses/examples-'+id+'.js').then(()=>{C.exReady=true}).catch(()=>{})}
function ensureLessons(id){if(WORDSTEP_LESSONS[id])return Promise.resolve(true);if(!['basic','mid','adv','middle','high','univ'].includes(id))return Promise.resolve(false);return loadScript('./courses/lessons-'+id+'.js').then(()=>!!WORDSTEP_LESSONS[id]).catch(()=>false)}

/* 지금 과정 데이터: units[u]={name,words:[{id,word,meaning,unit,ex}]} */
const C={id:'',units:[],grammar:[],groups:[],byId:new Map(),exReady:false};
function parseWords(words){return typeof words==='string'?words.split('|').map(p=>{const k=p.indexOf(':');return [p.slice(0,k).trim(),p.slice(k+1).trim()]}):words}
function buildCourse(id){
 let data;
 if(id==='custom'){const w=state.customWords||[],units=[];for(let i=0;i<w.length;i+=20)units.push(['우리 단어 '+(i/20+1),w.slice(i,i+20).map(x=>[x.w,x.m])]);data={units}}
 else data=WORDSTEP_COURSES[id];
 C.id=id;C.units=[];C.byId=new Map();C.grammar=data.grammar||[];C.groups=data.groups?.length?data.groups:(C.grammar.length?[['문법',0,C.grammar.length]]:[]);C.letters=!!data.letters;
 (data.units||[]).forEach(([name,words],u)=>{const list=parseWords(words).map(([word,meaning,extra],i)=>{const e={id:u*100+i,word,meaning,unit:u,extra};C.byId.set(e.id,e);return e});C.units.push({name,words:list})});
}
function exampleOf(e){if(!e)return null;if(e.extra?.ex)return e.extra.ex;const m=WORDSTEP_EXAMPLES[C.id];return m?.[e.word]||null}
function prog(id=C.id){return state.courses[id]??={words:{},tests:{},grammar:[]}}
function W(id){return prog().words[id]}
async function useCourse(id){
 if(!COURSES[id])id='basic';
 if(id==='theo'&&!theoOpen())id=modeInfo().courses[0];
 if(id==='custom'&&!state.customWords?.length)id=modeInfo().courses[0];
 await ensureCourse(id);state.course=id;buildCourse(id);ensureExamples(id);persist();
}

/* ── 학습 엔진: 익힘 5단계와 간격 복습 ── */
const LV_NAMES=['새 단어','처음 봄','알아봄','떠올림','철자','다 외움'];
const IVAL=[0,1,3,7,14,30];
function allWords(){return C.units.flatMap(u=>u.words)}
function learned(){return allWords().filter(e=>(W(e.id)?.lv||0)>=1)}
function dueWords(){const t=dayNum();return learned().filter(e=>W(e.id).due<=t).sort((a,b)=>W(a.id).due-W(b.id).due)}
function weakWords(){return learned().filter(e=>{const p=W(e.id);return p.w>=2&&p.w>=p.r*0.4}).sort((a,b)=>W(b.id).w-W(a.id).w).slice(0,10)}
function grade(e,ok,{hint=false}={}){
 const p=prog().words[e.id]??={lv:0,due:0,r:0,w:0};const today=dayNum();
 if(ok){p.r++;if(!hint&&(p.lv===0||p.due<=today)&&p.lastUp!==today){p.lv=Math.min(5,p.lv+1);p.due=today+IVAL[p.lv];p.lastUp=today}else if(p.lv===0){p.lv=1;p.due=today+1}}
 else{p.w++;p.lv=Math.max(1,p.lv-1);p.due=today+1;p.lastUp=today}
 p.last=today;
}
function unitDone(u){return (prog().tests[u]||0)>=80}
function unitOpen(u){return C.id==='custom'||u===0||unitDone(u-1)||(prog().tests[u]||0)>0}
function stepsOf(u){const w=C.units[u]?.words||[],out=[];for(let i=0;i<w.length;i+=5)out.push(w.slice(i,i+5));return out}
function stepDone(u,k){return stepsOf(u)[k]?.every(e=>(W(e.id)?.lv||0)>=1)}
function currentUnit(){for(let u=0;u<C.units.length;u++)if(!unitDone(u))return u;return Math.max(0,C.units.length-1)}
function nextNewWords(n){const out=[];for(let u=0;u<C.units.length&&out.length<n;u++){if(!unitOpen(u))break;for(const e of C.units[u].words){if(!(W(e.id)?.lv)){out.push(e);if(out.length>=n)break}}}return out}

/* ── 하루 기록 ── */
function today(){return state.days[dayKey()]??={q:0,c:0,xp:0,ms:0,nw:0}}
function streak(){let n=0;const d=new Date();if(!state.days[dayKey(d)]?.q)d.setDate(d.getDate()-1);while(state.days[dayKey(d)]?.q){n++;d.setDate(d.getDate()-1)}return n}
function weekPoints(){return weekDays().reduce((s,k)=>s+(state.days[k]?.xp||0),0)}
function trimDays(){const keys=Object.keys(state.days).sort();while(keys.length>70)delete state.days[keys.shift()]}

/* ── 소리 ── */
let player,soundId=0;const synth=window.speechSynthesis;
function voices(){const rank=v=>(/natural|neural|premium|enhanced|Google US English/i.test(v.name)?10:0)+(/en[-_]US/i.test(v.lang)?3:0)+(/Samantha|Daniel/i.test(v.name)?2:0);return (synth?.getVoices()||[]).filter(v=>/^en/i.test(v.lang)).sort((a,b)=>rank(b)-rank(a))}
voices();
function stopSound(){soundId++;if(player){player.pause();player=null}synth?.cancel()}
function say(text,{slow=false}={}){
 stopSound();const id=soundId;const rate=(slow?0.7:1)*(state.rate||1);
 const tts=()=>{if(id!==soundId||!synth)return;const list=voices();const m=new SpeechSynthesisUtterance(text);if(list.length){m.voice=list.find(v=>v.voiceURI===state.voice)||list[0];m.lang=m.voice.lang}else m.lang='en-US';m.rate=rate;synth.speak(m)};
 if(state.voice||slow||text.length===1||/\s/.test(text.trim())&&text.split(/\s+/).length>3){tts();return}
 const a=new Audio('https://ssl.gstatic.com/dictionary/static/sounds/20200429/'+encodeURIComponent(text.toLowerCase().trim())+'--_us_1.mp3');
 player=a;a.playbackRate=rate;let tried=false;const t=setTimeout(rec,2500);
 function rec(){if(tried||id!==soundId)return;tried=true;clearTimeout(t);a.pause();tts()}
 a.onplaying=()=>clearTimeout(t);a.onerror=rec;a.play().catch(rec);
}
let actx;
function sfx(ok){if(!state.sfx)return;try{actx??=new (window.AudioContext||window.webkitAudioContext)();const t=actx.currentTime;const notes=ok?[660,880]:[300,220];notes.forEach((f,i)=>{const o=actx.createOscillator(),g=actx.createGain();o.type=ok?'triangle':'sine';o.frequency.value=f;g.gain.setValueAtTime(.0001,t+i*.11);g.gain.exponentialRampToValueAtTime(.18,t+i*.11+.02);g.gain.exponentialRampToValueAtTime(.0001,t+i*.11+.16);o.connect(g).connect(actx.destination);o.start(t+i*.11);o.stop(t+i*.11+.18)})}catch{}}
const Rec=window.SpeechRecognition||window.webkitSpeechRecognition;

/* ── 칭찬 ── */
function callName(){const n=(state.cloudName||state.localName||'').trim();if(!n)return '';const g=/^[가-힣]{3}$/.test(n)?n.slice(1):n,last=g.charCodeAt(g.length-1);return /[가-힣]$/.test(g)?g+((last-0xAC00)%28?'아':'야'):g}
function nameOnly(){const n=(state.cloudName||state.localName||'').trim();return /^[가-힣]{3}$/.test(n)?n.slice(1):n}
const PRAISE={
 ok:['정답! 원어민 같아요','정답! 완전 칭찬해요','맞았어요! 영어 천재','정답! 척척박사','맞았어요! 최고예요','Perfect! 완벽해요','Great! 아주 좋아요','정답! 실력이 쑥쑥 자라요'],
 no:['괜찮아요, 다시 해 봐요','아깝다! 거의 맞았어요','틀려도 괜찮아요','다음엔 꼭 맞힐 거예요'],
 done:[['완전 칭찬해!','발음도 철자도 척척, 원어민 친구가 깜짝 놀라겠어요.'],['영어 천재 등장!','오늘 배운 단어는 이제 완전히 내 거예요.'],['원어민 같아요!','이 정도면 외국 친구랑 바로 이야기해도 되겠어요.'],['Excellent!','최고예요! 오늘 나 자신을 마음껏 칭찬해 줘요.'],['Amazing!','집중력이 정말 대단해요.'],['꾸준함 최고!','이렇게만 하면 영어 천재 되는 건 시간문제예요.'],['쑥쑥 크는 중!','매일 조금씩 하는 게 진짜 실력이 돼요.'],['오늘도 해냈어요!','틀린 단어는 잊을 때쯤 다시 나와서 꼭 내 것이 돼요.']]};

/* ── 클라우드 (Firebase) ── */
let firebaseReady,familyUser=null;
async function cloud(){
 const config=window.familyFirebaseConfig;if(!config?.projectId||!config.apiKey)throw Error('config');
 if(!firebaseReady){const base='https://www.gstatic.com/firebasejs/10.14.1/';
  firebaseReady=Promise.all(['firebase-app','firebase-auth','firebase-firestore'].map(x=>import(base+x+'.js'))).then(async([appApi,authApi,store])=>{const inst=appApi.initializeApp(config),auth=authApi.getAuth(inst);await auth.authStateReady();return {auth,authApi,store,db:store.getFirestore(inst)}}).catch(e=>{firebaseReady=null;throw e})}
 return firebaseReady;
}
const fdoc=(c,...p)=>c.store.doc(c.db,...p);
async function identify(){
 const c=await cloud(),user=c.auth.currentUser;familyUser=null;if(!user)return null;
 const data=(await c.store.getDoc(fdoc(c,'members',user.uid))).data();
 if(!data){if(state.cloudRole){state.cloudRole=null;state.cloudUid=null;state.cloudName=null;state.family=null;persist()}return null}
 if(!['admin','parent','student'].includes(data.role)||!data.family||data.family.includes('/'))throw Error('member');
 familyUser={...data,uid:user.uid};
 Object.assign(state,{cloudUid:user.uid,cloudRole:data.role,cloudName:data.name||null,family:data.family});persist();
 syncCustomWords(c,familyUser);watchCommands(c,familyUser);watchMyCoupons(c,familyUser);syncCloud();
 return familyUser;
}
async function me(){if(familyUser)return familyUser;try{return await identify()}catch{return null}}
function cleanWords(list){return (Array.isArray(list)?list:[]).filter(x=>x&&typeof x.w==='string'&&typeof x.m==='string'&&x.w.trim()&&x.m.trim()).slice(0,1000).map(x=>({w:x.w.trim().slice(0,40),m:x.m.trim().slice(0,60)}))}
async function syncCustomWords(c,u){try{const s=await c.store.getDoc(fdoc(c,'families',u.family,'wordbook','custom'));const words=cleanWords(s.data()?.words);if(JSON.stringify(words)===JSON.stringify(state.customWords||[]))return;state.customWords=words;persist();if(C.id==='custom')buildCourse('custom');refresh()}catch{}}
let stopCommand=null;
function watchCommands(c,u){
 if(stopCommand)return;
 stopCommand=c.store.onSnapshot(fdoc(c,'families',u.family,'commands',u.uid),snap=>{
  const d=snap.data()||{};const un=Array.isArray(d.unlocks)?d.unlocks.filter(x=>typeof x==='string'):[];
  if(JSON.stringify(un)!==JSON.stringify(state.unlocks||[])){state.unlocks=un;persist();if(C.id==='theo'&&!theoOpen()){useCourse(modeInfo().courses[0]).then(refresh)}else refresh()}
  const at=d.resetAt?.toMillis?.();if(!at||at<=(state.resetSeen||0))return;
  const first=state.resetSeen===undefined&&!Object.keys(state.courses).length;
  state.resetSeen=at;state.courses={};state.days={};state.session=null;persist();
  if(!first)recordReport('진도 초기화 완료 · 보호자 요청으로 처음부터 다시 시작');
  go('today');
 },()=>{stopCommand=null});
}
/* 학습 보고 (보호자 보고함) */
let sendingReports=false;
function recordReport(body){
 body='['+(COURSES[C.id]?.name||'')+'] '+body;
 state.reports.push({id:crypto.randomUUID(),owner:state.cloudUid,time:new Date().toISOString(),body,status:state.cloudRole==='student'?'전송 대기':'기기 기록'});
 state.reports=state.reports.slice(-60);persist();flushReports();
}
async function flushReports(){
 if(sendingReports||state.cloudRole!=='student'||!navigator.onLine)return;sendingReports=true;
 try{for(const r of state.reports.filter(r=>r.status==='전송 대기')){const c=await cloud(),u=await me();if(u?.role!=='student')return;if(!r.owner){r.owner=u.uid}if(r.owner!==u.uid)continue;
  await c.store.setDoc(fdoc(c,'families',u.family,'reports',r.id),{uid:u.uid,time:c.store.Timestamp.fromDate(new Date(r.time)),body:(u.name?u.name+' · ':'')+r.body});r.status='전송 완료';persist()}}catch{}finally{sendingReports=false}
}
window.addEventListener('online',()=>{flushReports();syncCloud()});
/* 통계(리그·주간 리포트)와 진도 백업 */
let syncing=false;
async function syncCloud(){
 if(syncing||!state.cloudRole||!navigator.onLine)return;syncing=true;
 try{const c=await cloud(),u=familyUser||await identify();if(!u)return;
  const days={};weekDays().concat(lastDays(14)).forEach(k=>{if(state.days[k])days[k]=state.days[k]});
  const weak=[];Object.entries(state.courses).forEach(([cid,p])=>{if(cid!==C.id)return;Object.entries(p.words).forEach(([id,w])=>{if(w.w>=2){const e=C.byId.get(Number(id));if(e)weak.push([e.word,e.meaning,w.w])}})});
  weak.sort((a,b)=>b[2]-a[2]);
  const mastered=Object.values(state.courses).reduce((n,p)=>n+Object.values(p.words).filter(w=>w.lv>=5).length,0);
  const learnedAll=Object.values(state.courses).reduce((n,p)=>n+Object.values(p.words).filter(w=>w.lv>=1).length,0);
  await c.store.setDoc(fdoc(c,'families',u.family,'stats',u.uid),{name:u.name||state.cloudName||'',role:u.role,week:weekKey(),points:weekPoints(),days:JSON.stringify(days),weak:JSON.stringify(weak.slice(0,8).map(x=>x.slice(0,2))),streak:streak(),learned:learnedAll,mastered,course:COURSES[C.id]?.name||'',updated:c.store.serverTimestamp()});
  const backup={courses:state.courses,days:state.days,talkDone:state.talkDone,mode:state.mode,course:state.course,goal:state.goal};
  const text=JSON.stringify(backup);if(text.length<900000)await c.store.setDoc(fdoc(c,'families',u.family,'progress',u.uid),{data:text,updated:c.store.serverTimestamp()});
  state.lastSync=Date.now();persist();
 }catch{}finally{syncing=false}
}
function lastDays(n){return [...Array(n)].map((_,i)=>{const d=new Date();d.setDate(d.getDate()-i);return dayKey(d)})}
async function restoreProgress(c,family,fromUid){
 try{const s=await c.store.getDoc(fdoc(c,'families',family,'progress',fromUid));const t=s.data()?.data;if(!t)return false;const b=JSON.parse(t);
  if(b.courses)state.courses=b.courses;if(b.days)state.days=b.days;if(b.talkDone)state.talkDone=b.talkDone;if(b.mode)state.mode=b.mode;if(b.course)state.course=b.course;if(b.goal)state.goal=b.goal;persist();return true}catch{return false}
}
/* 쿠폰 */
const COUPON_KINDS={tv:['TV','b'],game:['게임','p'],video:['유튜브·영상','r'],play:['놀이터·자전거','g'],late:['늦게 자기','y'],snack:['간식','o'],book:['원하는 책','b'],menu:['저녁 메뉴 고르기','o'],money:['용돈','g']};
const COUPON_DEFAULT={items:[
 {k:'tv',sizes:['30분','1시간'],on:[true,true]},{k:'game',sizes:['30분','1시간'],on:[true,true]},{k:'video',sizes:['30분','1시간'],on:[true,false]},
 {k:'play',sizes:['30분','1시간'],on:[true,true]},{k:'late',sizes:['30분','1시간'],on:[true,false]},{k:'snack',sizes:['1개','2개'],on:[true,true]},
 {k:'book',sizes:['1권'],on:[true]},{k:'menu',sizes:['1번'],on:[true]},{k:'money',sizes:['500원','1,000원'],on:[false,false]}],low:80,high:95,custom:[]};
let couponConfig=null,stopCoupons=null;
async function loadCouponConfig(){
 try{const c=await cloud(),u=await me();if(!u)return null;const s=await c.store.getDoc(fdoc(c,'families',u.family,'coupons','config'));const d=s.data();couponConfig=d?.data?JSON.parse(d.data):structuredClone(COUPON_DEFAULT);return couponConfig}catch{return couponConfig||structuredClone(COUPON_DEFAULT)}
}
function watchMyCoupons(c,u){
 if(stopCoupons||u.role!=='student')return;
 const q=c.store.query(c.store.collection(c.db,'families',u.family,'couponLog'),c.store.where('uid','==',u.uid));
 stopCoupons=c.store.onSnapshot(q,snap=>{state.myCoupons=snap.docs.map(d=>({id:d.id,...d.data(),time:d.data().time?.toMillis?.()||0})).sort((a,b)=>b.time-a.time);persist();if(V.tab==='me'&&!V.screen)refresh()},()=>{stopCoupons=null});
}
