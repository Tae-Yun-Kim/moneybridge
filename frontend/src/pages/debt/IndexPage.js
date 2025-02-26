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
import DebtuserList from "../../components/debt/DebtuserList";
import DebtadminList from "../../components/debt/DebtadminList"; // ✅ 관리자용 컴포넌트 추가

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
  const navigate = useNavigate(); // 리다이렉트에 사용

  // ✅ localStorage에서 사용자 정보 가져오기
  const userData = localStorage.getItem("member");
  const user = userData ? JSON.parse(userData) : null;
  const userId = user?.id || null;
  const isLender = user?.isLender || false;
  const isAdmin = user?.role === "ROLE_ADMIN"; // ✅ 관리자 여부 체크

  useEffect(() => {
    console.log("🚀 [MyPage] 로컬 스토리지에서 userInfo 가져오기");
    if (!user) {
      alert("로그인 상태가 아닙니다.");
      navigate("/member/login");
    } else {
      setUserInfo(user);
    }
  }, []);

  return (
    <div className="mypage-container">
      <div className="mypage-content">
        <BasicLayout>
          {/* ✅ ROLE_ADMIN이면 DebtadminList, 그 외에는 DebtuserList */}
          {isAdmin ? (
            <DebtadminList />
          ) : (
            <DebtuserList userId={userId} isLender={isLender} />
          )}
        </BasicLayout>
      </div>
    </div>
  );
};

export default MyPage;
