import "./BasicMenu.css"; // 일반 CSS import
import run from "../../images/따봉도로롱.gif";

const Rightsidemenu = () => {
  return (
    <div className="flex flex-col">
      {/* 첫 번째 박스 */}
      <div className="menu-box">
        <h3>챗봇기능칸</h3>
        <div className="textarea-box">
          <textarea rows="4" placeholder="아직 미구현..."></textarea>
        </div>
      </div>

      {/* 두 번째 박스 */}
      <div className="menu-box green">
        <h3>월간기부현황</h3>
        <div className="image-container">
          <img src={run} alt="Logo" />
        </div>
      </div>
    </div>
  );
};

export default Rightsidemenu;
