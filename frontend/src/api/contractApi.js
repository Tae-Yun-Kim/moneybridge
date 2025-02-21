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

// ✅ 출자자가 체결한 모든 계약 조회 (삭제된 계약 필터링 추가)
export const getContractsByLender = async (lenderId) => {
  try {
    const response = await jwtAxios.get(`${contractHost}/lender/${lenderId}`, {
      headers: getAuthHeader(),
    });

    // ✅ 삭제된 계약 필터링
    const filteredContracts = response.data.filter(
      (contract) => !contract.deletedByUsers?.includes(lenderId)
    );

    console.log(
      `✅ 출자자(${lenderId}) 계약 목록 조회 완료:`,
      filteredContracts
    );
    return filteredContracts;
  } catch (error) {
    console.error("💥 출자자의 계약 조회 오류:", error.response?.data || error);
    throw error;
  }
};

// ✅ 대출자가 체결한 모든 계약 조회 (삭제된 계약 필터링 추가)
export const getContractsByBorrower = async (borrowerId) => {
  try {
    const response = await jwtAxios.get(
      `${contractHost}/borrower/${borrowerId}`,
      { headers: getAuthHeader() }
    );

    // ✅ 각 계약에 대해 totalRepaymentAmount 및 paidAmount 포함
    const contractsWithAmounts = response.data.map((contract) => ({
      ...contract,
      totalRepaymentAmount: contract.totalRepaymentAmount || 0, // 총 상환 금액 (백엔드 응답)
      paidAmount: contract.paidAmount || 0, // 현재까지 상환 금액 (백엔드 응답)
    }));

    // ✅ 삭제된 계약 필터링
    const filteredContracts = contractsWithAmounts.filter(
      (contract) => !contract.deletedByUsers?.includes(borrowerId)
    );

    console.log(
      `✅ 대출자(${borrowerId}) 계약 목록 조회 완료 (상환 금액 포함):`,
      filteredContracts
    );
    return filteredContracts;
  } catch (error) {
    console.error("💥 대출자의 계약 조회 오류:", error.response?.data || error);
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
    console.log("✅ 계약 승인 완료:", response.data);
    return response.data;
  } catch (error) {
    console.error("💥 계약 승인 오류:", error.response?.data || error);
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

// ✅ 대출자가 송금 후 계약 완료 여부 확인 및 자동 COMPLETED 처리
export const checkRepaymentAndComplete = async (contractId) => {
  try {
    const response = await jwtAxios.post(
      `${contractHost}/${contractId}/auto-complete`,
      null,
      { headers: getAuthHeader() }
    );
    console.log(
      "✅ 계약 상환 완료 확인 및 자동 COMPLETED 처리:",
      response.data
    );
    return response.data;
  } catch (error) {
    console.error(
      "💥 계약 상환 완료 확인 실패:",
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
    console.log("✅ 계약 취소 완료:", contractId);
  } catch (error) {
    console.error("💥 계약 취소 오류:", error.response?.data || error);
    throw error;
  }
};

// ✅ 계약서 내용 저장 (대출자 또는 출자자)
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
        isLender: String(isLender),
      },
      { headers: getAuthHeader() }
    );
    console.log("✅ 계약서 저장 완료:", response.data);
    return response.data;
  } catch (error) {
    console.error("💥 계약서 저장 오류:", error.response?.data || error);
    throw error;
  }
};

// ✅ 계약서 내용 조회 (대출자 또는 출자자)
export const getContractContent = async (contractId, userId, isLender) => {
  try {
    // ✅ 공통 엔드포인트 사용: 출자자와 대출자를 하나의 API로 처리
    const endpoint = `${contractHost}/${contractId}/content/${userId}`;

    const response = await jwtAxios.get(endpoint, {
      headers: getAuthHeader(),
      params: { isLender }, // 출자자 여부를 쿼리 파라미터로 전달
    });

    console.log("✅ 계약서 내용 조회 완료:", response.data);
    return response.data;
  } catch (error) {
    console.error("💥 계약서 조회 오류:", error.response?.data || error);
    throw error;
  }
};

