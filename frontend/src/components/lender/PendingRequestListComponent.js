import React from "react";
import { approveLenderRequest } from "../../api/lenderApi";
import "./PendingRequestList.css";

const PendingRequestListComponent = ({
  pendingRequests,
  setPendingRequests,
}) => {
  const handleApproval = async (userId, approve) => {
    try {
      const message = await approveLenderRequest(userId, approve);
      alert(message);
      setPendingRequests(pendingRequests.filter((req) => req.id !== userId));
    } catch (error) {
      alert("승인/거절 처리 중 오류가 발생했습니다.");
    }
  };

  // 📌 서버 응답 데이터 디버깅
  console.log("📌 현재 대기 중인 요청 목록:", pendingRequests);

  if (!Array.isArray(pendingRequests) || pendingRequests.length === 0) {
    return <p>올바른 요청 목록 데이터를 불러올 수 없습니다.</p>;
  }

  // return (
  //   <div className="pending-request">
  //     <ul>
  //       {pendingRequests.map((request) => (
  //         <li key={request.id}>
  //           {request.name} ({request.email}) -{" "}
  //           {request.lenderStatus.includes("PENDING_SURRENDER")
  //             ? "채권자 포기 신청"
  //             : "채권자 신청"}
  //           <button onClick={() => handleApproval(request.id, true)}>
  //             승인
  //           </button>
  //           <button onClick={() => handleApproval(request.id, false)}>
  //             거절
  //           </button>
  //         </li>
  //       ))}
  //     </ul>
  //   </div>
  // );
  return (
    <div className="pending-requests-container">
      {pendingRequests.length === 0 ? (
        <p className="empty-message">❌ 대기 중인 요청이 없습니다.</p>
      ) : (
        <ul className="pending-request-list">
          {pendingRequests.map((request) => (
            <li key={request.id} className="pending-request-item">
              <div className="request-info">
                <span className="request-name">{request.name}</span>
                <span className="request-email">({request.email})</span>
              </div>
              <div className="request-status">
                {request.lenderStatus.includes("PENDING_SURRENDER")
                  ? "🔴 채권자 포기 신청"
                  : "🟢 채권자 신청"}
              </div>
              <div className="request-actions">
                <button
                  className="approve-btn"
                  onClick={() => handleApproval(request.id, true)}
                >
                  ✅ 승인
                </button>
                <button
                  className="reject-btn"
                  onClick={() => handleApproval(request.id, false)}
                >
                  ❌ 거절
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default PendingRequestListComponent;
