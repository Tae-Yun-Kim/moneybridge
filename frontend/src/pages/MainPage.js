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
import "./Page.css"; // CSS 파일 import
import { useEffect, useState } from "react";
import { getWalletByMemberId } from "../api/walletApi";
import DonationProgress from "../components/menus/DonationProgress";
import { getAllLoanPosts } from "../api/postApi";
import { getCommentsByPostId } from "../api/commentApi";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules"; // 여기서 가져옵니다
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Link } from "react-router-dom";
import LoanCalculator from "./LoanCalculator";
import AdBannerList from "./AdBannerList";

// 🔹 등급별 이모지 및 스타일 반환 함수
const getMedalIcon = (writerGrade) => {
  switch (writerGrade) {
    case "GOLD":
      return "🥇"; // 금메달
    case "SILVER":
      return "🥈"; // 은메달
    default:
      return "🥉"; // 그 외는 동메달
  }
};

const adBanners = [
  {
    id: 1,
    image: "/images/ad1_site_promo.jpg",
    title: "💰 MoneyBridge - 개인 간 대출 플랫폼",
    description: "안전한 P2P 대출을 MoneyBridge에서 시작하세요!",
    link: "/about", // 내부 페이지로 연결
  },
  {
    id: 2,
    image: "/images/ad2_fraud_prevention.jpg",
    title: "🚨 금융 사기 방지",
    description: "더치트에서 사기 번호, 계좌번호 조회하고 안전한 거래하세요!",
    link: "https://www.thecheat.co.kr/", // 더치트 외부 링크
  },
  {
    id: 3,
    image: "/images/ad3_credit_improve.jpg",
    title: "📈 신용 등급 올리는 방법",
    description: "신용 관리로 미래를 준비하세요! 자세한 가이드를 확인하세요.",
    link: "/credit-tips", // 내부 신용 등급 가이드 페이지
  },
];

