/* global Kakao */

import axios from "axios";
import { API_SERVER_HOST } from "./memberApi";

const rest_api_key = ``; // REST API 키
const client_secret = ``; //SECRET 키
const redirect_uri = `http://localhost:3000/member/kakao`; // 카카오 로그인 리다이렉트 URI
const logout_redirect_uri = `http://localhost:3000`; // 로그아웃 리다이렉트 URI

const auth_code_path = `https://kauth.kakao.com/oauth/authorize`;
const access_token_url = `https://kauth.kakao.com/oauth/token`;
const logout_url = `https://kauth.kakao.com/oauth/logout`; // 카카오 로그아웃 URL

/**
 * 카카오 로그인 링크 생성
 */
export const getKakaoLoginLink = () => {
  const kakaoURL = `${auth_code_path}?client_id=${rest_api_key}&redirect_uri=${redirect_uri}&response_type=code`;
  return kakaoURL;
};

/**
 * 카카오 액세스 토큰 요청
 * @param {string} authCode - 카카오에서 반환한 인증 코드
 */
export const getAccessToken = async (authCode) => {
  const header = {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  };
  const params = new URLSearchParams({
    grant_type: "authorization_code",
    client_id: rest_api_key,
    client_secret: client_secret, // 클라이언트 시크릿 추가
    redirect_uri: redirect_uri,
    code: authCode, // 인증 코드
  });

  try {
    const res = await axios.post(access_token_url, params, header);
    console.log("[Kakao] Access Token Response:", res.data);
    return res.data.access_token;
  } catch (error) {
    console.error(
      "[Kakao] 액세스 토큰 요청 실패:",
      error.response?.data || error.message
    );
    throw new Error("카카오 액세스 토큰 요청 실패");
  }
};

/**
 * 카카오 액세스 토큰으로 사용자 정보 가져오기
 * @param {string} accessToken - 카카오에서 발급한 액세스 토큰
 */
// export const getMemberWithAccessToken = async (accessToken) => {
//   try {
//     const res = await axios.get(
//       `${API_SERVER_HOST}/api/member/kakao?accessToken=${accessToken}`
//     );
//     console.log("카카오 사용자 정보 요청 성공:", res.data);
//     return res.data;
//   } catch (error) {
//     console.error("카카오 사용자 정보 요청 실패:", error);
//     throw new Error("카카오 사용자 정보 요청 실패");
//   }
// };
export const getMemberWithAccessToken = async (accessToken) => {
  try {
    const res = await axios.get(
      `${API_SERVER_HOST}/api/member/kakao?accessToken=${accessToken}`
    );
    console.log("카카오 사용자 정보 요청 성공:", res.data);

    // 여기서 토큰 저장 로직 추가
    const { accessToken: serverAccessToken, refreshToken } = res.data;

    if (serverAccessToken && refreshToken) {
      localStorage.setItem("accessToken", serverAccessToken);
      localStorage.setItem("refreshToken", refreshToken);
      console.log(
        "AccessToken과 RefreshToken이 로컬 스토리지에 저장되었습니다."
      );
    } else {
      console.log("토큰이 반환되지 않았습니다.");
    }

    return res.data;
  } catch (error) {
    console.error("카카오 사용자 정보 요청 실패:", error);
    throw error;
  }
};

/**
 * 카카오 로그아웃 (리다이렉트 방식)
 */
export const kakaoLogout = () => {
  const logoutUrl = `https://kauth.kakao.com/oauth/logout?client_id=${rest_api_key}&logout_redirect_uri=${redirect_uri}`;
  window.location.href = logoutUrl; // 카카오 로그아웃 후 리다이렉트
};

// 카카오 연결 끊기
export const kakaoSdkLogout = () => {
  return new Promise((resolve, reject) => {
    if (Kakao.Auth) {
      Kakao.Auth.logout(() => {
        console.log("카카오 JavaScript SDK 로그아웃 성공");
        resolve();
      });
    } else {
      console.error("카카오 JavaScript SDK 초기화되지 않음");
      reject("SDK Not Initialized");
    }
  });
};
