# MoneyBridge
RESTful API, Spring Boot, React, Python, AWS 를 활용한 두번째 풀스택 프로젝트(금융)

## 프로젝트 소개
개인 간 대출 진행 및 계약 수수료를 기부하는 금융 프로젝트

## 협업 멤버
<table>
  <tr>
    <td align="center"><a href="https://github.com/Tae-Yun-Kim"><img src="https://avatars.githubusercontent.com/Tae-Yun-Kim" width="100px;" alt=""/><br /><sub><b>Tae-Yun-Kim</b></sub></a></td>
    <td align="center"><a href="https://github.com/32won0"><img src="https://avatars.githubusercontent.com/32won0" width="100px;" alt=""/><br /><sub><b>32won0</b></sub></a></td>
    <td align="center"><a href="https://github.com/kkw8989"><img src="https://avatars.githubusercontent.com/kkw8989" width="100px;" alt=""/><br /><sub><b>kkw8989</b></sub></a></td>
    <td align="center"><a href="https://github.com/hyesulee"><img src="https://avatars.githubusercontent.com/hyesulee" width="100px;" alt=""/><br /><sub><b>hyesulee</b></sub></a></td>
    <td align="center"><a href="https://github.com/jsLeeR"><img src="https://avatars.githubusercontent.com/jsLeeR" width="100px;" alt=""/><br /><sub><b>jsLeeR</b></sub></a></td>
  </tr>
</table>

#### 각 팀원들은 맡은 기능을 하이브리드로 진행

- 김태윤 
  - 로그인 및 회원가입 : JWT를 이용한 보안처리 및 백엔드 스프링 시큐리티 사용
  - 관리자 페이지 및 기능 구현
  - 각 회원 채권자/채무자 변환 기능 구현
  - 파이썬을 이용한 채팅/음성인식 가능한 챗봇 구현
  - 회원과 계좌 연결 구현
  - 각 페이지 css
- 김경우
  - 게시글(CRUD) / 게시글 댓글(CRUD) 구현
  - 게시글을 활용한 채권자/채무자 커넥트 구현
  - 각 기능에 대한 알림 구현
  - 빌려드려요(게시글) 페이지 css
- 이진수
  - 대행서비스(추심신청) 구현
  - QNA 기능 구현
  - 각 페이지 틀 구성
- 이혜수
  - 게시글(CRUD) / 게시글 댓글(CRUD) 구현
  - 게시글을 활용한 채권자/채무자 커넥트 구현
  - iTextPdf 라이브러리를 이용한 계약서 CRUD
  - 게약 완료시 수수료 생성 및 수수료의 반 기부 기능 구현, 기부현황 리차트로 차트화
- 조원
  - 지갑 CRUD 및 각 지갑간 거래, 계좌와 지갑간 입/출금 기능 구현
  - 단체 채팅방 구현
  - 금융감독원 오픈API를 활용한 각 은행들 대출금리 표시
  - 회원ID 및 게시글 제목으로 게시글 검색 기능 구현

## 개발환경
###  - `fornt-end`
     - React
     - javascript
     - Node.js
     - html
     - css
     - Redux-tookit
     
### - `back-end`
     - Spring Boot
     - java
     - jwt
     - Spring JPA
     - mariaDB
     - Python

