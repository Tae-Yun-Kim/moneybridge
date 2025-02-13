import "./BasicMenu.css"; // 일반 CSS import
import dororong from "../../images/윈드밀도로롱.gif";
import LoanProductList from "./LoanProductList";
import TopMembersList from "./TopMembersList";
import VideoSequence from "../../pages/VideoSequence";
import "../../pages/Page.css";
import DonationProgress from "./DonationProgress";

const Leftsidemenu = () => {
  return (
    <div className="flex flex-col">
      {/* 첫 번째 박스 */}
      <div className="menu-box">
        <h3>회원신용도 순위 TOP 10</h3>
        <div>
          <TopMembersList />
        </div>
      </div>

      {/* 두 번째 박스 */}
      <div className="donation-container">
        <DonationProgress donation={50} goal={100} />
      </div>
      {/* <div>
        <VideoSequence />
      </div> */}
      {/* <div className="menu-box green">
        <h3>은행대출이자율API</h3>
        <div className="image-container">
          {/* <img src={dororong} alt="Logo" />
          <div>
            <LoanProductList />
          </div>
        </div>
      </div> */}
    </div>
  );
};

export default Leftsidemenu;
