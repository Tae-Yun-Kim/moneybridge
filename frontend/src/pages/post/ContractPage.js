import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getContractContent } from "../../api/contractApi";
import TermsAgreement from "../../components/post/TermsAgreement";

const ContractPage = () => {
  const { contractId } = useParams();
  const [contractContent, setContractContent] = useState("");
  const [isLender, setIsLender] = useState(false);
  const [userId, setUserId] = useState("");
  const [isAgreed, setIsAgreed] = useState(false);

  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    const storedIsLender = localStorage.getItem("isLender") === "true";

    if (!storedUserId) {
      alert("로그인이 필요합니다.");
      window.location.href = "/login";
      return;
    }

    setUserId(storedUserId);
    setIsLender(storedIsLender);
    fetchContractContent(storedUserId, storedIsLender);
  }, [contractId]);

  const fetchContractContent = async (userId, isLender) => {
    try {
      const content = await getContractContent(contractId, userId, isLender);
      setContractContent(content || "계약서 내용을 불러올 수 없습니다.");
    } catch (error) {
      console.error("계약서 내용을 불러오는 중 오류 발생:", error);
    }
  };

  const handleCompleteContract = () => {
    if (!isAgreed) {
      alert("약관에 모두 동의해야 계약을 진행할 수 있습니다.");
      return;
    }
    alert("계약서 작성이 완료되었습니다.");
    window.location.href = "/MyPage";
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-lg mt-6">
      <h1 className="text-2xl font-bold mb-4">📜 계약서</h1>

      {/* ✅ 계약서 내용 표시 */}
      <div className="border p-4 bg-gray-100 rounded-md mb-4">
        <h2 className="text-lg font-semibold">계약서 내용</h2>
        <pre className="whitespace-pre-wrap">{contractContent}</pre>
      </div>

      {/* ✅ 출자자는 최종 승인 단계에서만 동의하도록 설정 */}
      {(!isLender ||
        (isLender && window.location.pathname.includes("approve"))) && (
        <TermsAgreement onAgree={setIsAgreed} isLender={isLender} />
      )}

      {/* ✅ 계약서 작성 완료 버튼 (출자자도 최종 승인 단계에서만 가능) */}
      <div className="mt-6 text-center">
        <button
          className={`px-6 py-2 rounded-md text-white ${
            isAgreed
              ? "bg-blue-500 hover:bg-blue-600"
              : "bg-gray-400 cursor-not-allowed"
          }`}
          onClick={handleCompleteContract}
          disabled={!isAgreed}
        >
          계약서 작성 완료
        </button>
      </div>
    </div>
  );
};

export default ContractPage;
