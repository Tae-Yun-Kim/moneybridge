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
import { Link } from "react-router-dom";
import "../../pages/member/MyPage.css";

const MyPageComponent = ({
  userInfo,
  walletBalance,
  transactionsFrom,
  transactionsTo,
  walletToWalletTransactions,
}) => {
  if (!userInfo) {
    return (
      <div className="error-message">회원 정보가 없습니다. 로그인하세요.</div>
    );
  }

  return (
    <div className="mypage-component">
      {/* 제목 */}
<<<<<<< HEAD
      <h1 className="mypage-title">내 지갑</h1>
=======
      <h1 className="mypage-title">마이페이지</h1>
>>>>>>> c18324b9960a4447aa724017219b545b773bffeb

      {/* 회원 정보와 지갑 정보를 나란히 배치 */}
      <div className="user-wallet-container">
        {/* 회원 정보 */}
        <div className="user-info-box">
          <h2 className="section-title">회원 정보</h2>
<<<<<<< HEAD
          <div className="infoi">
            <p>아이디: {userInfo.id}</p>
            <p className="infon">이름: {userInfo.name}</p>
          </div>
          <p>이메일: {userInfo.email}</p>
          <p>등급: {userInfo.grade}</p>
=======
          <p>아이디: {userInfo.id}</p>
          <p>이름: {userInfo.name}</p>
          <p>이메일: {userInfo.email}</p>
>>>>>>> c18324b9960a4447aa724017219b545b773bffeb
          <div style={{ marginTop: "10px" }}>
            <Link to="/member/update" className="bg-green button">
              회원 수정
            </Link>
          </div>
        </div>

        {/* 지갑 정보 */}
        <div className="wallet-info-box">
          <h2 className="section-title">지갑 정보</h2>
          <p>잔액: {walletBalance.toLocaleString()} 원</p>
          <div className="button-group">
            <Link to="/wallet/transfer" className="bg-green button">
              입금/출금
            </Link>
            <Link to="/wallet/wallet-transfer" className="bg-blue button">
              송금
            </Link>
          </div>
        </div>
      </div>

      {/* 송금 내역 */}
<<<<<<< HEAD
      <div className="withdraw">
=======
      <div>
>>>>>>> c18324b9960a4447aa724017219b545b773bffeb
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
<<<<<<< HEAD
      <div className="deposit">
=======
      <div>
>>>>>>> c18324b9960a4447aa724017219b545b773bffeb
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
<<<<<<< HEAD
      <div className="transfer">
=======
      <div>
>>>>>>> c18324b9960a4447aa724017219b545b773bffeb
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
