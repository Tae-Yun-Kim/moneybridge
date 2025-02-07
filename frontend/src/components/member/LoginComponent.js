// import { useState } from "react";
// import useCustomLogin from "../../hooks/useCustomLogin";
// import KakaoLoginComponent from "./KakaoLoginComponent";
// import { Link } from "react-router-dom";

// const initState = {
//   id: "",
//   password: "",
// };

// const LoginComponent = () => {
//   const [loginParam, setLoginParam] = useState({ ...initState });

//   const { doLogin, moveToPath } = useCustomLogin();

//   const handleChange = (e) => {
//     loginParam[e.target.name] = e.target.value;

//     setLoginParam({ ...loginParam });
//   };

//   const handleClickLogin = (e) => {
//     // dispatch(login(loginParam));

//     doLogin(loginParam).then((data) => {
//       console.log(data);

//       if (data.error) {
//         alert("이메일과 패스워드를 다시 확인하세요");
//       } else {
//         alert("로그인 성공");

//         // 사용자 정보 로컬 스토리지에 저장
//         const userInfo = {
//           id: data.id, // 서버에서 반환된 사용자 ID
//           name: data.name, // 서버에서 반환된 사용자 이름
//           email: data.email, // 서버에서 반환된 사용자 이메일
//           role: data.role,
//           isLender: data.isLender,
//         };
//         localStorage.setItem("member", JSON.stringify(userInfo)); // JSON으로 저장

//         moveToPath("/");
//       }
//     });
//   };

//   return (
//     <div className="border-2 border-sky-200 mt-10 m-2 p-4">
//       <div className="flex justify-center">
//         <div className="text-4xl m-4 p-4 font-extrabold text-blue-500">
//           로그인
//         </div>
//       </div>
//       <div className="flex justify-center">
//         <div className="relative mb-4 flex w-full flex-wrap items-stretch">
//           <div className="w-full p-3 text-left font-bold">ID</div>
//           <input
//             className="w-full p-3 rounded-r border border-solid border-neutral-500 shadow-md"
//             name="id"
//             type={"text"}
//             value={loginParam.id}
//             onChange={handleChange}
//           ></input>
//         </div>
//       </div>
//       <div className="flex justify-center">
//         <div className="relative mb-4 flex w-full flex-wrap items-stretch">
//           <div className="w-full p-3 text-left font-bold">비밀번호</div>
//           <input
//             className="w-full p-3 rounded-r border border-solid border-neutral-500 shadow-md"
//             name="password"
//             type={"password"}
//             value={loginParam.password}
//             onChange={handleChange}
//           ></input>
//         </div>
//       </div>
//       <div className="flex justify-center">
//         <div className="relative mb-4 flex w-full justify-center">
//           <div className="w-2/5 p-6 flex justify-center font-bold">
//             <button
//               className="rounded p-4 w-36 bg-blue-500 text-xl  text-white"
//               onClick={handleClickLogin}
//             >
//               로그인
//             </button>
//           </div>
//           <div className="relative mb-4 flex justify-center font-bold">
//             <Link
//               to="/member/signup"
//               className="rounded p-4 w-36 bg-green-500 text-xl text-white text-center"
//             >
//               회원 가입
//             </Link>
//           </div>
//         </div>
//       </div>
//       <KakaoLoginComponent />
//     </div>
//   );
// };

// export default LoginComponent;

import { useState } from "react";
import useCustomLogin from "../../hooks/useCustomLogin";
import KakaoLoginComponent from "./KakaoLoginComponent";
import { Link } from "react-router-dom";
import "./LoginComponent.css"; // 개선된 CSS 파일

const initState = {
  id: "",
  password: "",
};

const LoginComponent = () => {
  const [loginParam, setLoginParam] = useState({ ...initState });

  const { doLogin, moveToPath } = useCustomLogin();

  const handleChange = (e) => {
    loginParam[e.target.name] = e.target.value;
    setLoginParam({ ...loginParam });
  };

  const handleClickLogin = (e) => {
    doLogin(loginParam).then((data) => {
      console.log("응답 데이터:", data);
      if (data.error) {
        alert("이메일과 패스워드를 다시 확인하세요");
      } else {
        alert("로그인 성공");
<<<<<<< HEAD
        const userInfo = {
          id: data.id,
          name: data.name,
          email: data.email,
          role: data.role,
          isLender: data.isLender,
          grade: data.grade,
        };
        localStorage.setItem("member", JSON.stringify(userInfo));
=======

        // 사용자 정보 로컬 스토리지에 저장
        const userInfo = {
          id: data.id, // 서버에서 반환된 사용자 ID
          name: data.name, // 서버에서 반환된 사용자 이름
          email: data.email, // 서버에서 반환된 사용자 이메일
          role: data.role,
          isLender: data.isLender,
        };
        localStorage.setItem("member", JSON.stringify(userInfo)); // JSON으로 저장

>>>>>>> c18324b9960a4447aa724017219b545b773bffeb
        moveToPath("/");
      }
    });
  };

  return (
    <div className="login-wrapper">
      <div className="login-card">
        <h1 className="login-title">로그인</h1>
        <form className="login-form">
          <div className="login-field">
            <label htmlFor="id">ID</label>
            <input
              id="id"
              name="id"
              type="text"
              value={loginParam.id}
              onChange={handleChange}
              className="login-input"
            />
          </div>
          <div className="login-field">
            <label htmlFor="password">비밀번호</label>
            <input
              id="password"
              name="password"
              type="password"
              value={loginParam.password}
              onChange={handleChange}
              className="login-input"
            />
          </div>
          <div className="login-buttons">
            <button
              type="button"
              className="login-button"
              onClick={handleClickLogin}
            >
              로그인
            </button>
            <Link to="/member/signup" className="signup-button">
              회원 가입
            </Link>
          </div>
        </form>
        <KakaoLoginComponent />
      </div>
    </div>
  );
};

export default LoginComponent;
