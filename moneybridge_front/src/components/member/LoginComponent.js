import { useState } from "react";
import useCustomLogin from "../../hooks/useCustomLogin";
import KakaoLoginComponent from "./KakaoLoginComponent";
import { Link } from "react-router-dom";

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
    // dispatch(login(loginParam));

    doLogin(loginParam).then((data) => {
      console.log(data);

      if (data.error) {
        alert("이메일과 패스워드를 다시 확인하세요");
      } else {
        alert("로그인 성공");
        moveToPath("/");
      }
    });
  };
  return (
    <div className="border-2 border-sky-200 mt-10 m-2 p-4">
      <div className="flex justify-center">
        <div className="text-4xl m-4 p-4 font-extrabold text-blue-500">
          Login Component
        </div>
      </div>
      <div className="flex justify-center">
        <div className="relative mb-4 flex w-full flex-wrap items-stretch">
          <div className="w-full p-3 text-left font-bold">ID</div>
          <input
            className="w-full p-3 rounded-r border border-solid border-neutral-500 shadow-md"
            name="id"
            type={"text"}
            value={loginParam.id}
            onChange={handleChange}
          ></input>
        </div>
      </div>
      <div className="flex justify-center">
        <div className="relative mb-4 flex w-full flex-wrap items-stretch">
          <div className="w-full p-3 text-left font-bold">비밀번호</div>
          <input
            className="w-full p-3 rounded-r border border-solid border-neutral-500 shadow-md"
            name="password"
            type={"password"}
            value={loginParam.password}
            onChange={handleChange}
          ></input>
        </div>
      </div>
      <div className="flex justify-center">
        <div className="relative mb-4 flex w-full justify-center">
          <div className="w-2/5 p-6 flex justify-center font-bold">
            <button
              className="rounded p-4 w-36 bg-blue-500 text-xl  text-white"
              onClick={handleClickLogin}
            >
              로그인
            </button>
          </div>
          <div className="relative mb-4 flex justify-center font-bold">
            <Link
              to="/member/signup"
              className="rounded p-4 w-36 bg-green-500 text-xl text-white text-center"
            >
              회원 가입
            </Link>
          </div>
        </div>
      </div>
      <KakaoLoginComponent />
    </div>
  );
};

export default LoginComponent;
