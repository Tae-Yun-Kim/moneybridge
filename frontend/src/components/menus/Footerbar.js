import die from "../../images/죽을게.jpg";
import "./BasicMenu.css"; // 일반 CSS import

const Footerbar = () => {
  const handleOpenNewPage = () => {
    window.open("/AdPage.html", "_blank"); // 새 탭으로 광고 열기
  };

  return (
    <div className="footer-container">
      {/* 첫 번째 박스 */}
      <div
        className="ad-box"
        onClick={handleOpenNewPage} // 클릭 이벤트
      >
        <div className="ad-content">
<<<<<<< HEAD
          {/* <img src={die} alt="Logo" className="ad-image" /> */}
          <div className="ad-text">
            {/* <h2>광고API</h2> */}
=======
          <img src={die} alt="Logo" className="ad-image" />
          <div className="ad-text">
            <h2>광고API</h2>
>>>>>>> c18324b9960a4447aa724017219b545b773bffeb
            <div>과도한 빚은 당신에게 큰 불행을 안겨줄 수 있습니다.</div>
          </div>
        </div>
      </div>

      {/* 두 번째 박스 */}
      <div className="footer-info">
        <p>
          사업자등록번호: 888-484-1557 | 통신판매업신고번호:
          제888484-경기성남-1557호 | 대표이사: faker | 이메일: 0000@naver.com
          <br />
          주소: 안얄랴쥼 | 대표전화: 1557-1557 | 호스팅 서비스 제공: moneybridge
          <br />
          <strong>Copyright © moneybridge Corp. All Rights Reserved.</strong>
        </p>
      </div>
    </div>
  );
};

export default Footerbar;
