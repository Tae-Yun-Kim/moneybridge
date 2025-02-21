import React, { useState, useEffect, useRef } from "react";
import {
  getRecentMessages,
  sendMessage,
  getMessagesAfter,
} from "../../api/chatApi";
import { format, isSameDay } from "date-fns";
import "./ChatComponent.css";
import { useNavigate } from "react-router-dom";

const ChatComponent = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);
  const [isScrolledToBottom, setIsScrolledToBottom] = useState(true);
  const navigate = useNavigate(); // ✅ 페이지 이동을 위한 useNavigate 사용

  const currentUserId = localStorage.getItem("userId");

  // ✅ 로그인 여부 확인 후, 미로그인 시 로그인 페이지로 리디렉트
  useEffect(() => {
    if (!currentUserId) {
      alert("로그인이 필요합니다.");
      navigate("/member/login");
    }
  }, [currentUserId, navigate]);

  useEffect(() => {
    fetchMessages();
    const interval = setInterval(() => {
      const lastMessageTime =
        messages.length > 0 ? messages[messages.length - 1].createdAt : null;
      fetchNewMessages(lastMessageTime);
    }, 10000);
    return () => clearInterval(interval);
  }, [messages]);

  useEffect(() => {
    if (isScrolledToBottom) {
      scrollToBottom();
    }
  }, [messages, isScrolledToBottom]);

  const fetchNewMessages = (lastMessageTime) => {
    getMessagesAfter(lastMessageTime)
      .then((newData) => {
        if (newData.length > 0) {
          setMessages((prevMessages) => [...prevMessages, ...newData]);
        }
      })
      .catch((err) => console.error("Error fetching new messages:", err));
  };

  const fetchMessages = () => {
    getRecentMessages()
      .then((data) => {
        setMessages(
          data.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
        );
      })
      .catch((err) => console.error("Error fetching messages:", err));
  };
  const filteredWords = [
    "010",
    "여기",
    "com",
    "시발",
    "개새끼",
    "죽을래",
    "뻐큐",
    "전화",
    "병신",
  ];
  const handleSendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim()) {
      // 필터링할 단어 검사
      const containsFilteredWord = filteredWords.some((word) =>
        newMessage.toLowerCase().includes(word.toLowerCase())
      );

      if (containsFilteredWord) {
        alert("부적절한 단어가 포함되어 있습니다.");
        return;
      }

      sendMessage({ content: newMessage })
        .then((response) => {
          setNewMessage("");
          setMessages((prevMessages) => [...prevMessages, response]);
          setIsScrolledToBottom(true);
        })
        .catch((err) => console.error("Error sending message:", err));
    }
  };

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  };

  const handleScroll = () => {
    if (chatContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } =
        chatContainerRef.current;
      setIsScrolledToBottom(scrollHeight - scrollTop === clientHeight);
    }
  };

  return (
    <div className="chat-container">
      <div
        className="chat-messages"
        ref={chatContainerRef}
        onScroll={handleScroll}
      >
        {messages.map((msg, index) => {
          // 날짜 변경 감지
          const showDate =
            index === 0 || // 첫 번째 메시지이거나
            !isSameDay(
              new Date(msg.createdAt),
              new Date(messages[index - 1].createdAt)
            ); // 이전 메시지와 날짜가 다를 경우

          return (
            <React.Fragment key={index}>
              {showDate && (
                <div className="date-separator-container">
                  <div className="date-separator">
                    📅 {format(new Date(msg.createdAt), "yyyy년 M월 d일 EEEE")}
                  </div>
                </div>
              )}
              <div
                className={`message ${
                  msg.senderId === currentUserId
                    ? "own-message"
                    : "other-message"
                }`}
              >
                <div className="message-content">{msg.content}</div>
                <div className="message-info">
                  {msg.senderId === currentUserId ? (
                    <span>{format(new Date(msg.createdAt), "HH:mm")}</span>
                  ) : (
                    <>
                      <span>{msg.senderNickname} </span>
                      <span>{format(new Date(msg.createdAt), "HH:mm")}</span>
                    </>
                  )}
                </div>
              </div>
            </React.Fragment>
          );
        })}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={handleSendMessage} className="chat-input">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="메시지를 입력하세요..."
        />
        <button type="submit">전송</button>
      </form>
    </div>
  );
};

export default ChatComponent;
