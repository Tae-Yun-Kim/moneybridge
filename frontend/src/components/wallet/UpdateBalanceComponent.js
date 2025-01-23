import React, { useState } from "react";
import { updateWalletBalance } from "../../api/walletApi";

const UpdateBalanceComponent = () => {
  const [walletId, setWalletId] = useState("");
  const [amount, setAmount] = useState("");

  const handleUpdateBalance = async () => {
    try {
      const response = await updateWalletBalance(walletId, amount);
      alert(`잔액 업데이트 성공! 현재 잔액: ${response.balance}원`);
    } catch (error) {
      alert(`잔액 업데이트 실패: ${error.message}`);
    }
  };

  return (
    <div className="border-2 border-yellow-200 mt-10 m-2 p-4">
      <h2 className="text-2xl font-bold mb-4">잔액 업데이트</h2>
      <input
        type="text"
        placeholder="지갑 ID"
        value={walletId}
        onChange={(e) => setWalletId(e.target.value)}
        className="border p-2 mb-4 w-full"
      />
      <input
        type="number"
        placeholder="금액"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        className="border p-2 mb-4 w-full"
      />
      <button
        className="bg-yellow-500 text-white py-2 px-4 rounded"
        onClick={handleUpdateBalance}
      >
        업데이트
      </button>
    </div>
  );
};

export default UpdateBalanceComponent;
