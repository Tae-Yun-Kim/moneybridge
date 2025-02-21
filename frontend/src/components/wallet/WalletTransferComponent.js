import React, { useState } from "react";
import "./WalletTransferComponent.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { createNotification } from "../../api/notificationApi";
import { getWalletByMemberId } from "../../api/walletApi";

const WalletTransferComponent = ({ fromWalletId, onTransfer }) => {
  const [toWalletId, setToWalletId] = useState("");
  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");

  // const handleTransfer = () => {
  //   if (!toWalletId || !amount || parseInt(amount) <= 0) {
  //     alert("올바른 수신 지갑 ID와 금액을 입력하세요.");
  //     return;
  //   }

  //   onTransfer(toWalletId, parseInt(amount));
  //   setToWalletId(""); // 입력 초기화
  //   setAmount("");
  // };

  // 알림 생성 함수
  const handleCreateNotification = async (transactionId, amount) => {
    try {
      // 여기서는 실제 알림을 생성하는 API 호출
      await createNotification(toWalletId, amount); // toWalletId는 거래 받는 지갑 ID, amount는 거래 금액
      console.log(
        `알림 생성 성공: 거래 ID ${transactionId}, 입금자 ID ${toWalletId}, 금액 ${amount}`
      );
    } catch (error) {
      console.error("알림 생성 중 오류 발생:", error);
    }
  };

  const handleTransfer = async () => {
    if (!toWalletId || !amount || parseInt(amount) <= 0) {
      alert("올바른 수신 지갑 ID와 금액을 입력하세요.");
      return;
    }

    // ✅ 출발 지갑 상태 확인
    const wallet = await getWalletByMemberId(fromWalletId);
    if (!wallet) {
      setError("지갑 정보를 찾을 수 없습니다.");
      return;
    }

    if (wallet.locked) {
      console.log("wallet data: ", wallet);
      setError("❌ 해당 회원은 추심 대상입니다.");
      return;
    }

    // 송금 로직
    const transactionId = `${Date.now()}`; // 예시로 transactionId 생성 (실제 구현에 맞게 수정 필요)

    onTransfer(toWalletId, parseInt(amount));

    // 알림 생성 호출
    handleCreateNotification(transactionId, amount);
    console.log("transactionId, amount", transactionId, amount);

    setToWalletId(""); // 입력 초기화
    setAmount("");
  };

  return (
    <div className="page-container">
      <h2 className="page-title">지갑 간 송금</h2>

      <div className="form-group">
        <label htmlFor="fromWalletId">출발 지갑 ID: </label>
        <input type="text" id="fromWalletId" value={fromWalletId} readOnly />
      </div>

      <div className="form-group">
        <label htmlFor="toWalletId">수신 지갑 ID:</label>
        <input
          type="text"
          id="toWalletId"
          value={toWalletId}
          placeholder="ID앞에 'w_' 를 붙혀주세요."
          onChange={(e) => setToWalletId(e.target.value)}
        />
      </div>

      <div className="form-group">
        <label htmlFor="amount">송금 금액:</label>
        <input
          type="number"
          id="amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
      </div>

      <button className="button-w" onClick={handleTransfer}>
        송금
      </button>
    </div>
  );
};

export default WalletTransferComponent;
