import jwtAxios from "../util/jwtUtil";

const API_SERVER_HOST = "http://localhost:8080";
const contractHost = `${API_SERVER_HOST}/api/contracts`;

// JWT 토큰 추가 함수
const getAuthHeader = () => {
  const token = localStorage.getItem("accessToken");
  if (!token) {
    console.error("JWT 토큰이 없습니다. 다시 로그인해주세요.");
    window.location.href = "/login";
    throw new Error("JWT 토큰이 없습니다.");
  }
  return { Authorization: `Bearer ${token}` };
};

// ✅ 출자자가 체결한 모든 계약 조회
export const getContractsByLender = async (lenderId) => {
  try {
    const response = await jwtAxios.get(`${contractHost}/lender/${lenderId}`, {
      headers: getAuthHeader(),
    });
    return response.data;
  } catch (error) {
    console.error(
      "Error fetching lender's contracts:",
      error.response?.data || error
    );
    throw error;
  }
};

// ✅ 대출자가 체결한 모든 계약 조회
export const getContractsByBorrower = async (borrowerId) => {
  try {
    const response = await jwtAxios.get(
      `${contractHost}/borrower/${borrowerId}`,
      {
        headers: getAuthHeader(),
      }
    );
    return response.data;
  } catch (error) {
    console.error(
      "Error fetching borrower's contracts:",
      error.response?.data || error
    );
    throw error;
  }
};

// ✅ 대출자가 계약 승인 (WAITING_FOR_APPROVAL 상태로 변경)
export const approveContract = async (contractId, borrowerId) => {
  try {
    const response = await jwtAxios.post(
      `${contractHost}/${contractId}/approve/${borrowerId}`,
      null,
      { headers: getAuthHeader() }
    );
    return response.data;
  } catch (error) {
    console.error("Error approving contract:", error.response?.data || error);
    throw error;
  }
};

// ✅ 출자자가 최종 계약 승인 (계약 상태: ACTIVE)
export const approveContractByLender = async (contractId, lenderId) => {
  try {
    const response = await jwtAxios.post(
      `${contractHost}/${contractId}/approve-lender/${lenderId}`,
      null,
      { headers: getAuthHeader() }
    );
    return response.data;
  } catch (error) {
    console.error(
      "Error approving contract by lender:",
      error.response?.data || error
    );
    throw error;
  }
};

// ✅ 계약 상태 업데이트 (예: COMPLETED, OVERDUE)
export const updateContractStatus = async (contractId, status) => {
  try {
    const response = await jwtAxios.put(
      `${contractHost}/${contractId}/status`,
      null,
      {
        headers: getAuthHeader(),
        params: { status },
      }
    );
    return response.data;
  } catch (error) {
    console.error(
      "Error updating contract status:",
      error.response?.data || error
    );
    throw error;
  }
};

// ✅ 계약 취소 (CANCELLED 상태로 변경)
export const cancelContract = async (contractId) => {
  try {
    await jwtAxios.delete(`${contractHost}/${contractId}/cancel`, {
      headers: getAuthHeader(),
    });
  } catch (error) {
    console.error("Error cancelling contract:", error.response?.data || error);
    throw error;
  }
};

// ✅ 계약서 내용 저장 (대출자 또는 출자자) - 🔄 JSON 요청 방식으로 변경
export const saveContractContent = async (
  contractId,
  userId,
  content,
  isLender
) => {
  try {
    const response = await jwtAxios.post(
      `${contractHost}/${contractId}/content`,
      {
        userId,
        content,
        isLender: String(isLender), // Boolean 값을 문자열로 변환하여 전달
      },
      {
        headers: getAuthHeader(),
      }
    );
    return response.data;
  } catch (error) {
    console.error(
      "Error saving contract content:",
      error.response?.data || error
    );
    throw error;
  }
};

// ✅ 계약서 내용 조회 (대출자 또는 출자자)
export const getContractContent = async (contractId, userId, isLender) => {
  try {
    const response = await jwtAxios.get(
      `${contractHost}/${contractId}/content/${userId}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        params: { isLender }, // 🔥 출자자인지 여부 전달
      }
    );
    return response.data;
  } catch (error) {
    console.error(
      "Error fetching contract content:",
      error.response?.data || error
    );
    throw error;
  }
};
