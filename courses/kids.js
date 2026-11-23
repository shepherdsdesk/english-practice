// 유치 과정: 알파벳 26자 + 첫 영어 단어
(function(){
const L=(ch,name,w,m)=>[ch,name,{letter:true,ex:[w,m]}];
const letters=[
 L('A','에이','apple','사과'),L('B','비','ball','공'),L('C','씨','cat','고양이'),L('D','디','dog','개'),L('E','이','egg','달걀'),
 L('F','에프','fish','물고기'),L('G','지','goat','염소'),L('H','에이치','hat','모자'),L('I','아이','igloo','이글루'),L('J','제이','jam','잼'),
 L('K','케이','kite','연'),L('L','엘','lion','사자'),L('M','엠','moon','달'),L('N','엔','nose','코'),L('O','오','orange','오렌지'),
 L('P','피','pig','돼지'),L('Q','큐','queen','여왕'),L('R','아르','rabbit','토끼'),L('S','에스','sun','해'),L('T','티','tiger','호랑이'),
 L('U','유','umbrella','우산'),L('V','브이','van','승합차'),L('W','더블유','water','물'),L('X','엑스','x-ray','엑스레이'),L('Y','와이','yo-yo','요요'),L('Z','제트','zebra','얼룩말')];
window.WORDSTEP_COURSES=window.WORDSTEP_COURSES||{};
WORDSTEP_COURSES.kids={letters:true,units:[
 ['A부터 E까지',letters.slice(0,5)],['F부터 J까지',letters.slice(5,10)],['K부터 O까지',letters.slice(10,15)],['P부터 T까지',letters.slice(15,20)],['U부터 Z까지',letters.slice(20,26)],
 ['동물 친구','cat:고양이|dog:개|pig:돼지|cow:소|hen:암탉|fox:여우|bee:벌|ant:개미|bird:새|fish:물고기'],
 ['과일과 음식','apple:사과|banana:바나나|milk:우유|egg:달걀|cake:케이크|juice:주스|bread:빵|rice:밥|candy:사탕|pizza:피자'],
 ['색깔','red:빨간색|blue:파란색|green:초록색|yellow:노란색|pink:분홍색|black:검은색|white:하얀색|brown:갈색|orange:주황색|purple:보라색'],
 ['숫자 1부터 10까지','one:하나, 1|two:둘, 2|three:셋, 3|four:넷, 4|five:다섯, 5|six:여섯, 6|seven:일곱, 7|eight:여덟, 8|nine:아홉, 9|ten:열, 10'],
 ['우리 몸','eye:눈|ear:귀|nose:코|mouth:입|hand:손|foot:발|head:머리|arm:팔|leg:다리|hair:머리카락'],
 ['우리 집','bed:침대|cup:컵|door:문|book:책|bag:가방|pen:펜|ball:공|toy:장난감|box:상자|chair:의자']]};
})();
