import React, { useEffect, useState } from "react";
import {
  transferFromWalletToAccount,
  transferFromAccountToWallet,
} from "../../api/walletApi";
import { getCookie } from "../../util/cookieUtil";

const TransferComponent = () => {
  const [memberId, setMemberId] = useState("");
  const [amount, setAmount] = useState("");
  const [direction, setDirection] = useState("wallet-to-account");
  const [message, setMessage] = useState(""); // 결과 메시지

  useEffect(() => {
    // 쿠키에서 로그인된 사용자 정보 가져오기
    const memberInfo = getCookie("member");
    if (memberInfo) {
      setMemberId(memberInfo.id); // 로그인된 사용자 ID 설정
    }
  }, []);

  const handleTransfer = async () => {
    try {
      if (!amount || isNaN(amount) || parseInt(amount) <= 0) {
        alert("올바른 금액을 입력하세요.");
        return;
      }

      if (direction === "wallet-to-account") {
        // 지갑 → 계좌 송금
        await transferFromWalletToAccount(memberId, parseInt(amount));
        setMessage(`지갑에서 계좌로 ${amount}원이 송금되었습니다.`);
      } else if (direction === "account-to-wallet") {
        // 계좌 → 지갑 송금
        await transferFromAccountToWallet(memberId, parseInt(amount));
        setMessage(`계좌에서 지갑으로 ${amount}원이 송금되었습니다.`);
      }

      setAmount(""); // 금액 초기화
    } catch (error) {
      console.error("송금 실패:", error.message);
      alert("송금에 실패했습니다. 다시 시도하세요.");
    }
  };

  return (
    <div className="border-2 border-green-200 mt-10 m-2 p-4">
      <h2 className="text-2xl font-bold mb-4">계좌 ↔ 지갑 송금</h2>
      <div className="mb-4">
        <label htmlFor="memberId" className="block font-bold mb-2">
          회원 ID:
        </label>
        <input
          type="text"
          id="memberId"
          value={memberId}
          readOnly // 읽기 전용으로 설정
          className="border p-2 w-full bg-gray-100 cursor-not-allowed"
        />
      </div>
      <div className="mb-4">
        <label htmlFor="amount" className="block font-bold mb-2">
          송금 금액:
        </label>
        <input
          type="number"
          id="amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="border p-2 w-full"
        />
      </div>
      <div className="mb-4">
        <label htmlFor="direction" className="block font-bold mb-2">
          송금 방향:
        </label>
        <select
          id="direction"
          value={direction}
          onChange={(e) => setDirection(e.target.value)}
          className="border p-2 w-full"
        >
          <option value="wallet-to-account">지갑 → 계좌</option>
          <option value="account-to-wallet">계좌 → 지갑</option>
        </select>
      </div>
      <button
        className="bg-green-500 text-white py-2 px-4 rounded"
        onClick={handleTransfer}
      >
        송금
      </button>
      {message && (
        <div className="mt-4 text-green-600 font-bold">
          <p>{message}</p>
        </div>
      )}
    </div>
  );
};

export default TransferComponent;
