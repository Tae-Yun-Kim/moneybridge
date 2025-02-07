// import { useState } from "react";

// const TermsAgreement = ({ onAgree }) => {
//   const [agreements, setAgreements] = useState({
//     terms1: false,
//     terms2: false,
//     terms3: false,
//     terms4: false,
//     terms5: false, // ✅ 전자 계약 동의 항목 추가
//   });

//   // ✅ 개별 약관 체크박스 상태 변경
//   const handleAgreementChange = (term) => {
//     const newAgreements = { ...agreements, [term]: !agreements[term] };
//     setAgreements(newAgreements);
//     onAgree(Object.values(newAgreements).every(Boolean)); // 모든 항목이 체크되었는지 확인
//   };

//   // ✅ 전체 동의 버튼 동작
//   const handleAgreeAll = () => {
//     const allChecked = Object.values(agreements).some((val) => !val);
//     const newAgreements = {
//       terms1: allChecked,
//       terms2: allChecked,
//       terms3: allChecked,
//       terms4: allChecked,
//       terms5: allChecked,
//     };
//     setAgreements(newAgreements);
//     onAgree(allChecked);
//   };

//   return (
//     <div className="border p-4 bg-gray-100 rounded-md my-4">
//       <h3 className="text-lg font-semibold">📜 계약 약관 동의</h3>

//       {/* ✅ 약관 1: 대출 및 계약 기본 약관 */}
//       <label className="flex items-center my-2">
//         <input
//           type="checkbox"
//           checked={agreements.terms1}
//           onChange={() => handleAgreementChange("terms1")}
//         />
//         <span className="ml-2">대출 및 계약 기본 약관에 동의합니다.</span>
//       </label>
//       <p className="text-sm text-gray-600 pl-6">
//         본 계약은 출자자와 대출자 간의 법적 계약이며, 상환 일정과 금리에 대한
//         내용을 포함합니다.
//       </p>

//       {/* ✅ 약관 2: 연체 및 추심 관련 약관 */}
//       <label className="flex items-center my-2">
//         <input
//           type="checkbox"
//           checked={agreements.terms2}
//           onChange={() => handleAgreementChange("terms2")}
//         />
//         <span className="ml-2">연체 및 추심 신청 약관에 동의합니다.</span>
//       </label>
//       <p className="text-sm text-gray-600 pl-6">
//         대출자가 상환 기한을 초과할 경우, 출자자는 추심 서비스를 신청할 수
//         있으며, 법적 절차가 진행될 수 있습니다.
//       </p>

//       {/* ✅ 약관 3: 거래 정지 및 추가 대출 제한 */}
//       <label className="flex items-center my-2">
//         <input
//           type="checkbox"
//           checked={agreements.terms3}
//           onChange={() => handleAgreementChange("terms3")}
//         />
//         <span className="ml-2">
//           거래 정지 및 추가 대출 제한 약관에 동의합니다.
//         </span>
//       </label>
//       <p className="text-sm text-gray-600 pl-6">
//         대출자가 연체 상태가 되면 계정이 자동으로 거래 정지 상태로 전환되며,
//         추가 대출이 제한됩니다.
//       </p>

//       {/* ✅ 약관 4: 개인정보 보호 및 금융 정보 제공 */}
//       <label className="flex items-center my-2">
//         <input
//           type="checkbox"
//           checked={agreements.terms4}
//           onChange={() => handleAgreementChange("terms4")}
//         />
//         <span className="ml-2">
//           개인정보 보호 및 금융 정보 제공 약관에 동의합니다.
//         </span>
//       </label>
//       <p className="text-sm text-gray-600 pl-6">
//         본 계약 체결 시 금융 정보가 보호되며, 신용 평가 및 대출 관련 정보가
//         활용될 수 있습니다.
//       </p>

//       {/* ✅ 약관 5: 전자 계약 동의 */}
//       <label className="flex items-center my-2">
//         <input
//           type="checkbox"
//           checked={agreements.terms5}
//           onChange={() => handleAgreementChange("terms5")}
//         />
//         <span className="ml-2">
//           본 계약을 전자 계약으로 체결함을 인정하고 동의합니다.
//         </span>
//       </label>
//       <p className="text-sm text-gray-600 pl-6">
//         이 계약은 전자 문서로 체결되며, 전자 서명 또는 확인을 통해 법적 효력을
//         가집니다.
//       </p>

