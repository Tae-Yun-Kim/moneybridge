// import { useEffect, useState } from "react";
// import BasicMenu from "../../components/menus/BasicMenu";
// import MyPageComponent from "../../components/member/MyPageComponent";
// import {
//   getTransactionsFromWallet,
//   getTransactionsToWallet,
//   getWalletByMemberId,
// } from "../../api/walletApi";

// const MyPage = () => {
//   const [userInfo, setUserInfo] = useState(null);
//   const [walletBalance, setWalletBalance] = useState(0); // 초기 잔액
//   const [transactionsFrom, setTransactionsFrom] = useState([]); // 송금 내역
//   const [transactionsTo, setTransactionsTo] = useState([]); // 입금 내역
//   const [walletToWalletTransactions, setWalletToWalletTransactions] = useState(
//     []
//   ); // 지갑 간 거래 내역
//   const [loading, setLoading] = useState(true); // 로딩 상태
//   const [error, setError] = useState(null); // 에러 상태
//   //   useEffect(() => {
//   //     // 로컬 스토리지에서 회원 정보 가져오기
//   //     const storedUserInfo = localStorage.getItem("member");
//   //     if (storedUserInfo) {
//   //       setUserInfo(JSON.parse(storedUserInfo)); // JSON 문자열을 객체로 변환
//   //     }
//   //   }, []);

//   // **로컬 스토리지에서 userInfo 가져오기**
//   useEffect(() => {
//     console.log("🚀 [MyPage] 로컬 스토리지에서 userInfo 가져오기");
//     const storedUserInfo = localStorage.getItem("member");
//     if (storedUserInfo) {
//       const user = JSON.parse(storedUserInfo);

//       // 불필요한 업데이트 방지
//       if (!userInfo || userInfo.id !== user.id) {
//         console.log("userInfo 설정:", user);
//         setUserInfo(user);
//       }
//     }
//   }, []); // ✅ 한 번만 실행

//   // **userInfo가 설정된 경우 지갑 데이터 가져오기**
//   useEffect(() => {
//     if (!userInfo) return; // userInfo가 없으면 실행하지 않음

//     console.log("🔄 [MyPage] userInfo 기반으로 지갑 데이터 요청 시작");

//     const fetchWalletData = async () => {
//       try {
//         setLoading(true); // 로딩 시작

//         // 1. 지갑 데이터 가져오기
//         const walletData = await getWalletByMemberId(userInfo.id);
//         console.log("지갑 데이터 가져옴:", walletData);

//         if (!walletData || !walletData.walletId) {
//           throw new Error("지갑 데이터가 올바르지 않습니다.");
//         }
//         setWalletBalance(walletData.balance); // 지갑 잔액 설정

//         // 2. 송금 내역 필터링
//         const fromTransactions = await getTransactionsFromWallet(
//           walletData.walletId
//         );
//         const filteredFromTransactions = fromTransactions.filter(
//           (transaction) => transaction.toWalletId === "N/A"
//         );
//         setTransactionsFrom(filteredFromTransactions);

//         // 3. 입금 내역 필터링
//         const toTransactions = await getTransactionsToWallet(
//           walletData.walletId
//         );
//         const filteredToTransactions = toTransactions.filter(
//           (transaction) => transaction.fromWalletId === "N/A"
//         );
//         setTransactionsTo(filteredToTransactions);

//         // 4. 지갑 간 거래 필터링
//         const walletToWalletFrom = fromTransactions.filter(
//           (transaction) => transaction.toWalletId !== "N/A"
//         );
//         const walletToWalletTo = toTransactions.filter(
//           (transaction) => transaction.fromWalletId !== "N/A"
//         );
//         setWalletToWalletTransactions([
//           ...walletToWalletFrom,
//           ...walletToWalletTo,
//         ]);
//       } catch (error) {
//         console.error("지갑 데이터 가져오는 중 에러 발생:", error.message);
//         setError(error.message);
//       } finally {
//         setLoading(false); // 로딩 종료
//       }
//     };

//     fetchWalletData();
//   }, [userInfo]); // ✅ userInfo가 변경될 때만 실행

//   if (loading) {
//     return <div className="loading-message">데이터를 불러오는 중입니다...</div>;
//   }

