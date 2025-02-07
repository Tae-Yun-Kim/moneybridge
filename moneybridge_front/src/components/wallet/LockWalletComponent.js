import React, { useState } from "react";
import { lockWallet, unlockWallet } from "../../api/walletApi";

const LockWalletComponent = () => {
  const [walletId, setWalletId] = useState("");

  const handleLock = async () => {
    try {
      await lockWallet(walletId);
      alert("지갑이 잠겼습니다.");
    } catch (error) {
      alert("지갑 잠금에 실패했습니다: " + error.message);
    }
  };

  const handleUnlock = async () => {
    try {
      await unlockWallet(walletId);
      alert("지갑 잠금 해제되었습니다.");
    } catch (error) {
      alert("지갑 잠금 해제에 실패했습니다: " + error.message);
    }
  };

  return (
    <div className="border-2 border-blue-200 mt-10 m-2 p-4">
      <h2 className="text-2xl font-bold mb-4">지갑 잠금/해제</h2>
      <input
        type="text"
        placeholder="지갑 ID"
        value={walletId}
        onChange={(e) => setWalletId(e.target.value)}
        className="border p-2 mb-4 w-full"
      />
      <div className="flex gap-4">
        <button
          className="bg-blue-500 text-white py-2 px-4 rounded"
          onClick={handleLock}
        >
          잠금
        </button>
        <button
          className="bg-green-500 text-white py-2 px-4 rounded"
          onClick={handleUnlock}
        >
          잠금 해제
        </button>
      </div>
    </div>
  );
};

export default LockWalletComponent;
