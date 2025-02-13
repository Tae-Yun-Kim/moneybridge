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


export const createNotification = async (receiverId, amount) => {
  try {
    await jwtAxios.post(
      `${host}`,
      {
        memberId: receiverId.replace("w_", ""), // 지갑 ID에서 실제 유저 ID 추출
        message: `${receiverId} 지갑으로 ${amount}원이 입금되었습니다.`,
      },
      { headers: { Authorization: getAuthToken() } }
    );
  } catch (error) {
    console.error("지갑 이체 알림 생성 오류:", error);
    throw error;
  }
};

export const createContractPendingNotification = async (receiverId, postId) => {
  try {
    await jwtAxios.post(
      `${host}`,
      {
        memberId: receiverId,
        message: `출자자가 댓글을 선택하여 계약 대기 상태입니다.`,
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
      headers: { Authorization: getAuthToken() },
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
      headers: { Authorization: getAuthToken() },
    });
    console.log("알림 삭제 완료");
  } catch (error) {
    console.error("알림 삭제 오류:", error.response?.data || error.message);
    throw error;
  }
};

// 승인 대기 알림 생성(출자자의 글에 댓글 달림)
export const createApprovalPendingNotification = async (postId, comment) => {
  try {
    await jwtAxios.post(`${host}/approval-pending/${postId}`, comment, {
      headers: { Authorization: getAuthToken() },
    });
  } catch (error) {
    console.error("승인 대기 알림 생성 오류:", error);
    throw error;
  }
};

// 계약 대기 알림 생성(출자자가 대출희망자의 댓글 선택)
// export const createContractPendingNotification = async (postId) => {
//   try {
//     await jwtAxios.post(`${host}/contract-pending/${postId}`, null, {
//       headers: { Authorization: getAuthToken() },
//     });
//   } catch (error) {
//     console.error("계약 대기 알림 생성 오류:", error);
//     throw error;
//   }
// };

// 계약 진행 알림 생성
export const createContractActiveNotification = async (contractId) => {
  try {
    await jwtAxios.post(`${host}/contract-active/${contractId}`, {
      headers: { Authorization: getAuthToken() },
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
      headers: { Authorization: getAuthToken() },
    });
  } catch (error) {
    console.error("계약 완료 알림 생성 오류:", error);
    throw error;
  }
};

// 계약 취소 알림 생성
export const createContractCancelledNotification = async (contractIdId) => {
  try {
    await jwtAxios.post(`${host}/contract-cancelled/${contractIdId}`, {
      headers: { Authorization: getAuthToken() },
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
      headers: { Authorization: getAuthToken() },
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
      headers: { Authorization: getAuthToken() },
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
      headers: { Authorization: getAuthToken() },
    });
  } catch (error) {
    console.error("연체 알림 생성 오류:", error);
    throw error;
  }
};
