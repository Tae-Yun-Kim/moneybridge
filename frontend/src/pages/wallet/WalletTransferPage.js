import React, { useEffect, useState } from "react";
import { getCookie } from "../../util/cookieUtil";
import { transferBetweenWallets } from "../../api/walletApi";
import WalletTransferComponent from "../../components/wallet/WalletTransferComponent";
import BasicMenu from "../../components/menus/BasicMenu";
import "../../components/wallet/WalletTransferComponent.css";
import { useNavigate } from "react-router-dom";

const WalletTransferPage = () => {
  const [fromWalletId, setFromWalletId] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    // 로그인된 사용자 정보에서 출발 지갑 ID 설정
    const memberInfo = getCookie("member");
    if (memberInfo) {
      setFromWalletId(`w_${memberInfo.id}`); // 지갑 ID 형식에 맞게 설정
    }
  }, []);

  const handleTransfer = async (toWalletId, amount) => {
    try {
      await transferBetweenWallets(fromWalletId, toWalletId, amount);
      setMessage(
        `지갑 ${fromWalletId}에서 ${toWalletId}로 ${amount}원이 송금되었습니다.`
      );
    } catch (error) {
      console.error("송금 실패:", error.message);
      alert("송금에 실패했습니다. 다시 시도하세요.");
    }
  };

  const handleinfo = () => {
    navigate("/member/mypage");
  };

  return (
    <div className="fixed top-0 left-0 z-[1055] flex flex-col h-full w-full">
      <BasicMenu />
      <div>
        <WalletTransferComponent
          fromWalletId={fromWalletId}
          onTransfer={handleTransfer}
        />
        {message && (
          <div className="info-box">
            <p className="info-message">{message}</p>

            {/* ✅ message가 있을 때만 버튼이 나타남 */}
            <button className="info-button" onClick={handleinfo}>
              확인
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default WalletTransferPage;
