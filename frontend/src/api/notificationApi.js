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

// // 지갑 간 거래 알림 생성
// export const createNotification = async (receiverId, amount) => {
//   try {
//     await jwtAxios.post(
//       `${host}`,
//       { receiverId, amount },
//       { headers: { Authorization: getAuthToken() } }
//     );
//   } catch (error) {
//     console.error("지갑 이체 알림 생성 오류:", error);
//     throw error;
//   }
// };
// 지갑 간 거래 알림 생성
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

// // ✅ QnA 알림 생성 함수
// export const createQnaNotification = async (receiverId, qno) => {
//   try {
//     await jwtAxios.post(
//       `${host}`,
//       {
//         memberId: receiverId, // QnA 작성자 ID
//         message: `📩 QnA #${qno}에 새로운 답변이 등록되었습니다.`,
//       },
//       { headers: { Authorization: getAuthToken() } }
//     );
//     console.log(
//       `✅ QnA 알림 전송 완료: QnA ID ${qno}, 수신자 ID ${receiverId}`
//     );
//   } catch (error) {
//     console.error("❌ QnA 알림 생성 오류:", error);
//     throw error;
//   }
// };
// ✅ QnA 알림 생성 함수 (QnA 1:1 페이지로 이동)
export const createQnaNotification = async (receiverId, qno) => {
  try {
    await jwtAxios.post(
      `${host}/qna`,
      {
        memberId: receiverId, // ✅ QnA 작성자 ID
        message: `📩 QnA #${qno}에 새로운 답변이 등록되었습니다.`,
        redirectUrl: "/qna/one-to-one", // ✅ QnA 알림 클릭 시 1:1 QnA 페이지로 이동하도록 변경
      },
      { headers: { Authorization: getAuthToken() } }
    );

    console.log(
      `✅ QnA 알림 전송 완료: QnA ID ${qno}, 수신자 ID ${receiverId}`
    );
  } catch (error) {
    console.error("❌ QnA 알림 생성 오류:", error);
    throw error;
  }
};

// 출자자의 댓글 선택 알림(대출자에게 알림)
export const createContractPendingNotification = async (receiverId, postId) => {
  try {
    await jwtAxios.post(
      `${host}`,
      {
        memberId: receiverId,
        // postId: postId, // 추가해야 함
        message: `출자자가 댓글을 선택하여 계약 대기 상태입니다.`,
        redirectUrl: `/member/mypage`,
      },
      { headers: { Authorization: getAuthToken() } }
    );
  } catch (error) {
    console.error("계약 대기 알림 생성 오류:", error);
    throw error;
  }
};

// // 알림 목록 조회
// export const getMemberNotifications = async () => {
//   try {
//     const memberId = localStorage.getItem("userId");
//     if (!memberId) {
//       throw new Error("사용자 정보를 찾을 수 없습니다.");
//     }

