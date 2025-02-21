import React, { useEffect, useState } from "react";
import { createWallet } from "../../api/walletApi";
import { useNavigate } from "react-router-dom";
import "./CreateWalletComponent.css";
import { findMember } from "../../api/memberApi";

const CreateWalletComponent = () => {
  const [memberId, setMemberId] = useState("");
  const [pinNumber, setPinNumber] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const navigate = useNavigate();

  // ✅ 로컬 스토리지에서 회원 정보 불러오기
  useEffect(() => {
    const storedMember = localStorage.getItem("member"); // 저장된 회원 정보 가져오기
    if (storedMember) {
      const memberData = JSON.parse(storedMember); // JSON 문자열 → 객체 변환
      setMemberId(memberData.id);
      setAccountNumber(memberData.accountNumber);
    } else {
      alert("회원 정보가 없습니다. 다시 로그인해주세요.");
      navigate("/login"); // 로그인 페이지로 이동
    }
  }, [navigate]);

  const handleCreateWallet = async () => {
    try {
      const walletData = { memberId, accountNumber, pinNumber };
      const response = await createWallet(walletData);
      alert(`지갑 생성 성공! 지갑 ID: ${response.walletId}`);
      navigate("/member/mypage");
    } catch (error) {
      alert(`지갑 생성 실패: ${error.message}`);
    }
  };

  return (
    <div className="wallet-container">
      <h1 className="wallet-title">지갑 생성</h1>
      <div className="wallet-form">
        <div className="input-group">
          <label>회원 ID</label>
          <input type="text" value={memberId} disabled />
        </div>
        <div className="input-group">
          <label>계좌 번호</label>
          <input type="text" value={accountNumber} disabled />
        </div>
        <div className="input-group">
          <label>PIN 번호</label>
          <input
            type="password"
            placeholder="PIN 번호 입력"
            value={pinNumber}
            onChange={(e) => setPinNumber(e.target.value)}
          />
        </div>
        <button className="wallet-submit" onClick={handleCreateWallet}>
          지갑 생성
        </button>
      </div>
    </div>
  );
};

export default CreateWalletComponent;
