import React, { useState } from "react";
import "./LoanCalculator.css"; // ✅ CSS 파일 추가

const LoanCalculator = () => {
  const [loanAmount, setLoanAmount] = useState(""); // 대출 금액
  const [interestRate, setInterestRate] = useState(""); // 이자율 (고정 이자)
  const [totalPayment, setTotalPayment] = useState(null); // 총 상환금액

  const calculateLoan = () => {
    if (!loanAmount || !interestRate) {
      alert("모든 값을 입력해주세요.");
      return;
    }

    const P = parseFloat(loanAmount); // 대출 원금
    const r = parseFloat(interestRate) / 100; // 이자율 (소수 변환)

    // 총 상환 금액 (원금 + 고정 이자)
    const total = P + P * r;

    setTotalPayment(total.toLocaleString("ko-KR")); // 소수점 둘째자리까지 표시
  };

  return (
    <div className="loan-calculator">
      <h2>💰 대출 이자 계산기</h2>
      <p>상환금을 예측해보세요.</p>
      <div className="input-container">
        <label>대출 금액 (원):</label>
        <input
          type="number"
          value={loanAmount}
          onChange={(e) => setLoanAmount(e.target.value)}
          placeholder="예: 5000000"
        />
      </div>
      <div className="input-container">
        <label>이자율 (%):</label>
        <input
          type="number"
          value={interestRate}
          onChange={(e) => setInterestRate(e.target.value)}
          placeholder="예: 2"
        />
      </div>
      <button onClick={calculateLoan}>계산하기</button>

      {totalPayment && (
        <div className="result-container">
          <p>
            📌 <b>총 상환금:</b> {totalPayment} 원
          </p>
        </div>
      )}
    </div>
  );
};

export default LoanCalculator;
