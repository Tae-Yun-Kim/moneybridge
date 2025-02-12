// src/api/notificationAPI.js
import axios from "axios";
import jwtAxios from "../util/jwtUtil";

const API_SERVER_HOST = "http://localhost:8080";
const host = `${API_SERVER_HOST}/api/notifications`;

// JWT 토큰 가져오기
const getAuthToken = () => {
  const token = localStorage.getItem("accessToken");
  if (!token) {
    console.error("JWT 토큰이 없습니다. 다시 로그인해주세요.");
    throw new Error("JWT 토큰이 없습니다. 다시 로그인해주세요.");
  }
  return `Bearer ${token}`;
};

// 지갑 간 거래 알림 생성
export const createNotification = async (receiverId, amount) => {
  try {
    await jwtAxios.post(
      `${host}`,
      { 
       // receiverId, message: `${receiverId} 지갑으로 ${amount}원이 입금되었습니다.`,
        memberId: receiverId.replace('w_', ''), // 지갑 ID에서 실제 유저 ID 추출
        message: `${receiverId} 지갑으로 ${amount}원이 입금되었습니다.`
      },
      { headers: { Authorization: getAuthToken() } }
    );
  } catch (error) {
    console.error("지갑 이체 알림 생성 오류:", error);
    throw error;
  }
};


// 알림 목록 조회
export const getMemberNotifications = async () => {
  try {
    const memberId = localStorage.getItem("userId");
    if (!memberId) {
      throw new Error("사용자 정보를 찾을 수 없습니다.");
    }

    const response = await jwtAxios.get(`${host}/member/${memberId}`, {
      headers: { Authorization: getAuthToken() }
    });
    console.log("Fetched Notifications: ", response);
    return response.data;
  } catch (error) {
    console.error("알림 조회 오류:", error.response?.data || error.message);
    throw error;
  }
};

// 알림 삭제
export const deleteNotification = async (notificationId) => {
  try {
    await jwtAxios.delete(`${host}/${notificationId}`, {
      headers: { Authorization: getAuthToken() }
    });
    console.log("알림 삭제 완료");
  } catch (error) {
    console.error("알림 삭제 오류:", error.response?.data || error.message);
    throw error;
  }
};

// 계약 대기 알림 생성
export const createContractPendingNotification = async (postId) => {
  try {
    await jwtAxios.post(`${host}/contract-pending/${postId}`, null, {
      headers: { Authorization: getAuthToken() }
    });
  } catch (error) {
    console.error("계약 대기 알림 생성 오류:", error);
    throw error;
  }
};

// 승인 대기 알림 생성
export const createApprovalPendingNotification = async (postId, comment) => {
  try {
    await jwtAxios.post(`${host}/approval-pending/${postId}`, comment, {
      headers: { Authorization: getAuthToken() }
    });
  } catch (error) {
    console.error("승인 대기 알림 생성 오류:", error);
    throw error;
  }
};

// 계약 진행 알림 생성
export const createContractActiveNotification = async (postId) => {
  try {
    await jwtAxios.post(`${host}/contract-active/${postId}`, null, {
      headers: { Authorization: getAuthToken() }
    });
  } catch (error) {
    console.error("계약 진행 알림 생성 오류:", error);
    throw error;
  }
};

// 계약 완료 알림 생성
export const createContractCompletedNotification = async (postId) => {
  try {
    await jwtAxios.post(`${host}/contract-completed/${postId}`, null, {
      headers: { Authorization: getAuthToken() }
    });
  } catch (error) {
    console.error("계약 완료 알림 생성 오류:", error);
    throw error;
  }
};

// 계약 취소 알림 생성
export const createContractCancelledNotification = async (postId) => {
  try {
    await jwtAxios.post(`${host}/contract-cancelled/${postId}`, null, {
      headers: { Authorization: getAuthToken() }
    });
  } catch (error) {
    console.error("계약 취소 알림 생성 오류:", error);
    throw error;
  }
};

// 채무자 -> 채권자 이체 알림 생성
export const createDebtorToCreditorNotification = async (postId, amount) => {
  try {
    await jwtAxios.post(`${host}/debtor-to-creditor/${postId}`, amount, {
      headers: { Authorization: getAuthToken() }
    });
  } catch (error) {
    console.error("이체 알림 생성 오류:", error);
    throw error;
  }
};

// 채권자 -> 채무자 이체 알림 생성
export const createCreditorToDebtorNotification = async (postId, amount) => {
  try {
    await jwtAxios.post(`${host}/creditor-to-debtor/${postId}`, amount, {
      headers: { Authorization: getAuthToken() }
    });
  } catch (error) {
    console.error("이체 알림 생성 오류:", error);
    throw error;
  }
};

// 연체 알림 생성
export const createOverdueNotification = async (postId) => {
  try {
    await jwtAxios.post(`${host}/overdue/${postId}`, null, {
      headers: { Authorization: getAuthToken() }
    });
  } catch (error) {
    console.error("연체 알림 생성 오류:", error);
    throw error;
  }
};