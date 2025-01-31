import React, { useEffect, useState } from "react";
import { getCookie } from "../../util/cookieUtil";
import { transferBetweenWallets } from "../../api/walletApi";
import WalletTransferComponent from "../../components/wallet/WalletTransferComponent";
import BasicMenu from "../../components/menus/BasicMenu";

const WalletTransferPage = () => {
  const [fromWalletId, setFromWalletId] = useState("");
  const [message, setMessage] = useState("");

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

  return (
    <div className="fixed top-0 left-0 z-[1055] flex flex-col h-full w-full">
      <BasicMenu />
      <div className="w-full flex flex-wrap  h-full justify-center items-center border-2">
        <WalletTransferComponent
          fromWalletId={fromWalletId}
          onTransfer={handleTransfer}
        />
        {message && (
          <div className="mt-4 text-purple-600 font-bold">
            <p>{message}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default WalletTransferPage;
