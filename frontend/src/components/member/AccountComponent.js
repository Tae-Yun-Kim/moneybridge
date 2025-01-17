import React, { useState } from "react";
import { getAccountByNumber } from "../../api/accountApi";

const AccountComponent = () => {
  const [accountNumber, setAccountNumber] = useState("");
  const [accountDetails, setAccountDetails] = useState(null);
  const [error, setError] = useState("");

  const fetchAccountDetails = async () => {
    try {
      const data = await getAccountByNumber(accountNumber);
      setAccountDetails(data);
      setError(""); // 에러 초기화
    } catch (err) {
      setAccountDetails(null);
      setError(
        err.response?.data?.message ||
          "계좌 정보를 가져오는 중 오류가 발생했습니다."
      );
    }
  };

  return (
    <div>
      <h1>계좌 조회</h1>
      <input
        type="text"
        value={accountNumber}
        onChange={(e) => setAccountNumber(e.target.value)}
        placeholder="계좌번호를 입력하세요"
      />
      <button onClick={fetchAccountDetails}>조회</button>
      {accountDetails && (
        <div>
          <h2>계좌 정보</h2>
          <p>연동 ID: {accountDetails.memberId}</p>
          <p>계좌번호: {accountDetails.accountNumber}</p>
          <p>은행명: {accountDetails.bankName}</p>
          {/* <p>예금주명: {accountDetails.accountHolderName}</p> */}
        </div>
      )}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default AccountComponent;
