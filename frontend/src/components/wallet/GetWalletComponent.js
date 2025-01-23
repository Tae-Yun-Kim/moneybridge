import React, { useEffect, useState } from "react";
import { getWalletById, getWalletByMemberId } from "../../api/walletApi";
import { getCookie } from "../../util/cookieUtil";

const GetWalletComponent = () => {
  const [memberId, setMemberId] = useState("");
  const [wallet, setWallet] = useState(null);

  useEffect(() => {
    // 쿠키에서 로그인된 사용자 정보 가져오기
    const memberInfo = getCookie("member");
    if (memberInfo) {
      setMemberId(memberInfo.id); // 로그인된 사용자 ID 설정
    }
  }, []);

  const handleFetchWallet = async () => {
    try {
      const response = await getWalletByMemberId(memberId);
      setWallet(response);
    } catch (error) {
      alert(`지갑 조회 실패: ${error.message}`);
    }
  };

  return (
    <div className="border-2 border-blue-200 mt-10 m-2 p-4">
      <h2 className="text-2xl font-bold mb-4">지갑 조회</h2>
      <input
        type="text"
        placeholder="회원 ID"
        value={memberId}
        readOnly // 읽기 전용으로 설정
        className="border p-2 mb-4 w-full"
      />
      <button
        className="bg-blue-500 text-white py-2 px-4 rounded"
        onClick={handleFetchWallet}
      >
        조회
      </button>
      {wallet && (
        <div className="mt-4">
          <p>
            <strong>회원 ID:</strong> {wallet.memberId}
          </p>
          <p>
            <strong>잔액:</strong> {wallet.balance}원
          </p>
        </div>
      )}
    </div>
  );
};

export default GetWalletComponent;
