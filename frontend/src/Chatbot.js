import React, { useState } from "react";
import "./Chatbot.css";

function Chatbot() {
  const [message, setMessage] = useState("");
  const [response, setResponse] = useState("");

  const sendMessage = async (e) => {
    e.preventDefault();

    const res = await fetch("http://localhost:5000/info", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message }),
    });

    const data = await res.json();
    setResponse(data.response);
  };

  return (
    // <div>
    //   <h2>챗봇</h2>
    //   <form onSubmit={sendMessage}>
    //     <input
    //       type="text"
    //       placeholder="질문을 입력하세요..."
    //       value={message}
    //       onChange={(e) => setMessage(e.target.value)}
    //     />
    //     <button type="submit">보내기</button>
    //   </form>
    //   <p>
    //     <strong>응답:</strong> {response}
    //   </p>
    // </div>
    <div className="chatbot">
      <h2 className="chatbot-header">💬 챗봇</h2>
      <div className="chatbot-content">
        <p className="chatbot-response">
          <strong>응답:</strong> {response || "챗봇과 대화해보세요!"}
        </p>
      </div>
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
    </div>
  );
}

export default Chatbot;