//       <hr className="my-4" />

//       {/* ✅ 전체 동의 버튼 */}
//       <label className="flex items-center my-2">
//         <input
//           type="checkbox"
//           checked={Object.values(agreements).every(Boolean)}
//           onChange={handleAgreeAll}
//         />
//         <span className="ml-2 font-semibold">전체 약관에 동의합니다.</span>
//       </label>
//     </div>
//   );
// };

// export default TermsAgreement;
import { useState } from "react";

const TermsAgreement = ({ onAgree, isLender }) => {
  const [agreements, setAgreements] = useState({
    terms1: false,
    terms2: false,
    terms3: false,
    terms4: false,
    terms5: false, // ✅ 전자 계약 동의 항목 추가
  });

  const handleAgreementChange = (term) => {
    const newAgreements = { ...agreements, [term]: !agreements[term] };
    setAgreements(newAgreements);
    onAgree(Object.values(newAgreements).every(Boolean));
  };

  const handleAgreeAll = () => {
    const allChecked = Object.values(agreements).some((val) => !val);
    const newAgreements = {
      terms1: allChecked,
      terms2: allChecked,
      terms3: allChecked,
      terms4: allChecked,
      terms5: allChecked,
    };
    setAgreements(newAgreements);
    onAgree(allChecked);
  };

  const termsList = isLender
    ? [
        [
          "terms1",
          "출자자 계약 동의",
          "대출자가 서명한 계약을 최종 승인하며, 대출금 지급이 이루어집니다.",
        ],
        [
          "terms2",
          "대출 상환 및 추심 규정",
          "대출자가 기한 내 상환하지 않을 경우 법적 절차를 진행할 수 있습니다.",
        ],
        [
          "terms3",
          "계약 파기 및 책임 조항",
          "대출자가 상환을 완료하지 않으면 추가 대출이 불가능합니다.",
        ],
        [
          "terms4",
          "개인정보 보호 정책",
          "계약 체결 과정에서 개인정보 보호 및 금융 정보 제공에 동의합니다.",
        ],
        [
          "terms5",
          "전자 계약 동의",
          "이 계약은 전자 문서로 체결되며 법적 효력을 가집니다.",
        ],
      ]
    : [
        [
          "terms1",
          "대출 및 계약 기본 약관",
          "본 계약은 출자자와 대출자 간의 법적 계약이며, 상환 일정과 금리에 대한 내용을 포함합니다.",
        ],
        [
          "terms2",
          "연체 및 추심 신청 약관",
          "대출자가 상환 기한을 초과할 경우, 출자자는 추심 서비스를 신청할 수 있으며, 법적 절차가 진행될 수 있습니다.",
        ],
        [
          "terms3",
          "거래 정지 및 추가 대출 제한 약관",
          "대출자가 연체 상태가 되면 계정이 자동으로 거래 정지 상태로 전환되며, 추가 대출이 제한됩니다.",
        ],
        [
          "terms4",
          "개인정보 보호 및 금융 정보 제공",
          "본 계약 체결 시 금융 정보가 보호되며, 신용 평가 및 대출 관련 정보가 활용될 수 있습니다.",
        ],
        [
          "terms5",
          "전자 계약 동의",
          "이 계약은 전자 문서로 체결되며, 전자 서명 또는 확인을 통해 법적 효력을 가집니다.",
        ],
      ];

  return (
    <div className="border p-4 bg-gray-100 rounded-md my-4">
      <h3 className="text-lg font-semibold">📜 계약 약관 동의</h3>

      {termsList.map(([key, title, description]) => (
        <div key={key} className="my-2">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={agreements[key]}
              onChange={() => handleAgreementChange(key)}
            />
            <span className="ml-2">{title}에 동의합니다.</span>
          </label>
          <p className="text-sm text-gray-600 pl-6">{description}</p>
        </div>
      ))}

      <hr className="my-4" />

      {/* ✅ 전체 동의 버튼 */}
      <label className="flex items-center my-2">
        <input
          type="checkbox"
          checked={Object.values(agreements).every(Boolean)}
          onChange={handleAgreeAll}
        />
        <span className="ml-2 font-semibold">전체 약관에 동의합니다.</span>
      </label>
    </div>
  );
};

export default TermsAgreement;
