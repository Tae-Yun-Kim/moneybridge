import "./BasicMenu.css"; // 일반 CSS import
import LoanProductList from "./LoanProductList";

const Rightsidemenu = () => {
  return (
    <div className="flex flex-col">
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
      {/* 챗봇 기능
      <div className="menu-box-chatbot-section">
        <button className="chatbot-toggle" onClick={toggleChatbot}>
          <img
            src={require("../../images/chatbot.png")} // 이미지 경로 확인
            alt="챗봇 열기"
            className="chatbot-icon"
          />
        </button>
        {isChatbotOpen && (
          <div className="chatbot-container">
            <Chatbot />
          </div>
        )}
      </div> */}
    </div>
  );
};

export default Rightsidemenu;
