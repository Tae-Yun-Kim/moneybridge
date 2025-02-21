import { useEffect, useState } from "react";
import jwtAxios from "../../util/jwtUtil"; // ✅ 경로 확인 후 추가
import "./ContractProgressComponent.css"; // CSS 파일 import

import { useNavigate } from "react-router-dom";
import {
  getContractsByLender,
  getContractsByBorrower,
  approveContract,
  approveContractByLender,
  updateContractStatus,
  cancelContract,
  getContractContent,
  generateContractPDF,
  checkRepaymentAndComplete,
  repayLoan,
  rejectRepaymentExtension,
  approveRepaymentExtension,
  requestRepaymentExtension,
} from "../../api/contractApi";

import {
  transferBetweenWallets,
  createWalletTransaction,
} from "../../api/walletApi"; // ✅ 경로 확인 후 추가

import {
  createContractActiveNotification,
  createContractCancelledNotification,
  createContractApprovalNotification,
  createOverdueNotification, // ✅ 연체 알림 추가
  createContractCompletedNotification,
  requestRepaymentExtensionNotification,
  approveRepaymentExtensionNotification,
  rejectRepaymentExtensionNotification, // ✅ 계약 완료 알림 추가
} from "../../api/notificationApi";

const ContractProgressComponent = ({ userId, isLender }) => {
  const [contracts, setContracts] = useState([]);
  const [contractContents, setContractContents] = useState({}); // ✅ 계약서 내용 개별 관리
  const [loadingPDF, setLoadingPDF] = useState({});
  const [expandedContracts, setExpandedContracts] = useState({}); // ✅ 접힘/펼침 상태 관리
  const [months, setMonths] = useState(1);
  // ✅ 연장 요청 입력창 표시 여부
  const [showExtensionInput, setShowExtensionInput] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  // ✅ 계약 상태를 한글로 변환하는 함수
  const getStatusLabel = (status) => {
    switch (status) {
      case "PENDING":
        return "⏳ 출자자 선택 대기";
      case "WAITING_FOR_APPROVAL":
        return "🔍 대출자 승인 대기";
      case "ACTIVE":
        return "✅ 진행 중 (대출 실행)";
      case "COMPLETED":
        return "🎉 계약 완료 (상환 완료)";
      case "OVERDUE":
        return "⚠️ 연체 상태";
      case "CANCELLED":
        return "❌ 계약 취소됨";
      default:
        return "❓ 알 수 없는 상태";
    }
  };

  //계좌 잰액 조회용
  const fetchWalletBalance = async () => {
    try {
      const response = await jwtAxios.get(`/api/wallet/${userId}`);
      console.log("🔄 지갑 잔액 갱신:", response.data.balance);
      // 필요하면 상태 업데이트
    } catch (error) {
      console.error("지갑 잔액 조회 실패:", error);
    }
  };

  // ✅ [자동 상환 확인] 대출자(isLender=false)일 때만 수행
  const fetchContracts = async () => {
    try {
      const data = isLender
        ? await getContractsByLender(userId) // 출자자: 계약만 조회
        : await getContractsByBorrower(userId); // 대출자: 계약 조회 후 상환 확인

      // ✅ "COMPLETED" 및 "CANCELLED" 상태 제외
      const filteredContracts = data.filter(
        (contract) =>
          contract.status !== "COMPLETED" && contract.status !== "CANCELLED"
      );

      setContracts(filteredContracts);

      // ✅ isLender = false (대출자)일 때만 자동 상환 확인
      if (!isLender) {
        for (const contract of filteredContracts) {
          if (contract.status === "ACTIVE") {
            try {
              const result = await checkRepaymentAndComplete(
                contract.id, // 계약 ID
                false // ✅ isLender 전달
              );
              if (result.status === "COMPLETED") {
                alert(`🎉 계약 ${contract.id}가 자동 상환 처리되었습니다.`);
                fetchContracts(); // 상태 재조회
              }
            } catch (error) {
              console.error(
                `💥 계약 ${contract.id} 자동 상환 확인 실패:`,
                error.response?.data || error.message
              );
            }
          }
        }
      }
    } catch (error) {
      console.error("💥 계약 목록 불러오기 중 오류 발생:", error);
    }
  };

  // ✅ useEffect에서 자동 상환 확인 포함
  useEffect(() => {
    fetchContracts();
  }, [userId, isLender]);

  // ✅ 대출자가 계약 승인 (WAITING_FOR_APPROVAL 상태로 변경)
  const handleApproveContract = async (
    contractId,
    loanPostId,
    navigateImmediately = false
  ) => {
    try {
      const hasActiveContract = contracts.some(
        (c) =>
          c.loanPostId === loanPostId &&
          ["ACTIVE", "WAITING_FOR_APPROVAL", "OVERDUE"].includes(c.status)
      );

      if (hasActiveContract) {
        alert("이미 진행 중인 계약이 있어 승인할 수 없습니다.");
        return;
      }

      await approveContract(contractId, userId);
      alert(" 계약이 승인되었습니다!\n잠시 후 계약서 페이지로 이동됩니다.");

      if (navigateImmediately) {
        navigate(`/contract/${contractId}`);
      } else {
        fetchContracts();
      }
    } catch (error) {
      console.error("계약 승인 오류:", error);
    }
  };

  // ✅ 출자자가 최종 계약 승인 (계약 상태: ACTIVE) 후 계약서 페이지로 이동

  const approveContractByLender = async (
    contractId,
    lenderId,
    borrowerId,
    loanAmount
  ) => {
    try {
      // ✅ 계약 승인 API 호출
      const response = await approveContractByLender(contractId, lenderId);

      // ✅ 출자자의 지갑에서 대출자의 지갑으로 송금
      await transferBetweenWallets(lenderId, borrowerId, loanAmount);

      // ✅ 거래 내역 저장
      await createWalletTransaction({
        fromWalletId: lenderId,
        toWalletId: borrowerId,
        amount: loanAmount,
        transactionType: "LOAN_DISBURSEMENT",
      });

      // ✅ 상태 업데이트: 기존 계약 목록에서 승인된 계약 업데이트
      setContracts((prevContracts) =>
        prevContracts.map((contract) =>
          contract.id === contractId ? response.data : contract
        )
      );

      // ✅ 출자자의 지갑 잔액을 다시 불러오기
      await fetchWalletBalance();

      alert("출자자가 최종 승인을 완료하였습니다! (상태: ACTIVE)");

      // ✅ 계약서 페이지로 이동 (조금 늦게 이동)
      setTimeout(() => navigate(`/contract/${contractId}`), 500);
    } catch (error) {
      console.error("최종 계약 승인 오류:", error);
      alert("최종 계약 승인 중 문제가 발생했습니다.");
    }
  };

  // ✅ 특정 계약 ID의 접힘/펼침 상태 토글
  const toggleExpand = (contractId) => {
    setExpandedContracts((prev) => ({
      ...prev,
      [contractId]: !prev[contractId],
    }));
  };

  // ✅ 계약 상태 업데이트 (예: COMPLETED, OVERDUE)
  const handleUpdateStatus = async (contractId, newStatus) => {
    try {
      // 계약 객체에서 borrowerId 가져오기
      const contract = contracts.find((c) => c.id === contractId);

      const borrowerId = contract.borrowerId;

      await updateContractStatus(contractId, newStatus);
      alert(`계약 상태가 ${newStatus}로 변경되었습니다.`);

      // ✅ 연체 상태로 변경 시 대출자에게 알림 전송
      if (newStatus === "OVERDUE") {
        await createOverdueNotification(borrowerId, contractId);
      }

      // ✅ 계약 완료 상태로 변경 시 대출자에게 알림 전송
      if (newStatus === "COMPLETED") {
        await createContractCompletedNotification(borrowerId);
      }
      fetchContracts();
    } catch (error) {
      console.error("계약 상태 변경 오류:", error);
    }
  };

  // ✅ 계약 취소
  const handleCancelContract = async (contractId) => {
    if (!window.confirm("정말로 계약을 취소하시겠습니까?")) return;
    try {
      await cancelContract(contractId);
      alert("계약이 취소되었습니다.");

      // ✅ 계약 취소 알림 생성 API 호출 안해도 됨 백에서 처리

      fetchContracts();
    } catch (error) {
      console.error("계약 취소 오류:", error);
    }
  };

  // ✅ 자동 상환 (대출자 전용)
  const handleRepayLoan = async (contractId) => {
    try {
      const contract = contracts.find((c) => c.id === contractId);

      const borrowerId = contract.borrowerId;

      const lenderId = contract.lenderId;

      // ✅ 계약 완료 상태로 변경 시 대출자에게 알림 전송
      await createContractCompletedNotification(borrowerId);

      await createContractCompletedNotification(lenderId);

      const result = await repayLoan(contractId, userId);
      alert(
        `계약 ${contractId}번의 상환이 완료되었습니다!\n계약이 정상적으로 종료되었습니다.`
      );

      fetchContracts();
    } catch (error) {
      console.error(" 자동 상환 실패:", error);

      // 🔹 에러 메시지를 안전하게 가져오기
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        " 지갑에 잔액이 부족합니다";

      // 🔹 메시지 내용에 '잔액 부족' 포함 여부 확인
      if (errorMessage.includes("잔액 부족")) {
        alert("🚨 상환 실패: 지갑에 잔액이 부족합니다.");
      } else {
        alert(`💥 자동 상환 실패: ${errorMessage}`);
      }
    }
  };

  // ✅ 대출자 - 상환 기간 연장 요청 (2회 제한)
  const handleRequestExtension = async (contractId, borrowerId) => {
    if (!contractId || !borrowerId) {
      alert("❌ 계약 ID 또는 대출자 ID가 설정되지 않았습니다.");
      return;
    }

    // 🔹 요청 횟수 제한: 최대 2회
    const contract = contracts.find((c) => c.id === contractId);
    if (contract.extensionRequestCount >= 2) {
      alert("⚠️ 상환 연장 요청은 최대 2회까지만 가능합니다.");
      return;
    }

    // 🔹 입력값 검증: 1 이상 정수만 허용
    if (!Number.isInteger(months) || months <= 0) {
      alert("❌ 연장 개월 수는 1 이상의 정수만 입력 가능합니다.");
      return;
    }

    if (isLoading) {
      alert("⚠️ 요청이 이미 진행 중입니다. 잠시만 기다려주세요.");
      return;
    }

    // 🚨 이자율 두 배 적용 경고 추가
    const confirmExtension = window.confirm(
      "⚠️ 상환 기간을 연장하면 이자율이 기존의 두 배로 적용됩니다.\n정말로 연장 신청을 진행하시겠습니까?"
    );
    if (!confirmExtension) {
      alert("❌ 연장 신청이 취소되었습니다.");
      return;
    }

    setIsLoading(true);

    try {
      await requestRepaymentExtension(contractId, months, borrowerId);

      const lenderId = contract.lenderId;

      // 출자자에게 상환 기간 연장 요청 알림
      await requestRepaymentExtensionNotification(lenderId);

      alert(`✅ ${months}개월 상환 기간 연장 요청 성공!`);

      // ✅ 연장 요청 후 계약 리스트 갱신
      fetchContracts();

      // ✅ 입력창 초기화
      setShowExtensionInput(false);
      setMonths(1);
    } catch (error) {
      console.error("💥 상환 기간 연장 요청 실패:", error);
      alert("💥 상환 기간 연장 요청 실패!");
    } finally {
      setIsLoading(false);
    }
  };

  // ✅ 출자자 - 상환 기간 연장 요청 승인
  const handleApproveExtension = async (contractId, lenderId) => {
    if (!contractId || !lenderId) {
      alert("❌ 계약 ID 또는 출자자 ID가 설정되지 않았습니다.");
      return;
    }

    const contract = contracts.find((c) => c.id === contractId);
    if (contract.extensionRequestCount >= 2) {
      alert("⚠️ 이미 최대 2회 연장 요청이 처리되었습니다.");
      return;
    }

    if (isLoading) {
      alert("⚠️ 요청이 이미 진행 중입니다. 잠시만 기다려주세요.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await approveRepaymentExtension(contractId, lenderId);

      const borrowerId = contract.borrowerId;

      // 대출자에게 상환 기간 연장 승인 알림
      await approveRepaymentExtensionNotification(borrowerId);

      alert(`✅ 상환 기간 연장 요청이 승인되었습니다!`);

      // 🔹 계약 목록 갱신
      fetchContracts();
    } catch (error) {
      console.error("💥 연장 요청 승인 실패:", error);
      alert("💥 연장 요청 승인 실패! 다시 시도해 주세요.");
    } finally {
      setIsLoading(false);
    }
  };

  // ✅ 출자자 - 상환 기간 연장 요청 거절
  const handleRejectExtension = async (contractId, lenderId) => {
    if (!contractId || !lenderId) {
      alert("🚨 계약 ID 또는 출자자 ID가 올바르지 않습니다!");
      return;
    }

    const contract = contracts.find((c) => c.id === contractId);
    if (contract.extensionRequestCount >= 2) {
      alert("⚠️ 이미 최대 2회 연장 요청이 처리되었습니다.");
      return;
    }

    if (isLoading) {
      alert("⚠️ 요청이 이미 진행 중입니다. 잠시만 기다려주세요.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await rejectRepaymentExtension(contractId, lenderId);

      const borrowerId = contract.borrowerId;

      // 대출자에게 상환 기간 연장 거절 알림
      await rejectRepaymentExtensionNotification(borrowerId);

      alert("❌ 연장 요청이 거절되었습니다.");

      // ✅ 거절 시 카운트 증가
      contract.extensionRequestCount += 1;

      // 🔹 계약 목록 갱신
      fetchContracts();
    } catch (error) {
      console.error("💥 연장 요청 거절 실패:", error);
      alert("💥 연장 요청 거절 실패!");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="contract-list-container">
      <h2 className="contract-title">계약 진행 현황</h2>

      {contracts.length === 0 ? (
        <p>계약이 없습니다.</p>
      ) : (
        <ul>
          {contracts.map((contract) => {
            const totalRepayment = Math.floor(
              contract.loanAmount +
                (contract.loanAmount * contract.interestRate) / 100
            );

            return (
              <li key={contract.id} className="contract-item">
                {/* ✅ 접힌 상태에서는 계약 ID와 대출 금액만 표시 */}
                <div
                  className="contract-summary"
                  onClick={() => toggleExpand(contract.id)}
                >
                  <p>📌 계약 번호: {contract.id}</p>
                  <p>
                    💰 대출 금액:{" "}
                    <span className="contract-amount">
                      {contract.loanAmount.toLocaleString()} 원
                    </span>
                  </p>
                  <button
                    className={`toggle-icon ${
                      expandedContracts[contract.id] ? "open" : ""
                    }`}
                  >
                    {expandedContracts[contract.id] ? "접기" : "펼치기"}
                  </button>
                </div>

                {/* ✅ 클릭 시 세부 정보 펼침 */}
                {expandedContracts[contract.id] && (
                  <div className="contract-details">
                    <p className="contract-info">
                      📈 이자율: {contract.interestRate}%
                    </p>
                    <p className="contract-info">
                      💳 총 상환 금액:{" "}
                      <span className="contract-total-amount">
                        {totalRepayment.toLocaleString()} 원
                      </span>
                    </p>
                    <p className="contract-info">
                      🕒 상환 기간: {contract.repaymentPeriod}개월
                    </p>
                    <p className="contract-info">
                      현재 상태:{" "}
                      <span
                        className={`contract-status status-${contract.status.toLowerCase()}`}
                      >
                        {getStatusLabel(contract.status)}
                      </span>
                    </p>

                    {/* PENDING 상태에서 채무자만 계약 승인 가능 */}
                    {contract.status === "PENDING" && !isLender && (
                      <button
                        onClick={() =>
                          handleApproveContract(
                            contract.id,
                            contract.loanPostId,
                            true
                          )
                        }
                        className="contract-button btn-approve"
                      >
                        계약 진행하기
                      </button>
                    )}

                    {/* ✅ 출자자 전용 최종 승인 버튼 (계약서 작성 후 ACTIVE 처리) */}
                    {contract.status === "WAITING_FOR_APPROVAL" && isLender && (
                      <button
                        onClick={() => navigate(`/contract/${contract.id}`)}
                        className="contract-button btn-wating"
                      >
                        최종 승인 (계약서 작성)
                      </button>
                    )}

                    {/* PENDING 상태에서 계약 취소 가능 */}
                    {contract.status === "PENDING" && (
                      <button
                        onClick={() => handleCancelContract(contract.id)}
                        className="contract-button btn-cancel"
                      >
                        계약 취소
                      </button>
                    )}

                    {/* 💸 자동 상환 버튼 (대출자 전용) */}
                    {!isLender && contract.status === "ACTIVE" && (
                      <button
                        onClick={() => handleRepayLoan(contract.id)}
                        className="contract-button btn-auto"
                      >
                        💸 자동 상환
                      </button>
                    )}

                    {/* 🔹 대출자용 버튼 (ACTIVE 상태일 때만) */}
                    {!isLender && contract.status === "ACTIVE" && (
                      <div className="contract-ex">
                        {contract.extendRepaymentRequested ? (
                          <span className="contract-info">
                            📡 상환 연장 요청 진행 중...
                          </span>
                        ) : !showExtensionInput ? (
                          <button
                            onClick={() => setShowExtensionInput(true)}
                            className="contract-button btn-ex"
                          >
                            ⏳ 상환 기간 연장 요청
                          </button>
                        ) : (
                          <>
                            <input
                              type="number"
                              value={months}
                              onChange={(e) =>
                                setMonths(Number(e.target.value))
                              }
                              className="month-late"
                              min="1"
                              placeholder="연장 개월 수"
                              disabled={isLoading}
                            />
                            <button
                              onClick={() =>
                                handleRequestExtension(
                                  contract.id,
                                  contract.borrowerId
                                )
                              }
                              className={`contract-button ${
                                isLoading
                                  ? "contract-button"
                                  : "contract-button"
                              }`}
                              disabled={isLoading}
                            >
                              {isLoading ? "요청 중..." : "요청"}
                            </button>
                            <button
                              onClick={() => setShowExtensionInput(false)}
                              className="contract-button"
                            >
                              취소
                            </button>
                          </>
                        )}
                      </div>
                    )}

                    {/* 🔹 출자자용 버튼 (ACTIVE 상태 & 연장 요청 시에만) */}
                    {isLender &&
                      contract.status === "ACTIVE" &&
                      contract.extensionRequestCount < 2 &&
                      contract.extendRepaymentRequested && ( // 🔍 요청이 존재할 때만 표시
                        <div className="flex gap-2">
                          <button
                            onClick={() =>
                              handleApproveExtension(
                                contract.id,
                                contract.lenderId
                              )
                            }
                            className="contract-button"
                          >
                            ✅ 연장 요청 승인
                          </button>
                          <button
                            onClick={() =>
                              handleRejectExtension(
                                contract.id,
                                contract.lenderId
                              )
                            }
                            className="contract-button"
                          >
                            ❌ 연장 요청 거절
                          </button>
                        </div>
                      )}

                    {/* ACTIVE 상태에서 출자자가 계약 완료 가능
                    {isLender && contract.status === "ACTIVE" && (
                      <>
                        <button
                          onClick={() =>
                            handleUpdateStatus(contract.id, "COMPLETED")
                          }
                          className="contract-button btn-complete"
                        >
                          ✅ 계약 완료
                        </button>
                        <button
                          onClick={() =>
                            handleUpdateStatus(contract.id, "OVERDUE")
                          }
                          className="contract-button btn-overdue"
                        >
                          연체 처리
                        </button>
                      </>
                    )} */}
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};
export default ContractProgressComponent;
