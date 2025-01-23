import React, { useState } from "react";

const WalletTransferComponent = ({ fromWalletId, onTransfer }) => {
  const [toWalletId, setToWalletId] = useState("");
  const [amount, setAmount] = useState("");

  const handleTransfer = () => {
    if (!toWalletId || !amount || parseInt(amount) <= 0) {
      alert("올바른 수신 지갑 ID와 금액을 입력하세요.");
      return;
    }

    onTransfer(toWalletId, parseInt(amount));
    setToWalletId(""); // 입력 초기화
    setAmount("");
  };

  return (
    <div className="border-2 border-purple-200 mt-10 m-2 p-4">
      <h2 className="text-2xl font-bold mb-4">지갑 간 송금</h2>
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
