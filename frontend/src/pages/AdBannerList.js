import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "./AdBannerList.css";

const adBanners = [
  {
    id: 1,
    image: "images/trust6.jpg",
    title: " MoneyBridge - 개인 간 대출 플랫폼",
    description: "안전한 P2P 대출을 MoneyBridge에서 시작하세요!",
    buttonText: "시작하기",
    link: "/member/login",
    bgColor: "rgb(253, 253, 175)", // 연한 노란색 (기존)
  },
  {
    id: 2,
    image: "images/thecheat6.png",
    title: "금융 사기 방지",
    description: "더치트에서 사기 번호, 계좌번호 조회하고 안전한 거래하세요!",
    buttonText: "바로가기",
    link: "https://www.thecheat.co.kr/",
    bgColor: "rgb(204, 229, 255)", // 연한 파란색 (신뢰감)
  },
  {
    id: 3,
    image: "images/credit.jpg",
    title: "신용 등급 올리는 방법",
    description: "신용 관리로 미래를 준비하세요! 자세한 가이드를 확인하세요.",
    buttonText: "신용관리 가이드",
    link: "https://www.credit.co.kr/ib20/mnu/BZWMCLMCU10",
    bgColor: "rgb(204, 255, 204)",
  },
];

const AdBannerList = () => {
  //   return (
  //     <div className="ad-banner-container">
  //       <Swiper
  //         modules={[Navigation, Pagination]}
  //         spaceBetween={20}
  //         slidesPerView={1}
  //         navigation
  //         pagination={{ clickable: true }}
  //         // autoplay={{ delay: 5000 }}
  //         loop
  //       >
  //         {adBanners.map((banner) => (
  //           <SwiperSlide key={banner.id}>
  //             <a
  //               href={banner.link}
  //               target="_blank"
  //               rel="noopener noreferrer"
  //               className="ad-banner"
  //             >
  //               <img
  //                 src={banner.image}
  //                 alt={banner.title}
  //                 className="ad-banner-img"
  //               />
  //               <div className="ad-banner-text">
  //                 <h3>{banner.title}</h3>
  //                 <p>{banner.description}</p>
  //               </div>
  //             </a>
  //           </SwiperSlide>
  //         ))}
  //       </Swiper>
  //     </div>
  //   );
  return (
    <div className="ad-banner-container">
      {/* 🔹 Swiper 바깥에 커스텀 네비게이션 버튼 추가 */}
      <div className="custom-prev-ad">〈</div>
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        spaceBetween={20}
        slidesPerView={1}
        navigation={{
          nextEl: ".custom-next-ad",
          prevEl: ".custom-prev-ad",
        }}
        pagination={{ clickable: true }}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        loop
      >
        {adBanners.map((banner) => (
          <SwiperSlide
            key={banner.id}
            style={{ backgroundColor: banner.bgColor }}
          >
            <div className="ad-banner">
              <img
                src={banner.image}
                alt={banner.title}
                className="ad-banner-img"
              />
              <div className="ad-banner-text">
                <h3>{banner.title}</h3>
                <p>{banner.description}</p>
                <a
                  href={banner.link}
                  target={banner.link.startsWith("http") ? "_blank" : "_self"}
                  rel="noopener noreferrer"
                  className="ad-button"
                >
                  {banner.buttonText}
                </a>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
      <div className="custom-next-ad">〉</div>
    </div>
  );
};

export default AdBannerList;
