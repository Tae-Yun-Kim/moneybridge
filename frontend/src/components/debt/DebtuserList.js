import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getContractsByLender } from "../../api/contractApi"; // ✅ 출자자의 계약만 조회
import {
  requestDebtCollection,
  getDebtStatusByContract,
} from "../../api/debtApi";
import "./DebtuserList.css";

const DebtuserList = ({ userId, isLender }) => {
  const [contracts, setContracts] = useState([]);
  const [debtStatuses, setDebtStatuses] = useState({}); // ✅ 계약별 추심 상태 저장
  const navigate = useNavigate();

  // ✅ 계약 상태 라벨 반환
  const getStatusLabel = (status) => {
    switch (status) {
      case "OVERDUE":
        return "⚠️ 연체 상태";
      default:
        return "❓ 알 수 없는 상태";
    }
  };

  // ✅ 추심 상태 라벨 반환
  const getDebtStatusLabel = (debtstatus) => {
    switch (debtstatus) {
      case "PENDING":
        return "⏳ 추심 승인 대기 중";
      case "APPROVED":
        return "✅ 추심 승인 완료";
      case "REJECTED":
        return "❌ 추심 신청 거절";
      default:
        return "📌 추심 미신청";
    }
  };

  // ✅ 연체 상태인 계약만 조회 (출자자만 접근 가능)
  const fetchContracts = async () => {
    try {
      if (!isLender) {
        console.warn("🚨 대출자는 계약 목록을 조회할 수 없습니다.");
        setContracts([]); // 대출자일 경우 목록 초기화
        return;
      }

      const data = await getContractsByLender(userId); // 출자자의 계약 조회
      const overdueContracts = data.filter(
        (contract) => contract.status === "OVERDUE"
      );

      setContracts(overdueContracts);
      fetchDebtStatuses(overdueContracts.map((contract) => contract.id)); // ✅ 추심 상태 조회
    } catch (error) {
      console.error("💥 연체 계약 목록 불러오기 중 오류 발생:", error);
    }
  };

  // ✅ 각 계약의 추심 상태 조회
  const fetchDebtStatuses = async (contractIds) => {
    try {
      const debtStatusesMap = { ...debtStatuses }; // 기존 상태 유지
      await Promise.all(
        contractIds.map(async (contractId) => {
          try {
            const response = await getDebtStatusByContract(contractId);
            debtStatusesMap[contractId] =
              response.length > 0 ? response[0].debtstatus : "NONE";
          } catch (error) {
            console.error(
              `💥 계약 ID ${contractId}의 추심 상태 불러오기 실패`,
              error
            );
            debtStatusesMap[contractId] = "NONE";
          }
        })
      );
      setDebtStatuses(debtStatusesMap); // ✅ 최신 상태 반영
    } catch (error) {
      console.error("💥 추심 상태 불러오기 실패:", error);
    }
  };

  useEffect(() => {
    fetchContracts();
  }, [userId, isLender]);

  // ✅ 출자자가 추심 요청 버튼 클릭 시 실행
  const handleDebtRequest = async (contractId, lenderId) => {
    try {
      // ✅ 상태를 먼저 PENDING으로 업데이트하여 UI 반영
      setDebtStatuses((prev) => ({
        ...prev,
        [contractId]: "PENDING", // ✅ 특정 계약만 업데이트
      }));

      await requestDebtCollection(contractId, lenderId);
      alert(`✅ 계약 ${contractId}의 추심 요청이 관리자에게 전달되었습니다.`);

      // ✅ 추심 상태를 다시 확인하여 UI 갱신
      fetchDebtStatuses([contractId]);
    } catch (error) {
      console.error("💥 추심 요청 중 오류 발생:", error);
      alert("❌ 추심 요청에 실패했습니다. 다시 시도해주세요.");

      // ✅ 오류 발생 시 상태를 원래대로 되돌림
      setDebtStatuses((prev) => ({
        ...prev,
        [contractId]: "NONE",
      }));
    }
  };

  return (
    <div className="debt-container-u">
      <h2 className="debt-title-u">추심 대상 계약</h2>
      <div className="debt-container-u-second">
        {contracts.length === 0 ? (
          <p>연체 상태의 계약이 없습니다.</p>
        ) : (
          <ul>
            {contracts.map((contract) => (
              <li key={contract.id} className="debt-list-u">
                <div>
                  <strong>📌 계약 ID:</strong> {contract.id} <br />
                </div>
                <div>
                  <strong>💰 대출 금액:</strong> {contract.loanAmount}원 <br />
                </div>
                <div>
                  <strong>📈 이자율:</strong> {contract.interestRate}% <br />
                </div>
                <div>
                  <strong>🚦 계약 상태:</strong>

                  <span className="debt-status-u">
                    {getStatusLabel(
                      contract.status?.toUpperCase() || "UNKNOWN"
                    )}
                  </span>
                </div>
                {isLender && (
                  <div className="debt-status-action">
                    {debtStatuses[contract.id] === "PENDING" ? (
                      <span className="debt-status-action-p">
                        ⏳ 추심 승인 대기 중
                      </span>
                    ) : debtStatuses[contract.id] === "APPROVED" ? (
                      <span className="debt-status-action-a">
                        ✅ 추심 승인 완료
                      </span>
                    ) : debtStatuses[contract.id] === "REJECTED" ? (
                      <span className="debt-status-action-r">
                        ❌ 추심 신청 거절
                      </span>
                    ) : (
                      <button
                        className="debt-start"
                        onClick={() => handleDebtRequest(contract.id, userId)}
                      >
                        ✅ 추심 신청
                      </button>
                    )}
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default DebtuserList;
