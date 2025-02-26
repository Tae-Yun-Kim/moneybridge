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
      const overdueContracts = data
        .filter((contract) => contract.status === "OVERDUE")
        .map((contract) => ({
          ...contract,
          borrowerId: contract.borrowerId, // ✅ 채무자 ID 추가
        }));

      setContracts(overdueContracts);
      fetchDebtStatuses(overdueContracts);
    } catch (error) {
      console.error("💥 연체 계약 목록 불러오기 중 오류 발생:", error);
    }
  };

  // ✅ 각 계약의 추심 상태 조회 및 채무자 ID 저장
  const fetchDebtStatuses = async (contracts) => {
    try {
      const debtStatusesMap = {};

      await Promise.all(
        contracts.map(async (contract) => {
          try {
            const response = await getDebtStatusByContract(contract.id);
            debtStatusesMap[contract.id] = {
              debtstatus: response.length > 0 ? response[0].debtstatus : "NONE",
              borrowerId: contract.borrowerId, // ✅ 채무자 ID 저장
            };
          } catch (error) {
            console.error(
              "💥 계약 ID ${contract.id}의 추심 상태 불러오기 실패",
              error
            );
            debtStatusesMap[contract.id] = {
              debtstatus: "NONE",
              borrowerId: contract.borrowerId || "정보 없음",
            };
          }
        })
      );

      setDebtStatuses(debtStatusesMap);
    } catch (error) {
      console.error("💥 추심 상태 불러오기 실패:", error);
    }
  };

  useEffect(() => {
    fetchContracts();
  }, [userId, isLender]);

  const handleDebtRequest = async (
    contractId,
    lenderId,
    borrowerId,
    loanAmount,
    interestRate
  ) => {
    try {
      // ✅ 추가 이자율 계산
      const extraInterestRate = interestRate / 100 + 0.5 * (interestRate / 100);

      // ✅ 추심금액 계산
      const debtAmount = Math.floor(
        loanAmount + loanAmount * extraInterestRate
      );

      setDebtStatuses((prev) => ({
        ...prev,
        [contractId]: {
          ...prev[contractId],
          debtstatus: "PENDING",
        },
      }));

      // ✅ 백엔드로 추가 이자율과 추심금액 함께 전달
      await requestDebtCollection(
        contractId,
        lenderId,
        borrowerId,
        debtAmount,
        extraInterestRate
      );

      alert(`✅ 계약 ${contractId}의 추심 요청이 관리자에게 전달되었습니다.`);

      fetchDebtStatuses([{ id: contractId, borrowerId }]); // ✅ 추심 상태 다시 확인
    } catch (error) {
      console.error("💥 추심 요청 중 오류 발생:", error);
      alert("❌ 추심 요청에 실패했습니다. 다시 시도해주세요.");

      setDebtStatuses((prev) => ({
        ...prev,
        [contractId]: {
          ...prev[contractId],
          debtstatus: "NONE",
        },
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
                  <strong>📈 추심금액:</strong>
                  {Math.floor(
                    contract.loanAmount +
                      contract.loanAmount *
                        (contract.interestRate / 100 +
                          0.5 * (contract.interestRate / 100))
                  )}
                  원 <br />
                </div>

                <div>
                  <strong>🚦 계약 상태:</strong>
                  <span className="debt-status-u">
                    {getStatusLabel(
                      contract.status?.toUpperCase() || "UNKNOWN"
                    )}
                  </span>
                </div>
                <div>
                  <strong>👤 채무자 ID:</strong>{" "}
                  {debtStatuses[contract.id]?.borrowerId || "정보 없음"} <br />
                </div>
                {isLender && (
                  <div className="debt-status-action">
                    {debtStatuses[contract.id]?.debtstatus === "PENDING" ? (
                      <span className="debt-status-action-p">
                        ⏳ 추심 승인 대기 중
                      </span>
                    ) : debtStatuses[contract.id]?.debtstatus === "APPROVED" ? (
                      <span className="debt-status-action-a">
                        ✅ 추심 승인 완료
                      </span>
                    ) : debtStatuses[contract.id]?.debtstatus === "REJECTED" ? (
                      <span className="debt-status-action-r">
                        ❌ 추심 신청 거절
                      </span>
                    ) : (
                      <button
                        className="debt-start"
                        onClick={() =>
                          handleDebtRequest(
                            contract.id,
                            userId,
                            contract.borrowerId,
                            contract.loanAmount,
                            contract.interestRate
                          )
                        }
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
