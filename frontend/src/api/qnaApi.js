import jwtAxios from "../util/jwtUtil"; // 인증된 axios 인스턴스 (자동으로 토큰 추가)

const BACKEND_URL = "http://localhost:8080"; // 백엔드 서버 URL
const host = `${BACKEND_URL}/api/qna`;

// ✅ QnA 목록 조회 (페이징)
export const getQnAList = async ({ page = 1, size = 10 }) => {
  try {
    // 기존 코드에서 axios 대신 jwtAxios로 변경하여 자동 인증 처리
    const res = await jwtAxios.get(`${host}/list`, { params: { page, size } });
    return res.data;
  } catch (error) {
    console.error("Error fetching QnA list:", error);
    throw new Error(
      error.response?.data?.message || "Failed to fetch QnA list"
    );
  }
};

// ✅ QnA 단일 조회 (작성자 본인만 볼 수 있도록 요청에 ID 포함)
export const getQnA = async (qno) => {
  try {
    // ✅ localStorage에서 로그인한 사용자 정보 가져오기
    const userData = localStorage.getItem("member");
    const user = userData ? JSON.parse(userData) : null;
    const id = user?.id || "";

    if (!id) {
      throw new Error("로그인이 필요합니다.");
    }

    // ✅ 서버 요청 시 작성자 ID도 함께 전송
    const res = await jwtAxios.get(`${host}/read/${qno}`, {
      params: { id }, // ✅ 백엔드에서 작성자 확인을 위해 ID 전달
    });

    return res.data;
  } catch (error) {
    console.error("Error fetching QnA:", error.response?.data || error.message);

    if (error.response?.status === 403) {
      throw new Error("해당 게시글을 볼 수 있는 권한이 없습니다.");
    }

    throw new Error(error.response?.data?.message || "QnA 조회 실패");
  }
};
// ✅ QnA 등록
export const postQnA = async (qnaData) => {
  try {
    const formData = new FormData();
    formData.append("qnaTitle", qnaData.qnaTitle || "");
    formData.append("qnaContent", qnaData.qnaContent || "");
    formData.append("id", qnaData.id || "");
    formData.append("isSecret", qnaData.isSecret ? "true" : "false");

    // // 파일 추가
    // if (qnaData.files && qnaData.files.length > 0) {
    //   qnaData.files.forEach((file) => formData.append("files", file));
    // }

    // ✅ 기존 코드에서 axios → jwtAxios로 변경 (토큰 자동 추가)
    const res = await jwtAxios.post(`${host}/register`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    return res.data;
  } catch (error) {
    console.error("Error posting QnA:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Failed to post QnA");
  }
};

// ✅ QnA 수정
export const putQnA = async (qno, qnaData) => {
  try {
    // ✅ 기존 코드에서 axios → jwtAxios로 변경 (토큰 자동 추가)
    const res = await jwtAxios.put(`${host}/modify/${qno}`, qnaData, {
      headers: { "Content-Type": "application/json" },
    });

    console.log("PUT Response:", res.data);
    return res.data;
  } catch (error) {
    console.error("Error updating QnA:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Failed to update QnA");
  }
};

// ✅ QnA 삭제
export const deleteQnA = async (qno) => {
  try {
    // ✅ 기존 코드에서 axios → jwtAxios로 변경 (토큰 자동 추가)
    const res = await jwtAxios.delete(`${host}/${qno}`);

    console.log("DELETE Response:", res.data);
    return res.data;
  } catch (error) {
    console.error("Error deleting QnA:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Failed to delete QnA");
  }
};

// ✅ 댓글 목록 조회
export const getQnaComments = async (qno, page = 1, size = 10) => {
  try {
    // ✅ 기존 코드에서 axios → jwtAxios로 변경 (토큰 자동 추가)
    const response = await jwtAxios.get(`${host}/comment/${qno}`, {
      params: { page, size },
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching QnA comments:", error);
    throw new Error(
      error.response?.data?.message || "Failed to fetch QnA comments"
    );
  }
};

// ✅ 댓글 등록
export const addQnaComment = async (qnaCommentDTO) => {
  try {
    // ✅ 기존 코드에서 axios → jwtAxios로 변경 (토큰 자동 추가)
    const response = await jwtAxios.post(
      `${host}/comment/register`,
      qnaCommentDTO
    );

    return response.data;
  } catch (error) {
    console.error(
      "Error posting QnA comment:",
      error.response?.data || error.message
    );
    throw new Error(
      error.response?.data?.message || "Failed to post QnA comment"
    );
  }
};

// ✅ 댓글 수정
export const modifyQnaComment = async (qcno, qnaCommentDTO) => {
  try {
    // ✅ 기존 코드에서 axios → jwtAxios로 변경 (토큰 자동 추가)
    const response = await jwtAxios.put(
      `${host}/comment/${qcno}`,
      qnaCommentDTO
    );

    return response.data;
  } catch (error) {
    console.error(
      "Error updating QnA comment:",
      error.response?.data || error.message
    );
    throw new Error(
      error.response?.data?.message || "Failed to update QnA comment"
    );
  }
};

// ✅ 댓글 삭제
export const removeQnaComment = async (qcno) => {
  try {
    // ✅ 기존 코드에서 axios → jwtAxios로 변경 (토큰 자동 추가)
    const response = await jwtAxios.delete(`${host}/comment/${qcno}`);

    return response.data;
  } catch (error) {
    console.error(
      "Error deleting QnA comment:",
      error.response?.data || error.message
    );
    throw new Error(
      error.response?.data?.message || "Failed to delete QnA comment"
    );
  }
};

export const updateQnaCompleteStatus = async (qno) => {
  try {
    const response = await jwtAxios.put(`${host}/${qno}/complete`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) throw new Error("QnA 상태 업데이트 실패");
    console.log("QnA 상태 업데이트 성공");
  } catch (error) {
    console.error(error.message);
  }
};