//   if (error) {
//     return <div className="error-message">오류 발생: {error}</div>;
//   }

//   return (
//     <div className="mypage-container">
//       <BasicMenu />

//       <div className="mypage-content">
//         <MyPageComponent
//           userInfo={userInfo}
//           walletBalance={walletBalance}
//           transactionsFrom={transactionsFrom}
//           transactionsTo={transactionsTo}
//           walletToWalletTransactions={walletToWalletTransactions} // 지갑 간 거래 전달
//         />
//       </div>
//     </div>
//   );
// };

// export default MyPage;

import { useEffect, useState } from "react";
import BasicMenu from "../../components/menus/BasicMenu";
import MyPageComponent from "../../components/member/MyPageComponent";
import {
  getTransactionsFromWallet,
  getTransactionsToWallet,
  getWalletByMemberId,
} from "../../api/walletApi";
import { createNotification } from "../../api/notificationApi";  
import BasicLayout from "../../layouts/BasicLayout";

const MyPage = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [walletBalance, setWalletBalance] = useState(0);
  const [transactionsFrom, setTransactionsFrom] = useState([]);
  const [transactionsTo, setTransactionsTo] = useState([]);
  const [walletToWalletTransactions, setWalletToWalletTransactions] = useState(
    []
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  //
  const [prevTransactionsTo, setPrevTransactionsTo] = useState([]); // 이전 거래 내역 저장

  useEffect(() => {
    console.log("🚀 [MyPage] 로컬 스토리지에서 userInfo 가져오기");
    const storedUserInfo = localStorage.getItem("member");
    if (storedUserInfo) {
      const user = JSON.parse(storedUserInfo);
      if (!userInfo || userInfo.id !== user.id) {
        console.log("userInfo 설정:", user);
        setUserInfo(user);
      }
    }
  }, []);

  useEffect(() => {
    if (!userInfo) return;

    console.log("🔄 [MyPage] userInfo 기반으로 지갑 데이터 요청 시작");

    const fetchWalletData = async () => {
      try {
        setLoading(true);

        const walletData = await getWalletByMemberId(userInfo.id);
        console.log("지갑 데이터 가져옴:", walletData);

        if (!walletData || !walletData.walletId) {
          throw new Error("지갑 데이터가 올바르지 않습니다.");
        }
        setWalletBalance(walletData.balance);

        const fromTransactions = await getTransactionsFromWallet(
          walletData.walletId
        );
        const toTransactions = await getTransactionsToWallet(
          walletData.walletId
        );

        const filteredFromTransactions = fromTransactions.filter(
          (transaction) => transaction.toWalletId === "N/A"
        );
        const filteredToTransactions = toTransactions.filter(
          (transaction) => transaction.fromWalletId === "N/A"
        );

        const walletToWalletFrom = fromTransactions.filter(
          (transaction) => transaction.toWalletId !== "N/A"
        );
        const walletToWalletTo = toTransactions.filter(
          (transaction) => transaction.fromWalletId !== "N/A"
        );

        // 최신순 정렬 (날짜 기준)
        const sortByDateDesc = (transactions) =>
          transactions.sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
          );

        setTransactionsFrom(sortByDateDesc(filteredFromTransactions));
        setTransactionsTo(sortByDateDesc(filteredToTransactions));
        setWalletToWalletTransactions(
          sortByDateDesc([...walletToWalletFrom, ...walletToWalletTo])
        );
        
      } catch (error) {
        console.error("지갑 데이터 가져오는 중 에러 발생:", error.message);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchWalletData();
  }, [userInfo]);

  if (loading) {
    return <div className="loading-message">데이터를 불러오는 중입니다...</div>;
  }

  if (error) {
    return <div className="error-message">오류 발생: {error}</div>;
  }

  return (
    <div className="mypage-container">
      {/* <BasicMenu /> */}
      {/* <BasicLayout /> */}
      <div className="mypage-content">
        <BasicLayout>
          <MyPageComponent
            userInfo={userInfo}
            walletBalance={walletBalance}
            transactionsFrom={transactionsFrom}
            transactionsTo={transactionsTo}
            walletToWalletTransactions={walletToWalletTransactions}
          />
        </BasicLayout>
      </div>
    </div>
  );
};

export default MyPage;
