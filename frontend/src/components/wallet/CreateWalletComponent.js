import React, { useState } from "react";
import { createWallet } from "../../api/walletApi";

const CreateWalletComponent = () => {
  const [memberId, setMemberId] = useState("");
  const [pinNumber, setPinNumber] = useState("");
  const [accountNumber, setAccountNumber] = useState("");

  const handleCreateWallet = async () => {
    try {
      const walletData = { memberId, accountNumber, pinNumber };
      const response = await createWallet(walletData);
      alert(`지갑 생성 성공! 지갑 ID: ${response.walletId}`);
    } catch (error) {
      alert(`지갑 생성 실패: ${error.message}`);
    }
  };

  return (
    <div className="border-2 border-green-200 mt-10 m-2 p-4">
      <h2 className="text-2xl font-bold mb-4">지갑 생성</h2>
      <input
        type="text"
        placeholder="회원 ID"
        value={memberId}
        onChange={(e) => setMemberId(e.target.value)}
        className="border p-2 mb-4 w-full"
      />
      <input
        type="text"
        placeholder="계좌 번호"
        value={accountNumber}
        onChange={(e) => setAccountNumber(e.target.value)}
        className="border p-2 mb-4 w-full"
      />
      <input
        type="password"
        placeholder="PIN 번호"
        value={pinNumber}
        onChange={(e) => setPinNumber(e.target.value)}
        className="border p-2 mb-4 w-full"
      />
      <button
        className="bg-blue-500 text-white py-2 px-4 rounded"
        onClick={handleCreateWallet}
      >
        지갑 생성
      </button>
    </div>
  );
};

export default CreateWalletComponent;
