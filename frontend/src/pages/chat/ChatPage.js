import React from "react";
import BasicLayout from "../../layouts/BasicLayout";
import ChatComponent from "../../components/chat/ChatComponent";
import "../../components/chat/ChatComponent.css";

const ChatPage = () => {
  return (
    <BasicLayout>
      {/* 채팅 페이지 메인 콘텐츠 */}
      <div className="main-content bg-white rounded-lg shadow-lg p-6">
        <h1 className="chat-title">실시간 채팅</h1>
        <ChatComponent />
      </div>
    </BasicLayout>
  );
};

export default ChatPage;
