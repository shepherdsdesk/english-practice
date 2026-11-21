# 기초영어 연습장

초등학생이 기초 영단어 1,000개와 필수 문법 26개를 단계별로 연습하는 웹앱입니다. 기본 학습량은 한 회차 20단어이며, 관리자 설정에서 1~100개로 조절할 수 있습니다.

## 앱 주소

저장소 이름이 `english-practice`일 때 기본 접속 주소는 다음과 같습니다. `YOUR-USERNAME` 자리에 저장소를 소유한 GitHub 계정명을 넣으세요.

`https://YOUR-USERNAME.github.io/english-practice/`

배포 후 저장소의 **Settings → Pages → Visit site**를 누르면 실제 앱이 열립니다. 그때 브라우저 주소창의 링크를 복사해 휴대폰으로 보내세요.

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
2. 배포용 ZIP을 풀고 `index.html`, `manifest.webmanifest`, `sw.js`, `icon-180.png`, `icon-192.png`, `icon-512.png`와 이 `README.md`를 저장소 최상위에 올립니다.
3. **Commit changes**를 눌러 `main` 브랜치에 저장합니다.
4. **Settings → Pages → Build and deployment**에서 **Deploy from a branch**를 선택합니다. 브랜치를 `main`, 폴더를 `/(root)`로 지정하고 **Save**를 누릅니다.
5. 배포가 끝나면 **Visit site**에서 앱을 열어 봅니다. 위의 주소 예시를 실제 주소로 바꿔 두면 방문자가 쉽게 접속할 수 있습니다.

학습 진도와 설정은 사용한 기기의 브라우저에 저장됩니다. [GitHub Pages 배포 안내](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site) · [아이폰 홈 화면 추가 안내](https://support.apple.com/ko-kr/guide/iphone/iphea86e5236/ios)
