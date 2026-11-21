// 대본형 영어 대화. p: 상대 말, k: 해석, r: 내 대답(ok: 자연스러운 대답, fix: 고칠 점, better: 더 나은 표현), then: 상대 반응(선택)
WORDSTEP_DIALOGS=[
{id:'hello',level:'basic',title:'처음 만난 친구',desc:'인사하고 나를 소개해요',role:'나는 지호예요',partner:'Mia',
 turns:[
 {p:"Hi! I'm Mia. What's your name?",k:"안녕! 나는 미아야. 너는 이름이 뭐야?",r:[{e:"Hi, Mia. I'm Jiho.",k:"안녕, 미아. 나는 지호야.",ok:1},{e:"I'm fine, thank you.",k:"나는 잘 지내, 고마워.",fix:"이름을 물었는데 안부로 대답했어요.",better:"I'm Jiho."}]},
 {p:"Nice to meet you, Jiho!",k:"만나서 반가워, 지호야!",r:[{e:"Nice to meet you, too.",k:"나도 만나서 반가워.",ok:1},{e:"Nice to meet me.",k:"나를 만나서 반가워.",fix:"me는 '나'예요. 상대에게는 you를 써요.",better:"Nice to meet you, too."}]},
 {p:"How old are you?",k:"너는 몇 살이야?",r:[{e:"I'm ten years old.",k:"나는 열 살이야.",ok:1},{e:"I have ten years.",k:"나는 10년을 가지고 있어.",fix:"영어로 나이는 have가 아니라 be동사로 말해요.",better:"I'm ten years old."}]},
 {p:"Where are you from?",k:"너는 어디에서 왔어?",r:[{e:"I'm from Korea.",k:"나는 한국에서 왔어.",ok:1},{e:"I'm Korea.",k:"나는 한국이야.",fix:"'~에서 왔다'는 from을 꼭 붙여요.",better:"I'm from Korea."}]},
 {p:"Cool! Let's be friends.",k:"멋지다! 우리 친구 하자.",r:[{e:"Sure! See you later.",k:"좋아! 나중에 봐.",ok:1},{e:"Okay! Let's play together.",k:"좋아! 같이 놀자.",ok:1}],then:"Great! Bye, Jiho!"}
 ],
 keys:[["Nice to meet you.","만나서 반가워."],["I'm ten years old.","나는 열 살이야."],["I'm from Korea.","나는 한국에서 왔어."]]},
{id:'feeling',level:'basic',title:'오늘 기분 어때?',desc:'기분과 이유를 말해요',role:'나는 나 자신이에요',partner:'Mr. Brown',
 turns:[
 {p:"Good morning! How are you today?",k:"좋은 아침! 오늘 기분 어때?",r:[{e:"I'm great, thank you.",k:"아주 좋아요, 고맙습니다.",ok:1},{e:"I'm a little tired.",k:"조금 피곤해요.",ok:1},{e:"I'm morning.",k:"나는 아침이에요.",fix:"기분을 묻는 말에는 기분을 나타내는 말로 대답해요.",better:"I'm great, thank you."}]},
 {p:"Why do you feel that way?",k:"왜 그런 기분이야?",r:[{e:"Because I slept well.",k:"잠을 잘 잤거든요.",ok:1},{e:"Because I played games late.",k:"늦게까지 게임을 했거든요.",ok:1},{e:"Because I sleep well yesterday.",k:"어제 잘 자요.",fix:"yesterday는 지난 일이라 과거형 slept를 써요.",better:"Because I slept well."}]},
 {p:"I see. And how about you? Are you hungry?",k:"그렇구나. 배는 고프니?",r:[{e:"Yes, I am.",k:"네, 고파요.",ok:1},{e:"No, I'm not.",k:"아니요, 안 고파요.",ok:1},{e:"Yes, I do.",k:"네, 해요.",fix:"Are you로 물으면 be동사로 대답해요.",better:"Yes, I am."}]},
 {p:"What do you want for lunch?",k:"점심으로 뭐 먹고 싶어?",r:[{e:"I want pizza.",k:"피자가 먹고 싶어요.",ok:1},{e:"I want to eat rice and soup.",k:"밥이랑 국을 먹고 싶어요.",ok:1},{e:"I want eat pizza.",k:"",fix:"want 뒤에 동사가 오면 to를 붙여요.",better:"I want to eat pizza."}]},
 {p:"Sounds good! Have a nice day.",k:"좋네! 좋은 하루 보내.",r:[{e:"You too!",k:"선생님도요!",ok:1},{e:"Thank you. Have a nice day!",k:"고맙습니다. 좋은 하루 보내세요!",ok:1}]}
 ],
 keys:[["How are you today?","오늘 기분 어때?"],["Because I slept well.","잠을 잘 잤거든요."],["You too!","너도! / 당신도요!"]]},
{id:'likes',level:'basic',title:'좋아하는 것',desc:'좋아하는 음식과 운동을 말해요',role:'나는 나 자신이에요',partner:'Leo',
 turns:[
 {p:"What's your favorite food?",k:"네가 제일 좋아하는 음식은 뭐야?",r:[{e:"My favorite food is chicken.",k:"내가 제일 좋아하는 음식은 치킨이야.",ok:1},{e:"I like tteokbokki.",k:"나는 떡볶이를 좋아해.",ok:1},{e:"I am chicken.",k:"나는 치킨이야.",fix:"'나는 치킨이다'라는 뜻이 돼요. like를 써요.",better:"I like chicken."}]},
 {p:"Me too! Do you like sports?",k:"나도! 운동 좋아해?",r:[{e:"Yes, I like soccer.",k:"응, 나는 축구를 좋아해.",ok:1},{e:"No, I don't. I like reading.",k:"아니, 나는 책 읽는 게 좋아.",ok:1},{e:"Yes, I like the soccer.",k:"",fix:"운동 경기 앞에는 the를 붙이지 않아요.",better:"Yes, I like soccer."}]},
 {p:"How often do you play?",k:"얼마나 자주 해?",r:[{e:"I play every Saturday.",k:"토요일마다 해.",ok:1},{e:"I play twice a week.",k:"일주일에 두 번 해.",ok:1},{e:"I play in Saturday.",k:"",fix:"요일 앞에는 on을 써요.",better:"I play on Saturdays."}]},
 {p:"Can you play with me this weekend?",k:"이번 주말에 나랑 같이 할래?",r:[{e:"Sure, I can.",k:"그래, 할 수 있어.",ok:1},{e:"Sorry, I can't. I'm busy.",k:"미안, 못 해. 바빠.",ok:1},{e:"Sure, I can playing.",k:"",fix:"can 뒤에는 동사원형이 와요.",better:"Sure, I can play."}]},
 {p:"Awesome! See you on Saturday.",k:"좋아! 토요일에 봐.",r:[{e:"See you!",k:"그때 봐!",ok:1},{e:"Okay, see you then.",k:"그래, 그때 봐.",ok:1}]}
 ],
 keys:[["What's your favorite food?","제일 좋아하는 음식이 뭐야?"],["I play every Saturday.","토요일마다 해."],["Sure, I can.","그래, 할 수 있어."]]},
{id:'family',level:'basic',title:'우리 가족 소개',desc:'가족이 몇 명인지, 누구인지 말해요',role:'나는 나 자신이에요',partner:'Emma',
 turns:[
 {p:"How many people are in your family?",k:"너희 가족은 몇 명이야?",r:[{e:"There are four people in my family.",k:"우리 가족은 네 명이야.",ok:1},{e:"We are five.",k:"우리는 다섯 명이야.",ok:1},{e:"There is four people.",k:"",fix:"여러 명이니까 There are를 써요.",better:"There are four people in my family."}]},
 {p:"Who are they?",k:"누구누구야?",r:[{e:"My dad, my mom, my brother, and me.",k:"아빠, 엄마, 형(오빠, 남동생), 그리고 나.",ok:1},{e:"My parents, my sister, and me.",k:"부모님, 누나(언니, 여동생), 그리고 나.",ok:1}]},
 {p:"What does your dad do?",k:"아빠는 무슨 일을 하셔?",r:[{e:"He is a pastor.",k:"목사님이셔.",ok:1},{e:"He is a teacher.",k:"선생님이셔.",ok:1},{e:"She is a pastor.",k:"",fix:"아빠는 남자라서 He를 써요.",better:"He is a pastor."}]},
 {p:"Do you have a pet?",k:"반려동물 있어?",r:[{e:"Yes, I have a dog.",k:"응, 개가 한 마리 있어.",ok:1},{e:"No, I don't have a pet.",k:"아니, 반려동물은 없어.",ok:1},{e:"Yes, I have dog.",k:"",fix:"하나일 때는 a를 붙여요.",better:"Yes, I have a dog."}]},
 {p:"Your family sounds lovely!",k:"너희 가족 정말 멋지다!",r:[{e:"Thanks! I love my family.",k:"고마워! 나는 우리 가족을 사랑해.",ok:1},{e:"Thank you!",k:"고마워!",ok:1}]}
 ],
 keys:[["There are four people in my family.","우리 가족은 네 명이야."],["What does your dad do?","아빠는 무슨 일을 하셔?"],["I love my family.","나는 우리 가족을 사랑해."]]},
{id:'restaurant',level:'mid',title:'식당에서 주문하기',desc:'음식을 고르고 주문해요',role:'나는 손님이에요',partner:'Waiter',
 turns:[
 {p:"Hello! Are you ready to order?",k:"안녕하세요! 주문하시겠어요?",r:[{e:"Yes, please.",k:"네, 할게요.",ok:1},{e:"Not yet. Can I have a minute?",k:"아직이요. 잠깐 시간 주실래요?",ok:1}],then:"Sure. Here is the menu."},
 {p:"What would you like?",k:"무엇을 드시겠어요?",r:[{e:"I'd like a cheeseburger, please.",k:"치즈버거 주세요.",ok:1},{e:"Can I have spaghetti, please?",k:"스파게티 주시겠어요?",ok:1},{e:"Give me burger.",k:"버거 줘.",fix:"뜻은 통하지만 무례하게 들려요. I'd like ~, please로 공손하게 말해요.",better:"I'd like a burger, please."}]},
 {p:"Would you like something to drink?",k:"마실 것도 드릴까요?",r:[{e:"Orange juice, please.",k:"오렌지 주스 주세요.",ok:1},{e:"No, thank you.",k:"아니요, 괜찮아요.",ok:1},{e:"Yes, I drink.",k:"네, 나는 마셔요.",fix:"무엇을 마실지 말해 주는 게 자연스러워요.",better:"Yes, orange juice, please."}]},
 {p:"For here or to go?",k:"여기서 드세요, 가져가세요?",r:[{e:"For here, please.",k:"여기서 먹을게요.",ok:1},{e:"To go, please.",k:"포장해 주세요.",ok:1}]},
 {p:"That will be twelve dollars.",k:"12달러입니다.",r:[{e:"Here you are.",k:"여기 있어요.",ok:1},{e:"Can I pay by card?",k:"카드로 내도 돼요?",ok:1}],then:"Thank you! Enjoy your meal."},
 {p:"How is your food?",k:"음식은 어떠세요?",r:[{e:"It's delicious. Thank you!",k:"맛있어요. 고맙습니다!",ok:1},{e:"It's a little salty.",k:"조금 짜요.",ok:1},{e:"It's deliciously.",k:"",fix:"be동사 뒤에는 형용사 delicious를 써요.",better:"It's delicious."}]}
 ],
 keys:[["I'd like a cheeseburger, please.","치즈버거 주세요."],["For here or to go?","드시고 가세요, 가져가세요?"],["Here you are.","여기 있어요."]]},
{id:'directions',level:'mid',title:'길 묻기',desc:'가고 싶은 곳의 길을 물어요',role:'나는 여행자예요',partner:'Local',
 turns:[
 {p:"Hi there. Can I help you?",k:"안녕하세요. 도와드릴까요?",r:[{e:"Yes, please. Where is the subway station?",k:"네. 지하철역이 어디예요?",ok:1},{e:"Excuse me, how can I get to the museum?",k:"실례합니다, 박물관에 어떻게 가요?",ok:1},{e:"Where subway station?",k:"",fix:"is를 넣어야 완전한 질문이 돼요.",better:"Where is the subway station?"}]},
 {p:"Go straight two blocks and turn left.",k:"두 블록 직진해서 왼쪽으로 도세요.",r:[{e:"Go straight and turn left. Got it.",k:"직진해서 왼쪽. 알겠어요.",ok:1},{e:"Sorry, can you say that again?",k:"죄송한데 다시 말씀해 주실래요?",ok:1}],then:"Go straight two blocks, then turn left."},
 {p:"It's next to the bank.",k:"은행 옆에 있어요.",r:[{e:"Next to the bank. Thank you!",k:"은행 옆이군요. 고마워요!",ok:1},{e:"Is it far from here?",k:"여기서 멀어요?",ok:1}],then:"No, it's about five minutes on foot."},
 {p:"Is this your first time here?",k:"여기 처음 오셨어요?",r:[{e:"Yes, it is. It's beautiful.",k:"네, 처음이에요. 아름답네요.",ok:1},{e:"No, I came here last year.",k:"아니요, 작년에 왔었어요.",ok:1},{e:"No, I come here last year.",k:"",fix:"last year는 지난 일이라 과거형 came을 써요.",better:"No, I came here last year."}]},
 {p:"Enjoy your trip!",k:"즐거운 여행 되세요!",r:[{e:"Thank you so much. Have a good day!",k:"정말 고마워요. 좋은 하루 보내세요!",ok:1},{e:"Thanks for your help!",k:"도와줘서 고마워요!",ok:1}]}
 ],
 keys:[["How can I get to the museum?","박물관에 어떻게 가요?"],["Go straight and turn left.","직진해서 왼쪽으로 도세요."],["It's next to the bank.","은행 옆에 있어요."]]},
{id:'school',level:'mid',title:'학교 이야기',desc:'좋아하는 과목과 하루 일과를 말해요',role:'나는 학생이에요',partner:'Ms. Kim',
 turns:[
 {p:"What's your favorite subject?",k:"제일 좋아하는 과목이 뭐니?",r:[{e:"My favorite subject is science.",k:"과학을 제일 좋아해요.",ok:1},{e:"I like art the most.",k:"미술을 제일 좋아해요.",ok:1},{e:"My favorite subject science.",k:"",fix:"is가 빠졌어요.",better:"My favorite subject is science."}]},
 {p:"Why do you like it?",k:"왜 좋아하니?",r:[{e:"Because experiments are fun.",k:"실험이 재미있어서요.",ok:1},{e:"Because I like drawing.",k:"그림 그리는 게 좋아서요.",ok:1}]},
 {p:"What time do you go to school?",k:"몇 시에 학교에 가니?",r:[{e:"I go to school at eight thirty.",k:"8시 30분에 학교에 가요.",ok:1},{e:"I leave home at eight.",k:"8시에 집에서 나가요.",ok:1},{e:"I go to the school on eight.",k:"",fix:"시각 앞에는 at, 학교 가다는 go to school이에요.",better:"I go to school at eight."}]},
 {p:"What do you do after school?",k:"방과 후에는 뭐 하니?",r:[{e:"I go to a piano academy.",k:"피아노 학원에 가요.",ok:1},{e:"I do my homework and play outside.",k:"숙제하고 밖에서 놀아요.",ok:1},{e:"I doing my homework.",k:"",fix:"평소에 하는 일은 현재형 do를 써요.",better:"I do my homework."}]},
 {p:"You are a busy student!",k:"정말 바쁜 학생이구나!",r:[{e:"Yes, but it's fun.",k:"네, 그래도 재미있어요.",ok:1},{e:"I am. But I like it.",k:"맞아요. 그래도 좋아요.",ok:1}]}
 ],
 keys:[["My favorite subject is science.","과학을 제일 좋아해요."],["I go to school at eight thirty.","8시 30분에 학교에 가요."],["What do you do after school?","방과 후에 뭐 해?"]]},
{id:'shopping',level:'adv',title:'옷 가게에서',desc:'사이즈와 가격을 묻고 사요',role:'나는 손님이에요',partner:'Clerk',
 turns:[
 {p:"Hi! Are you looking for anything special?",k:"안녕하세요! 특별히 찾는 거 있으세요?",r:[{e:"I'm looking for a jacket.",k:"재킷을 찾고 있어요.",ok:1},{e:"I'm just looking, thanks.",k:"그냥 둘러보는 중이에요, 고마워요.",ok:1}],then:"Our jackets are over here."},
 {p:"How about this blue one?",k:"이 파란 건 어떠세요?",r:[{e:"It looks nice. Can I try it on?",k:"좋아 보여요. 입어 봐도 돼요?",ok:1},{e:"Do you have it in black?",k:"검은색도 있어요?",ok:1},{e:"Can I try on it?",k:"",fix:"it 같은 대명사는 try와 on 사이에 넣어요.",better:"Can I try it on?"}]},
 {p:"What size do you wear?",k:"어떤 사이즈 입으세요?",r:[{e:"I wear a medium.",k:"미디움 입어요.",ok:1},{e:"I'm not sure. Maybe a small.",k:"잘 모르겠어요. 스몰일 거예요.",ok:1}]},
 {p:"How does it fit?",k:"잘 맞으세요?",r:[{e:"It's a little too big.",k:"조금 커요.",ok:1},{e:"It fits perfectly.",k:"딱 맞아요.",ok:1},{e:"It's too much big.",k:"",fix:"'너무 크다'는 too big이에요. much는 빼요.",better:"It's too big."}]},
 {p:"It's forty dollars, but it's on sale today.",k:"40달러인데 오늘 세일해요.",r:[{e:"Great! How much is the discount?",k:"좋아요! 얼마나 할인돼요?",ok:1},{e:"I'll take it.",k:"이걸로 살게요.",ok:1}],then:"It's twenty percent off."},
 {p:"Would you like a bag?",k:"봉투 드릴까요?",r:[{e:"No, thanks. I have one.",k:"괜찮아요. 가지고 있어요.",ok:1},{e:"Yes, please.",k:"네, 주세요.",ok:1}]}
 ],
 keys:[["I'm just looking, thanks.","그냥 둘러보는 중이에요."],["Can I try it on?","입어 봐도 돼요?"],["I'll take it.","이걸로 살게요."]]},
{id:'doctor',level:'adv',title:'병원에서',desc:'아픈 곳을 설명해요',role:'나는 환자예요',partner:'Doctor',
 turns:[
 {p:"What seems to be the problem?",k:"어디가 불편하세요?",r:[{e:"I have a headache and a fever.",k:"머리가 아프고 열이 나요.",ok:1},{e:"My stomach hurts.",k:"배가 아파요.",ok:1},{e:"I am headache.",k:"",fix:"'아픈 것'은 have로 말해요.",better:"I have a headache."}]},
 {p:"When did it start?",k:"언제부터 그랬어요?",r:[{e:"It started yesterday.",k:"어제부터요.",ok:1},{e:"Since last night.",k:"어젯밤부터요.",ok:1},{e:"It starts yesterday.",k:"",fix:"yesterday는 지난 일이라 started를 써요.",better:"It started yesterday."}]},
 {p:"Did you eat anything unusual?",k:"평소와 다른 걸 먹었나요?",r:[{e:"I ate some ice cream.",k:"아이스크림을 좀 먹었어요.",ok:1},{e:"No, I didn't.",k:"아니요, 안 먹었어요.",ok:1}]},
 {p:"Take this medicine three times a day.",k:"이 약을 하루에 세 번 드세요.",r:[{e:"Three times a day. Okay.",k:"하루 세 번이요. 알겠어요.",ok:1},{e:"Should I take it after meals?",k:"식후에 먹어야 해요?",ok:1}],then:"Yes, after meals. And drink lots of water."},
 {p:"Get plenty of rest. You'll feel better soon.",k:"푹 쉬세요. 곧 나을 거예요.",r:[{e:"Thank you, doctor.",k:"고맙습니다, 선생님.",ok:1},{e:"Thanks. I'll rest at home.",k:"고마워요. 집에서 쉴게요.",ok:1}]}
 ],
 keys:[["I have a headache.","머리가 아파요."],["It started yesterday.","어제부터 그랬어요."],["three times a day","하루에 세 번"]]},
{id:'airport',level:'middle',title:'공항 체크인',desc:'여권을 보여 주고 좌석을 골라요',role:'나는 여행객이에요',partner:'Agent',
 turns:[
 {p:"Good afternoon. May I see your passport, please?",k:"안녕하세요. 여권 좀 보여 주시겠어요?",r:[{e:"Sure. Here it is.",k:"네. 여기 있어요.",ok:1},{e:"Of course. Here you go.",k:"물론이죠. 여기요.",ok:1}]},
 {p:"Where are you flying to today?",k:"오늘 어디로 가세요?",r:[{e:"I'm flying to Sydney.",k:"시드니로 가요.",ok:1},{e:"I'm going to London to visit my aunt.",k:"이모를 만나러 런던에 가요.",ok:1}]},
 {p:"Do you have any bags to check?",k:"부칠 짐이 있으세요?",r:[{e:"Yes, just this suitcase.",k:"네, 이 가방 하나요.",ok:1},{e:"No, only a carry-on.",k:"아니요, 기내용 가방만 있어요.",ok:1}]},
 {p:"Would you prefer a window seat or an aisle seat?",k:"창가 좌석과 통로 좌석 중 어디가 좋으세요?",r:[{e:"A window seat, please.",k:"창가 좌석이요.",ok:1},{e:"I'd prefer an aisle seat.",k:"통로 좌석이 좋아요.",ok:1},{e:"A aisle seat, please.",k:"",fix:"aisle은 '아일'로 모음 소리라 an을 써요.",better:"An aisle seat, please."}]},
 {p:"Boarding starts at 2:30 at Gate 15.",k:"탑승은 2시 30분에 15번 게이트에서 시작해요.",r:[{e:"Gate 15 at 2:30. Thank you.",k:"15번 게이트, 2시 30분이요. 고맙습니다.",ok:1},{e:"How long is the flight?",k:"비행시간은 얼마나 돼요?",ok:1}],then:"About ten hours. Have a nice flight!"}
 ],
 keys:[["Here it is.","여기 있어요."],["Do you have any bags to check?","부칠 짐 있으세요?"],["A window seat, please.","창가 좌석으로 주세요."]]},
{id:'weekend',level:'middle',title:'주말에 한 일',desc:'지난 주말 이야기를 과거형으로 해요',role:'나는 나 자신이에요',partner:'Daniel',
 turns:[
 {p:"How was your weekend?",k:"주말 어땠어?",r:[{e:"It was great!",k:"정말 좋았어!",ok:1},{e:"It was okay. Nothing special.",k:"그냥 그랬어. 특별한 건 없었어.",ok:1},{e:"It is great.",k:"",fix:"지난 주말이니까 was를 써요.",better:"It was great!"}]},
 {p:"What did you do?",k:"뭐 했어?",r:[{e:"I went hiking with my family.",k:"가족이랑 등산 갔어.",ok:1},{e:"I watched a movie at home.",k:"집에서 영화 봤어.",ok:1},{e:"I go hiking.",k:"",fix:"지난 일은 go의 과거형 went를 써요.",better:"I went hiking."}]},
 {p:"Sounds fun! How did you feel?",k:"재밌었겠다! 기분이 어땠어?",r:[{e:"I felt tired but happy.",k:"피곤했지만 행복했어.",ok:1},{e:"It was really relaxing.",k:"정말 편안했어.",ok:1}]},
 {p:"Did you go to church on Sunday?",k:"일요일에 교회 갔어?",r:[{e:"Yes, I did. I sang in the choir.",k:"응, 갔어. 성가대에서 노래했어.",ok:1},{e:"Yes. I met my friends there.",k:"응. 거기서 친구들을 만났어.",ok:1},{e:"Yes, I went. I sing in the choir.",k:"",fix:"이야기 전체가 지난 일이라 sang으로 맞춰요.",better:"Yes, I did. I sang in the choir."}]},
 {p:"What are you going to do next weekend?",k:"다음 주말엔 뭐 할 거야?",r:[{e:"I'm going to visit my grandparents.",k:"할머니 할아버지 댁에 갈 거야.",ok:1},{e:"I'll probably stay home and rest.",k:"아마 집에서 쉴 것 같아.",ok:1},{e:"I went to visit my grandparents.",k:"",fix:"다음 주말은 앞으로의 일이라 be going to를 써요.",better:"I'm going to visit my grandparents."}]}
 ],
 keys:[["How was your weekend?","주말 어땠어?"],["I went hiking with my family.","가족이랑 등산 갔어."],["I'm going to visit my grandparents.","할머니 할아버지 댁에 갈 거야."]]},
{id:'opinion',level:'high',title:'의견 나누기',desc:'스마트폰 사용에 대해 생각을 말해요',role:'나는 토론 참가자예요',partner:'Sarah',
 turns:[
 {p:"Do you think students should use smartphones at school?",k:"학생들이 학교에서 스마트폰을 써도 된다고 생각해?",r:[{e:"In my opinion, they should be allowed during breaks.",k:"내 생각엔 쉬는 시간에는 허용해야 해.",ok:1},{e:"I don't think so. They can be distracting.",k:"아니라고 생각해. 집중을 흐트러뜨릴 수 있거든.",ok:1},{e:"I think so. Because.",k:"",fix:"because 뒤에는 이유를 꼭 붙여요.",better:"I think so, because they are useful for research."}]},
 {p:"Interesting. Can you give me an example?",k:"흥미롭네. 예를 들어 줄래?",r:[{e:"For example, we can look up words quickly.",k:"예를 들어 단어를 빨리 찾아볼 수 있어.",ok:1},{e:"For instance, some students play games in class.",k:"예를 들면 어떤 학생들은 수업 중에 게임을 해.",ok:1}]},
 {p:"But what about cyberbullying?",k:"그런데 사이버 폭력은 어때?",r:[{e:"That's a good point. Schools need clear rules.",k:"좋은 지적이야. 학교에 분명한 규칙이 필요해.",ok:1},{e:"I agree that it's a serious problem.",k:"심각한 문제라는 데 동의해.",ok:1},{e:"I am agree with you.",k:"",fix:"agree는 동사라서 am을 쓰지 않아요.",better:"I agree with you."}]},
 {p:"So what's your conclusion?",k:"그래서 너의 결론은 뭐야?",r:[{e:"Smartphones are useful if we use them responsibly.",k:"책임감 있게 쓰면 스마트폰은 유용해.",ok:1},{e:"We should limit them, but not ban them completely.",k:"제한은 해야 하지만 완전히 금지하면 안 돼.",ok:1}]},
 {p:"I see your point. Thanks for sharing.",k:"네 생각 알겠어. 말해 줘서 고마워.",r:[{e:"Thanks for listening.",k:"들어 줘서 고마워.",ok:1},{e:"It was a great discussion.",k:"좋은 토론이었어.",ok:1}]}
 ],
 keys:[["In my opinion, ...","내 생각에는 ..."],["That's a good point.","좋은 지적이야."],["I agree with you.","네 말에 동의해."]]},
{id:'volunteer',level:'high',title:'봉사 활동 계획',desc:'봉사 활동을 함께 계획해요',role:'나는 봉사 동아리 회원이에요',partner:'Jason',
 turns:[
 {p:"Our club is planning a volunteer day. Any ideas?",k:"우리 동아리가 봉사의 날을 계획 중이야. 아이디어 있어?",r:[{e:"How about visiting a nursing home?",k:"요양원을 방문하는 건 어때?",ok:1},{e:"We could clean up the park near our school.",k:"학교 근처 공원을 청소할 수 있어.",ok:1}]},
 {p:"Good idea. What should we prepare?",k:"좋은 생각이야. 뭘 준비해야 할까?",r:[{e:"We need gloves and trash bags.",k:"장갑과 쓰레기봉투가 필요해.",ok:1},{e:"We should prepare some songs and snacks.",k:"노래랑 간식을 준비하자.",ok:1}]},
 {p:"When would be a good time?",k:"언제가 좋을까?",r:[{e:"Saturday morning would be best.",k:"토요일 오전이 제일 좋겠어.",ok:1},{e:"Let's do it after the exams.",k:"시험 끝나고 하자.",ok:1}]},
 {p:"How many people do we need?",k:"몇 명이 필요할까?",r:[{e:"About ten people should be enough.",k:"열 명 정도면 충분할 거야.",ok:1},{e:"The more, the better.",k:"많을수록 좋아.",ok:1},{e:"The more, the good.",k:"",fix:"'~할수록 더 ~하다'는 두 쪽 다 비교급을 써요.",better:"The more, the better."}]},
 {p:"Great. Can you make a poster for it?",k:"좋아. 포스터 만들어 줄 수 있어?",r:[{e:"Sure, I'll make one by Friday.",k:"그래, 금요일까지 만들게.",ok:1},{e:"I'd be happy to.",k:"기꺼이 할게.",ok:1}]}
 ],
 keys:[["How about visiting a nursing home?","요양원을 방문하는 건 어때?"],["Saturday morning would be best.","토요일 오전이 제일 좋겠어."],["I'd be happy to.","기꺼이 할게."]]},
{id:'interview',level:'univ',title:'인턴 면접',desc:'자기소개와 강점을 말해요',role:'나는 지원자예요',partner:'Interviewer',
 turns:[
 {p:"Thank you for coming in. Could you tell me about yourself?",k:"와 주셔서 감사합니다. 자기소개를 해 주시겠어요?",r:[{e:"Sure. I'm a third-year student majoring in education.",k:"네. 교육학을 전공하는 3학년 학생입니다.",ok:1},{e:"Of course. I study computer science and enjoy solving problems.",k:"물론입니다. 컴퓨터 공학을 공부하고 문제 해결을 좋아합니다.",ok:1}]},
 {p:"Why are you interested in this position?",k:"이 자리에 왜 관심이 있나요?",r:[{e:"I want to gain hands-on experience in this field.",k:"이 분야에서 실무 경험을 쌓고 싶습니다.",ok:1},{e:"Your company's mission aligns with my values.",k:"회사의 사명이 제 가치관과 맞습니다.",ok:1},{e:"Because I need money.",k:"돈이 필요해서요.",fix:"솔직하지만 면접에서는 배우고 기여하고 싶은 점을 말하는 게 좋아요.",better:"I want to grow and contribute to your team."}]},
 {p:"What would you say is your greatest strength?",k:"가장 큰 강점이 무엇이라고 생각하나요?",r:[{e:"I'm a good communicator and work well in teams.",k:"소통을 잘하고 팀에서 일을 잘합니다.",ok:1},{e:"I'm very organized and meet deadlines.",k:"매우 체계적이고 마감을 잘 지킵니다.",ok:1}]},
 {p:"Can you describe a challenge you overcame?",k:"극복한 어려움을 이야기해 줄 수 있나요?",r:[{e:"Last year, I led a project that was behind schedule, and we finished on time.",k:"작년에 일정이 밀린 프로젝트를 맡아 제때 끝냈습니다.",ok:1},{e:"I struggled with English, so I practiced every day and improved.",k:"영어가 어려워서 매일 연습해 실력을 높였습니다.",ok:1}]},
 {p:"Do you have any questions for us?",k:"저희에게 질문 있나요?",r:[{e:"Yes. What does a typical day look like for an intern?",k:"네. 인턴의 하루는 보통 어떤가요?",ok:1},{e:"Could you tell me about the team I'd be working with?",k:"함께 일할 팀에 대해 말씀해 주시겠어요?",ok:1},{e:"No.",k:"없어요.",fix:"질문이 없다고만 하면 관심이 적어 보여요. 하나쯤 준비해 가요.",better:"Yes. What does a typical day look like?"}]}
 ],
 keys:[["I'm majoring in education.","교육학을 전공하고 있습니다."],["I work well in teams.","팀에서 일을 잘합니다."],["What does a typical day look like?","보통 하루는 어떤가요?"]]},
{id:'meeting',level:'univ',title:'팀 회의',desc:'의견을 내고 일정을 조율해요',role:'나는 팀원이에요',partner:'Manager',
 turns:[
 {p:"Let's get started. Could you give us an update on the project?",k:"시작하죠. 프로젝트 진행 상황을 알려 주시겠어요?",r:[{e:"Sure. We've finished the first draft, and we're reviewing it now.",k:"네. 초안을 끝냈고 지금 검토 중입니다.",ok:1},{e:"We're about seventy percent done.",k:"70% 정도 진행됐습니다.",ok:1}]},
 {p:"Are there any issues we should know about?",k:"알아야 할 문제가 있나요?",r:[{e:"We might need two more days for testing.",k:"테스트에 이틀이 더 필요할 수도 있습니다.",ok:1},{e:"Everything is on track so far.",k:"지금까지는 모두 예정대로입니다.",ok:1}]},
 {p:"Can we move the deadline to next Friday?",k:"마감을 다음 주 금요일로 옮겨도 될까요?",r:[{e:"That works for me.",k:"저는 괜찮습니다.",ok:1},{e:"I'd prefer Monday, if possible.",k:"가능하면 월요일이 좋겠습니다.",ok:1}]},
 {p:"Who can take care of the presentation?",k:"발표는 누가 맡을 수 있나요?",r:[{e:"I can take care of it.",k:"제가 맡겠습니다.",ok:1},{e:"I'd be glad to help with the slides.",k:"슬라이드 만드는 걸 기꺼이 돕겠습니다.",ok:1},{e:"I can take care it.",k:"",fix:"take care of + 대상이에요. of를 빼먹지 않아요.",better:"I can take care of it."}]},
 {p:"Great. Let's wrap up here. Thanks, everyone.",k:"좋습니다. 여기서 마무리하죠. 모두 고마워요.",r:[{e:"Thank you. I'll send the notes after the meeting.",k:"감사합니다. 회의 후에 회의록을 보내겠습니다.",ok:1},{e:"Thanks. See you next week.",k:"감사합니다. 다음 주에 뵙겠습니다.",ok:1}]}
 ],
 keys:[["We're about seventy percent done.","70% 정도 진행됐습니다."],["That works for me.","저는 괜찮습니다."],["I can take care of it.","제가 맡겠습니다."]]}
];
