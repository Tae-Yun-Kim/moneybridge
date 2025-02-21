import { initializeApp } from "firebase/app";
import {
  getAuth,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  signInWithEmailAndPassword,
} from "firebase/auth";

// Firebase 프로젝트의 설정 값
const firebaseConfig = {
  apiKey: "//api키",
  authDomain: "ezen-f52f4.firebaseapp.com",
  projectId: "ezen-f52f4",
  storageBucket: "ezen-f52f4.firebasestorage.app",
  messagingSenderId: "616067938397",
  appId: "1:616067938397:web:fe068fb77c09f3999d75b4",
  measurementId: "G-HRH4MYM9D8",
};

// Firebase 초기화
const app = initializeApp(firebaseConfig);

// Firebase 인증 객체 생성
const auth = getAuth(app);

// 회원가입
export const authenticateUser = async (email, password) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    console.log("User registered:", userCredential.user);

    // 이메일 인증 링크 전송
    await sendEmailVerification(userCredential.user);

    alert("이메일 인증을 하세요.");
    console.log("Verification email sent to:", userCredential.user.email);
  } catch (error) {
    console.error("error:", error.message);
    alert("이메일 인증에 실패했습니다: " + error.message); // 사용자에게 오류 메시지 알리기
  }
};

// 로그인
export const loginUser = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;

    if (user.emailVerified) {
      console.log("User logged in:", user.email);
      alert("로그인에 성공했습니다: " + user.email);
      // 로그인 후 대시보드로 리디렉션
    } else {
      alert("이메일 인증에 실패했습니다.");
      console.log("Email is not verified. Please verify your email.");
      // 이메일 인증이 완료되지 않았다는 메시지 표시
    }
  } catch (error) {
    console.error("Login error:", error.message);
    alert("로그인에 실패했습니다: " + error.message); // 사용자에게 오류 메시지 알리기
  }
};