//     const response = await jwtAxios.get(`${host}/member/${memberId}`, {
//       headers: { Authorization: getAuthToken() },
//     });
//     console.log("Fetched Notifications: ", response);
//     return response.data;
//   } catch (error) {
//     console.error("알림 조회 오류:", error.response?.data || error.message);
//     throw error;
//   }
// };
// 알림 목록 조회 (리디렉션 URL 포함)
export const getMemberNotifications = async () => {
  try {
    const memberId = localStorage.getItem("userId");
    if (!memberId) {
      throw new Error("사용자 정보를 찾을 수 없습니다.");
    }

    const response = await jwtAxios.get(`${host}/member/${memberId}`, {
      headers: { Authorization: getAuthToken() },
    });

    // 서버에서 `redirectUrl` 포함된 알림 데이터를 가져옴
    return response.data.map((notification) => ({
      ...notification,
      redirectUrl: notification.redirectUrl || "/", // URL이 없으면 기본값 설정
    }));
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
// 대출자의 계약서 작성 알림(출자자에게 알림)
export const createContractApprovalNotification = async (lenderId, userId) => {
  try {
    await jwtAxios.post(
      `${host}`,
      {
        memberId: lenderId,
        message: `대출자가 계약서를 작성하여 계약 대기 상태입니다.`,
        redirectUrl: `/member/mypage`,
      },
      { headers: { Authorization: getAuthToken() } }
    );
  } catch (error) {
    console.error("지갑 이체 알림 생성 오류:", error);
    throw error;
  }
};

// 계약 진행 알림 생성
export const createContractActiveNotification = async (contractId) => {
  try {
    await jwtAxios.post(
      `${host}/contract-active/${contractId}`,
      { redirectUrl: "/member/mypage" }, // ✅ 마이페이지로 이동 설정
      { headers: { Authorization: getAuthToken() } }
    );
  } catch (error) {
    console.error("계약 진행 알림 생성 오류:", error);
    throw error;
  }
};

// 계약 완료 알림 생성
export const createContractCompletedNotification = async (borrowerId) => {
  try {
    await jwtAxios.post(
      `${host}`,
      {
        memberId: borrowerId,
        message: `상환이 완료되어 계약이 완료되었습니다.`,
        redirectUrl: "/member/contract-history", // ✅ 계약 완료 내역 페이지로 이동
      },
      { headers: { Authorization: getAuthToken() } }
    );
  } catch (error) {
    console.error("계약 완료 알림 생성 오류:", error);
    throw error;
  }
};

// 계약 취소 알림 생성
export const createContractCancelledNotification = async (contractId) => {
  try {
    await jwtAxios.post(
      `${host}/contract-cancelled/${contractId}`,
      { redirectUrl: "/member/contract-history" },
      { headers: { Authorization: getAuthToken() } }
    );
  } catch (error) {
    console.error("계약 취소 알림 생성 오류:", error);
    throw error;
  }
};

// 채무자 -> 채권자 이체 알림 생성(사용 x)
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

// 채권자 -> 채무자 이체 알림 생성(사용 x)
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

// 대출자가 상환 기간 연장 요청
export const requestRepaymentExtensionNotification = async (lenderId) => {
  try {
    await jwtAxios.post(
      `${host}`,
      {
        memberId: lenderId,
        message: `상환 기간 연장 신청이 왔습니다.`,
      },
      { headers: { Authorization: getAuthToken() } }
    );
  } catch (error) {
    console.error("지갑 이체 알림 생성 오류:", error);
    throw error;
  }
};

// 출자자가 연장 요청 승인
export const approveRepaymentExtensionNotification = async (borrowerId) => {
  try {
    await jwtAxios.post(
      `${host}`,
      {
        memberId: borrowerId,
        message: `상환 기간 연장 신청이 승인되었습니다.`,
      },
      { headers: { Authorization: getAuthToken() } }
    );
  } catch (error) {
    console.error("지갑 이체 알림 생성 오류:", error);
    throw error;
  }
};

// 출자자가 연장 요청 거절
export const rejectRepaymentExtensionNotification = async (borrowerId) => {
  try {
    await jwtAxios.post(
      `${host}`,
      {
        memberId: borrowerId,
        message: `상환 기간 연장 신청이 거절되었습니다`,
      },
      { headers: { Authorization: getAuthToken() } }
    );
  } catch (error) {
    console.error("지갑 이체 알림 생성 오류:", error);
    throw error;
  }
};

// 연체 알림 생성
export const createOverdueNotification = async (borrowerId) => {
  try {
    await jwtAxios.post(
      `${host}`,
      {
        memberId: borrowerId,
        message: `계약이 연체되었습니다. 빨리 해결해 주세요.`,
      },
      { headers: { Authorization: getAuthToken() } }
    );
  } catch (error) {
    console.error("지갑 이체 알림 생성 오류:", error);
    throw error;
  }
};
