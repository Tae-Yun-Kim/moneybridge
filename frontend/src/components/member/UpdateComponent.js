import { useEffect } from "react";
import { useState } from "react";
import { useSelector } from "react-redux";
import { checkDuplicate, updateMember } from "../../api/memberApi";
import useCustomLogin from "../../hooks/useCustomLogin";
import ResultModal from "../common/ResultModal";

const initState = {
  id: "",
  password: "",
  nickname: "",
  residentNumber: "",
  phoneNumber: "",
  email: "",
  accountNumber: "",
};

const ModifyComponent = () => {
  const [member, setMember] = useState(initState);
  const loginInfo = useSelector((state) => state.loginSlice);

  const { moveToLogin, doLogout } = useCustomLogin();
  const [result, setResult] = useState();

  const [duplicateStatus, setDuplicateStatus] = useState({
    nickname: null,
    email: null,
    phoneNumber: null,
    accountNumber: null,
  });

  useEffect(() => {
    setMember({ ...loginInfo, password: "" }); // 비밀번호는 초기화
  }, [loginInfo]);

  // 입력값 핸들링
  const handleChange = (e) => {
    const { name, value } = e.target;
    setMember((prev) => ({
      ...prev,
      [name]: value,
    }));
    // 입력값 변경 시 중복 상태 초기화
    setDuplicateStatus((prev) => ({ ...prev, [name]: null }));
  };

  // 중복 확인
  const handleDuplicateCheck = async (field) => {
    try {
      const isDuplicate = await checkDuplicate(
        field,
        member[field],
        member.social
      );
      setDuplicateStatus((prev) => ({ ...prev, [field]: !isDuplicate })); // true: 사용 가능, false: 중복
      alert(
        isDuplicate
          ? `${field}가 중복되었습니다.`
          : `${field}는 사용 가능합니다.`
      );
    } catch (error) {
      console.error(`중복 확인 오류 (${field}):`, error);
    }
  };

  // 회원 정보 수정
  const handleClickModify = async () => {
    try {
      // 모든 필드의 중복 상태 확인
      const allChecked = Object.values(duplicateStatus).every(
        (status) => status === true || status === null
      );
      if (!allChecked) {
        alert("중복 확인이 필요한 필드가 있습니다.");
        return;
      }

      // 회원 정보 수정
      await updateMember(member);

      // 수정 완료 처리
      setResult(true);
      alert("회원 정보가 수정되었습니다. 다시 로그인해주세요.");

      // 로그아웃 처리
      doLogout();
      moveToLogin();
    } catch (error) {
      console.error("회원 정보 수정 중 오류 발생:", error);
      alert("회원 정보 수정에 실패했습니다.");
    }
  };

  const closeModal = () => {
    setResult(null);
    // moveToLogin();
  };

  return (
    <div className="mt-6">
      {result && (
        <ResultModal
          title={"회원정보"}
          content={"정보수정완료"}
          callbackFn={closeModal}
        />
      )}

      <div className="flex justify-center">
        <div className="relative mb-4 flex w-full flex-wrap items-stretch">
          <div className="w-1/5 p-6 text-right font-bold">ID</div>
          <input
            className="w-4/5 p-6 rounded-r border border-solid border-neutral-300 shadow-md"
            name="id"
            type="text"
            value={member.id}
            readOnly
          />
        </div>
      </div>

      {/* 비밀번호 */}
      <div className="flex justify-center">
        <div className="relative mb-4 flex w-full flex-wrap items-stretch">
          <div className="w-1/5 p-6 text-right font-bold">비밀번호</div>
          <input
            className="w-4/5 p-6 rounded-r border border-solid border-neutral-300 shadow-md"
            name="password"
            type="password"
            value={member.password}
            onChange={handleChange}
          />
        </div>
      </div>

      {/* 닉네임 */}
      <div className="flex justify-center">
        <div className="relative mb-4 flex w-full flex-wrap items-stretch">
          <div className="w-1/5 p-6 text-right font-bold">닉네임</div>
          <input
            className="w-4/5 p-6 rounded-r border border-solid border-neutral-300 shadow-md"
            name="nickname"
            type="text"
            value={member.nickname}
            onChange={handleChange}
          />
        </div>
      </div>

      {/* 이메일 */}
      <div className="flex justify-center">
        <div className="relative mb-4 flex w-full flex-wrap items-stretch">
          <div className="w-1/5 p-6 text-right font-bold">이메일</div>
          <input
            className="w-3/5 p-6 rounded-r border border-solid border-neutral-300 shadow-md"
            name="email"
            type="text"
            value={member.email}
            onChange={handleChange}
            readOnly={member.social} // 소셜 로그인 사용자는 readOnly
          />
          <button
            className="w-1/5 p-6 bg-blue-500 text-white rounded ml-2"
            onClick={() => handleDuplicateCheck("email")}
          >
            중복확인
          </button>
        </div>
      </div>

      {/* 전화번호 */}
      <div className="flex justify-center">
        <div className="relative mb-4 flex w-full flex-wrap items-stretch">
          <div className="w-1/5 p-6 text-right font-bold">전화번호</div>
          <input
            className="w-3/5 p-6 rounded-r border border-solid border-neutral-300 shadow-md"
            name="phoneNumber"
            type="text"
            value={member.phoneNumber}
            onChange={handleChange}
          />
          <button
            className="w-1/5 p-6 bg-blue-500 text-white rounded ml-2"
            onClick={() => handleDuplicateCheck("phoneNumber")}
          >
            중복확인
          </button>
        </div>
      </div>

      {/* 계좌번호 */}
      <div className="flex justify-center">
        <div className="relative mb-4 flex w-full flex-wrap items-stretch">
          <div className="w-1/5 p-6 text-right font-bold">계좌번호</div>
          <input
            className="w-3/5 p-6 rounded-r border border-solid border-neutral-300 shadow-md"
            name="accountNumber"
            type="text"
            value={member.accountNumber}
            onChange={handleChange}
          />
          <button
            className="w-1/5 p-6 bg-blue-500 text-white rounded ml-2"
            onClick={() => handleDuplicateCheck("accountNumber")}
          >
            중복확인
          </button>
        </div>
      </div>

      {/* 수정 버튼 */}
      <div className="flex justify-center">
        <div className="relative mb-4 flex w-full flex-wrap justify-end">
          <button
            type="button"
            className="rounded p-4 m-2 text-xl w-32 text-white bg-blue-500"
            onClick={handleClickModify}
          >
            수정
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModifyComponent;
