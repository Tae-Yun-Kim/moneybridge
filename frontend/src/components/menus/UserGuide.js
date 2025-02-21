import React, { useState } from "react";
import "./UserGuide.css"; // 스타일 파일 추가
import BasicLayout from "../../layouts/BasicLayout";

const UserGuide = () => {
  const [activeTab, setActiveTab] = useState(null); // 기본값: 채무자

  // 🔹 탭 클릭 시 열고, 같은 탭을 클릭하면 닫기
  const toggleTab = (tab) => {
    setActiveTab(activeTab === tab ? null : tab);
  };

  return (
    <div className="user-guide-container">
      <h2>이용 방법 가이드</h2>
      <p>아래 내용을 참고하여 서비스를 이용하세요.</p>

      {/* 버튼 추가 */}
      <div className="tab-buttons">
        <button
          className={activeTab === "debtor" ? "active" : ""}
          onClick={() => toggleTab("debtor")}
        >
          채무자 이용안내 {activeTab === "debtor" ? "🡅" : "🡇"}
        </button>
        <button
          className={activeTab === "creditor" ? "active" : ""}
          onClick={() => toggleTab("creditor")}
        >
          채권자 이용안내 {activeTab === "creditor" ? "🡅" : "🡇"}
        </button>
      </div>

      {/* 채무자 이용안내 (activeTab이 debtor일 때만 표시) */}
      {activeTab === "debtor" && (
        <section className="guide-section">
          <h3>🔹 채무자 이용안내</h3>
          <ul>
            <li>
              1. 페이지 상단 우측에서 <strong>로그인</strong> 버튼을 클릭하여
              로그인하거나 회원가입을 진행하세요.
            </li>
            <li>
              2. 회원가입 후 최초 상태는 <strong>채무자</strong>입니다.
            </li>
            <li>
              3. <strong>채권자로 변경</strong>하려면 우측 상단에서 변경 신청을
              하세요.
            </li>
            <li>
              4. <strong>빌려드려요</strong> 게시판에서 원하는 대출을 찾아
              클릭하세요.
            </li>
            <li>
              5. 원하는 <strong>이자율</strong>과 <strong>댓글</strong>을
              작성하세요.
            </li>
            <li>6. 채권자가 댓글을 선택하면 계약 진행이 시작됩니다.</li>
            <li>
              7. 계약 진행 버튼을 눌러 <strong>계약서</strong>를 작성하세요.
            </li>
            <li>
              8. 채권자가 승인하지 않으면 <strong>승인 대기</strong> 상태가
              됩니다.
            </li>
            <li>
              9. 승인되면 <strong>진행 중</strong> 상태가 되며, 대출금이
              자동으로 채무자의 지갑에 입금됩니다.
            </li>
            <li>
              10. 대출금을 갚을 때 <strong>자동 상환</strong> 버튼을 눌러
              대출금+이자를 상환하세요.
            </li>
            <li>
              11. <strong>상환 기간 연장</strong>을 신청할 수 있으며, 채권자가
              승인해야 적용됩니다.
            </li>
            <li>
              12. 연장 승인 시 이자율이 기존보다 <strong>2배 증가</strong>할 수
              있습니다.
            </li>
            <li>
              13. 계약이 완료되면 <strong>계약 내역 보기</strong>에서 과거
              계약을 확인하고 PDF로 다운로드하거나 삭제할 수 있습니다.
            </li>
          </ul>
        </section>
      )}

      {/* 채권자 이용안내 (activeTab이 creditor일 때만 표시) */}
      {activeTab === "creditor" && (
        <section className="guide-section">
          <h3>🔹 채권자 이용안내</h3>
          <ul>
            <li>
              1. 페이지 상단 우측에서 <strong>로그인</strong> 버튼을 클릭하여
              로그인하거나 회원가입을 진행하세요.
            </li>
            <li>
              2. 회원가입 후 최초 상태는 <strong>채무자</strong>입니다.
            </li>
            <li>
              3. <strong>채권자로 변경</strong>하려면 우측 상단에서 변경 신청을
              하세요.
            </li>
            <li>4. 변경 신청 후 관리자의 승인이 필요합니다.</li>
            <li>
              5. <strong>채권자로 변경</strong>되면 <strong>빌려드려요</strong>{" "}
              게시판에 게시글을 작성할 수 있습니다.
            </li>
            <li>
              6. 대출을 원하는 회원들이 게시글에 <strong>댓글</strong>을
              남깁니다.
            </li>
            <li>
              7. 원하는 댓글을 선택하면 해당 회원과 <strong>대출 계약</strong>이
              시작됩니다.
            </li>
            <li>
              8. 계약서가 자동 생성되며, 채무자가 약관 동의를 완료하면 채권자가
              최종 승인할 수 있습니다.
            </li>
            <li>9. 계약이 완료되면 대출금이 자동으로 송금됩니다.</li>
            <li>10. 채무자가 대출금을 상환하면 계약이 자동 종료됩니다.</li>
            <li>
              11. <strong>계약 내역 보기</strong>에서 기존 계약을 확인하고 PDF
              다운로드 또는 삭제할 수 있습니다.
            </li>
          </ul>
        </section>
      )}
    </div>
  );
};

export default UserGuide;
