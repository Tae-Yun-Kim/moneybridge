import jwtAxios from "../util/jwtUtil";
import axios from "axios";

const API_SERVER_HOST = "http://localhost:8080"; // 서버 호스트 URL
const host = `${API_SERVER_HOST}/api/post`; // API 엔드포인트

// JWT 토큰 추가 헬퍼 함수
const getAuthHeader = () => {
  const accessToken = localStorage.getItem("accessToken");

  if (!accessToken) {
    console.error("Access token not found. Please log in.");
    return null;
  }

  return `Bearer ${accessToken}`;
};

// 사용자 정보 가져오는 헬퍼 함수
const getUserInfo = () => {
  const userId = localStorage.getItem("userId");
  const memberGrade = localStorage.getItem("memberGrade");

  if (!userId || !memberGrade) {
    alert("사용자 정보가 올바르지 않습니다. 다시 로그인해주세요.");
    throw new Error("User information is missing in local storage");
  }

  return { userId, memberGrade };
};

// 댓글 생성
export const createComment = async (postId, comment) => {
  try {
    const authHeader = getAuthHeader();
    if (!authHeader) {
      alert("로그인이 필요합니다.");
      throw new Error("Authorization header is missing");
    }

    // 사용자 정보 추가
    const { userId, memberGrade } = getUserInfo();

    const requestData = {
      ...comment,
      memberId: userId, // 사용자 ID 추가
      memberGrade, // 회원 등급 추가
    };

    const response = await jwtAxios.post(
      `${host}/${postId}/comments`,
      requestData,
      {
        headers: { Authorization: authHeader },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error in createComment:", error.response || error.message);
    if (error.response?.status === 401) {
      alert("인증 정보가 만료되었습니다. 다시 로그인해주세요.");
    } else {
      alert("댓글 작성 중 문제가 발생했습니다. 다시 시도해주세요.");
    }
    throw error;
  }
};

// 특정 게시글의 댓글 목록 조회
export const getCommentsByPostId = async (postId) => {
  try {
    // const authHeader = getAuthHeader();
    // if (!authHeader) throw new Error("Authorization header is missing");

    const response = await axios.get(`${host}/${postId}/comments`, {
      // headers: { Authorization: authHeader },
    });
    console.log(response.data);
    // 반환된 데이터를 가공
    return response.data.map((comment) => ({
      id: comment.id,
      postId: comment.postId,
      memberId: comment.memberId,
      memberName: comment.memberName,
      memberGrade: comment.memberGrade, // 회원 등급
      interestRate: comment.interestRate,
      commentText: comment.commentText,
      isSelected: comment.isSelected,
      createdAt: comment.createdAt,
      updatedAt: comment.updatedAt,
    }));
  } catch (error) {
    console.error(
      "Error in getCommentsByPostId:",
      error.response || error.message
    );
    if (error.response?.status === 401) {
      alert("인증 정보가 만료되었습니다. 다시 로그인해주세요.");
    } else {
      alert("댓글 목록을 불러오는 중 문제가 발생했습니다.");
    }
    throw error;
  }
};

// 댓글 수정
export const updateComment = async (commentId, updatedComment) => {
  try {
    const authHeader = getAuthHeader();
    if (!authHeader) throw new Error("Authorization header is missing");

    const response = await jwtAxios.put(
      `${host}/comments/${commentId}`,
      updatedComment,
      {
        headers: { Authorization: authHeader },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error in updateComment:", error.response || error.message);
    if (error.response?.status === 401) {
      alert("인증 정보가 만료되었습니다. 다시 로그인해주세요.");
    } else {
      alert("댓글 수정 중 문제가 발생했습니다. 다시 시도해주세요.");
    }
    throw error;
  }
};

// 댓글 삭제
export const deleteComment = async (commentId) => {
  try {
    const authHeader = getAuthHeader();
    if (!authHeader) throw new Error("Authorization header is missing");

    await jwtAxios.delete(`${host}/comments/${commentId}`, {
      headers: { Authorization: authHeader },
    });
  } catch (error) {
    console.error("Error in deleteComment:", error.response || error.message);
    if (error.response?.status === 401) {
      alert("인증 정보가 만료되었습니다. 다시 로그인해주세요.");
    } else {
      alert("댓글 삭제 중 문제가 발생했습니다. 다시 시도해주세요.");
    }
    throw error;
  }
};

// 댓글 선택
// export const selectComment = async (postId, commentId) => {
//   try {
//     const authHeader = getAuthHeader();
//     if (!authHeader) throw new Error("Authorization header is missing");

//     const response = await jwtAxios.post(
//       `${host}/${postId}/comments/${commentId}/select`,
//       {},
//       {
//         headers: { Authorization: authHeader },
//       }
//     );
//     return response.data;
//   } catch (error) {
//     console.error("Error in selectComment:", error.response || error.message);
//     if (error.response?.status === 401) {
//       alert("인증 정보가 만료되었습니다. 다시 로그인해주세요.");
//     } else {
//       alert("댓글 선택 중 문제가 발생했습니다.");
//     }
//     throw error;
//   }
// };

export const selectComment = async (postId, commentId) => {
  try {
    const authHeader = getAuthHeader();
    if (!authHeader) throw new Error("Authorization header is missing");

    // 사용자 정보 가져오기
    const { userId } = getUserInfo(); // ✅ lenderId로 사용될 userId 추가

    const response = await jwtAxios.post(
      `${host}/${postId}/comments/${commentId}/select-comment/${userId}`, // ✅ lenderId 추가
      {},
      {
        headers: { Authorization: authHeader },
      }
    );

    console.log("📌 selectComment response:", response.data); // ✅ 응답 데이터 확인

    return response.data;
  } catch (error) {
    console.error("Error in selectComment:", error.response || error.message);
    if (error.response?.status === 401) {
      alert("인증 정보가 만료되었습니다. 다시 로그인해주세요.");
    } else {
      alert("댓글 선택 중 문제가 발생했습니다.");
    }
    throw error;
  }
};
// // 거래 성립
// export const confirmTransaction = async (commentId) => {
//   try {
//     const authHeader = getAuthHeader();
//     if (!authHeader) throw new Error("Authorization header is missing");

//     const response = await jwtAxios.post(
//       `${host}/comments/${commentId}/confirm`,
//       {},
//       {
//         headers: { Authorization: authHeader },
//       }
//     );
//     return response.data;
//   } catch (error) {
//     console.error(
//       "Error in confirmTransaction:",
//       error.response || error.message
//     );
//     if (error.response?.status === 401) {
//       alert("인증 정보가 만료되었습니다. 다시 로그인해주세요.");
//     } else {
//       alert("거래 성립 중 문제가 발생했습니다.");
//     }
//     throw error;
//   }
// };
