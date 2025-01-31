import React, { useState } from "react";
import { requestLenderToggle } from "../../api/lenderApi";

// const LenderRequestComponent = ({ id, isLender, lenderStatus }) => {
//   const [status, setStatus] = useState(lenderStatus);

//   const handleRequest = async () => {
//     try {
//       const message = await requestLenderToggle(id);
//       alert(message); // 서버에서 반환된 메시지
//       setStatus("PENDING");
//     } catch (error) {
//       alert("요청 처리 중 오류가 발생했습니다.");
//     }
//   };

//   return (
//     <div>
//       {status === "PENDING" ? (
//         <p>신청 대기 중입니다. 관리자의 승인을 기다려주세요.</p>
//       ) : (
//         <button onClick={handleRequest}>
//           {isLender ? "채권자 포기 신청" : "채권자 신청"}
//         </button>
//       )}
//     </div>
//   );
// };

// export default LenderRequestComponent;

const LenderRequestComponent = ({ id, isLender, lenderStatus }) => {
  const [status, setStatus] = useState(lenderStatus);
  const [loading, setLoading] = useState(false); // 요청 중 상태 관리

  const handleRequest = async () => {
    try {
      setLoading(true);

      // `id`가 없으면 로컬 스토리지에서 사용자 정보 가져오기
      if (!id) {
        const storedMember = localStorage.getItem("member");
        console.log("로컬 스토리지 데이터 확인:", storedMember);

        if (!storedMember) {
          alert("사용자 정보가 없습니다. 로그인 후 다시 시도해주세요.");
          return;
        }

        // JSON 파싱 및 ID 추출
        const parsedMember = JSON.parse(storedMember);
        id = parsedMember.id;

        if (!id) {
          alert("유효한 사용자 ID를 찾을 수 없습니다.");
          return;
        }
      }

      // API 호출
      const message = await requestLenderToggle(id);
      alert(message); // 서버에서 반환된 메시지

      // 상태 업데이트
      setStatus("PENDING");
    } catch (error) {
      alert("요청 처리 중 오류가 발생했습니다.");
      console.error("오류 발생:", error);
    } finally {
      setLoading(false); // 로딩 상태 해제
    }
  };

  return (
    <div>
      {status === "PENDING" ? (
        <p>신청 대기 중입니다. 관리자의 승인을 기다려주세요.</p>
      ) : (
        <button onClick={handleRequest} disabled={loading}>
          {isLender ? "채권자 포기 신청" : "채권자 신청"}
        </button>
      )}
    </div>
  );
};

export default LenderRequestComponent;
