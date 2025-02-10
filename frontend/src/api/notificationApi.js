import axios from "axios";
import jwtAxios from "../util/jwtUtil";

const API_SERVER_HOST = "http://localhost:8080";
const notificationHost = `${API_SERVER_HOST}/api/notifications`;

// JWT 토큰 가져오기
const getAuthToken = () => {
  const token = localStorage.getItem("accessToken");
  if (!token) {
    console.error("JWT 토큰이 없습니다. 다시 로그인해주세요.");
    throw new Error("JWT 토큰이 없습니다. 다시 로그인해주세요.");
  }
  return `Bearer ${token}`;
};

// 알림 목록 조회
export const getMemberNotifications = async () => {
  try {
    const memberId = localStorage.getItem("userId");
    if (!memberId) {
      throw new Error("사용자 정보를 찾을 수 없습니다.");
    }

    const response = await jwtAxios.get(`${notificationHost}/member/${memberId}`, {
      headers: { Authorization: getAuthToken() }
    });
    console.log("Fetched Notifications: ", response); // 여기서 확인
    return response.data;
  } catch (error) {
    console.error("알림 조회 오류:", error.response?.data || error.message);
    throw error;
  }
};

// 알림 삭제
export const deleteNotification = async (notificationId) => {
  try {
    await jwtAxios.delete(`${notificationHost}/${notificationId}`, {
      headers: { Authorization: getAuthToken() }
    });
    console.log("알림 삭제 완료");
  } catch (error) {
    console.error("알림 삭제 오류:", error.response?.data || error.message);
    throw error;
  }
};
