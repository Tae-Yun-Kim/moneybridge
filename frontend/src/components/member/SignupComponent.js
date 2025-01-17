import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { checkDuplicate, registerMember } from "../../api/memberApi";

const initState = {
  id: "",
  password: "",
  name: "",
  residentNumber: "",
  phoneNumber: "",
  email: "",
  accountNumber: "",
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
  const navigate = useNavigate();

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

  const handleDuplicateCheck = async (field) => {
    try {
      const value = registerParam[field];
      const isDuplicate = await checkDuplicate(field, value);
      if (isDuplicate) {
        alert(`${field}가 이미 사용 중입니다.`);
      } else {
        alert(`${field}를 사용할 수 있습니다.`);
        setDuplicateChecks({
          ...duplicateChecks,
          [field]: true,
        });
      }
    } catch (error) {
      console.error(error);
      alert("중복 체크 중 오류가 발생했습니다.");
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

    try {
      await registerMember(registerParam); // 회원가입 API 호출
      alert("회원가입이 성공적으로 완료되었습니다!");
      navigate("/");
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
        { label: "Password", name: "password", type: "password" },
        { label: "Name", name: "name", type: "text" },
        { label: "Resident Number", name: "residentNumber", type: "text" },
        { label: "Phone Number", name: "phoneNumber", type: "text" },
        { label: "Email", name: "email", type: "email" },
        { label: "Account Number", name: "accountNumber", type: "text" },
        { label: "Nickname", name: "nickname", type: "text" },
        { label: "Address", name: "address", type: "text" },
      ].map((input) => (
        <div className="flex justify-center" key={input.name}>
          <div className="relative mb-4 flex w-full flex-wrap items-stretch">
            <div className="w-full p-3 text-left font-bold">{input.label}</div>
            <input
              className="w-4/5 p-3 rounded-l border border-solid border-neutral-500 shadow-md"
              name={input.name}
              type={input.type}
              value={registerParam[input.name]}
              onChange={handleChange}
              required
            />
            {duplicateChecks.hasOwnProperty(input.name) && (
              <button
                className="w-1/5 p-3 bg-blue-500 text-white rounded-r"
                onClick={() => handleDuplicateCheck(input.name)}
              >
                중복 체크
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
              REGISTER
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupComponent;
