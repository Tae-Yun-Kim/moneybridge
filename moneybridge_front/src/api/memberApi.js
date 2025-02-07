import axios from "axios";
import jwtAxios from "../util/jwtUtil";

export const API_SERVER_HOST = "http://localhost:8080";

const host = `${API_SERVER_HOST}/api/member`;

// //로그인(Spring security 이용)
export const loginPost = async (loginParam) => {
  const header = { headers: { "Content-Type": "x-www-form-urlencoded" } };

  const form = new FormData();
  form.append("username", loginParam.id);
  form.append("password", loginParam.password);

  try {
    const res = await axios.post(`${host}/login`, form, header);

    // 반환된 데이터에서 토큰 및 추가 정보를 추출
    const { accessToken, refreshToken, userId, isLender, memberGrade } = res.data;

    // 로컬 스토리지 초기화
    localStorage.clear();

    // 로컬 스토리지에 저장
    if (accessToken && refreshToken) {
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
      localStorage.setItem("userId", userId); // 사용자 ID 저장
      localStorage.setItem("memberGrade", memberGrade || "BRONZE"); // 기본값 설정

      // 출자자 여부 추가 저장
      if (typeof isLender !== "undefined") {
        localStorage.setItem("isLender", isLender.toString()); // 문자열로 변환하여 저장
      }

      console.log(
        "로컬 스토리지가 초기화되고 AccessToken, RefreshToken, isLender이 저장되었습니다."
      );
    } else {
      console.log("토큰 또는 추가 정보가 반환되지 않았습니다.");
    }

    // 반환된 데이터를 그대로 반환
    return res.data;
  } catch (error) {
    // 에러 객체 구조 확인 및 안전한 핸들링
    console.error("로그인 실패:", error);

  }
};






//회원 가입
export const registerMember = async (member) => {
  try {
    const response = await axios.post(
      "http://localhost:8080/api/member/register",
      member,
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
export const checkDuplicate = async (field, value, social = false) => {
  const response = await axios.get(`${host}/check-duplicate`, {
    params: { field, value, social },
  });
  return response.data; // true (중복), false (사용 가능)
};

// 소셜 회원 정보 업데이트 API
export const updateSocialMember = async (memberInfo) => {
  const response = await axios.put(`${host}/social/update`, memberInfo);
  return response.data;
};
