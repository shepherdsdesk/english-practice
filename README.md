# 기초영어 연습장

초등학생이 기초 영단어 1,000개와 필수 문법 26개를 단계별로 연습하는 웹앱입니다. 기본 학습량은 한 회차 20단어이며, 관리자 설정에서 1~100개로 조절할 수 있습니다.

## 앱 주소

[기초영어 연습장 열기](https://shepherdsdesk.github.io/english-practice/)

## 갤럭시 홈 화면에 설치하기

1. 휴대폰의 **Chrome**에서 앱 주소를 엽니다. 카카오톡에서 링크를 받았다면 메뉴에서 **다른 브라우저로 열기**를 선택합니다.
2. 앱 오른쪽 위의 **홈 화면에 추가**를 누릅니다.
3. 설치 창에서 **설치**를 누릅니다. 안내만 표시되면 Chrome의 **⋮ → 홈 화면에 추가**에서 **설치** 또는 **바로가기 만들기**를 선택합니다.
4. 홈 화면에 생긴 초록색 책 아이콘을 눌러 **오늘의 학습**을 시작합니다.

## 아이폰 홈 화면에 설치하기

1. **Safari**에서 앱 주소를 엽니다.
2. **공유** 버튼을 누르고 메뉴를 아래로 내려 **홈 화면에 추가**를 선택합니다.
3. **웹 앱으로 열기**가 표시되면 켜고 **추가**를 누릅니다. 다음부터는 홈 화면의 책 아이콘으로 실행합니다.

## 운영자용 GitHub Pages 배포 방법

1. GitHub에 `english-practice` 저장소를 만듭니다. 무료 개인 계정을 사용한다면 **Public**으로 만듭니다.
2. 배포용 ZIP을 풀고 `index.html`, `manifest.webmanifest`, `sw.js`, `icon-180.png`, `icon-192.png`, `icon-512.png`와 `firebase-config.js`, 이 `README.md`를 저장소 최상위에 올립니다.
3. **Commit changes**를 눌러 `main` 브랜치에 저장합니다.
4. **Settings → Pages → Build and deployment**에서 **Deploy from a branch**를 선택합니다. 브랜치를 `main`, 폴더를 `/(root)`로 지정하고 **Save**를 누릅니다.
5. 배포가 끝나면 **Visit site**에서 앱을 열어 봅니다. 위의 주소 예시를 실제 주소로 바꿔 두면 방문자가 쉽게 접속할 수 있습니다.

학습 진도와 설정은 사용한 기기의 브라우저에 저장됩니다. [GitHub Pages 배포 안내](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site) · [아이폰 홈 화면 추가 안내](https://support.apple.com/ko-kr/guide/iphone/iphea86e5236/ios)

## 사진으로 내 단어장 만들기

홈에서 **사진 단어장**을 열고 인쇄된 영어 단어를 촬영하거나 앨범에서 고릅니다. 사진은 브라우저 안에서 처리하며, 처음에는 인식 도구와 영어 데이터를 받기 위해 인터넷 연결이 필요합니다. 인식된 철자와 뜻을 확인하고 원하는 단어만 선택해 저장하세요. 기본 단어장에 없는 뜻은 직접 입력할 수 있습니다. 저장한 단어도 발음 듣기, 글자 배열, 철자 쓰기, 뜻 고르기로 연습합니다. 기기별로 저장되므로 배포를 업데이트할 때 같은 주소를 사용하세요.

## Firebase 가족 보고함 연결

1. Firebase 콘솔에서 프로젝트를 만들고 웹 앱을 등록합니다. 프로젝트 설정에서 웹 앱의 apiKey, authDomain, projectId, appId를 firebase-config.js에 입력한 후 GitHub Pages에 앱 파일과 함께 올립니다. 이 파일에는 웹 앱의 공개 설정만 넣습니다.
2. Authentication → Sign-in method에서 이메일/비밀번호를 켜고, Users에서 보호자 계정 하나와 학생 계정 하나를 직접 생성합니다. 각각의 UID를 복사합니다. Authentication 설정의 승인된 도메인에 GitHub Pages 호스트(예: 계정명.github.io)를 등록합니다.
3. Firestore Database에서 기본 데이터베이스를 프로덕션 모드로 만들고 Rules 탭에 동봉한 firestore.rules 전체를 붙여 넣은 뒤 게시합니다.
4. Firestore 데이터 탭에서 members 컬렉션을 만듭니다. 문서 ID를 보호자 UID로 지정하고 문자열 필드 family에 family-home, role에 parent를 입력합니다. 학생 UID 문서에도 같은 family 값과 role 값 student를 넣습니다. 이 권한 문서는 보호자가 콘솔에서만 관리합니다.
5. 각 기기에서 앱의 관리자 메뉴를 열어 해당 기기의 PIN을 정합니다. 자녀 휴대폰에는 학생 계정, 부모 휴대폰에는 보호자 계정으로 한 번 연결합니다. 학생 휴대폰은 학생 모드로 돌아갑니다. 부모 기기는 다음 실행부터 관리자 PIN 화면으로 열립니다.
6. 학생 기기에서 1단어 회차를 완료하고 부모 기기의 열린 보고함에 결과가 뜨는지 확인합니다. 시험 후 분량을 원래 값으로 되돌립니다.

보호자 화면은 최근 보고 30개를 실시간으로 구독합니다. 앱을 닫은 동안 들어온 보고도 다음에 확인할 수 있습니다. 인터넷이 끊긴 학생 기기는 보고를 대기시켰다가 다시 연결될 때 전송합니다. 기기 이전 버전의 개인 진도는 같은 주소와 브라우저를 사용하면 유지됩니다. 이전 서버의 보고 내역은 별도로 이전하지 않습니다. 무료 사용 범위는 Firebase 프로젝트 할당량에 따릅니다.
