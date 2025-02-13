import React from "react";
import sendSMS from "./smsApi"; // 위에서 작성한 함수 import

const SMSComponent = () => {
  const handleSendSMS = async () => {
    try {
      await sendSMS();
      alert("문자가 성공적으로 전송되었습니다!");
    } catch (error) {
      alert("문자 전송에 실패했습니다.");
    }
  };

  return (
    <div>
      <h1>CoolSMS 문자 전송</h1>
      <button onClick={handleSendSMS}>문자 보내기</button>
    </div>
  );
};

export default SMSComponent;
