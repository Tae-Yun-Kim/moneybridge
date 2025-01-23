import React, { useState } from "react";
import { incrementTransactionCount } from "../../api/walletApi";

const IncrementTransactionComponent = () => {
  const [walletId, setWalletId] = useState("");

  const handleIncrementTransaction = async () => {
    try {
      await incrementTransactionCount(walletId);
      alert("거래 횟수가 성공적으로 증가했습니다.");
    } catch (error) {
      alert(`거래 횟수 증가 실패: ${error.message}`);
    }
  };

  return (
    <div className="border-2 border-purple-200 mt-10 m-2 p-4">
      <h2 className="text-2xl font-bold mb-4">거래 횟수 증가</h2>
      <input
        type="text"
        placeholder="지갑 ID"
        value={walletId}
        onChange={(e) => setWalletId(e.target.value)}
        className="border p-2 mb-4 w-full"
      />
      <button
        className="bg-purple-500 text-white py-2 px-4 rounded"
        onClick={handleIncrementTransaction}
      >
        거래 횟수 증가
      </button>
    </div>
  );
};

export default IncrementTransactionComponent;
