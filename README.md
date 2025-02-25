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
  ![2차UML](https://github.com/user-attachments/assets/96f6cb5c-8fbb-4644-97bc-1883754e6f7d)


## 주요 기능

### 메인페이지
- 배너 자동 스킵

  ![image](https://github.com/user-attachments/assets/6ff43150-e725-4c66-848b-76af234c8751)

- 좌/우 바 스크롤시 고정

  ![image](https://github.com/user-attachments/assets/c12112b6-a571-4444-86ed-aa1deb697f52)

- 리차트, 파이썬 이용 차트

  ![image](https://github.com/user-attachments/assets/6b90dfa4-c153-43ad-9de5-d95fb73e13dd)


#### 구현 결과
  ![main](https://github.com/user-attachments/assets/8d24b6ec-8569-4593-aa9a-45fa4d4c754f)

---
### 내지갑(마이페이지)
- 회원정보 표시 및 수정/삭제
- 내 지갑 정보/잔액표시 및 계좌에서 지갑으로 입출금, 다른 유저와 지갑과 거래 가능, 거래 횟수 및 내역 표시
  - 계좌에서 지갑

    ![계좌에서 지갑](https://github.com/user-attachments/assets/5e134e24-d9df-49b1-bc45-7fa45dd41ee0)
  - 지갑에서 계좌
    ![지갑에서 계좌](https://github.com/user-attachments/assets/6f6f1b02-3e40-4f0b-932f-e6b8972b3aa2)
  - 지갑간 거래
    
    ![지갑간 거래](https://github.com/user-attachments/assets/5aed8575-4df0-4a5b-ab00-a5f310f75839)
  
- 진행중인 계약 및 완료된 계약 표시
  

#### 구현 결과
  ![mypage](https://github.com/user-attachments/assets/20fc8ba2-3e06-4bef-9e91-315fe0b0d81c)

---
### 빌려드려요(계약진행)
- 채권자의 게시글 작성 / 채무자의 댓글 작성
  - 채권자 게시글 작성 코드
    ![게시글작성](https://github.com/user-attachments/assets/c5e968d4-47e2-4469-94e3-54e8d0bd78b7)
    ![게시글작성](https://github.com/user-attachments/assets/8246e58a-de47-46a7-b086-eb2f34671e74)

  - 채무자 댓글 작성 코드
    ![게시글작성](https://github.com/user-attachments/assets/f09c6b58-8e42-4167-a633-5406ba8ccb00)
    ![댓글작성](https://github.com/user-attachments/assets/f17659ef-6aaa-4a66-a111-317cec74af65)

- 채권자가 채무자의 댓글 선정시 계약 진행
  ![image](https://github.com/user-attachments/assets/adce608d-77f9-40b8-a860-acc874ac146c)
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
  ![image](https://github.com/user-attachments/assets/6704c333-c3de-4018-ab03-c6791b0fc438)
  ![image](https://github.com/user-attachments/assets/2a4a57f5-3964-43e9-9223-4a9544496c0e)


- 연체 상태시 채권자는 대행서비스를 통해 추심 신청가능
  ![image](https://github.com/user-attachments/assets/4766aab3-ffd6-4518-be20-53ecb8771d01)
  ![추심신청](https://github.com/user-attachments/assets/7c88825b-f7ba-4356-87af-bb42939a1cf3)

  
- 관리자가 추심 신청 승인시 채무자의 지갑의 모든 기능이 막힘
  ![image](https://github.com/user-attachments/assets/7abd2726-fd6e-4ed7-bcf9-f3f59db2a41a)
  ![image](https://github.com/user-attachments/assets/cb2b05b0-1e88-4154-a1df-5e77cc33ac00)
  ![추심관리자승인](https://github.com/user-attachments/assets/7ee27c61-4e69-4389-9c79-070f8502e78f)

- 채무자의 지갑 기능이 막힌 것 확인가능
  ![image](https://github.com/user-attachments/assets/9cd738a9-773d-4f35-bfaf-334523b650cf)

---
### 채팅
- 유저들과 실시간 채팅가능(오픈카톡)
  ![image](https://github.com/user-attachments/assets/f2c374c4-3499-4956-8e06-f7aff8ec7f1d)
  ![image](https://github.com/user-attachments/assets/aed55484-97c4-4078-80b8-01f444fb8b8d)
- 본인이 쓴 채팅은 파란색, 다른유저가 쓴 채팅은 회색으로 나옴
  ![채팅](https://github.com/user-attachments/assets/fdc74426-80ca-44f9-bef6-84077c152ccd)

---
### 고객센터
- 사이트 이용안내
  
  ![image](https://github.com/user-attachments/assets/ea1ed5d1-a515-4420-8b6c-bd50c676b3f7)
- 버튼 활용으로 채권자 가이드 / 채무자 가이드 확인 가능
  ![이용가이드](https://github.com/user-attachments/assets/041527b4-089c-4671-a513-3d0b2f7651fb)


- QNA CRUD 가능 및 비밀글 설정 가능(비밀글은 QNA 작성유저와 관리자만 확인 가능)
  ![image](https://github.com/user-attachments/assets/40b3f88d-350d-4637-a9c1-6f736d5f1c5c)
  ![image](https://github.com/user-attachments/assets/472e2614-f387-43bc-8eab-693aa48f74a6)
  프론트엔드에서 받은 입력값을 엔티티로 변환 후 데이터베이스에 추가

  ![비밀글쓰기](https://github.com/user-attachments/assets/37871bbc-6c07-4737-b107-e66acdb9b078)

  작성자 or 관리자가 아니면 QNA 확인 불가
  
  ![비밀글보기](https://github.com/user-attachments/assets/82eaab82-c1d7-4401-871f-9e350259b8df)
  
- QNA는 관리자만 답변 가능
  - 댓글 권한을 관리자만 부여
  ![image](https://github.com/user-attachments/assets/42e63a55-eadb-4285-b329-613f53a579c0)
  ![관리자QNA댓글](https://github.com/user-attachments/assets/e55808c9-93c7-43f5-af87-619e12d0544e)

---
### 채권/채무 변환
- 채권자 -> 채무자 / 채무자 -> 채권자 변환 가능
- 회원이 채권/채무 변환 신청
  ![image](https://github.com/user-attachments/assets/7d43d58b-d665-42c9-a3d0-d350391774ff)
  ![채권채무변환](https://github.com/user-attachments/assets/38e9e543-3e66-4411-8724-c0625ae2465c)
- 관리자가 신청 승인 및 거절
  ![image](https://github.com/user-attachments/assets/bed01426-5692-4259-a575-025829a72ca5)
  ![채권채무관리자승인](https://github.com/user-attachments/assets/0d0e0b80-81b5-4c82-ada9-09c6b94309de)
- 승인 후 결과
  ![채권채무변환결과](https://github.com/user-attachments/assets/49eb5fde-46bf-418d-a141-a72f4884bf34)
#### 반대로도 마찬가지로 진행

---
### 계약 수수료 기부
- 계약 완료 시 계약 금액에 따라 수수료 발생, 수수료 절반 기부계좌로 입금
  ![image](https://github.com/user-attachments/assets/684b74d9-54df-49c4-99c0-86609075d5f0)
- 그간의 수수료에 따라 메인페이지에 차트 띄움(리차트 사용)
  ![image](https://github.com/user-attachments/assets/cc75acee-bbc0-435c-8b59-886c88c6c6dd)
  ![image](https://github.com/user-attachments/assets/ee9cad17-8913-4a2c-a796-9c20225e0c49)

---
### 파이썬 이용 챗봇, 이자율 평균 차트
- 파이썬을 이용한 챗봇 구현, 들어오는 입력값에 따라 엔드포인트가 나뉨
  ![image](https://github.com/user-attachments/assets/39df406a-545d-49cf-97b5-d3c6c665c244)
- /info 엔드포인트 경우(프롬프트 설정으로 이용에 관한 답변 반환)
  ![image](https://github.com/user-attachments/assets/ccebc8c5-26ae-4e1d-be72-1fb7efbb2b9a)
- /filter 엔드포인트의 경우(게시글 데이터를 불러와 필터링 진행 후 html태그로 변환해서 반환
  ![image](https://github.com/user-attachments/assets/f1f45d57-9a88-4db3-9375-8a12467d15f1)
  
  ![image](https://github.com/user-attachments/assets/3a0a3286-03b2-44e9-bfad-d32e3308bd23)
  



  












  







