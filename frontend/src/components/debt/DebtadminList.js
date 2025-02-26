import { useEffect, useState } from "react";
import {
  getAllDebtRequests,
  approveOrRejectDebtRequest,
  completeDebtRequest,
} from "../../api/debtApi";
import "./DebtadminList.css";

const DebtAdminList = () => {
  const [debtRequests, setDebtRequests] = useState([]); // ✅ 모든 추심 요청 목록

  // ✅ 모든 추심 요청 불러오기
  const fetchDebtRequests = async () => {
    console.log("🔄 모든 추심 요청 불러오는 중...");
    try {
      const data = await getAllDebtRequests();
      if (data) {
        console.log("✅ 추심 요청 목록 불러오기 성공:", data);
        setDebtRequests(data);
      }
    } catch (error) {
      console.error("💥 추심 요청 목록 조회 실패:", error);
    }
  };

  useEffect(() => {
    fetchDebtRequests();
  }, []);

  // ✅ 추심 요청 승인 (APPROVED)
  const handleApprove = async (requestId) => {
    console.log(`🔄 요청 승인 중: requestId=${requestId}`);
    try {
      await approveOrRejectDebtRequest(requestId, "APPROVED");
      alert("✅ 추심 요청 승인 완료!");
      fetchDebtRequests(); // 목록 업데이트
    } catch (error) {
      console.error("❌ 승인 실패:", error);
      alert("❌ 승인 실패!");
    }
  };

  // ✅ 추심 요청 거절 (REJECTED)
  const handleReject = async (requestId) => {
    console.log(`🔄 요청 거절 중: requestId=${requestId}`);
    try {
      await approveOrRejectDebtRequest(requestId, "REJECTED");
      alert("❌ 추심 요청 거절 완료!");
      fetchDebtRequests(); // 목록 업데이트
    } catch (error) {
      console.error("❌ 거절 실패:", error);
      alert("❌ 거절 실패!");
    }
  };

  // ✅ 추심 완료 (COLLECTED 상태로 변경)
  const handleComplete = async (requestId) => {
    console.log(`🔄 요청 추심 완료 처리 중: requestId=${requestId}`);
    try {
      await approveOrRejectDebtRequest(requestId, "COLLECTED"); // 기존 승인 API
      await completeDebtRequest(requestId); // 새로운 추심 완료 API 호출
      alert("✅ 추심 완료!");
      fetchDebtRequests(); // 목록 업데이트
    } catch (error) {
      console.error("❌ 추심 완료 처리 실패:", error);
      alert("❌ 추심 완료 처리 실패!");
    }
  };

  return (
    <div className="debt-container">
      <h2 className="debt-title">📌 관리자 - 추심 요청 관리</h2>
      {debtRequests.length === 0 ? (
        <p>📌 현재 승인 대기 중인 추심 요청이 없습니다.</p>
      ) : (
        <ul>
          {debtRequests.map((request) => (
            <li key={request.id} className="debt-list">
              {/* 왼쪽 요청 정보 */}
              <div className="debt-info">
                {/* 윗줄 */}
                <div className="debt-top">
                  <div>
                    <strong>🆔 요청 ID:</strong> {request.id}
                  </div>
                  <div>
                    <strong>📄 계약 ID:</strong> {request.contractId}
                  </div>
                  <div>
                    <strong>👤 출자자 ID:</strong> {request.lenderId}
                  </div>
                  <div>
                    <strong>💳 채무자 ID:</strong>{" "}
                    {request.borrowerId || "정보 없음"}
                  </div>
                </div>

                {/* 아랫줄 */}
                <div className="debt-bottom">
                  <div>
                    <strong>💰 추심 금액:</strong>{" "}
                    {request.debtAmount.toLocaleString()} 원
                  </div>
                  <div>
                    <strong>📈 추가 이자율:</strong>{" "}
                    {(request.extraInterestRate * 100).toFixed(2)}%
                  </div>
                  <div>
                    <strong>💰📈 익월 연체원리금:</strong>{" "}
                    {request.overdueDebt.toLocaleString()} 원
                  </div>
                  <div>
                    <strong>🚦 현재 상태:</strong>
                    <span
                      className={`debt-status ${request.debtstatus.toLowerCase()}`}
                    >
                      {request.debtstatus === "PENDING"
                        ? "⏳ 승인 대기"
                        : request.debtstatus === "APPROVED"
                        ? "✅ 승인 완료"
                        : request.debtstatus === "COLLECTED"
                        ? "✅ 추심 완료"
                        : "❌ 거절됨"}
                    </span>
                  </div>
                </div>
              </div>

              {/* 오른쪽 버튼 (세로 정렬 + 최소한의 크기) */}
              <div className="debt-actions-wrapper">
                {request.debtstatus === "PENDING" && (
                  <>
                    <button
                      className="debt-button-a"
                      onClick={() => handleApprove(request.id)}
                    >
                      ✅ 승인
                    </button>
                    <button
                      className="debt-button-r"
                      onClick={() => handleReject(request.id)}
                    >
                      ❌ 거절
                    </button>
                  </>
                )}
                {request.debtstatus === "APPROVED" && (
                  <button
                    className="debt-button-f"
                    onClick={() => handleComplete(request.id)}
                  >
                    🔄 추심 완료
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default DebtAdminList;
