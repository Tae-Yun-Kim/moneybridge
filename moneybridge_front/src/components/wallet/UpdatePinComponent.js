import React, { useState } from "react";
import { updatePinNumber } from "../../api/walletApi";

const UpdatePinComponent = () => {
  const [walletId, setWalletId] = useState("");
  const [oldPin, setOldPin] = useState("");
  const [newPin, setNewPin] = useState("");

  const handleUpdatePin = async () => {
    try {
      await updatePinNumber(walletId, oldPin, newPin);
      alert("PIN 번호가 성공적으로 변경되었습니다.");
    } catch (error) {
      alert(`PIN 번호 변경 실패: ${error.message}`);
    }
  };

  return (
    <div className="border-2 border-gray-200 mt-10 m-2 p-4">
      <h2 className="text-2xl font-bold mb-4">PIN 번호 변경</h2>
      <input
        type="text"
        placeholder="지갑 ID"
        value={walletId}
        onChange={(e) => setWalletId(e.target.value)}
        className="border p-2 mb-4 w-full"
      />
      <input
        type="password"
        placeholder="기존 PIN"
        value={oldPin}
        onChange={(e) => setOldPin(e.target.value)}
        className="border p-2 mb-4 w-full"
      />
      <input
        type="password"
        placeholder="새 PIN"
        value={newPin}
        onChange={(e) => setNewPin(e.target.value)}
        className="border p-2 mb-4 w-full"
      />
      <button
        className="bg-gray-500 text-white py-2 px-4 rounded"
        onClick={handleUpdatePin}
      >
        PIN 변경
      </button>
    </div>
  );
};

export default UpdatePinComponent;
