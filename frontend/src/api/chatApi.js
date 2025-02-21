import axios from "axios";
import jwtAxios from "../util/jwtUtil";

const API_SERVER_HOST = "http://localhost:8080";
const host = `${API_SERVER_HOST}/api/chat`;

// JWT 토큰 가져오기
const getAuthToken = () => {
  const token = localStorage.getItem("accessToken");
  if (!token) {
    console.error("JWT 토큰이 없습니다. 다시 로그인해주세요.");
    throw new Error("JWT 토큰이 없습니다. 다시 로그인해주세요.");
  }
  return `Bearer ${token}`;
};

// 메시지 전송
export const sendMessage = async (message) => {
  try {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      console.error("사용자 ID가 없습니다.");
      throw new Error("로그인된 사용자 정보를 찾을 수 없습니다. 다시 로그인해주세요.");
    }

    const enrichedMessage = {
      ...message,
      senderId: userId,
    };
    const response = await jwtAxios.post(`${API_SERVER_HOST}/api/chat/send`, enrichedMessage, {
        headers: { Authorization: getAuthToken() },
      });
    return response.data;
  } catch (error) {
    console.error("메시지 전송 오류:", error.response?.data || error.message);
    throw error;
  }
};

// 최근 메시지 조회
export const getRecentMessages = async (limit = 100) => {
  try {
    const response = await jwtAxios.get(`${host}/messages`, {
      params: { limit },
      headers: { Authorization: getAuthToken() },
    });
    return response.data;
  } catch (error) {
    console.error("메시지 조회 오류:", error.response?.data || error.message);
    throw error;
  }
};

// 특정 시간 이후의 메시지 조회
export const getMessagesAfter = async (timestamp) => {
  try {
    const response = await jwtAxios.get(`${host}/messages/after`, {
      params: { timestamp },
      headers: { Authorization: getAuthToken() },
    });
    return response.data;
  } catch (error) {
    console.error("새 메시지 조회 오류:", error.response?.data || error.message);
    throw error;
  }
};

// 사용자 정보 조회 (채팅방에 표시할 용도)
export const getUserInfo = async (userId) => {
  try {
    const response = await jwtAxios.get(`${API_SERVER_HOST}/api/user/${userId}`, {
      headers: { Authorization: getAuthToken() },
    });
    return response.data;
  } catch (error) {
    console.error("사용자 정보 조회 오류:", error.response?.data || error.message);
    throw error;
  }
};
