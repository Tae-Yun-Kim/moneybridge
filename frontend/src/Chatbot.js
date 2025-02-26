import React, { useState } from "react";
import "./Chatbot.css";
import "./pages/member/MyPage.css";
import SpeachToText from "./SpeachToText";

function Chatbot() {
  const [isChatbotOpen, setIsChatbotOpen] = useState(false); // 챗봇 열림 상태
  const [message, setMessage] = useState("");
  // const [response, setResponse] = useState("");
  const [messages, setMessages] = useState([]); // ✅ 대화 내역 저장

  const toggleChatbot = () => {
    setIsChatbotOpen((prev) => !prev); // 챗봇 열고 닫기 토글
  };

  const sendMessage = async (e, voiceMessage = null) => {
    if (e) e.preventDefault();

    const inputMessage = voiceMessage || message;

    if (!message.trim()) return;

    // ✅ 사용자 메시지를 추가
    setMessages((prevMessages) => [
      ...prevMessages,
      { role: "user", content: message },
    ]);

    // 메시지에 따라 엔드포인트 결정
    let endpoint = "http://localhost:7000/info";
    if (inputMessage.match(/\d+만원|\d+억|\d+천/)) {
      endpoint = "http://localhost:7000/filter";
    } else if (voiceMessage) {
      endpoint = "http://localhost:7000/voice-chat";
    }

    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: inputMessage }),
    });

    const data = await res.json();
    //   setResponse(data.response);
    // };

    // ✅ 챗봇 응답을 추가
    setMessages((prevMessages) => [
      ...prevMessages,
      { role: "bot", content: data.response },
    ]);

    setMessage(""); // 입력창 초기화
  };

  return (
    <div>
      {/* 챗봇 아이콘 */}
      <div
        style={{
          position: "fixed",
          top: "7%",
          right: "10%",
          zIndex: 1000,
        }}
      >
        <button
          onClick={toggleChatbot}
          style={{ border: "none", background: "none" }}
        >
          <img
            src={require("./images/chatbot_inverted.png")} // 챗봇 아이콘 경로
            alt="챗봇 열기"
            style={{
              width: "70px",
              height: "70px",
              borderRadius: "50%",
              boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
              cursor: "pointer",
            }}
          />
        </button>
      </div>

      {/* 챗봇 창 */}
      {isChatbotOpen && (
        <div
          className="chatbot"
          style={{
            position: "fixed",
            bottom: "50px",
            right: "150px",
            width: "500px",
            height: "700px",
            backgroundColor: "#fff",
            border: "1px solid #ddd",
            borderRadius: "10px",
            boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
            zIndex: 1001,
          }}
        >
          <h2 className="chatbot-header">💬 챗봇</h2>
          {/* ✅ 채팅 내역 표시 */}
          <div className="chatbot-content">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={msg.role === "user" ? "user-message" : "bot-message"}
              >
                {msg.role === "bot" ? (
                  <div
                    className="chatbot-response"
                    dangerouslySetInnerHTML={{ __html: msg.content }}
                  />
                ) : (
                  <div>{msg.content}</div>
                )}
              </div>
            ))}
          </div>

          {/* <div>
            <div
              className="chatbot-response"
              dangerouslySetInnerHTML={{
                __html: "" || "챗봇과 대화해보세요!",
              }}
            />
          </div> */}
          <form className="chatbot-form" onSubmit={sendMessage}>
            <input
              type="text"
              placeholder="질문을 입력하세요..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="chatbot-input"
            />
            <button type="submit" className="chatbot-send">
              보내기
            </button>
          </form>

          <SpeachToText onSend={(newMessages) => setMessages(newMessages)} />
        </div>
      )}
    </div>
  );
}

export default Chatbot;
