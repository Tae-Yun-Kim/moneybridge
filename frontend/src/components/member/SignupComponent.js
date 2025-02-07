import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { checkDuplicate, registerMember } from "../../api/memberApi";
import { authenticateUser } from "../../api/firebaseApi";

const initState = {
  id: "",
  password: "",
  name: "",
  residentNumber: "",
  phoneNumber: "",
  email: "",
  accountNumber: "",
  creditScore: "",
  nickname: "",
  social: false,
  address: "",
  isLender: false,
};

const SignupComponent = () => {
  const [registerParam, setRegisterParam] = useState({ ...initState });
  const [duplicateChecks, setDuplicateChecks] = useState({
    id: false,
    residentNumber: false,
    phoneNumber: false,
    email: false,
    accountNumber: false,
  });
  const [authenticatedEmail, setAuthenticatedEmail] = useState(false); // 이메일 인증 상태
  const navigate = useNavigate();
  const [creditScoreCheck, setCreditScoreCheck] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setRegisterParam({
      ...registerParam,
      [name]: type === "checkbox" ? checked : value,
    });

    // 중복 체크 상태 초기화
    if (duplicateChecks.hasOwnProperty(name)) {
      setDuplicateChecks({
        ...duplicateChecks,
        [name]: false,
      });
    }
  };

  // const handleDuplicateCheck = async (field) => {
  //   try {
  //     const value = registerParam[field];
  //     const isDuplicate = await checkDuplicate(field, value);
  //     if (isDuplicate) {
  //       alert(`${field}가 이미 사용 중입니다.`);
  //     } else {
  //       alert(`${field}를 사용할 수 있습니다.`);
  //       setDuplicateChecks({
  //         ...duplicateChecks,
  //         [field]: true,
  //       });
  //     }
  //   } catch (error) {
  //     console.error(error);
  //     alert("중복 체크 중 오류가 발생했습니다.");
  //   }
  // };
  const handleDuplicateCheck = async (field) => {
    const value = registerParam[field];

    if (!value) {
      alert(`${field} 값을 입력해주세요.`);
      return;
    }

    console.log(`🔍 중복 체크 요청: ${field} = ${value}`);

    try {
      const isDuplicate = await checkDuplicate(field, value);
      if (isDuplicate === null) {
        alert("서버 오류로 중복 체크를 수행할 수 없습니다.");
        return;
      }

      if (isDuplicate) {
        alert(`⚠️ ${field}가 이미 사용 중입니다.`);
      } else {
        alert(`✅ ${field}를 사용할 수 있습니다.`);
        setDuplicateChecks({
          ...duplicateChecks,
          [field]: true,
        });
      }
    } catch (error) {
      console.error("중복 체크 중 오류 발생:", error);
      alert("중복 체크 중 오류가 발생했습니다.");
    }
  };

  const handleEmailAuthentication = async () => {
    try {
      const { email, password } = registerParam;
      // 비밀번호와 이메일을 함께 전달하여 회원가입
      if (password && email) {
        await authenticateUser(email, password); // 이메일 인증 메서드 호출
        alert("이메일 인증을 위해 인증 메일이 전송되었습니다.");
        setAuthenticatedEmail(true); // 이메일 인증 상태 업데이트
      } else {
        alert("이메일과 비밀번호를 모두 입력해주세요.");
      }
    } catch (error) {
      console.error(error);
      alert("이메일 인증 중 오류가 발생했습니다.");
    }
  };

  const handleCreditScoreCheck = () => {
    const score = parseInt(registerParam.creditScore, 10);

    if (isNaN(score)) {
      alert("신용점수를 올바르게 입력해주세요.");
      return;
    }

    if (score >= 500) {
      alert("신용점수가 유효합니다.");
      setCreditScoreCheck(true);
    } else {
      alert("신용점수가 낮습니다.");
      setCreditScoreCheck(false);
    }
  };

  const handleClickRegister = async () => {
    // 중복 체크가 완료되지 않은 필드가 있는지 확인
    const allChecked = Object.values(duplicateChecks).every(
      (checked) => checked
    );
    if (!allChecked) {
      alert("모든 필드의 중복 체크를 완료해주세요.");
      return;
    }

    if (!creditScoreCheck) {
      alert("신용점수 검증을 완료해주세요.");
      return;
    }

    if (!authenticatedEmail) {
      alert("이메일 인증을 먼저 진행해주세요.");
      return;
    }

    try {
      await registerMember(registerParam); // 회원가입 API 호출
      alert("회원가입이 성공적으로 완료되었습니다!");
      navigate("/member/login");
    } catch (error) {
      console.error(error);
      alert("회원가입 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="border-2 border-green-200 mt-10 m-2 p-4">
      <div className="flex justify-center">
        <div className="text-4xl m-4 p-4 font-extrabold text-green-500">
          Register Component
        </div>
      </div>
      {[
        { label: "ID", name: "id", type: "text" },
        { label: "비밀번호", name: "password", type: "password" },
        { label: "이름", name: "name", type: "text" },
        { label: "주민번호", name: "residentNumber", type: "text" },
        { label: "휴대전화", name: "phoneNumber", type: "text" },
        { label: "Email", name: "email", type: "email" },
        { label: "계좌번호", name: "accountNumber", type: "text" },
        { label: "신용점수", name: "creditScore", type: "text" },
        { label: "닉네임", name: "nickname", type: "text" },
        { label: "주소", name: "address", type: "text" },
      ].map((input) => (
        <div className="flex justify-center" key={input.name}>
          <div className="relative mb-4 flex w-full flex-wrap items-stretch">
            <div className="w-full p-3 text-left font-bold">{input.label}</div>
            <input
              className="w-4/5 p-3 rounded-l border border-solid border-neutral-500 shadow-md"
              name={input.name}
              type={input.type}
              value={registerParam[input.name]}
              placeholder={
                input.name === "password" ? "6자리 이상 입력해주세요" : ""
              }
              onChange={handleChange}
              required
            />
            {duplicateChecks.hasOwnProperty(input.name) && (
              <>
                <button
                  className="w-1/5 p-3 bg-blue-500 text-white rounded-r"
                  onClick={() => handleDuplicateCheck(input.name)}
                >
                  중복 체크
                </button>
                {input.name === "email" && ( // 이메일 필드인 경우에만 인증 버튼 추가
                  <button
                    className="w-1/5 p-3 bg-green-500 text-white rounded-r ml-2"
                    onClick={handleEmailAuthentication}
                  >
                    이메일 인증
                  </button>
                )}
              </>
            )}
            {input.name === "creditScore" && ( // 신용점수 필드에만 신용점수 검증 버튼 추가
              <button
                className="w-1/5 p-3 bg-yellow-500 text-white rounded-r ml-2"
                onClick={handleCreditScoreCheck}
              >
                신용점수 검증
              </button>
            )}
          </div>
        </div>
      ))}
      <div className="flex justify-center">
        <div className="relative mb-4 flex w-full justify-center">
          <div className="w-2/5 p-6 flex justify-center font-bold">
            <button
              className="rounded p-4 w-36 bg-green-500 text-xl text-white"
              onClick={handleClickRegister}
            >
              회원가입
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupComponent;