// ✅ 특정 유저가 계약을 삭제 (숨김 처리)
export const softDeleteContract = async (contractId, userId) => {
  try {
    await jwtAxios.put(
      `${contractHost}/${contractId}/soft-delete/${userId}`,
      null,
      { headers: getAuthHeader() }
    );
    console.log(`✅ 계약 ${contractId} 삭제(숨김) 완료`);
  } catch (error) {
    console.error("💥 계약 삭제(숨김) 오류:", error.response?.data || error);
    throw error;
  }
};

// ✅ 계약서 PDF 생성 (쿼리 파라미터 방식으로 수정)
export const generateContractPDF = async (contractId, userId, isLender) => {
  try {
    const response = await jwtAxios.post(
      `${contractHost}/download`,
      { contractId, userId, isLender },
      {
        headers: {
          ...getAuthHeader(),
          "Content-Type": "application/json",
        },
        responseType: "blob", // 'arraybuffer' 대신 'blob' 사용 (파일 다운로드 용도)
      }
    );

    // ✅ content-disposition 헤더 추출
    const contentDisposition =
      response.headers.get("content-disposition") || "";
    const fileNameMatch = contentDisposition.match(/filename="(.+)"/);
    const fileName = fileNameMatch ? fileNameMatch[1] : "contract.pdf";

    // ✅ Blob을 사용하여 파일 다운로드
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(link);

    console.log("✅ 계약서 PDF 다운로드 완료");
  } catch (error) {
    console.error("❌ 계약서 PDF 다운로드 실패:", error);
    alert("PDF 다운로드 실패: " + error.message);
  }
};

// 자동상환
export const repayLoan = async (contractId, borrowerId) => {
  try {
    const response = await jwtAxios.post(
      `${contractHost}/${contractId}/repay`,
      null,
      { params: { borrowerId } }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "자동 상환 요청 실패";
  }
};
// ✅ 대출자가 상환 기간 연장 요청
export const requestRepaymentExtension = async (
  contractId,
  additionalMonths,
  borrowerId
) => {
  try {
    const response = await jwtAxios.post(
      `${contractHost}/${contractId}/extend`,
      null,
      {
        headers: getAuthHeader(),
        params: { additionalMonths, borrowerId },
      }
    );
    console.log("🔔 상환 기간 연장 요청 완료:", response.data);
    return response.data;
  } catch (error) {
    console.error(
      "❌ 상환 기간 연장 요청 실패:",
      error.response?.data || error
    );
    throw error;
  }
};

// ✅ 출자자가 연장 요청 승인
export const approveRepaymentExtension = async (contractId, lenderId) => {
  try {
    // 🔹 POST 요청 시 contractId와 lenderId 전달
    const response = await jwtAxios.post(
      `${contractHost}/${contractId}/extend/approve`,
      null,
      {
        headers: getAuthHeader(),
        params: { lenderId },
      }
    );

    console.log("✅ [API] 상환 기간 연장 요청 승인 완료:", response.data);
    return response.data;
  } catch (error) {
    console.error(
      "❌ [API] 상환 기간 연장 요청 승인 실패:",
      error.response?.data || error
    );
    throw error;
  }
};

// ✅ 출자자가 연장 요청 거절
export const rejectRepaymentExtension = async (contractId, lenderId) => {
  try {
    const response = await jwtAxios.post(
      `${contractHost}/${contractId}/extend/reject`,
      null,
      {
        headers: getAuthHeader(),
        params: { lenderId },
      }
    );
    console.log("❌ 상환 기간 연장 요청 거절 완료:", response.data);
    return response.data;
  } catch (error) {
    console.error(
      "❌ 상환 기간 연장 요청 거절 실패:",
      error.response?.data || error
    );
    throw error;
  }
};
