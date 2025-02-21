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
import BasicLayout from "../../layouts/BasicLayout";
import { useNavigate } from "react-router-dom";
import ContractProgressComponent from "../../components/contract/ContractProgressComponent";

const MyPage = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [walletBalance, setWalletBalance] = useState(0);
  const [transactionsFrom, setTransactionsFrom] = useState([]);
  const [transactionsTo, setTransactionsTo] = useState([]);
  const [walletToWalletTransactions, setWalletToWalletTransactions] = useState(
    []
  );
  const [transactionCount, setTransactionCount] = useState(0); // 거래 횟수 추가
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [walletError, setWalletError] = useState(null);
  const [isWalletLocked, setIsWalletLocked] = useState(false); // 🔹 지갑 잠김 상태 추가
  const navigate = useNavigate(); // 리다이렉트에 사용

  const userId = localStorage.getItem("userId");
  const isLender = localStorage.getItem("isLender") === "true";

  useEffect(() => {
    console.log("🚀 [MyPage] 로컬 스토리지에서 userInfo 가져오기");
    const storedUserInfo = localStorage.getItem("member");
    if (storedUserInfo) {
      const user = JSON.parse(storedUserInfo);
      if (!userInfo || userInfo.id !== user.id) {
        console.log("userInfo 설정:", user);
        setUserInfo(user);
      }
    } else {
      alert("로그인 상태가 아닙니다.");
      navigate("/member/login");
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
          console.log("⚠️ 해당 회원의 지갑이 없습니다.");
          setWalletBalance(null); // 지갑이 없으면 null 설정
          setWalletError("지갑이 없습니다");
          return;
        }

        // // ✅ 지갑이 있지만 잠긴 경우 (추심 상태)
        // if (walletData.locked) {
        //   console.log("⚠️ 현재 추심 상태입니다.");
        //   setWalletBalance(null); // 잔액도 null 처리
        //   setWalletError(walletData.message); // "❌ 현재 추심 상태입니다. 지갑 사용이 제한됩니다."
        //   return;
        // }
        // ✅ 지갑이 잠긴 경우
        if (walletData.locked) {
          console.log("⚠️ 현재 추심 상태입니다.");
          setWalletBalance(null);
          setIsWalletLocked(true); // 🔹 지갑 잠김 상태 설정
          setWalletError("❌ 현재 추심 진행 중입니다. 지갑 사용이 제한됩니다.");
        } else {
          // ✅ 지갑이 다시 활성화된 경우
          console.log("✅ 추심 해제됨! 정상 사용 가능");
          setIsWalletLocked(false); // 🔄 다시 활성화
          setWalletError(null); // 에러 메시지 초기화
          setWalletBalance(walletData.balance);
          setTransactionCount(walletData.transactionCount);

          setWalletBalance(walletData.balance);
          setTransactionCount(walletData.transactionCount); // ✅ 거래 횟수 설정

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
        }
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
          <div className="mypage-contract">
            {/* ✅ 계약 내역 보기 버튼 */}
            <div className="mypage-contract-btn">
              <button
                onClick={() => navigate("/member/contract-history")}
                className="mypage-contract-btn-btn"
              >
                계약 내역 보기
              </button>
            </div>
            {/* ✅ 진행 중인 계약만 표시 */}
            <div className="mypage-contract-ing">
              <ContractProgressComponent userId={userId} isLender={isLender} />
            </div>
          </div>
          <MyPageComponent
            userInfo={userInfo}
            walletBalance={walletBalance}
            transactionCount={transactionCount} // ✅ 거래 횟수 추가
            transactionsFrom={transactionsFrom}
            transactionsTo={transactionsTo}
            walletToWalletTransactions={walletToWalletTransactions}
            walletError={walletError} // 지갑 오류 상태 전달
          />
        </BasicLayout>
      </div>
    </div>
  );
};

export default MyPage;
