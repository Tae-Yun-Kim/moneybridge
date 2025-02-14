import React, { useState } from "react";
import "./WalletTransferComponent.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { createNotification } from "../../api/notificationApi";

const WalletTransferComponent = ({ fromWalletId, onTransfer }) => {
  const [toWalletId, setToWalletId] = useState("");
  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");

  const handleTransfer = async () => {
    if (!toWalletId || !amount || parseInt(amount) <= 0) {
      alert("올바른 수신 지갑 ID와 금액을 입력하세요.");
      return;
    }

    const transactionId = `${Date.now()}`;
    
    try {
      // 송금 시도하고 결과를 받음
      const isTransferSuccessful = await onTransfer(toWalletId, parseInt(amount));
      
      // 송금이 성공한 경우에만 알림 생성
      if (isTransferSuccessful) {
        try {
          await createNotification(toWalletId, amount);
          console.log(
            `알림 생성 성공: 거래 ID ${transactionId}, 입금자 ID ${toWalletId}, 금액 ${amount}`
          );
        } catch (notificationError) {
          console.error("알림 생성에 실패했습니다:", notificationError);
        }
      }

      // 송금 성공시에만 입력 필드 초기화
      if (isTransferSuccessful) {
        setToWalletId("");
        setAmount("");
        setError("");
      }
      
    } catch (error) {
      console.error("송금 처리 중 오류가 발생했습니다:", error);
      setError("송금 처리 중 오류가 발생했습니다.");
    }
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

      {error && <div className="error-message">{error}</div>}

      <button className="button-w" onClick={handleTransfer}>
        송금
      </button>
    </div>
  );
};

export default WalletTransferComponent;