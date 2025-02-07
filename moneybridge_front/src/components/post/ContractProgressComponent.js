import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getContractsByLender,
  getContractsByBorrower,
  approveContract,
  approveContractByLender,
  updateContractStatus,
  cancelContract,
  getContractContent, // ✅ 계약서 내용 조회 API 추가
} from "../../api/contractApi";

const ContractProgressComponent = ({ userId, isLender }) => {
  const [contracts, setContracts] = useState([]);
  const [contractContents, setContractContents] = useState({}); // ✅ 계약서 내용 개별 관리
  const navigate = useNavigate();

  // ✅ 계약 목록 가져오기
  const fetchContracts = async () => {
    try {
      const data = isLender
        ? await getContractsByLender(userId)
        : await getContractsByBorrower(userId);
      setContracts(data);
    } catch (error) {
      console.error("계약 목록을 불러오는 중 오류 발생:", error);
    }
  };

  useEffect(() => {
    fetchContracts();
  }, [userId, isLender]);

  // ✅ 특정 계약의 계약서 내용 조회 (출자자 또는 대출자)
  const fetchContractContent = async (contractId) => {
    try {
      const content = await getContractContent(contractId, userId, isLender);
      setContractContents({
        [contractId]: content || "계약서 내용을 불러올 수 없습니다.",
      });
    } catch (error) {
      console.error("계약서 내용을 불러오는 중 오류 발생:", error);
    }
  };

  // ✅ 출자자가 대출자가 작성한 계약서를 조회하는 기능
  const fetchBorrowerContractContent = async (contractId, borrowerId) => {
    try {
      const content = await getContractContent(contractId, borrowerId, false);
      setContractContents({
        [contractId]:
          content || "대출자가 작성한 계약서 내용을 불러올 수 없습니다.",
      });
    } catch (error) {
      console.error("대출자 계약서 내용을 불러오는 중 오류 발생:", error);
    }
  };

  // ✅ 대출자가 계약 승인 (WAITING_FOR_APPROVAL 상태로 변경)
  // const handleApproveContract = async (contractId) => {
  //   try {
  //     await approveContract(contractId, userId);
  //     alert("계약이 승인되었습니다.");
  //     fetchContracts();
  //   } catch (error) {
  //     console.error("계약 승인 오류:", error);
  //   }
  // };
  const handleApproveContract = async (contractId, loanPostId) => {
    try {
      const hasActiveContract = contracts.some(
        (c) =>
          c.loanPostId === loanPostId &&
          ["ACTIVE", "WAITING_FOR_APPROVAL", "COMPLETED"].includes(c.status)
      );
      if (hasActiveContract) {
        alert("이미 진행 중인 계약이 있어 승인할 수 없습니다.");
        return;
      }
      await approveContract(contractId, userId);
      alert("계약이 승인되었습니다.");
      fetchContracts();
    } catch (error) {
      console.error("계약 승인 오류:", error);
    }
  };

  // ✅ 출자자가 최종 계약 승인 (계약 상태: ACTIVE)
  const handleLenderApproveContract = async (contractId) => {
    try {
      await approveContractByLender(contractId, userId);
      alert("출자자가 최종 승인을 완료하였습니다! (상태: ACTIVE)");
      fetchContracts();
    } catch (error) {
      console.error("최종 계약 승인 오류:", error);
      alert("최종 계약 승인 중 문제가 발생했습니다.");
    }
  };

  // ✅ 계약 작성 페이지로 이동 (대출자만 가능)
  // const handleGoToContractPage = (contractId) => {
  //   navigate(`/contract/${contractId}`);
  // };
  const handleGoToContractPage = (contractId, loanPostId) => {
    const hasActiveContract = contracts.some(
      (c) =>
        c.loanPostId === loanPostId &&
        ["ACTIVE", "WAITING_FOR_APPROVAL", "COMPLETED"].includes(c.status)
    );
    if (hasActiveContract) {
      alert("이미 진행 중인 계약이 있어 계약서를 작성할 수 없습니다.");
      return;
    }
    navigate(`/contract/${contractId}`);
  };

  // ✅ 계약 상태 업데이트 (예: COMPLETED, OVERDUE)
  const handleUpdateStatus = async (contractId, newStatus) => {
    try {
      await updateContractStatus(contractId, newStatus);
      alert(`계약 상태가 ${newStatus}로 변경되었습니다.`);
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
      fetchContracts();
    } catch (error) {
      console.error("계약 취소 오류:", error);
    }
  };

  return (
    <div className="border-2 border-gray-300 p-4 rounded-md">
      <h2 className="text-xl font-bold mb-4">📜 계약 진행 현황</h2>

      {contracts.length === 0 ? (
        <p>계약이 없습니다.</p>
      ) : (
        <ul>
          {contracts.map((contract) => (
            <li key={contract.id} className="p-4 border-b border-gray-200">
              <strong>📌 계약 ID:</strong> {contract.id} <br />
              <strong>💰 대출 금액:</strong> {contract.loanAmount}원 <br />
              <strong>📈 이자율:</strong> {contract.interestRate}% <br />
              <strong>🕒 상환 기간:</strong> {contract.repaymentPeriod}개월{" "}
              <br />
              <strong>🚦 현재 상태:</strong>{" "}
              <span className="font-bold text-blue-500">{contract.status}</span>
              <br />
              {/* ✅ 계약서 내용 보기 버튼 */}
              <button
                onClick={() => fetchContractContent(contract.id)}
                className="px-4 py-1 bg-gray-600 text-white rounded-md mt-2"
              >
                계약서 보기
              </button>
              {/* ✅ 출자자가 대출자가 작성한 계약서 보기 버튼 */}
              {contract.status === "WAITING_FOR_APPROVAL" && isLender && (
                <button
                  onClick={() =>
                    fetchBorrowerContractContent(
                      contract.id,
                      contract.borrowerId
                    )
                  }
                  className="px-4 py-1 bg-gray-600 text-white rounded-md mt-2 ml-2"
                >
                  대출자가 작성한 계약서 보기
                </button>
              )}
              {/* ✅ 계약서 내용 표시 (선택된 계약서만 보이도록 설정) */}
              {contractContents[contract.id] && (
                <div className="mt-4 p-4 bg-gray-100 rounded-md">
                  <h3 className="text-lg font-semibold">📜 계약서 내용</h3>
                  <pre className="whitespace-pre-wrap">
                    {contractContents[contract.id]}
                  </pre>
                </div>
              )}
              {/* ✅ 계약 승인 버튼 (대출자만 가능) */}
              {contract.status === "PENDING" && !isLender && (
                <button
                  onClick={() => handleApproveContract(contract.id)}
                  className="px-4 py-1 bg-green-500 text-white rounded-md mt-2"
                >
                  계약 진행하기
                </button>
              )}
              {/* ✅ 계약서 작성 페이지로 이동 버튼 (대출자만 가능) */}
              {contract.status === "WAITING_FOR_APPROVAL" && !isLender && (
                <button
                  onClick={() => handleGoToContractPage(contract.id)}
                  className="px-4 py-1 bg-blue-500 text-white rounded-md mt-2"
                >
                  계약서 작성
                </button>
              )}
              {/* ✅ 최종 승인 (출자자만 가능) */}
              {contract.status === "WAITING_FOR_APPROVAL" && isLender && (
                <button
                  onClick={() => handleLenderApproveContract(contract.id)}
                  className="px-4 py-1 bg-blue-500 text-white rounded-md mt-2"
                >
                  최종 승인
                </button>
              )}
              {/* ✅ 계약 완료 처리 (출자자만 가능) */}
              {contract.status === "ACTIVE" && isLender && (
                <button
                  onClick={() => handleUpdateStatus(contract.id, "COMPLETED")}
                  className="px-4 py-1 bg-green-500 text-white rounded-md mt-2"
                >
                  계약 완료 처리
                </button>
              )}
              {/* ✅ 계약 취소 (PENDING 상태일 때만 가능) */}
              {contract.status === "PENDING" && (
                <button
                  onClick={() => handleCancelContract(contract.id)}
                  className="px-4 py-1 bg-gray-500 text-white rounded-md mt-2"
                >
                  계약 취소
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ContractProgressComponent;
