import React from "react";
import LenderRequestComponent from "../../components/lender/LenderRequestComponent";
import BasicMenu from "../../components/menus/BasicMenu";

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
      <div>
        <h1>채권자 신청</h1>
        <p>현재 상태: {isLender ? "채권자" : "채무자"}</p>
        <LenderRequestComponent
          userId={id}
          isLender={isLender}
          lenderStatus={lenderStatus}
        />
      </div>
    </div>
  );
};

export default LenderPage;
