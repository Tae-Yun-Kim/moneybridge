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
          `본 계약을 통해 출자자는 대출자가 서명한 계약을 최종 승인하며, 이에 따라 대출금 지급이 이루어집니다.
        출자자는 계약이 성립된 이후 대출자에게 해당 금액을 송금할 법적 의무를 가지며, 해당 금액은 대출 계약에서 
        명시된 조건에 따라 상환됩니다. 출자자는 대출자가 계약 조건을 준수하지 않을 경우, 법적 절차를 진행할 수 
        있으며, 이 과정에서 발생하는 비용 및 책임은 출자자 본인이 부담합니다.`,
        ],
        [
          "terms2",
          "대출 상환 및 추심 규정",
          `대출자는 계약에서 명시된 기한 내에 원금과 이자를 상환해야 하며, 기한을 초과할 경우 연체 이자가 부과됩니다.
        출자자는 연체 발생 시 대출자의 신용 정보를 신용 평가 기관에 공유할 수 있으며, 필요 시 법적 절차를 통해 
        강제 추심을 진행할 권리를 가집니다. 본 계약은 금융 규제에 따라 법적 효력을 가지며, 대출자가 3회 이상 
        연체할 경우, 출자자는 대출자에 대한 법적 대응을 시작할 수 있습니다.`,
        ],
        [
          "terms3",
          "계약 파기 및 책임 조항",
          `대출자가 계약 체결 이후 계약을 임의로 파기하거나 상환을 완료하지 않을 경우, 추가 대출이 불가능합니다.
        또한, 대출자가 연체 상태가 지속될 경우, 출자자는 채권 추심 절차를 진행할 수 있으며, 이 과정에서 발생하는 
        모든 비용과 책임은 대출자가 부담합니다. 계약 위반이 발생하면, 출자자는 해당 계약을 해지할 수 있으며, 
        이에 따른 법적 조치를 수행할 수 있습니다.`,
        ],
        [
          "terms4",
          "개인정보 보호 정책",
          `출자자는 본 계약 체결 과정에서 제공되는 모든 개인정보가 금융 거래 및 계약 진행을 위한 목적으로 사용됨을 
        인지하며, 이를 동의합니다. 해당 정보는 금융 관련 법규에 따라 보호되며, 출자자는 필요 시 법적 절차를 통해 
        대출자의 신용 정보를 요청할 수 있습니다.`,
        ],
        [
          "terms5",
          "전자 계약 동의",
          `본 계약은 전자 문서로 체결되며, 법적으로 동일한 효력을 가집니다. 출자자는 해당 계약이 전자 서명을 통해 
        인증되었음을 인지하며, 이에 따라 법적 분쟁 발생 시 계약서 내용이 증거로 활용될 수 있습니다.`,
        ],
      ]
    : [
        [
          "terms1",
          "대출 및 계약 기본 약관에 동의합니다.",
          `본 계약은 출자자와 대출자 간의 법적 계약이며, 상환 일정, 금리, 상환 방식 등의 주요 사항이 포함됩니다.
        대출자는 계약에서 정한 기한 내에 대출 원금 및 이자를 상환해야 하며, 계약 위반 시 법적 책임을 질 수 있습니다.
        대출자는 계약 체결 이후 대출금을 목적 외의 용도로 사용하지 않아야 하며, 본 계약의 조건을 준수해야 합니다.`,
        ],
        [
          "terms2",
          "연체 및 추심 신청 약관에 동의합니다.",
          `대출자가 계약에서 정한 상환 기한을 초과하여 연체 상태가 될 경우, 연체 이자가 부과되며, 출자자는 추심 서비스를 
        신청할 수 있습니다. 대출자가 연체 상태를 지속하면 신용 평가 기관에 해당 정보가 공유될 수 있으며, 일정 기간 
        초과 시 법적 절차가 진행될 수 있습니다. 대출자는 연체 시 출자자가 법적 조치를 취할 수 있음을 이해하고 동의합니다.`,
        ],
        [
          "terms3",
          "거래 정지 및 추가 대출 제한 약관에 동의합니다.",
          `대출자가 연체 상태가 되면 계정이 자동으로 거래 정지 상태로 전환되며, 추가 대출이 제한됩니다.
        일정 기간 동안 연체가 지속되거나 계약 위반이 반복될 경우, 대출자는 서비스 이용 제한 및 금융 불이익을 받을 수 있습니다.
        이러한 조치는 대출자의 신용 보호 및 출자자의 권리를 보장하기 위한 조치입니다.`,
        ],
        [
          "terms4",
          "개인정보 보호 및 금융 정보 제공에 동의합니다.",
          `대출자는 본 계약 체결 시 금융 정보가 보호되며, 신용 평가 및 대출 관련 정보가 활용될 수 있음을 이해하고 동의합니다.
        제공된 정보는 금융 거래 및 계약 이행을 위한 목적으로만 사용되며, 법적 요구가 있는 경우 출자자와 공유될 수 있습니다.`,
        ],
        [
          "terms5",
          "전자 계약 동의합니다.",
          `이 계약은 전자 문서로 체결되며, 전자 서명 또는 확인을 통해 법적 효력을 가집니다. 대출자는 전자 계약 방식에 동의하며, 
        법적 분쟁 발생 시 전자 계약서가 증거로 활용될 수 있음을 이해합니다.`,
        ],
      ];

  return (
    <div className="border p-4 bg-gray-100 rounded-md my-4">
      <h3 className="text-lg font-semibold">📜 계약 약관 동의</h3>

      {termsList.map(([key, title, description]) => (
        <div key={key} className="my-4">
          {/* ✅ 제목을 크게 표시 */}
          <label className="flex items-center text-lg font-semibold">
            <input
              type="checkbox"
              checked={agreements[key]}
              onChange={() => handleAgreementChange(key)}
            />
            <span className="ml-2">{title}</span>
          </label>
          {/* ✅ 상세 내용을 박스 안에 넣고 스크롤 가능하도록 설정 */}
          <div className="mt-2 p-3 border border-gray-300 bg-white rounded-md max-h-40 overflow-y-auto text-sm text-gray-700">
            <p className="whitespace-pre-wrap">{description}</p>
          </div>
        </div>
      ))}

      <hr className="my-4" />

      {/* ✅ 출자자는 모든 약관 동의 및 채권 심사 동의 */}
      {isLender && (
        <div className="my-2">
          <label className="flex items-center text-lg font-semibold">
            <input
              type="checkbox"
              checked={Object.values(agreements).every(Boolean)}
              onChange={handleAgreeAll}
            />
            <span className="ml-2">
              출자자는 위 모든 약관에 동의하며, 연체 발생 시 채권 심사 지원을
              받는 것에 동의합니다.
            </span>
          </label>
        </div>
      )}

      {/* ✅ 전체 동의 버튼 (대출자의 경우) */}
      {!isLender && (
        <label className="flex items-center my-2 text-lg font-semibold">
          <input
            type="checkbox"
            checked={Object.values(agreements).every(Boolean)}
            onChange={handleAgreeAll}
          />
          <span className="ml-2">전체 약관에 동의합니다.</span>
        </label>
      )}
    </div>
  );
};

export default TermsAgreement;
