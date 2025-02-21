// import { Link } from "react-router-dom";
// import "../../pages/member/MyPage.css";

// const MyPageComponent = ({
//   userInfo,
//   walletBalance,
//   transactionsFrom,
//   transactionsTo,
//   walletToWalletTransactions,
// }) => {
//   if (!userInfo) {
//     return (
//       <div className="error-message">회원 정보가 없습니다. 로그인하세요.</div>
//     );
//   }

//   return (
//     <div className="mypage-component">
//       <h1 className="mypage-title">마이페이지</h1>
//       <div className="mt-4">
//         <p className="user-info">아이디: {userInfo.id}</p>
//         <p className="user-info">이름: {userInfo.name}</p>
//         <p className="user-info">이메일: {userInfo.email}</p>
//       </div>

//       <div className="relative mb-4 flex justify-center font-bold">
//         <Link
//           to="/member/update"
//           className="rounded p-4 w-36 bg-green-500 text-xl text-white text-center"
//         >
//           회원 수정
//         </Link>
//       </div>

//       {/* 지갑 정보 */}
//       <div className="mt-6">
//         <h2 className="text-2xl font-bold text-gray-700">지갑 정보</h2>
//         <p className="text-xl">잔액: {walletBalance.toLocaleString()} 원</p>
//       </div>

//       {/* 입금, 송금, 출금 버튼 */}
//       <div className="mt-6 flex justify-center space-x-4">
//         <div>
//           <Link
//             to="/wallet/transfer"
//             className="p-3 bg-green-500 text-white rounded shadow hover:bg-green-600"
//           >
//             입금/출금
//           </Link>
//         </div>
//         <div>
//           <Link
//             to="/wallet/wallet-transfer"
//             className="p-3 bg-blue-500 text-white rounded shadow hover:bg-blue-600"
//           >
//             송금
//           </Link>
//         </div>
//       </div>

//       {/* 송금 내역 */}
//       <div className="mt-6">
//         <h2 className="text-xl font-bold text-gray-700">출금 내역</h2>
//         <ul className="list-disc pl-6">
//           {transactionsFrom.map((transaction) => (
//             <li key={transaction.transactionId}>
//               <span>{transaction.createdAt}: </span>
//               <span>{transaction.amount.toLocaleString()} 원 </span>
//               <span>
//                 (
//                 {transaction.toWalletId === "N/A"
//                   ? "계좌"
//                   : transaction.toWalletId}
//                 )
//               </span>
//             </li>
//           ))}
//         </ul>
//       </div>

//       {/* 입금 내역 */}
//       <div className="mt-6">
//         <h2 className="text-xl font-bold text-gray-700">입금 내역</h2>
//         <ul className="list-disc pl-6">
//           {transactionsTo.map((transaction) => (
//             <li key={transaction.transactionId}>
//               <span>{transaction.createdAt}: </span>
//               <span>{transaction.amount.toLocaleString()} 원 </span>
//               <span>
//                 (
//                 {transaction.fromWalletId === "N/A"
//                   ? "계좌"
//                   : transaction.fromWalletId}
//                 )
//               </span>
//             </li>
//           ))}
//         </ul>
//       </div>

//       {/* 지갑 간 거래 내역 */}
//       <div className="mt-6">
//         <h2 className="text-xl font-bold text-gray-700">거래 내역</h2>
//         <ul className="list-disc pl-6">
//           {walletToWalletTransactions.map((transaction) => (
//             <li key={transaction.transactionId}>
//               <span>{transaction.createdAt}: </span>
//               <span>{transaction.amount.toLocaleString()} 원 </span>
//               <span>
//                 (보낸 지갑: {transaction.fromWalletId}, 받는 지갑:{" "}
//                 {transaction.toWalletId})
//               </span>
//             </li>
//           ))}
//         </ul>
//       </div>
//     </div>
//   );
// };

// export default MyPageComponent;

import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "../../pages/member/MyPage.css";

