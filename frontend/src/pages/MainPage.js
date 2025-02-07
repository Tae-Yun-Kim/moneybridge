// import BasicLayout from "../layouts/BasicLayout";

// const MainPage = () => {
//   return (
//     <BasicLayout>
//       <div className="text-3xl">Main Page</div>
//     </BasicLayout>
//   );
// };

// export default MainPage;

import BasicLayout from "../layouts/BasicLayout";
import zannen from "../images/정말유감인.png";
import "./Page.css"; // CSS 파일 import
<<<<<<< HEAD
import { useEffect, useState } from "react";
import { getWalletByMemberId } from "../api/walletApi";
import VideoSequence from "./VideoSequence";
import DonationProgress from "../components/menus/DonationProgress";
=======
>>>>>>> c18324b9960a4447aa724017219b545b773bffeb

// 메인페이지
const MainPage = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [walletBalance, setWalletBalance] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    try {
      const storedUserInfo = localStorage.getItem("member");
      if (storedUserInfo) {
        setUserInfo(JSON.parse(storedUserInfo));
        console.log(
          "✅ [MainPage] 로컬 스토리지에서 userInfo 가져오기:",
          storedUserInfo
        );
      } else {
        console.log("❌ [MainPage] 로그인이 안 되어 있습니다.");
        setUserInfo(null); // 로그아웃 상태 처리
      }
    } catch (error) {
      console.error("로컬 스토리지 오류:", error);
      setUserInfo(null); // 에러 상태에서도 기본값 처리
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
      } catch (error) {
        console.error("지갑 데이터 가져오는 중 에러 발생:", error.message);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchWalletData();
  }, [userInfo]);

  return (
    <BasicLayout>
      <div className="main-container">
<<<<<<< HEAD
        {/* <div className="youtube">
          <VideoSequence />
        </div> */}
        {/* 첫 번째 박스 */}
        <div className="main-box">
          <VideoSequence />
          <div className="main-title">내정보</div>
          <div className="info">
            <p>내등급 : {userInfo?.grade || "로그인이 필요합니다"}</p>
            <p>페이금액 : {userInfo ? walletBalance : "로그인이 필요합니다"}</p>
            <p>
              대출/변제금액 :{" "}
              {userInfo ? "정보 제공 예정" : "로그인이 필요합니다"}
            </p>
          </div>
=======
        {/* 첫 번째 박스 */}
        <div className="main-box">
          <div className="main-title">내정보</div>
          <ul className="main-list">
            <li>내등급</li>
            <li>페이금액</li>
            <li>대출/변제금액</li>
          </ul>
>>>>>>> c18324b9960a4447aa724017219b545b773bffeb
        </div>

        {/* 두 번째 박스 */}
        <div className="sub-box">
          <div className="sub-title">주의</div>

          <div className="sub-content">
            {/* 이미지 */}
            <img src={zannen} alt="Logo" className="sub-image" />

            {/* 텍스트 */}
            <div className="sub-text">
              <div>-먹튀주의</div>
              <div>-먹튀당해도 해당사이트는 책임지지않음</div>
            </div>
          </div>
<<<<<<< HEAD
          <div className="donation-container">
            <DonationProgress donation={50} goal={100} />
          </div>
=======
>>>>>>> c18324b9960a4447aa724017219b545b773bffeb
        </div>
      </div>
    </BasicLayout>
  );
};

export default MainPage;
