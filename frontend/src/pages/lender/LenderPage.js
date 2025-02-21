import React from "react";
import LenderRequestComponent from "../../components/lender/LenderRequestComponent";
import BasicMenu from "../../components/menus/BasicMenu";
import "./LenderPage.css";

const LenderPage = () => {
  const storedMember = localStorage.getItem("member");
  let id = null;
  let isLender = false;
  let lenderStatus = "NONE";

  if (storedMember) {
    try {
      const memberData = JSON.parse(storedMember);
      id = memberData.id;
      isLender = memberData.isLender || "";
      lenderStatus = memberData.lenderStatus || "";
    } catch (error) {
      console.error("로컬스토리지 파싱 실패:", error);
    }
  }

  return (
    <div>
      <BasicMenu />
      <h1 className="page-title">채권자 신청</h1>
      <div className="card-container">
        {/* 현재 상태 카드 */}
        <div className="card">
          <h2>현재 상태</h2>
          <p>{isLender ? "채권자" : "채무자"}</p>
        </div>

        {/* 신청/포기 버튼 카드 */}
        <div className="card">
          <h2>신청 상태</h2>
          <LenderRequestComponent
            userId={id}
            isLender={isLender}
            lenderStatus={lenderStatus}
          />
        </div>
      </div>
    </div>
  );
};

export default LenderPage;
