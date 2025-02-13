import React, { useEffect, useState } from "react";
import {
  transferFromWalletToAccount,
  transferFromAccountToWallet,
} from "../../api/walletApi";
import { getCookie } from "../../util/cookieUtil";
import "./TransferComponent.css";
import { useNavigate } from "react-router-dom";
const TransferComponent = () => {
  const [memberId, setMemberId] = useState("");
  const [amount, setAmount] = useState("");
  const [direction, setDirection] = useState("wallet-to-account");
  const [message, setMessage] = useState(""); // 결과 메시지
  const navigate = useNavigate();

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

  const handleinfo = () => {
    navigate("/member/mypage");
  };

  return (
    <div className="page-container">
      <h2 className="page-title">계좌 ↔ 지갑 송금</h2>

      <div className="form-group">
        <label htmlFor="memberId">회원 ID:</label>
        <input type="text" id="memberId" value={memberId} readOnly />
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

      <div className="form-group">
        <label htmlFor="direction">송금 방향:</label>
        <select
          id="direction"
          value={direction}
          onChange={(e) => setDirection(e.target.value)}
        >
          <option value="wallet-to-account">지갑 → 계좌</option>
          <option value="account-to-wallet">계좌 → 지갑</option>
        </select>
      </div>

      <button className="button-t" onClick={handleTransfer}>
        송금
      </button>

      {message && (
        <div className="info-box">
          <p className="info-message">{message}</p>

          {/* ✅ message가 있을 때만 버튼이 나타남 */}
          <button className="info-button" onClick={handleinfo}>
            확인
          </button>
        </div>
      )}
    </div>
  );
};

export default TransferComponent;
