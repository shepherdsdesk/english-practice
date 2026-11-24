// 유치 과정: 알파벳 26자(글자마다 이름·소리·그림 단어 3개) + 그림 단어 60개
(function(){
// [글자, 이름, 소리, [[단어, 뜻, 그림]×3]]
const RAW=[
 ['A','에이','애',[['apple','사과','🍎'],['ant','개미','🐜'],['alligator','악어','🐊']]],
 ['B','비','브',[['ball','공','⚽'],['bear','곰','🐻'],['banana','바나나','🍌']]],
 ['C','씨','크',[['cat','고양이','🐱'],['car','자동차','🚗'],['cake','케이크','🍰']]],
 ['D','디','드',[['dog','개','🐶'],['duck','오리','🦆'],['door','문','🚪']]],
 ['E','이','에',[['egg','달걀','🥚'],['elephant','코끼리','🐘'],['envelope','봉투','✉️']]],
 ['F','에프','프',[['fish','물고기','🐟'],['frog','개구리','🐸'],['flower','꽃','🌸']]],
 ['G','지','그',[['goat','염소','🐐'],['grapes','포도','🍇'],['gift','선물','🎁']]],
 ['H','에이치','흐',[['hat','모자','🎩'],['horse','말','🐴'],['house','집','🏠']]],
 ['I','아이','이',[['insect','곤충','🐞'],['igloo','이글루','🛖'],['ink','잉크','🖋️']]],
 ['J','제이','즈',[['jam','잼','🍯'],['juice','주스','🧃'],['jeep','지프차','🚙']]],
 ['K','케이','크',[['kite','연','🪁'],['key','열쇠','🔑'],['king','왕','🤴']]],
 ['L','엘','르',[['lion','사자','🦁'],['leaf','나뭇잎','🍃'],['lemon','레몬','🍋']]],
 ['M','엠','므',[['moon','달','🌙'],['monkey','원숭이','🐵'],['milk','우유','🥛']]],
 ['N','엔','느',[['nose','코','👃'],['nut','땅콩','🥜'],['nine','아홉','9️⃣']]],
 ['O','오','아',[['octopus','문어','🐙'],['ox','황소','🐂'],['orange','오렌지','🍊']]],
 ['P','피','프',[['pig','돼지','🐷'],['pizza','피자','🍕'],['panda','판다','🐼']]],
 ['Q','큐','크',[['queen','여왕','👸'],['question','질문','❓'],['quiet','조용히','🤫']]],
 ['R','아르','르',[['rabbit','토끼','🐰'],['rain','비','🌧️'],['robot','로봇','🤖']]],
 ['S','에스','스',[['sun','해','☀️'],['star','별','⭐'],['snake','뱀','🐍']]],
 ['T','티','트',[['tiger','호랑이','🐯'],['tree','나무','🌳'],['train','기차','🚂']]],
 ['U','유','어',[['umbrella','우산','☂️'],['up','위로','⬆️'],['under','아래에','⬇️']]],
 ['V','브이','브',[['van','승합차','🚐'],['violin','바이올린','🎻'],['volcano','화산','🌋']]],
 ['W','더블유','워',[['water','물','💧'],['watch','손목시계','⌚'],['whale','고래','🐳']]],
 ['X','엑스','크스',[['fox','여우','🦊'],['box','상자','📦'],['six','여섯','6️⃣']]],
 ['Y','와이','이',[['yo-yo','요요','🪀'],['yellow','노란색','💛'],['yacht','요트','⛵']]],
 ['Z','제트','즈',[['zebra','얼룩말','🦓'],['zero','영','0️⃣'],['zoo','동물원','🦒']]]];
const letters=RAW.map(([ch,name,sound,words])=>[ch,name,{letter:true,sound,words,ex:[words[0][0],words[0][1]],end:ch==='X'}]);
const pics={cat:'🐱',dog:'🐶',pig:'🐷',cow:'🐮',hen:'🐔',fox:'🦊',bee:'🐝',ant:'🐜',bird:'🐦',fish:'🐟',
 apple:'🍎',banana:'🍌',milk:'🥛',egg:'🥚',cake:'🍰',juice:'🧃',bread:'🍞',rice:'🍚',candy:'🍬',pizza:'🍕',
 red:'🔴',blue:'🔵',green:'🟢',yellow:'🟡',pink:'💗',black:'⚫',white:'⚪',brown:'🟤',orange:'🟠',purple:'🟣',
 one:'1️⃣',two:'2️⃣',three:'3️⃣',four:'4️⃣',five:'5️⃣',six:'6️⃣',seven:'7️⃣',eight:'8️⃣',nine:'9️⃣',ten:'🔟',
 eye:'👁️',ear:'👂',nose:'👃',mouth:'👄',hand:'✋',foot:'🦶',head:'🙂',arm:'💪',leg:'🦵',hair:'💇',
 bed:'🛏️',cup:'☕',door:'🚪',book:'📖',bag:'🎒',pen:'🖊️',ball:'⚽',toy:'🧸',box:'📦',chair:'🪑'};
window.WORDSTEP_COURSES=window.WORDSTEP_COURSES||{};
WORDSTEP_COURSES.kids={letters:true,pics,units:[
 ['A부터 E까지',letters.slice(0,5)],['F부터 J까지',letters.slice(5,10)],['K부터 O까지',letters.slice(10,15)],['P부터 T까지',letters.slice(15,20)],['U부터 Z까지',letters.slice(20,26)],
 ['동물 친구','cat:고양이|dog:개|pig:돼지|cow:소|hen:암탉|fox:여우|bee:벌|ant:개미|bird:새|fish:물고기'],
 ['과일과 음식','apple:사과|banana:바나나|milk:우유|egg:달걀|cake:케이크|juice:주스|bread:빵|rice:밥|candy:사탕|pizza:피자'],
 ['색깔','red:빨간색|blue:파란색|green:초록색|yellow:노란색|pink:분홍색|black:검은색|white:하얀색|brown:갈색|orange:주황색|purple:보라색'],
 ['숫자 1부터 10까지','one:하나, 1|two:둘, 2|three:셋, 3|four:넷, 4|five:다섯, 5|six:여섯, 6|seven:일곱, 7|eight:여덟, 8|nine:아홉, 9|ten:열, 10'],
 ['우리 몸','eye:눈|ear:귀|nose:코|mouth:입|hand:손|foot:발|head:머리|arm:팔|leg:다리|hair:머리카락'],
 ['우리 집','bed:침대|cup:컵|door:문|book:책|bag:가방|pen:펜|ball:공|toy:장난감|box:상자|chair:의자']]};
})();
