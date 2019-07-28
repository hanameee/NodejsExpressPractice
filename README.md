# 0. 목적
Express를 이용해 REST API를 구현해보면서 서버-클라이언트 작동 원리를 공부해보고자 한다.

# 1. 참고 링크

[공식문서](https://expressjs.com/ko/) : https://expressjs.com/ko/
[참고링크1](http://webframeworks.kr/tutorials/nodejs/api-server-by-nodejs-02/) : http://webframeworks.kr/tutorials/nodejs/api-server-by-nodejs-02/
[참고링크2](https://velopert.com/294) : https://velopert.com/294

# 2. 구현사항 정리

## 1) Express 프레임워크 준비

###1-1) package.json 파일 생성

```json
{
  "name": "NodejsExpressPractice",
  "version": "1.0.0",
  "dependencies": 
  {
    "express": "~4.13.1",
    "ejs": "~2.4.1"    
  }
}
```

### 1-2) NPM 으로 Dependency (의존 패키지) 설치

```bash
$ npm install
```

### 1-3) .gitignore 파일 생성

```
node_modules/
```

참고: http://gitignore.io/ 에서 본인이 사용하는 환경에 맞는 gitignore 템플릿 다운로드 가능

###1-4) Express 서버 생성

server.js 파일을 생성하고 아래의 내용을 입력

```javascript
var express = require('express');
var app = express();
var server = app.listen(3000, function(){
  	//서버가 실행되었을 때 콘솔에 아래 메세지 출력
    console.log("Express server has started on port 3000")
})

//첫 화면에서 Hello World 출력
app.get('/', function(req, res){
    res.send('Hello World');
});
```

아래에 추가한 간단한 Router 설정을 통해, 콘솔에서 http://localhost:3000/ 으로 접속하였을 때 Hello World 를 반환한다.

### 1-5) Router 폴더 만들기

라우터 코드와 서버 코드는 다른 파일에 작성하는것이 좋은 습관임.
/router 디렉토리를 만들고, 그 안에 아래와 같은 내용의 main.js 를 생성.

```javascript
module.exports = function(app)
{
     app.get('/',function(req,res){
        res.render('index.html')
     });
     app.get('/about',function(req,res){
        res.render('about.html');
    });
}
```

### 1-6) HTML 파일 띄우기

/views 디렉토리를 만들고, index.html 과 about.html 생성

`index.html`

```html
<html>
  <head>
    <title>Main</title>
    <link rel="stylesheet" type="text/css" href="css/style.css">
  </head>
  <body>
    Hey, this is index page
  </body>
</html>
```

`about.html`

```html
<html>
  <head>
    <title>About</title>
    <link rel="stylesheet" type="text/css" href="css/style.css">
  </head>
  <body>
    About... what?
  </body>
</html>
```

그 후 아래의 내용으로 새롭게 `server.js`파일 업데이트

```javascript
var express = require('express');
var app = express();
// 라우터 모듈인 main.js 를 불러와서 app 에 전달
var router = require('./router/main')(app);

// 서버가 읽을 수 있도록 HTML 의 위치를 정의 (__dirname은 현재 디렉토리명)
app.set('views', __dirname + '/views');

// 서버가 HTML 렌더링을 할 때, EJS 엔진을 사용하도록 설정
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

// 서버 구동 시 콘솔창에 아래 메세지 출력
var server = app.listen(3000, function(){
    console.log("Express server has started on port 3000");
});
```

### 1-7) 정적 파일 다루기

정적 파일이란 - HTML 에서 사용되는 .js 파일, css 파일, image 파일 등을 의미함.
서버에서 정적파일을 다루기 위해선, express.static() 메소드를 사용하면 됨.

public/css 디렉토리를 만들고, 그 안에 style.css 파일을 생성

```css
body{
	background-color: black;
	color: white;
}
```

그 후, `server.js` 맨 아래에 해당 코드 추가

```javascript
app.use(express.static('public'));
```

서버 실행 후 http://localhost:3000/ 에 접속했을 때 css 가 적용된 페이지가 나타나게 됨 :)



## 2) RESTful API

### 2-1) REST란?

**RE**presentational **S**tate **T**ransfer 의 약자로,  월드와이드웹(www) 와 같은 하이퍼미디어 시스템을 위한 소프트웨어 아키텍쳐 중 하나의 형식임.
REST 서버는 클라이언트로 하여금 HTTP 프로토콜을 사용해 서버의 정보에 접근 및 변경을 가능케 함. 여기서의 정보는 text, xml, json 등 형식으로 제공되는데, 요즘은 대부분 json임.

REST 기반 아키텍처에서 자주 사용되는 메소드는 다음과 같음

1. **GET** – 조회
2. **PUT** –  생성 및 업데이트
3. **DELETE** – 제거
4. **POST** – 생성

둘 다 생성하는 POST 와 PUT 의 차이점은 아래 링크에서 추가 학습!
[PUT vs POST, REST API (1ambda Blog)](http://1ambda.github.io/put-vs-post-restful-api/) : http://1ambda.github.io/put-vs-post-restful-api/)

### 2-2) DB 생성

/data 디렉토리를 생성하고, 그 안에 `user.json` 파일을 아래와 같이 만들자.

```json
{
    "first_user": {
        "password": "first_pass",
        "name": "abet"
    },
    "second_user":{
        "password": "second_pass",
        "name": "betty"
    }
}
```

### 2-3) 첫번째 API - GET/list

모든 유저 리스트를 출력하는 GET API 를 작성해보자.
우선, user.json 파일을 읽어야 하므로, fs 모듈을 사용해야 함.

```bash
$npm install fs
```

`router/main.js` 파일을 아래와 같이 업데이트

```javascript
module.exports = function(app, fs)
{
     app.get('/',function(req,res){
         res.render('index', {
             title: "MY HOMEPAGE",
             length: 5
         })
     });

    app.get('/list', function (req, res) {
       fs.readFile( __dirname + "/../data/" + "user.json", 'utf8', function (err, data) {
           console.log( data );
           res.end( data );
       });
    })


}
```

`server.js` 파일의 router 부분과 fs 모듈 require 부분도 업데이트 해주기!

```javascript
const fs = require("fs"); //상단에
var router = require('./router/main')(app,fs); //업데이트
```

이후 http://localhost:3000/list 에 접속하면 json 파일 내용을 브라우저에서 볼 수 있음.