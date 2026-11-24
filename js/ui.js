'use strict';
/* 워드스텝 v2 — 화면 공통: 아이콘, 마스코트, 화면 전환, 이벤트 연결 */

const I=(d,s=22,w=2.2,extra='')=>`<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" ${extra}>${d}</svg>`;
const IC={
 home:'<path d="M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"/>',
 map:'<path d="M9 4 3 6v14l6-2 6 2 6-2V4l-6 2z"/><path d="M9 4v14M15 6v14"/>',
 book:'<path d="M4 19V5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2z"/><path d="M4 19a2 2 0 0 0 2 2h13"/>',
 user:'<circle cx="12" cy="8" r="4"/><path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6"/>',
 plus:'<path d="M12 5v14M5 12h14"/>',
 redo:'<path d="M20 12a8 8 0 1 1-2.3-5.6"/><path d="M20 4v5h-5"/>',
 gram:'<path d="M4 19V5a2 2 0 0 1 2-2h12v18H6a2 2 0 0 1-2-2z"/><path d="M8 7h6M8 11h4"/>',
 target:'<circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="3"/>',
 x:'<path d="M6 6l12 12M18 6 6 18"/>',
 back:'<path d="M15 5l-7 7 7 7"/>',
 next:'<path d="M9 5l7 7-7 7"/>',
 check:'<path d="M5 12l5 5L20 7"/>',
 lock:'<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/>',
 star:'<path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z" fill="currentColor"/>',
 test:'<path d="M8 3h8v4H8z"/><path d="M6 5H4v16h16V5h-2"/><path d="M8 13l3 3 5-6"/>',
 speaker:'<path d="M4 9v6h4l5 4V5L8 9z" fill="currentColor"/><path d="M16 9a4 4 0 0 1 0 6M19 6a8 8 0 0 1 0 12"/>',
 speaker1:'<path d="M4 9v6h4l5 4V5L8 9z"/><path d="M16 9a4 4 0 0 1 0 6"/>',
 mic:'<rect x="9" y="3" width="6" height="11" rx="3" fill="currentColor"/><path d="M5 11a7 7 0 0 0 14 0M12 18v3"/>',
 camera:'<path d="M4 8h3l2-3h6l2 3h3v12H4z"/><circle cx="12" cy="13.5" r="3.5"/>',
 flame:'<path d="M12 2c1 3.5 6 5.5 6 11.5a6 6 0 0 1-12 0c0-2.5 1.2-4.2 2.4-5.3 0 2.2 1 3.4 2.3 3.4 0-3.4-.8-5.9 1.3-9.6z" fill="#F59E0B" stroke="none"/>',
 trophy:'<path d="M7 4h10v5a5 5 0 0 1-10 0z" fill="#FFC531"/><path d="M7 6H4a3 3 0 0 0 3 4M17 6h3a3 3 0 0 1-3 4M12 14v4M8 21h8"/>',
 cloud:'<path d="M7 18a5 5 0 0 1-.5-10A6 6 0 0 1 18 9a4.5 4.5 0 0 1-.5 9z"/><path d="M9.5 13l2 2 3.5-4"/>',
 info:'<circle cx="12" cy="12" r="9"/><path d="M12 8v5M12 16.5v.01"/>',
 bell:'<path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10 21h4"/>',
 chat:'<path d="M4 5h16v11H9l-5 4z"/>',
 gift:'<rect x="3" y="8" width="18" height="13" rx="2"/><path d="M3 12h18M12 8v13M12 8c-2-4-6-4-6-1s6 1 6 1 6 2 6-1-4-3-6 1"/>',
 report:'<path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/>',
 key:'<circle cx="8" cy="15" r="4"/><path d="M11 12l9-9M17 6l3 3"/>',
 link:'<path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1"/><path d="M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1"/>',
 users:'<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20c1-3.5 3.5-5 6.5-5s5.5 1.5 6.5 5"/><circle cx="17" cy="9" r="2.5"/><path d="M17 14c2.5 0 4 1.3 4.8 4"/>',
 trash:'<path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3"/>',
 search:'<circle cx="11" cy="11" r="6"/><path d="M20 20l-4.5-4.5"/>',
 pencil:'<path d="M4 20l4-1L19 8l-3-3L5 16z"/><path d="M14 7l3 3"/>',
 tv:'<rect x="3" y="6" width="18" height="13" rx="2"/><path d="M8 2l4 4 4-4"/>',
 game:'<path d="M7 8h10a4 4 0 0 1 4 4v1a3 3 0 0 1-5.4 1.8L14.5 14h-5l-1.1 1.8A3 3 0 0 1 3 13v-1a4 4 0 0 1 4-4z"/><path d="M8 10v3M6.5 11.5h3M16 11h.01M18 12.5h.01"/>',
 play:'<circle cx="12" cy="12" r="9"/><path d="M3.5 9.5c5 1 12 1 17 0M3.5 14.5c5-1 12-1 17 0M12 3v18"/>',
 snack:'<circle cx="12" cy="12" r="9"/><path d="M9 9h.01M14 8h.01M15 13h.01M10 14h.01M12 11h.01"/>',
 moon:'<path d="M20 14A8 8 0 1 1 10 4a6 6 0 0 0 10 10z"/>',
 video:'<rect x="3" y="6" width="13" height="12" rx="2"/><path d="M16 10l5-3v10l-5-3"/>',
 money:'<rect x="3" y="6" width="18" height="12" rx="2"/><circle cx="12" cy="12" r="2.5"/>',
 menu:'<path d="M6 3v8a3 3 0 0 0 6 0V3M9 3v18M17 3c-2 2-2 7 0 9v9"/>'
};
const COUPON_ICON={tv:'tv',game:'game',video:'video',play:'play',late:'moon',snack:'snack',book:'book',menu:'menu',money:'money'};
function mascot(size=88,mood='smile'){
 const face=mood==='happy'?'<path d="M32 53q5-6 10 0M54 53q5-6 10 0" stroke="#16302A" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M40 60q8 9 16 0z" fill="#16302A"/>'
  :mood==='cheer'?'<circle cx="37" cy="53" r="5" fill="#16302A"/><circle cx="59" cy="53" r="5" fill="#16302A"/><circle cx="38.6" cy="51.4" r="1.6" fill="#fff"/><circle cx="60.6" cy="51.4" r="1.6" fill="#fff"/><path d="M43 62h10" stroke="#16302A" stroke-width="3" stroke-linecap="round"/>'
  :'<circle cx="37" cy="53" r="5" fill="#16302A"/><circle cx="59" cy="53" r="5" fill="#16302A"/><circle cx="38.6" cy="51.4" r="1.6" fill="#fff"/><circle cx="60.6" cy="51.4" r="1.6" fill="#fff"/><path d="M42 61q6 5 12 0" stroke="#16302A" stroke-width="3" fill="none" stroke-linecap="round"/>';
 const arms=mood==='happy'?'<path d="M16 60 6 46M80 60l10-14" stroke="#2FBF8A" stroke-width="7" stroke-linecap="round"/>':mood==='cheer'?'<path d="M80 50l9-12" stroke="#2FBF8A" stroke-width="7" stroke-linecap="round"/>':'';
 return `<svg class="mascot" width="${size}" height="${size}" viewBox="0 0 96 96" role="img" aria-label="마스코트 새싹이"><path d="M48 24c-1-11 5-17 15-17-1 10-6 15-15 17z" fill="#7BD88F"/><path d="M48 24c-1-8-7-13-15-12 1 7 6 11 15 12z" fill="#4CB96B"/><path d="M48 22v10" stroke="#3E9A57" stroke-width="3" stroke-linecap="round"/>${arms}<ellipse cx="48" cy="61" rx="34" ry="30" fill="#2FBF8A"/><ellipse cx="48" cy="73" rx="17" ry="12" fill="#C9F2DE"/>${face}<ellipse cx="28" cy="63" rx="5" ry="3" fill="#FF9FA0"/><ellipse cx="68" cy="63" rx="5" ry="3" fill="#FF9FA0"/></svg>`;
}
function lvdots(lv){return `<span class="lvdots${lv>=5?' max':''}" aria-label="익힘 ${lv}/5단계">${[0,1,2,3,4].map(k=>`<i class="${k<lv?'on':''}"></i>`).join('')}</span>`}
function sayBtn(text,big=false,label='발음 듣기'){return `<button type="button" class="say${big?' big':''}" data-a="say" data-v="${esc(text)}" aria-label="${label}">${I(big?IC.speaker:IC.speaker1,big?26:20)}</button>`}

