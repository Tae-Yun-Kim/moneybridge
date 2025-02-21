import axios from "axios"; // ✅ axios 추가
import jwtAxios from "../util/jwtUtil";

// ✅ API 서버 기본 URL
const API_SERVER_HOST = "http://localhost:8080";
const donationHost = `${API_SERVER_HOST}/api/donations`;

// 📊 1️⃣ 월별 기부금 & 관리자 수익 조회
export const getMonthlyDonationStatsWithProfit = async () => {
  try {
    const response = await axios.get(`${donationHost}/monthly`);

    console.log("✅ 월별 기부금 & 관리자 수익 조회 성공:", response.data);
    return response.data;
  } catch (error) {
    console.error("🚨 월별 기부금 & 관리자 수익 조회 실패:", error);
    return [];
  }
};

// 🗂️ 2️⃣ 기부금 상세 내역 조회
export const getDonationDetails = async () => {
  try {
    const response = await axios.get(`${donationHost}/monthly`);

    console.log("✅ 기부금 상세 내역 조회 성공:", response.data);
    return response.data;
  } catch (error) {
    console.error("🚨 기부금 상세 내역 조회 실패:", error);
    return [];
  }
};
