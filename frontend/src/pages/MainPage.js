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

// 메인페이지
const MainPage = () => {
  return (
    <BasicLayout>
      <div className="main-container">
        {/* 첫 번째 박스 */}
        <div className="main-box">
          <div className="main-title">내정보</div>
          <ul className="main-list">
            <li>내등급</li>
            <li>페이금액</li>
            <li>대출/변제금액</li>
          </ul>
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
        </div>
      </div>
    </BasicLayout>
  );
};

export default MainPage;
