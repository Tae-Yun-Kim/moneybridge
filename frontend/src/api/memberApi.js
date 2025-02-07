import axios from "axios";
import jwtAxios from "../util/jwtUtil";

export const API_SERVER_HOST = "http://localhost:8080";

const host = `${API_SERVER_HOST}/api/member`;

//로그인(Spring security 이용)
export const loginPost = async (loginParam) => {
  const header = { headers: { "Content-Type": "x-www-form-urlencoded" } };

  const form = new FormData();
  form.append("username", loginParam.id);
  form.append("password", loginParam.password);

  try {
    const res = await axios.post(`${host}/login`, form, header);

    // 반환된 데이터에서 토큰 추출
    const { accessToken, refreshToken } = res.data;

    // 로컬 스토리지에 저장
    if (accessToken && refreshToken) {
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
      console.log(
        "AccessToken과 RefreshToken이 로컬 스토리지에 저장되었습니다."
      );
    } else {
      console.log("토큰이 반환되지 않았습니다.");
    }

    // 반환된 데이터를 그대로 반환
    return res.data;
  } catch (error) {
    console.error("로그인 실패:", error);
    throw error;
  }
};

//회원 가입
export const registerMember = async (memberData) => {
  try {
    const response = await axios.post(
      "http://localhost:8080/api/member/register",
      memberData,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error("Error registering member:", error);
    throw error;
  }
};

//회원 수정
export const updateMember = async (member) => {
  const res = await jwtAxios.put(`${host}/update`, member);

  return res.data;
};

// 회원 조회 요청
export const findMember = async (id) => {
  const res = await jwtAxios.get(`${host}/${id}`); // id로 회원 조회
  return res.data;
};

// 회원 삭제 요청
export const deleteMember = async (id, password) => {
  const res = await jwtAxios.delete(`${host}/${id}`, {
    params: { password },
  }); // id로 회원 삭제
  return res.data;
};

// 중복 체크 API 호출
// export const checkDuplicate = async (field, value, social = false) => {
//   const response = await axios.get(`${host}/check-duplicate`, {
//     params: { field, value, social },
//   });
//   return response.data; // true (중복), false (사용 가능)
// };
export const checkDuplicate = async (field, value, social = false) => {
  try {
    const response = await axios.post(
      `${host}/check-duplicate`,
      {
        field,
        value,
        social,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data; // true (중복), false (사용 가능)
  } catch (error) {
    console.error("중복 체크 API 오류:", error);
    return null; // 오류 발생 시 null 반환
  }
};

// 소셜 회원 정보 업데이트 API
export const updateSocialMember = async (memberInfo) => {
  const response = await axios.put(`${host}/social/update`, memberInfo);
  return response.data;
};
