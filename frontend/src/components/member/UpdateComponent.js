import { useEffect } from "react";
import { useState } from "react";
import { useSelector } from "react-redux";
import { checkDuplicate, updateMember } from "../../api/memberApi";
import useCustomLogin from "../../hooks/useCustomLogin";
import ResultModal from "../common/ResultModal";
import "./UpdateComponent.css";

const initState = {
  id: "",
  password: "",
  nickname: "",
  residentNumber: "",
  phoneNumber: "",
  email: "",
  accountNumber: "",
};

const UpdateComponent = () => {
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
    <div className="page-container">
      <h1 className="page-title">회원수정 페이지</h1>

      <form>
        {/* ID */}
        <div className="form-group">
          <label>ID</label>
          <input type="text" name="id" value={member.id} readOnly />
        </div>

        {/* 비밀번호 */}
        <div className="form-group">
          <label>비밀번호</label>
          <input
            type="password"
            name="password"
            value={member.password}
            onChange={handleChange}
          />
        </div>

        {/* 닉네임 */}
        <div className="form-group">
          <label>닉네임</label>
          <input
            type="text"
            name="nickname"
            value={member.nickname}
            onChange={handleChange}
          />
        </div>

        {/* 이메일 */}
        <div className="form-group">
          <label>이메일</label>
          <input
            type="text"
            name="email"
            value={member.email}
            onChange={handleChange}
            readOnly={member.social}
          />
          <button type="button" onClick={() => handleDuplicateCheck("email")}>
            중복확인
          </button>
        </div>

        {/* 전화번호 */}
        <div className="form-group">
          <label>전화번호</label>
          <input
            type="text"
            name="phoneNumber"
            value={member.phoneNumber}
            onChange={handleChange}
          />
          <button
            type="button"
            onClick={() => handleDuplicateCheck("phoneNumber")}
          >
            중복확인
          </button>
        </div>

        {/* 계좌번호 */}
        <div className="form-group">
          <label>계좌번호</label>
          <input
            type="text"
            name="accountNumber"
            value={member.accountNumber}
            onChange={handleChange}
          />
          <button
            type="button"
            onClick={() => handleDuplicateCheck("accountNumber")}
          >
            중복확인
          </button>
        </div>

        {/* 수정 버튼 */}
        <button
          type="button"
          className="submit-btn"
          onClick={handleClickModify}
        >
          수정
        </button>
      </form>
    </div>
  );
};

export default UpdateComponent;
