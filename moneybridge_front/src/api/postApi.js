import axios from "axios";
import jwtAxios from "../util/jwtUtil";

const API_SERVER_HOST = "http://localhost:8080"; // 서버 호스트 URL
const host = `${API_SERVER_HOST}/api/post`; // API 엔드포인트

// JWT 토큰 가져오기
const getAuthToken = () => {
  const token = localStorage.getItem("accessToken");
  if (!token) {
    console.error("JWT 토큰이 없습니다. 다시 로그인해주세요.");
    throw new Error("JWT 토큰이 없습니다. 다시 로그인해주세요.");
  }
  return `Bearer ${token}`;
};

// 출자자 여부 확인 함수
const checkIsLender = () => {
  const isLender = localStorage.getItem("isLender");
  if (!isLender || isLender !== "true") {
    console.error("출자자가 아닙니다. 권한이 없습니다.");
    throw new Error("출자자가 아닙니다. 권한이 없습니다.");
  }
};

// 게시글 생성
export const createLoanPost = async (loanPost) => {
  try {
    checkIsLender();

    if (!loanPost.title || loanPost.title.trim() === "") {
      console.error("게시글 제목이 누락되었습니다.");
      throw new Error("게시글 제목은 필수 항목입니다.");
    }

    const userId = localStorage.getItem("userId");
    if (!userId) {
      console.error("사용자 ID가 없습니다.");
      throw new Error(
        "로그인된 사용자 정보를 찾을 수 없습니다. 다시 로그인해주세요."
      );
    }

    const enrichedLoanPost = {
      ...loanPost,
      writerId: userId,
    };

    console.log("게시글 생성 요청: ", enrichedLoanPost);

    const response = await jwtAxios.post(`${host}/add`, enrichedLoanPost, {
      headers: { Authorization: getAuthToken() },
    });
    return response.data;
  } catch (error) {
    console.error("게시글 생성 오류:", error.response?.data || error.message);
    throw error;
  }
};

// 모든 게시글 조회
export const getAllLoanPosts = async (page = 0, size = 10) => {
  try {
    const response = await axios.get(`${host}/list`, {
      params: { page, size },
    });
    return response.data;
  } catch (error) {
    console.error("게시글 조회 오류:", error.response?.data || error.message);
    throw error;
  }
};

// 게시글 상세 조회
export const getLoanPostById = async (id) => {
  try {
    const response = await jwtAxios.get(`${host}/view/${id}`, {
      headers: { Authorization: getAuthToken() },
    });
    return response.data;
  } catch (error) {
    console.error(
      "게시글 상세 조회 오류:",
      error.response?.data || error.message
    );
    throw error;
  }
};

// 게시글 수정
export const updateLoanPost = async (id, loanPost) => {
  try {
    checkIsLender();

    if (!loanPost.title || loanPost.title.trim() === "") {
      console.error("게시글 제목이 누락되었습니다.");
      throw new Error("게시글 제목은 필수 항목입니다.");
    }

    const userId = localStorage.getItem("userId");
    if (!userId) {
      console.error("사용자 ID가 없습니다.");
      throw new Error(
        "로그인된 사용자 정보를 찾을 수 없습니다. 다시 로그인해주세요."
      );
    }

    const enrichedLoanPost = {
      ...loanPost,
      writerId: userId,
    };

    console.log("게시글 수정 요청: ", enrichedLoanPost);

    const response = await jwtAxios.put(
      `${host}/update/${id}`,
      enrichedLoanPost,
      {
        headers: { Authorization: getAuthToken() },
      }
    );
    return response.data;
  } catch (error) {
    console.error("게시글 수정 오류:", error.response?.data || error.message);
    throw error;
  }
};

// 게시글 삭제
export const deleteLoanPost = async (id) => {
  try {
    checkIsLender();

    await jwtAxios.delete(`${host}/delete/${id}`, {
      headers: { Authorization: getAuthToken() },
    });
    console.log("게시글 삭제 완료");
  } catch (error) {
    console.error("게시글 삭제 오류:", error.response?.data || error.message);
    throw error;
  }
};
