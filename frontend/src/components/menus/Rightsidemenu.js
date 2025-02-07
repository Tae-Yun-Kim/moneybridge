import "./BasicMenu.css"; // 일반 CSS import
import run from "../../images/따봉도로롱.gif";
<<<<<<< HEAD
import LoanProductList from "./LoanProductList";
import Chatbot from "../../Chatbot";
import { useState } from "react";

const Rightsidemenu = () => {
  const [isChatbotOpen, setIsChatbotOpen] = useState(false); // 챗봇 열림 상태 관리

  const toggleChatbot = () => {
    setIsChatbotOpen((prev) => !prev); // 열고 닫기 토글
  };

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
      {/* 챗봇 기능 */}
      <div className="menu-box chatbot-section">
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
      </div>

      {/* 첫 번째 박스
=======

const Rightsidemenu = () => {
  return (
    <div className="flex flex-col">
      {/* 첫 번째 박스 */}
>>>>>>> c18324b9960a4447aa724017219b545b773bffeb
      <div className="menu-box">
        <h3>챗봇기능칸</h3>
        <div className="textarea-box">
          <textarea rows="4" placeholder="아직 미구현..."></textarea>
        </div>
<<<<<<< HEAD
      </div> */}
      {/* 두 번째 박스
=======
      </div>

      {/* 두 번째 박스 */}
>>>>>>> c18324b9960a4447aa724017219b545b773bffeb
      <div className="menu-box green">
        <h3>월간기부현황</h3>
        <div className="image-container">
          <img src={run} alt="Logo" />
        </div>
<<<<<<< HEAD
      </div> */}
=======
      </div>
>>>>>>> c18324b9960a4447aa724017219b545b773bffeb
    </div>
  );
};

export default Rightsidemenu;