const MyPageComponent = ({
  userInfo,
  walletBalance,
  transactionsFrom,
  transactionsTo,
  walletToWalletTransactions,
  walletError,
  transactionCount,
}) => {
  const navigate = useNavigate();

  const getTransactionLevel = (count) => {
    return count >= 30 ? "30+" : count; // 100 이상이면 100+ 표시
  };

  const getGaugeWidth = (count) => {
    return Math.min((count / 30) * 100, 100); // 최대 100%까지만 차도록 설정
  };

  if (!userInfo) {
    return (
      <div className="error-message">회원 정보가 없습니다. 로그인하세요.</div>
    );
  }

  return (
    <div className="mypage-component">
      {/* 제목 */}
      <h1 className="mypage-title">내 지갑</h1>

      {/* 회원 정보와 지갑 정보를 나란히 배치 */}
      <div className="user-wallet-container">
        {/* 회원 정보 */}
        <div className="user-info-box">
          <h2 className="section-title">회원 정보</h2>
          <div className="infoi">
            <p>아이디: {userInfo.id}</p>
            <p className="infon">이름: {userInfo.name}</p>
          </div>
          <p>이메일: {userInfo.email}</p>
          <p>등급: {userInfo.grade}</p>
          <div className="button-group" style={{ marginTop: "10px" }}>
            <Link to="/member/update" className="bg-green button">
              회원 수정
            </Link>
            <Link to="/member/delete" className="bg-green button">
              회원 탈퇴
            </Link>
          </div>
        </div>

        {/* 지갑 정보
        <div className="wallet-info-box">
          <h2 className="section-title">지갑 정보</h2>
          {walletBalance !== null ? (
            <>
              <p>잔액: {walletBalance.toLocaleString()} 원</p>
              <div className="button-group">
                <Link to="/wallet/transfer" className="bg-green button">
                  입금/출금
                </Link>
                <Link to="/wallet/wallet-transfer" className="bg-blue button">
                  송금
                </Link>
              </div>
            </>
          ) : (
            <>
              <p className="no-wallet">🚨 {walletError} </p>
              <button
                className="btn-create-wallet"
                onClick={() => navigate("/wallet/create")}
              >
                지갑 생성
              </button>
            </>
          )}
        </div> */}
        <div className="wallet-wrapper">
          {/* 지갑 정보 */}
          <div className="wallet-info-box">
            <h2 className="section-title">지갑 정보</h2>
            {walletError ===
            "❌ 현재 추심 진행 중입니다. 지갑 사용이 제한됩니다." ? (
              <p className="wallet-locked-message">🚨 {walletError}</p>
            ) : walletBalance !== null ? (
              <>
                <p>잔액: {walletBalance.toLocaleString()} 원</p>
                <div className="button-group">
                  <Link to="/wallet/transfer" className="bg-green button">
                    입금/출금
                  </Link>
                  <Link to="/wallet/wallet-transfer" className="bg-blue button">
                    송금
                  </Link>
                </div>
              </>
            ) : (
              <>
                <p className="no-wallet">🚨 지갑이 없습니다.</p>
                <button
                  className="btn-create-wallet"
                  onClick={() => navigate("/wallet/create")}
                >
                  지갑 생성
                </button>
              </>
            )}
          </div>
          {/* 거래 횟수 (아래쪽) */}
          <div className="wallet-info-box-c">
            <p className="transaction-count">
              거래 횟수: {getTransactionLevel(transactionCount)} 회
            </p>
            <div className="transaction-gauge-container">
              {/* 눈금 위에 숫자 표시 */}
              <div className="gauge-labels">
                <span className="gauge-label" style={{ left: "33%" }}>
                  10
                </span>
                <span className="gauge-label" style={{ left: "66%" }}>
                  20
                </span>
                <span
                  className="gauge-label last-label"
                  style={{ right: "0%" }}
                >
                  30+
                </span>
              </div>

              {/* 게이지 바 */}
              <div className="transaction-gauge">
                {/* 눈금 추가 */}
                <div className="gauge-ticks">
                  <div className="tick" style={{ left: "33%" }}></div>
                  <div className="tick" style={{ left: "66%" }}></div>
                </div>

                {/* 게이지 채우기 */}
                <div
                  className="transaction-gauge-fill"
                  style={{
                    width: `${(transactionCount / 30) * 100}%`,
                    background: `linear-gradient(
                                      to right,
                                    #f44336 0%,   /* 빨강 (0 거래) */
                                    #ff9800 30%,  /* 주황 (10 거래) */
                                    #ffeb3b 60%,  /* 노랑 (20 거래) */
                                    #4caf50 100%  /* 초록 (30+ 거래) */
                                      )`,
                  }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 송금 내역 */}
      <div className="withdraw">
        <h2 className="section-title">출금 내역</h2>
        <ul className="list-disc">
          {transactionsFrom.map((transaction) => (
            <li key={transaction.transactionId}>
              {transaction.createdAt}: {transaction.amount.toLocaleString()} 원
              (
              {transaction.toWalletId === "N/A"
                ? "계좌"
                : transaction.toWalletId}
              )
            </li>
          ))}
        </ul>
      </div>

      {/* 입금 내역 */}
      <div className="deposit">
        <h2 className="section-title">입금 내역</h2>
        <ul className="list-disc">
          {transactionsTo.map((transaction) => (
            <li key={transaction.transactionId}>
              {transaction.createdAt}: {transaction.amount.toLocaleString()} 원
              (
              {transaction.fromWalletId === "N/A"
                ? "계좌"
                : transaction.fromWalletId}
              )
            </li>
          ))}
        </ul>
      </div>

      {/* 거래 내역 */}
      <div className="transfer">
        <h2 className="section-title">거래 내역</h2>
        <ul className="list-disc">
          {walletToWalletTransactions.map((transaction) => (
            <li key={transaction.transactionId}>
              {transaction.createdAt}: {transaction.amount.toLocaleString()} 원
              ( 보낸 지갑: {transaction.fromWalletId}, 받는 지갑:{" "}
              {transaction.toWalletId})
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default MyPageComponent;
