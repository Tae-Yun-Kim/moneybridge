import jwtAxios from "../../util/jwtUtil";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import BasicLayout from "../../layouts/BasicLayout";
import {
  getContractsByLender,
  getContractsByBorrower,
  getContractContent,
  softDeleteContract,
  generateContractPDF, // ✅ 계약 숨김 API 추가
} from "../../api/contractApi";
import "./ContractHistoryPage.css";

const ContractHistoryPage = () => {
  const [contracts, setContracts] = useState([]);
  const [contractContents, setContractContents] = useState({});
  const [expandedContract, setExpandedContract] = useState(null);
  const navigate = useNavigate();

  const userId = localStorage.getItem("userId");
  const isLender = localStorage.getItem("isLender") === "true";

  // ✅ 계약 내역 가져오기 (완료된 계약과 취소된 계약만 필터링)
  const fetchContracts = async () => {
    try {
      const data = isLender
        ? await getContractsByLender(userId)
        : await getContractsByBorrower(userId);

      // ✅ "deletedByUsers" 필드를 사용하여 현재 사용자가 삭제한 계약 숨김
      const filteredContracts = data.filter((contract) => {
        const deletedUsers = contract.deletedByUsers?.split(",") || [];
        return (
          ["COMPLETED", "CANCELLED"].includes(contract.status) &&
          !deletedUsers.includes(userId) // ✅ 현재 사용자가 삭제한 계약 숨김
        );
      });

      console.log("📜 계약 내역 (숨김 제외):", filteredContracts);
      setContracts(filteredContracts);
    } catch (error) {
      console.error("💥 계약 내역 조회 오류:", error);
    }
  };

  useEffect(() => {
    fetchContracts();
  }, [userId, isLender]);

  // ✅ 특정 계약의 계약서 내용 조회
  const fetchContractContent = async (contractId) => {
    try {
      const content = await getContractContent(contractId, userId, isLender);
      setContractContents((prev) => ({
        ...prev,
        [contractId]: content || "계약서 내용을 불러올 수 없습니다.",
      }));
    } catch (error) {
      console.error("💥 계약서 조회 오류:", error);
    }
  };

  // ✅ PDF 다운로드 처리
  // const handleDownloadPDF = async (contractId) => {
  //   localStorage.setItem("contractId", contractId);
  //   try {
  //     await generateContractPDF(contractId, userId, isLender);
  //   } catch (error) {
  //     console.error("❌ PDF 다운로드 실패:", error);
  //   }
  // };
  const handleDownloadPDF = async (contractId) => {
    localStorage.setItem("contractId", contractId);
    try {
      // 서버에서 파일 경로를 반환받고
      const filePath = await generateContractPDF(contractId, userId, isLender);

      // 파일 다운로드 링크 생성
      const link = document.createElement("a");
      link.href = filePath; // 서버에서 반환한 파일 경로를 사용
      link.download = "contract.pdf"; // 파일 이름 설정
      link.click(); // 파일 다운로드 시작

      console.log("✅ 계약서 PDF 다운로드 완료");
    } catch (error) {
      console.error("❌ PDF 다운로드 실패:", error);
    }
  };

  // ✅ 리스트에서 계약 삭제 (백엔드에서 숨김 처리)
  const handleDeleteContractFromList = async (contractId) => {
    if (!window.confirm("이 계약을 리스트에서 삭제하시겠습니까?")) return;

    try {
      await softDeleteContract(contractId, userId); // ✅ 백엔드에 삭제 요청

      // ✅ UI에서 바로 반영 (새로고침 필요 없이 적용)
      setContracts((prevContracts) =>
        prevContracts.filter((contract) => contract.id !== contractId)
      );

      alert("계약이 삭제되었습니다.");
    } catch (error) {
      console.error("💥 계약 삭제 처리 오류:", error);
      alert("계약 삭제 중 오류가 발생했습니다.");
    }
  };

  // ✅ 펼치기/접기 기능
  const toggleContract = (contractId) => {
    setExpandedContract(expandedContract === contractId ? null : contractId);
  };

  return (
    <BasicLayout>
      <div className="contract-container-h">
        <h1 className="contract-title-h">📜 계약 내역</h1>

        {contracts.length === 0 ? (
          <p className="no-contracts-h">
            완료되거나 취소된 계약 내역이 없습니다.
          </p>
        ) : (
          <div className="contract-list-h">
            {contracts.map((contract) => (
              <div key={contract.id} className="contract-card-h">
                {/* 상단 요약 정보 */}
                <div className="contract-summary-h">
                  <p className="contract-id-h">📌 계약 번호: {contract.id}</p>
                  <p className="contract-amount-h">
                    💰 대출 금액: {contract.loanAmount.toLocaleString()} 원
                  </p>
                  <button
                    className="toggle-btn-h"
                    onClick={() => toggleContract(contract.id)}
                  >
                    {expandedContract === contract.id ? "접기" : "펼치기"}
                  </button>
                </div>

                {/* 펼쳐진 상세 정보 */}
                {expandedContract === contract.id && (
                  <div className="contract-det">
                    <div className="contract-details">
                      <p>📈 이자율: {contract.interestRate}%</p>
                      <p>🕒 상환 기간: {contract.repaymentPeriod}개월</p>
                      <p>
                        🚦 계약 상태:{" "}
                        <span
                          className={`contract-status-h ${
                            contract.status === "COMPLETED"
                              ? "completed"
                              : "cancelled"
                          }`}
                        >
                          {contract.status === "COMPLETED"
                            ? "✅ 완료됨"
                            : "❌ 취소됨"}
                        </span>
                      </p>

                      <div className="contract-actions-h">
                        <button
                          className="view-btn-h"
                          onClick={() => fetchContractContent(contract.id)}
                        >
                          📜 계약서 보기
                        </button>

                        <button
                          className="pdf-btn-h"
                          onClick={() => handleDownloadPDF(contract.id)}
                        >
                          📄 PDF 다운로드
                        </button>
                        <button
                          className="delete-btn-h"
                          onClick={() =>
                            handleDeleteContractFromList(contract.id)
                          }
                        >
                          🗑️ 계약 삭제
                        </button>
                      </div>

                      {/* ✅ 계약서 내용 표시 및 닫기 버튼 */}
                      {contractContents[contract.id] && (
                        <div className="contract-info">
                          {/* ✅ HTML 내용을 올바르게 렌더링 */}
                          <div
                            className="whitespace-pre-wrap"
                            dangerouslySetInnerHTML={{
                              __html: contractContents[contract.id],
                            }}
                          ></div>

                          <button
                            onClick={() =>
                              setContractContents((prev) => {
                                const newContents = { ...prev };
                                delete newContents[contract.id];
                                return newContents;
                              })
                            }
                            className="contract-close"
                          >
                            계약서 닫기
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* 마이페이지 이동 버튼 */}
        <div className="back-to-mypage-h">
          <button onClick={() => navigate("/member/mypage")}>
            마이페이지로 돌아가기
          </button>
        </div>
      </div>
    </BasicLayout>
  );
};

export default ContractHistoryPage;
