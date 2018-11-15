# Project : EcoSeoul Server

* 2018년 서울시 앱 공모전 출품작(EcoSeoul)



## Description

- 내가 만드는 에코 서울 **에코 서울**
- 에코마일리지 활성화를 위해 접근성을 높여 친환경 서울을 만드는 애플리케이션

* 프로젝트 기간 : 2018년 8월 9일 ~ 2018년 8월 30일
* **API** : https://drive.google.com/open?id=1Mz6P5cZ8vuSdusO1hY6mI7b7LNfEMWezcdX7PJpNzaQ



## DB

* 논리적 DB 모델링

* MySQL




## 의존성

```json
"dependencies": {
    "aws-sdk": "^2.323.0",
    "cookie-parser": "^1.4.3",
    "crypto-promise": "^2.1.0",
    "debug": "~2.6.9",
    "express": "~4.16.0",
    "helmet": "^3.13.0",
    "http-errors": "~1.6.2",
    "jade": "^1.11.0",
    "moment": "^2.22.2",
    "morgan": "^1.9.1",
    "multer": "^1.4.0",
    "multer-s3": "^2.7.0",
    "promise-mysql": "^3.3.1"
  }
​```
```

## 시작하기

모든 소스코드는 visual studio + Window 10 + Node.js 8 환경에서 작성되었습니다.

* Node.js의 Async/Await을 사용해 (Promise) 비동기 제어를 하고 있습니다.
* Node.js의 버전을 7.6 이상으로 유지해햐 합니다.



## 배포

- [AWS EC2](https://aws.amazon.com/ko/ec2/?sc_channel=PS&sc_campaign=acquisition_KR&sc_publisher=google&sc_medium=english_ec2_b&sc_content=ec2_e&sc_detail=aws%20ec2&sc_category=ec2&sc_segment=177228231544&sc_matchtype=e&sc_country=KR&s_kwcid=AL!4422!3!177228231544!e!!g!!aws%20ec2&ef_id=WkRozwAAAnO-lPWy:20180412120123:s) - 애플리케이션 서버
- [AWS RDS](https://aws.amazon.com/ko/rds/) - db 서버
- [AWS S3](https://aws.amazon.com/ko/s3/?sc_channel=PS&sc_campaign=acquisition_KR&sc_publisher=google&sc_medium=english_s3_b&sc_content=s3_e&sc_detail=aws%20s3&sc_category=s3&sc_segment=177211245240&sc_matchtype=e&sc_country=KR&s_kwcid=AL!4422!3!177211245240!e!!g!!aws%20s3&ef_id=WkRozwAAAnO-lPWy:20180412120059:s) - 저장소 서버



## 사용된 도구

- [Node.js](https://nodejs.org/ko/) - Chrome V8 자바스크립트 엔진으로 빌드된 자바스크립트 런타임
- [Express.js](http://expressjs.com/ko/) - Node.js 웹 애플리케이션 프레임워크
- [NPM](https://rometools.github.io/rome/) - 자바 스크립트 패키지 관리자
- [PM2](http://pm2.keymetrics.io/) - Express 앱용 프로세스 관리자
- [vscode](https://code.visualstudio.com/) - 편집기
- [Mysql](https://www.mysql.com/) - DataBase
- [AWS EC2](https://aws.amazon.com/ko/ec2/?sc_channel=PS&sc_campaign=acquisition_KR&sc_publisher=google&sc_medium=english_ec2_b&sc_content=ec2_e&sc_detail=aws%20ec2&sc_category=ec2&sc_segment=177228231544&sc_matchtype=e&sc_country=KR&s_kwcid=AL!4422!3!177228231544!e!!g!!aws%20ec2&ef_id=WkRozwAAAnO-lPWy:20180412120123:s) - 클라우드 환경 컴퓨팅 시스템
- [AWS RDS](https://aws.amazon.com/ko/rds/) - 클라우드 환경 데이터베이스 관리 시스템
- [AWS S3](https://aws.amazon.com/ko/s3/?sc_channel=PS&sc_campaign=acquisition_KR&sc_publisher=google&sc_medium=english_s3_b&sc_content=s3_e&sc_detail=aws%20s3&sc_category=s3&sc_segment=177211245240&sc_matchtype=e&sc_country=KR&s_kwcid=AL!4422!3!177211245240!e!!g!!aws%20s3&ef_id=WkRozwAAAnO-lPWy:20180412120059:s) - 클라우드 환경 데이터 저장소



## 개발자

* **김현진** ([hyunjkluz](https://github.com/hyunjkluz)) : 작성자
* **한정민** ([han51361](https://github.com/han51361))

[기여자 목록](https://github.com/EcoSeoul/Team_Server/graphs/contributors)을 확인하여 이 프로젝트에 참가하신 분들을 보실 수 있습니다.



## 연관 프로젝트

* [Android](https://github.com/EcoSeoul/Team_Android)
* [iOS](https://github.com/EcoSeoul/Team_iOS)