// 메인페이지
const MainPage = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [walletBalance, setWalletBalance] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [postsByComments, setPostsByComments] = useState([]); // 댓글 많은 순
  const [postsByLatest, setPostsByLatest] = useState([]); // 최신순

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

  useEffect(() => {
    // 게시글 및 댓글 데이터 가져오기
    const fetchPosts = async () => {
      try {
        const response = await getAllLoanPosts(); // 게시글 데이터 가져오기
        console.log("게시글 데이터:", response);

        // 🔹 계약 완료("계약 완료") 또는 진행 중("진행 중") 상태의 게시글을 제외
        const filteredPosts = response.content.filter(
          (post) =>
            post.contractStatus !== "계약 완료" &&
            post.contractStatus !== "진행 중" &&
            post.contractStatus !== "계약 취소"
        );
        // 댓글 데이터 병합
        const processedPosts = await Promise.all(
          filteredPosts.map(async (post) => {
            console.log("✅ Post 데이터:", post);
            const comments = await getCommentsByPostId(post.id); // 댓글 데이터 가져오기
            return {
              ...post,
              comments: comments || [], // 댓글 데이터 추가
            };
          })
        );

        // 댓글 많은 순 정렬
        const sortedByComments = [...processedPosts].sort((a, b) => {
          const commentDiff = b.comments.length - a.comments.length; // 댓글 수 기준
          if (commentDiff !== 0) return commentDiff;
          return new Date(b.createdAt) - new Date(a.createdAt); // 최신순
        });

        // 최신순 정렬
        const sortedByLatest = [...processedPosts].sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );

        setPostsByComments(sortedByComments);
        setPostsByLatest(sortedByLatest);
      } catch (error) {
        console.error("게시글 또는 댓글 데이터 가져오기 실패:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  return (
    <BasicLayout>
      <div className="main-container-m">
        {/* 광고 배너 슬라이드 추가 */}
        <AdBannerList />

        {/* 댓글 많은 인기 게시글 */}
        <div className="main-box-m">
          <div className="main-title-container">
            <h2 className="main-title-m">댓글 많은 인기 빌려드려요🔥</h2>
            {/* 전체보기 버튼 */}
            <Link to="/post/list" className="view-all-link">
              전체보기
            </Link>
          </div>
          <div className="swiper-container">
            {loading ? (
              <p>로딩 중...</p>
            ) : postsByComments.length > 0 ? (
              <Swiper
                modules={[Navigation]}
                spaceBetween={20}
                slidesPerView={3}
                navigation={{
                  nextEl: ".comments-next", // 댓글 많은 게시글 화살표 클래스
                  prevEl: ".comments-prev",
                }}
                pagination={{ clickable: true }}
                loop
                breakpoints={{
                  1024: { slidesPerView: 3, spaceBetween: 20 }, // 화면이 클 때
                  768: { slidesPerView: 2, spaceBetween: 20 }, // 중간 크기
                  480: { slidesPerView: 1, spaceBetween: 20 }, // 모바일 크기
                }}
              >
                {postsByComments.slice(0, 10).map((post) => (
                  <SwiperSlide key={post.id}>
                    <Link
                      to={`/post/view/${post.id}`}
                      style={{ textDecoration: "none", color: "inherit" }}
                    >
                      <div className="post-card-m">
                        {/* <p>
                          작성 시간: {new Date(post.createdAt).toLocaleString()}
                        </p> */}
                        <h3>{post.title}</h3>
                        <h4>
                          <span className="medal">
                            {getMedalIcon(post.writerGrade?.[0])}
                          </span>{" "}
                          {post.writerId}
                        </h4>
                        <p>대출 금액: {post.loanAmount.toLocaleString()} 원</p>
                        <p>댓글 수: {post.comments.length}</p>
                      </div>
                    </Link>
                  </SwiperSlide>
                ))}
              </Swiper>
            ) : (
              <p>게시글이 없습니다.</p>
            )}
            {/* 커스텀 버튼 */}
            <div className="custom-prev comments-prev">〈</div>
            <div className="custom-next comments-next">〉</div>
          </div>
        </div>

        {/* 최신 게시글 */}
        <div className="main-box-m">
          <div className="main-title-container">
            <h2 className="main-title-m">신규 빌려드려요</h2>
            {/* 전체보기 버튼 */}
            <Link to="/post/list" className="view-all-link">
              전체보기
            </Link>
          </div>
          <div className="swiper-container">
            {loading ? (
              <p>로딩 중...</p>
            ) : postsByLatest.length > 0 ? (
              <Swiper
                modules={[Navigation]}
                spaceBetween={20}
                slidesPerView={3}
                navigation={{
                  nextEl: ".latest-next", // 최신 게시글 화살표 클래스
                  prevEl: ".latest-prev",
                }}
                pagination={{ clickable: true }}
                loop
                breakpoints={{
                  1024: { slidesPerView: 3 },
                  768: { slidesPerView: 2 },
                  480: { slidesPerView: 1 },
                }}
              >
                {postsByLatest.slice(0, 10).map((post) => (
                  <SwiperSlide key={post.id}>
                    <Link
                      to={`/post/view/${post.id}`}
                      style={{ textDecoration: "none", color: "inherit" }}
                    >
                      <div className="post-card-m">
                        <h3>{post.title}</h3>
                        <h4>
                          <span className="medal">
                            {getMedalIcon(post.writerGrade?.[0])}
                          </span>{" "}
                          {post.writerId}
                        </h4>
                        <p>대출 금액: {post.loanAmount.toLocaleString()} 원</p>
                        <p>댓글 수: {post.comments.length}</p>
                      </div>
                    </Link>
                  </SwiperSlide>
                ))}
              </Swiper>
            ) : (
              <p>게시글이 없습니다.</p>
            )}
            {/* 커스텀 화살표 */}
            <div className="custom-prev latest-prev">〈</div>
            <div className="custom-next latest-next">〉</div>
          </div>
        </div>

        <div className="main-box-m">
          <LoanCalculator />
        </div>
      </div>
    </BasicLayout>
  );
};

export default MainPage;
