// import { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import {
//   getContractContent,
//   approveContractByLender,
//   updateContractStatus,
// } from "../../api/contractApi"; // ✅ PDF API 추가
// import TermsAgreement from "../../components/contract/TermsAgreement";
// import BasicLayout from "../../layouts/BasicLayout";
// import "./ContractPage.css";

// const ContractPage = () => {
//   const { contractId } = useParams();
//   const navigate = useNavigate();
//   const [contractContent, setContractContent] = useState("");
//   const [isLender, setIsLender] = useState(false);
//   const [userId, setUserId] = useState("");
//   const [isAgreed, setIsAgreed] = useState(false);

//   useEffect(() => {
//     const storedUserId = localStorage.getItem("userId");
//     const storedIsLender = localStorage.getItem("isLender") === "true";

//     if (!storedUserId) {
//       alert("로그인이 필요합니다.");
//       navigate("/login");
//       return;
//     }

//     setUserId(storedUserId);
//     setIsLender(storedIsLender);
//     fetchContractContent(storedUserId, storedIsLender);
//   }, [contractId, navigate]);

//   const fetchContractContent = async (userId, isLender) => {
//     try {
//       console.log("📡 계약서 내용 요청:", { contractId, userId, isLender }); // ✅ API 요청 확인
//       const content = await getContractContent(contractId, userId, isLender);
//       console.log("📄 계약서 응답 데이터:", content); // ✅ 응답 데이터 확인
//       setContractContent(content || "계약서 내용을 불러올 수 없습니다.");
//     } catch (error) {
//       console.error("❌ 계약서 내용을 불러오는 중 오류 발생:", error);
//     }
//   };

//   // ✅ 계약 상태 업데이트 함수 추가 (WAITING_FOR_APPROVAL → ACTIVE)
//   const updateContractToActive = async () => {
//     try {
//       await updateContractStatus(contractId, "ACTIVE");
//       alert("🚀 계약 상태가 'ACTIVE'로 변경되었습니다.");
//     } catch (error) {
//       console.error(
//         "❌ 계약 상태 업데이트 중 오류 발생:",
//         error.response?.data || error
//       );
//       alert("계약 상태 업데이트 중 문제가 발생했습니다.");
//     }
//   };

//   // ✅ 계약서 작성 완료 처리
//   // const handleCompleteContract = async () => {
//   //   if (!isAgreed) {
//   //     alert("약관에 모두 동의해야 계약을 진행할 수 있습니다.");
//   //     return;
//   //   }

//   //   try {
//   //     if (isLender) {
//   //       // ✅ 출자자 승인 (WAITING_FOR_APPROVAL)
//   //       const response = await approveContractByLender(contractId, userId);
//   //       alert(response.message || "출자자 최종 승인이 완료되었습니다.");

//   //       // ✅ 출자자 승인 후 'ACTIVE' 상태로 업데이트
//   //       await updateContractToActive();
//   //     }

//   //     navigate("/member/mypage");
//   //   } catch (error) {
//   //     console.error(
//   //       "❌ 계약 완료 중 오류 발생:",
//   //       error.response?.data || error
//   //     );
//   //     alert("계약 진행 중 문제가 발생했습니다.");
//   //   }
//   // };

//   // 🚨 "ACTIVE" 상태 업데이트 요청 제거
//   const handleCompleteContract = async () => {
//     if (isLender) {
//       // ✅ 출자자 승인 API만 호출 (상태는 API 내부에서 처리)
//       const response = await approveContractByLender(contractId, userId);
//       alert(response.message || "출자자 최종 승인이 완료되었습니다.");
//     }

//     navigate("/member/mypage");
//   };

//   return (
//     <BasicLayout>
//       <div className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-lg mt-6">
//         {/* ✅ 계약서 내용 표시 (HTML 렌더링) */}
//         <div className="border p-4 bg-gray-100 rounded-md mb-4">
//           <div dangerouslySetInnerHTML={{ __html: contractContent }} />
//         </div>

//         {/* ✅ 출자자와 대출자 모두 계약 약관을 볼 수 있도록 설정 */}
//         <TermsAgreement onAgree={setIsAgreed} isLender={isLender} />

//         {/* ✅ 계약서 작성 완료 & PDF 다운로드 버튼 추가 */}
//         <div className="mt-6 text-center">
//           <button
//             className={`px-6 py-2 rounded-md text-white mr-4 ${
//               isAgreed
//                 ? "bg-blue-500 hover:bg-blue-600"
//                 : "bg-gray-400 cursor-not-allowed"
//             }`}
//             onClick={handleCompleteContract}
//             disabled={!isAgreed}
//           >
//             계약서 작성 완료
//           </button>
//         </div>
//       </div>
//     </BasicLayout>
//   );
// };

