import "./BasicMenu.css"; // 일반 CSS import
import "./Footerbar.css";

const Footerbar = () => {
  const handleOpenNewPage = () => {
    window.open("/AdPage.html", "_blank"); // 새 탭으로 광고 열기
  };

  return (
    <div className="footer-container">
      {/* 두 번째 박스 */}
      {/* 고객센터 정보 */}
      <div className="sub">
        <div className="sub-box-f">
          <div className="sub-title">고객센터</div>
          <div className="sub-content">
            <div className="sub-phone">📞 1599-0000</div>
            <div className="sub-time">평일 9:30 - 18:00</div>
            <div className="sub-time">점심시간 12:00 - 13:00</div>
            <div className="sub-warning">(주말 및 공휴일 휴무)</div>
          </div>
        </div>

        {/* 대출 안내 */}
        <div className="sub-box-s">
          <div className="sub-title">개인 간 대출 중개 플랫폼</div>
          <div className="sub-content">
            <p>
              MoneyBridge는 **개인 간 대출(P2P)**을 중개하는 플랫폼으로,
              직접적인 대출 제공자가 아닙니다. MoneyBridge는 신용등급이 일정
              수준 이상인 개인들 간의 안전한 대출 거래를 지원하며, 신뢰할 수
              있는 금융 환경을 제공합니다.
            </p>
            <p>
              MoneyBridge에 등록된 모든 대출 거래는 합법적이고 신뢰할 수 있는
              기준에 따라 진행되며, 플랫폼은 거래 과정에서 발생하는 문제에 대해
              직접적인 책임을 지지 않습니다.
            </p>
            <p className="sub-highlight">
              📢 과도한 빚은 당신에게 큰 부담을 안겨줄 수 있습니다.
            </p>
          </div>
        </div>

        {/* 금리 및 상환안내 */}
        <div className="sub-box-t">
          <div className="sub-title">금리 및 상환안내</div>
          <div className="sub-content">
            <p>moneybridge는 본인이 제시한 이자에 따라 달라집니다.</p>
            <p>
              대출 상환 완료시 수수료가 부가되며 수수료는 10만원 단위로
              측정됩니다.(10만원당 수수료 100원)
            </p>
            <p>ex) 대출 금액 : 150만원 → 수수료 1500원 </p>
            <p className="sub-highlight">
              개인 간 대출이라도 대출 실행 시 귀하의 신용등급이 하락할 가능성이
              있으니 신중하게 판단하시기 바랍니다.
            </p>
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