/* ── 화면 상태와 전환 ── */
const V={tab:'today',screen:null,p:{}};
const root=()=>$('#root');
function go(tab,screen=null,p={}){stopSound();if(tab)V.tab=tab;V.screen=screen;V.p=p;render();scrollTo(0,0)}
function scr(screen,p={}){go(null,screen,p)}
function refresh(){if(document.activeElement?.matches?.('input,textarea')&&!V.forceRefresh)return;render()}
const TABS=[['today','오늘',IC.home],['path','학습 지도',IC.map],['words','내 단어',IC.book],['me','나',IC.user]];
const GUARDIAN_TABS=[['family','우리 아이',IC.users],['coupons','쿠폰',IC.gift],['today','공부',IC.book],['me','나',IC.user]];
function tabsFor(){return state.cloudRole==='parent'||state.cloudRole==='admin'?GUARDIAN_TABS:TABS}
function tabbar(){const kids=themeOf()==='kids';return `<nav class="tabbar" aria-label="주요 메뉴"><span class="rail-brand">워드스텝</span>${tabsFor().map(([id,label,ic])=>`<button type="button" class="tab" data-a="tab" data-v="${id}" ${V.tab===id&&!V.screen?'aria-current="page"':''}><span class="pill">${I(ic,22)}</span>${kids&&id==='today'?'놀이':label}</button>`).join('')}</nav>`}
const SCREENS={};
function render(){
 const th=themeOf();document.body.className='t-'+th;
 const meta=document.querySelector('meta[name=theme-color]');if(meta)meta.content=th==='calm'?'#1F3A5F':'#12A578';
 if(V._cleanup){try{V._cleanup()}catch{}V._cleanup=null}
 const name=V.screen||V.tab;const fn=SCREENS[name]||SCREENS.today;
 let html;try{html=fn(V.p)}catch(e){console.error(e);html=`<main class="screen"><div class="card"><b>화면을 그리지 못했어요.</b><p class="note">${esc(e.message)}</p><button class="btn primary" data-a="tab" data-v="today">처음 화면으로</button></div></main>`}
 if(html==null)return;
 const withTabs=!fn.focus;
 root().className=withTabs?'has-tabs':'';
 root().innerHTML=html+(withTabs?tabbar():'');
 fn.after?.(V.p);
}
/* data-a="이름" 으로 버튼을 연결해요. */
const ACT={};
document.addEventListener('click',e=>{const el=e.target.closest('[data-a]');if(!el||el.disabled)return;const fn=ACT[el.dataset.a];if(fn){e.preventDefault();fn(el.dataset.v,el,e)}});
ACT.tab=v=>go(v);
ACT.say=v=>say(v);
ACT.saySlow=v=>say(v,{slow:true});
ACT.back=()=>{const b=V.p?.back;if(b)scr(b.screen,b.p||{});else go(V.tab)};
ACT.open=v=>scr(v);
