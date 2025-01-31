import axios from "axios";
import jwtAxios from "../util/jwtUtil";

const API_SERVER_HOST = "http://localhost:8080";
const lenderHost = `${API_SERVER_HOST}/api/lender`;

// 1. 채권자 신청/포기 요청
export const requestLenderToggle = async (id) => {
  if (!id) {
    console.error("ID가 null이거나 undefined입니다.");
    throw new Error("유효하지 않은 ID입니다.");
  }

  try {
    const response = await jwtAxios.post(`${lenderHost}/request`, {
      id,
    });
    return response.data; // 성공 메시지 반환
  } catch (error) {
    console.error("채권자 신청/포기 요청 실패:", error);
    throw error;
  }
};

// 2. 관리자 승인/거절 요청
export const approveLenderRequest = async (id, approve) => {
  console.log("보낼 데이터:", { id, approve }); // 디버깅 로그 추가
  try {
    const response = await jwtAxios.post(`${lenderHost}/approve`, {
      id,
      approve,
    });
    return response.data; // 성공 메시지 반환
  } catch (error) {
    console.error("채권자 승인/거절 요청 실패:", error);
    throw error;
  }
};

// 3. 신청 상태가 PENDING인 목록 가져오기
export const getPendingLenderRequests = async () => {
  const token = localStorage.getItem("accessToken");
  try {
    const response = await jwtAxios.get(`${lenderHost}/pending`, {
      headers: {
        Authorization: `Bearer ${token}`, // 토큰 헤더 추가
      },
    });
    console.log("서버 응답 데이터:", response.data);
    console.log("요청 성공:", response);
    return response.data;
  } catch (error) {
    console.error("신청 목록 가져오기 실패:", error);
    console.error("요청 실패:", error.response || error);
    throw error;
  }
};
