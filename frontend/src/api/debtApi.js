import jwtAxios from "../util/jwtUtil";

const API_SERVER_HOST = "http://localhost:8080";
const BASE_URL = `${API_SERVER_HOST}/api/debt`;

// ✅ 모든 추심 요청 조회 (관리자용)
export const getAllDebtRequests = async () => {
  try {
    const token = localStorage.getItem("jwtToken"); // ✅ JWT 토큰 추가
    const response = await jwtAxios.get(`${BASE_URL}/requests`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("💥 모든 추심 요청 조회 중 오류 발생:", error);
    throw error;
  }
};

// ✅ 특정 계약 조회 API (계약 정보 가져오기)
export const getContractById = async (contractId) => {
  try {
    const response = await jwtAxios.get(
      `${API_SERVER_HOST}/api/contracts/${contractId}`
    );
    return response.data;
  } catch (error) {
    console.error("💥 계약 정보 조회 실패:", error);
    return {};
  }
};

// ✅ 추심 요청 상태 업데이트 (관리자용)
export const updateDebtRequestStatus = async (requestId, debtstatus) => {
  try {
    const response = await jwtAxios.patch(
      `${BASE_URL}/request/${requestId}/status`,
      { debtstatus }, // ✅ JSON Body로 변경
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("💥 추심 요청 상태 변경 중 오류 발생:", error);
    throw error;
  }
};

// ✅ 연체 계약 추심 요청 API
export const requestDebtCollection = async (
  contractId,
  lenderId,
  borrowerId,
  debtAmount,
  extraInterestRate,
  overdueDebt
) => {
  try {
    const response = await jwtAxios.post(`${BASE_URL}/request`, {
      contractId,
      lenderId,
      borrowerId,
      debtAmount, // ✅ 추심금액 추가
      extraInterestRate, // ✅ 추가 이자율 추가
      overdueDebt,

      debtstatus: "PENDING",
    });
    return response.data;
  } catch (error) {
    console.error(`💥 계약 ${contractId}의 추심 요청 실패:`, error);
    throw error;
  }
};

// ✅ 특정 계약의 추심 상태 조회 API
export const getDebtStatusByContract = async (contractId) => {
  try {
    const response = await jwtAxios.get(`${BASE_URL}/request/${contractId}`);
    return response.data;
  } catch (error) {
    console.error(`💥 계약 ${contractId}의 추심 상태 조회 실패:`, error);
    return [];
  }
};

// ✅ 특정 추심 요청 승인 또는 거절 (관리자용)
export const approveOrRejectDebtRequest = async (requestId, debtstatus) => {
  try {
    const token = localStorage.getItem("accessToken"); // ✅ JWT 토큰 추가
    if (!token) throw new Error("로그인 상태를 확인할 수 없습니다.");

    const response = await jwtAxios.put(
      `${BASE_URL}/requests/${requestId}/approve`,
      { debtstatus },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // ✅ JWT 인증 추가
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error(`💥 추심 요청 ${requestId} 승인/거절 실패:`, error);
    throw error;
  }
};
// ✅ 추심 완료 API 추가
export const completeDebtRequest = async (requestId) => {
  try {
    const token = localStorage.getItem("accessToken"); // ✅ JWT 토큰 추가
    if (!token) throw new Error("로그인 상태를 확인할 수 없습니다.");

    const response = await jwtAxios.put(
      `${BASE_URL}/requests/${requestId}/complete`,
      {},
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error(`💥 추심 완료 요청 실패: requestId=${requestId}`, error);
    throw error;
  }
};
