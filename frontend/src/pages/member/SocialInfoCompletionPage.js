import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { updateSocialMember } from "../../api/memberApi"; // 백엔드와 통신할 API
import { login } from "../../slices/loginSlice"; // Redux에 업데이트

const SocialInfoCompletionPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // 로그인한 사용자 정보 (Redux에서 가져오기)
  const loginInfo = useSelector((state) => state.loginSlice);

  // 입력 상태 관리
  const [memberInfo, setMemberInfo] = useState({
    id: "",
    email: "",
    name: "",
    nickname: "",
    residentNumber: "",
    phoneNumber: "",
    accountNumber: "",
    address: "",
  });

  // 초기 데이터 설정
  useEffect(() => {
    if (loginInfo.social) {
      setMemberInfo({
        id: loginInfo.id,
        password: loginInfo.password,
        email: loginInfo.email,
        name: loginInfo.name,
        nickname: loginInfo.nickname,
        residentNumber: loginInfo.residentNumber || "",
        phoneNumber: loginInfo.phoneNumber || "",
        accountNumber: loginInfo.accountNumber || "",
        address: loginInfo.address || "",
        social: loginInfo.social || "",
        isLender: loginInfo.isLender || "",
        accountLocked: loginInfo.accountLocked || "",
        roleNames: loginInfo.roleNames || "",
      });
    } else {
      navigate("/"); // 소셜 회원이 아닌 경우 메인으로 리다이렉트
    }
  }, [loginInfo, navigate]);

  // 입력 핸들러
  const handleChange = (e) => {
    const { name, value } = e.target;
    setMemberInfo((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // 저장 요청
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log("전송 데이터:", memberInfo); // 데이터 확인
      const updatedMember = await updateSocialMember(memberInfo);
      console.log("업데이트 성공:", updatedMember);
      dispatch(login(updatedMember)); // Redux 상태 업데이트
      alert("추가 정보가 저장되었습니다. 메인 페이지로 이동합니다.");
      navigate("/"); // 메인 페이지로 이동
    } catch (error) {
      console.error("정보 저장 중 오류 발생:", error);
      alert("정보 저장에 실패했습니다. 다시 시도해주세요.");
    }
  };

  return (
    <div className="container mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-4">추가 정보 입력</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block font-medium">ID</label>
          <input
            type="text"
            name="id"
            value={memberInfo.id}
            readOnly
            className="w-full border p-2 rounded"
          />
        </div>

        <div className="mb-4">
          <label className="block font-medium">이메일</label>
          <input
            type="text"
            name="email"
            value={memberInfo.email}
            readOnly
            className="w-full border p-2 rounded"
          />
        </div>

        <div className="mb-4">
          <label className="block font-medium">닉네임</label>
          <input
            type="text"
            name="nickname"
            value={memberInfo.nickname}
            readOnly
            className="w-full border p-2 rounded"
          />
        </div>

        <div className="mb-4">
          <label className="block font-medium">주민등록번호</label>
          <input
            type="text"
            name="residentNumber"
            value={memberInfo.residentNumber}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            placeholder="주민등록번호를 입력해주세요"
          />
        </div>

        <div className="mb-4">
          <label className="block font-medium">전화번호</label>
          <input
            type="text"
            name="phoneNumber"
            value={memberInfo.phoneNumber}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            placeholder="전화번호를 입력해주세요"
          />
        </div>

        <div className="mb-4">
          <label className="block font-medium">계좌번호</label>
          <input
            type="text"
            name="accountNumber"
            value={memberInfo.accountNumber}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            placeholder="계좌번호를 입력해주세요"
          />
        </div>

        <div className="mb-4">
          <label className="block font-medium">주소</label>
          <input
            type="text"
            name="address"
            value={memberInfo.address}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            placeholder="주소를 입력해주세요"
          />
        </div>

        <button
          type="submit"
          className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700"
        >
          저장
        </button>
      </form>
    </div>
  );
};

export default SocialInfoCompletionPage;
