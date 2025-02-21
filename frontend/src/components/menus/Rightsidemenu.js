import InterestRateChart from "../../InterestRateChart";
import "./BasicMenu.css"; // 일반 CSS import
import LoanProductList from "./LoanProductList";

const Rightsidemenu = () => {
  return (
    <div className="right">
      {/* 두 번째 박스 */}
      <div className="menu-box right">
        <h3>은행대출이자율</h3>
        <div className="image-container">
          {/* <img src={dororong} alt="Logo" /> */}
          <div>
            <LoanProductList />
          </div>
        </div>
      </div>
      <div>
        <InterestRateChart />
      </div>
    </div>
  );
};

export default Rightsidemenu;
