import axios from "axios";
import jwtAxios from "../util/jwtUtil"; // JWT 인증용 유틸리티

const API_SERVER_HOST = "http://localhost:8080";
const ACCOUNT_API_URL = `${API_SERVER_HOST}/api/account`;

// 계좌 정보를 조회하는 API 호출
export const getAccountByNumber = async (accountNumber) => {
  const token = localStorage.getItem("accessToken");
  const headers = { Authorization: `Bearer ${token}` };

  try {
    const res = await axios.get(
      `${API_SERVER_HOST}/api/account/${accountNumber}`,
      { headers }
    );
    console.log("계좌 정보 조회 성공:", res.data);
    return res.data;
  } catch (error) {
    console.error(
      "계좌 정보 조회 실패:",
      error.response?.data || error.message
    );
    throw error;
  }
};
