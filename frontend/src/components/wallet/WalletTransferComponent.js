import React, { useState } from "react";
import { createNotification } from "../../api/notificationApi";  // 알림 생성 API 임포트

const WalletTransferComponent = ({ fromWalletId, onTransfer }) => {
  const [toWalletId, setToWalletId] = useState("");
  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");

  // 알림 생성 함수
  const handleCreateNotification = async (transactionId, amount) => {
    try {
      // 여기서는 실제 알림을 생성하는 API 호출
      await createNotification(toWalletId, amount);  // toWalletId는 거래 받는 지갑 ID, amount는 거래 금액
      console.log(`알림 생성 성공: 거래 ID ${transactionId}, 입금자 ID ${toWalletId}, 금액 ${amount}`);
    } catch (error) {
      console.error("알림 생성 중 오류 발생:", error);
    }
  };

  const handleTransfer = () => {
    if (!toWalletId || !amount || parseInt(amount) <= 0) {
      alert("올바른 수신 지갑 ID와 금액을 입력하세요.");
      return;
    }

    // 송금 로직
    const transactionId = `${Date.now()}`; // 예시로 transactionId 생성 (실제 구현에 맞게 수정 필요)
    
    onTransfer(toWalletId, parseInt(amount));

    // 알림 생성 호출
    handleCreateNotification(transactionId, amount);
    console.log("transactionId, amount",transactionId, amount)

    setToWalletId(""); // 입력 초기화
    setAmount("");
  };

  return (
    <div className="border-2 border-purple-200 mt-10 m-2 p-4">
      <h2 className="text-2xl font-bold mb-4">지갑 간 송금</h2>
      {error && <div className="text-red-500 mb-2">{error}</div>}
      <div className="mb-4">
        <label htmlFor="fromWalletId" className="block font-bold mb-2">
          출발 지갑 ID:
        </label>
        <input
          type="text"
          id="fromWalletId"
          value={fromWalletId}
          readOnly
          className="border p-2 w-full bg-gray-100 cursor-not-allowed"
        />
      </div>
      <div className="mb-4">
        <label htmlFor="toWalletId" className="block font-bold mb-2">
          수신 지갑 ID:
        </label>
        <input
          type="text"
          id="toWalletId"
          value={toWalletId}
          onChange={(e) => setToWalletId(e.target.value)}
          className="border p-2 w-full"
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
      <button
        className="bg-purple-500 text-white py-2 px-4 rounded"
        onClick={handleTransfer}
      >
        송금
      </button>
    </div>
  );
};

export default WalletTransferComponent;
