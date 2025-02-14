// import axios from "axios";

// const smsApi = async () => {
//   // CoolSMS API 키 및 시크릿 키
//   const apiKey = ""; // ⚠️ 테스트용 키
//   const apiSecret = ""; // ⚠️ 테스트용 키

//   const url = "https://api.coolsms.co.kr/messages/v4/send";

//   // CoolSMS 메시지 데이터
//   const messageData = {
//     messages: [
//       {
//         to: "01012345678", // 수신자 번호
//         from: "01098765432", // 발신자 번호 (CoolSMS 인증된 번호)
//         text: "테스트 메시지입니다.", // 메시지 내용
//       },
//     ],
//   };

//   const headers = {
//     "Content-Type": "application/json",
//     Authorization: `Basic ${btoa(`${apiKey}:${apiSecret}`)}`, // Base64 인코딩
//   };

//   try {
//     const response = await axios.post(url, messageData, { headers });
//     console.log("문자 발송 성공:", response.data);
//   } catch (error) {
//     console.error("문자 발송 실패:", error);
//   }
// };

// export default smsApi;