## ERD
  ![2차ERD찐막 drawio](https://github.com/user-attachments/assets/76205634-de2e-48ef-abe3-717a45d47e49)

## 유스케이스
  ![image](https://github.com/user-attachments/assets/b63766c0-9607-48df-983f-6c31c1f6aae1)

## 주요 기능

### 메인페이지
- 배너 자동 스킵
- 좌/우 바 스크롤시 고정
- 리차트, 파이썬 이용 차트
#### 구현 결과
  ![main](https://github.com/user-attachments/assets/8d24b6ec-8569-4593-aa9a-45fa4d4c754f)

---
### 내지갑(마이페이지)
- 회원정보 표시 및 수정/삭제
- 내 지갑 정보/잔액표시 및 계좌에서 지갑으로 입출금, 다른 유저와 지갑과 거래 가능, 거래 횟수 및 내역 표시
- 진행중인 계약 및 완료된 계약 표시
  

#### 구현 결과
  ![mypage](https://github.com/user-attachments/assets/20fc8ba2-3e06-4bef-9e91-315fe0b0d81c)

---
### 빌려드려요(계약진행)
- 채권자의 게시글 작성 / 채무자의 댓글 작성
  - 채권자 게시글 작성
    ![게시글작성](https://github.com/user-attachments/assets/8246e58a-de47-46a7-b086-eb2f34671e74)

  - 채무자 댓글 작성
    ![댓글작성](https://github.com/user-attachments/assets/f17659ef-6aaa-4a66-a111-317cec74af65)

- 채권자가 채무자의 댓글 선정시 계약 진행
  ![계약시작](https://github.com/user-attachments/assets/e028e6d0-6b85-4290-aa68-593665fbe98f)

- 채무자가 게약서 작성 후 채권자 게약서 작성 -> 계약 시작
  - 채무자
    ![채무자계약작성](https://github.com/user-attachments/assets/fbe26f37-f512-4ad0-8bfa-55af4c19cfce)

  - 채권자
    ![채권자계약작성](https://github.com/user-attachments/assets/9f137aaa-66df-4f11-a5f2-d010d1922dbc)

  - 양측 다 계약서 작성 완료시 자동으로 지갑에서 송금
    ![image](https://github.com/user-attachments/assets/a4e73c8f-0394-4c02-9b15-a3b8bae14681)
 
- 계약이 진행중, 게약 완료, 게약 취소 인 게시글들은 확인 불가
  ![계약진행중은불가](https://github.com/user-attachments/assets/2b714c59-71e1-419c-bf7e-af760c725ffc)

- 채무자 자동상환 가능
  ![자동상환](https://github.com/user-attachments/assets/e958c50f-9a64-483a-9628-380c9f0e7025)
  ![image](https://github.com/user-attachments/assets/b364ed0b-2ba1-4be5-98b9-a961a360df88)

---
### 대행서비스(추심신청)
- 상환기간이 지날 경우 연체 상태로 전환
  ![image](https://github.com/user-attachments/assets/2a4a57f5-3964-43e9-9223-4a9544496c0e)


- 연체 상태시 채권자는 대행서비스를 통해 추심 신청가능
  ![추심신청](https://github.com/user-attachments/assets/7c88825b-f7ba-4356-87af-bb42939a1cf3)

  
- 관리자가 추심 신청 승인시 채무자의 지갑의 모든 기능이 막힘
  ![추심관리자승인](https://github.com/user-attachments/assets/7ee27c61-4e69-4389-9c79-070f8502e78f)

- 채무자의 지갑 기능이 막힌 것 확인가능
  ![image](https://github.com/user-attachments/assets/9cd738a9-773d-4f35-bfaf-334523b650cf)

---
### 채팅
- 유저들과 실시간 채팅가능(오픈카톡)
- 본인이 쓴 채팅은 파란색, 다른유저가 쓴 채팅은 회색으로 나옴
  ![채팅](https://github.com/user-attachments/assets/fdc74426-80ca-44f9-bef6-84077c152ccd)

---
### 고객센터
- 사이트 이용안내
  - 버튼 활용으로 채권자 가이드 / 채무자 가이드 확인 가능
  ![이용가이드](https://github.com/user-attachments/assets/041527b4-089c-4671-a513-3d0b2f7651fb)


- QNA CRUD 가능 및 비밀글 설정 가능(비밀글은 QNA 작성유저와 관리자만 확인 가능)

  - 프론트엔드에서 받은 입력값을 엔티티로 변환 후 데이터베이스에 추가

  ![비밀글쓰기](https://github.com/user-attachments/assets/37871bbc-6c07-4737-b107-e66acdb9b078)

  - 작성자 or 관리자가 아니면 QNA 확인 불가
  
  ![비밀글보기](https://github.com/user-attachments/assets/82eaab82-c1d7-4401-871f-9e350259b8df)
  
- QNA는 관리자만 답변 가능
  - 댓글 권한을 관리자만 부여
  ![관리자QNA댓글](https://github.com/user-attachments/assets/e55808c9-93c7-43f5-af87-619e12d0544e)

---
### 채권/채무 변환
- 채권자 -> 채무자 / 채무자 -> 채권자 변환 가능
- 회원이 채권/채무 변환 신청
  ![채권채무변환](https://github.com/user-attachments/assets/38e9e543-3e66-4411-8724-c0625ae2465c)
- 관리자가 신청 승인 및 거절
  ![채권채무관리자승인](https://github.com/user-attachments/assets/0d0e0b80-81b5-4c82-ada9-09c6b94309de)
- 승인 후 결과
  ![채권채무변환결과](https://github.com/user-attachments/assets/49eb5fde-46bf-418d-a141-a72f4884bf34)
#### 반대로도 마찬가지로 진행

---
### 계약 수수료 기부
- 계약 완료 시 계약 금액에 따라 수수료 발생, 수수료 절반 기부계좌로 입금
- 그간의 수수료에 따라 메인페이지에 차트 띄움(리차트 사용)
  
  ![image](https://github.com/user-attachments/assets/ee9cad17-8913-4a2c-a796-9c20225e0c49)

---
### 파이썬 이용 챗봇, 이자율 평균 차트
- 파이썬을 이용한 챗봇 구현, 들어오는 입력값에 따라 엔드포인트가 나뉨
- /info 엔드포인트 경우(프롬프트 설정으로 이용에 관한 답변 반환)
- /filter 엔드포인트 경우(게시글 데이터를 불러와 필터링 진행 후 html태그로 변환해서 반환
- /chat-voice 엔드포인트 경우(음성 데이터로 받은 입력값을 /filter와 마찬가지로 html태그로 변환해서 반환)

#### 구현결과
  ![챗봇](https://github.com/user-attachments/assets/b0519d4e-dbd0-4ac4-9c42-812666b32d78)

#### 이자율 평균 차트
- 최근 4일간 게약시 선택된 이자율의 평균을 차트로 띄움
  ![image](https://github.com/user-attachments/assets/e24897ac-c956-4d51-a7aa-eddf39eee345)
  ![image](https://github.com/user-attachments/assets/f0e0dc7a-3803-4927-ac30-5b91055f027f)




  



  












  