// export default ContractPage;

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getContractContent,
  approveContractByLender,
  updateContractStatus,
  getContractsByLender,
  getContractsByBorrower,
} from "../../api/contractApi";
import TermsAgreement from "../../components/contract/TermsAgreement";
import BasicLayout from "../../layouts/BasicLayout";
import "./ContractPage.css";
import { createContractApprovalNotification } from "../../api/notificationApi";

const ContractPage = () => {
  const { contractId } = useParams();
  const [contracts, setContracts] = useState([]);
  const navigate = useNavigate();
  const [contractContent, setContractContent] = useState("");
  const [isLender, setIsLender] = useState(false);
  const [userId, setUserId] = useState("");
  const [isAgreed, setIsAgreed] = useState(false);

  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    const storedIsLender = localStorage.getItem("isLender") === "true";

    if (!storedUserId) {
      alert("로그인이 필요합니다.");
      navigate("/login");
      return;
    }

    setUserId(storedUserId);
    setIsLender(storedIsLender);
    fetchContractContent(storedUserId, storedIsLender);
    fetchContracts(storedUserId, storedIsLender); // contracts 데이터를 불러오는 함수 호출
  }, [contractId, navigate]);

  // contracts 데이터를 가져오는 함수 추가
  const fetchContracts = async (userId, isLender) => {
    try {
      const data = isLender
        ? await getContractsByLender(userId)
        : await getContractsByBorrower(userId);

      // "COMPLETED" 및 "CANCELLED" 상태 제외
      const filteredContracts = data.filter(
        (contract) =>
          contract.status !== "COMPLETED" && contract.status !== "CANCELLED"
      );

      setContracts(filteredContracts);
    } catch (error) {
      console.error("계약 목록 불러오기 중 오류 발생:", error);
    }
  };

  const fetchContractContent = async (userId, isLender) => {
    try {
      console.log("📡 계약서 내용 요청:", { contractId, userId, isLender });
      const content = await getContractContent(contractId, userId, isLender);
      console.log("📄 계약서 응답 데이터:", content);
      setContractContent(content || "계약서 내용을 불러올 수 없습니다.");
    } catch (error) {
      console.error("❌ 계약서 내용을 불러오는 중 오류 발생:", error);
    }
  };

  // const handleCompleteContract = async () => {
  //   if (!isAgreed) {
  //     alert("약관에 모두 동의해야 계약을 진행할 수 있습니다.");
  //     return;
  //   }

  //   try {
  //     if (isLender) {
  //       const response = await approveContractByLender(contractId, userId);
  //       alert(response.message || "출자자 최종 승인이 완료되었습니다.");
  //     } else {
  //       console.log("contracts", contracts);
  //       // 현재 계약 찾기
  //       const currentContract = contracts.find(
  //         (c) => c.id === parseInt(contractId)
  //       );

  //       if (!currentContract) {
  //         alert("계약 정보를 찾을 수 없습니다.");
  //         return;
  //       }

  //       // 찾은 계약에서 lenderId 추출
  //       const lenderId = currentContract.lenderId;

  //       // 출자자에게 알림 생성
  //       await createContractApprovalNotification(lenderId);
  //       alert("계약서 작성이 완료되었으며, 출자자에게 알림이 전송되었습니다.");
  //     }

  //     navigate("/member/mypage");
  //   } catch (error) {
  //     console.error("계약 처리 중 오류 발생:", error);
  //     alert("계약 처리 중 오류가 발생했습니다.");
  //   }
  // };
  const handleCompleteContract = async () => {
    if (!isAgreed) {
      alert("약관에 모두 동의해야 계약을 진행할 수 있습니다.");
      return;
    }

    try {
      if (isLender) {
        const response = await approveContractByLender(contractId, userId);
        alert(response.message || "출자자 최종 승인이 완료되었습니다.");
      } else {
        console.log("contracts", contracts);
        // 현재 계약 찾기
        const currentContract = contracts.find(
          (c) => c.id === parseInt(contractId)
        );

        if (!currentContract) {
          alert("계약 정보를 찾을 수 없습니다.");
          return;
        }

        // 찾은 계약에서 lenderId 추출
        const lenderId = currentContract.lenderId;

        // 출자자에게 알림 생성
        await createContractApprovalNotification(lenderId);
        alert("계약서 작성이 완료되었으며, 출자자에게 알림이 전송되었습니다.");
      }

      navigate("/member/mypage");
    } catch (error) {
      console.error("계약 처리 중 오류 발생:", error);
      alert("계약 처리 중 오류가 발생했습니다.");
    }
  };

  return (
    <BasicLayout>
      <div className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-lg mt-6">
        <div className="border p-4 bg-gray-100 rounded-md mb-4">
          <div dangerouslySetInnerHTML={{ __html: contractContent }} />
        </div>

        <TermsAgreement onAgree={setIsAgreed} isLender={isLender} />

        <div className="complete-button">
          <button
            className={`px-6 py-2 rounded-md text-white mr-4 ${
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
    </BasicLayout>
  );
};

export default ContractPage;
