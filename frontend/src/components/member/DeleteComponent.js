import React, { useState } from "react";
import { deleteMember } from "../../api/memberApi"; // deleteMember를 import
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../slices/loginSlice";
import "./DeleteComponent.css";

const DeleteComponent = () => {
  const [credentials, setCredentials] = useState({
    id: "", // 회원 ID
    password: "", // 비밀번호
  });
  const navigate = useNavigate(); // 페이지 이동을 위한 hook
  const currentUserId = useSelector((state) => state.loginSlice.id); // 현재 로그인한 사용자 ID
  const dispatch = useDispatch();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({
      ...prev,
      [name]: value, // 입력 필드 업데이트
    }));
  };

  const handleDelete = async () => {
    const { id, password } = credentials;

    console.log("🚀 삭제 요청 ID:", credentials.id);
    console.log("🔍 삭제 요청 비밀번호:", credentials.password);

    if (!id || !password) {
      alert("회원 ID와 비밀번호를 모두 입력해주세요.");
      return;
    }

    const confirmDelete = window.confirm(
      `정말로 회원 ID "${id}"를 삭제하시겠습니까?`
    );
    if (!confirmDelete) return;

    try {
      await deleteMember(id, password);
      alert(`회원 ID "${id}"가 성공적으로 삭제되었습니다.`);

      // 삭제된 ID가 현재 로그인한 ID와 같으면 로그아웃 처리
      if (id === currentUserId) {
        alert("현재 로그인한 계정이 삭제되었습니다. 로그아웃됩니다.");
        dispatch(logout()); // Redux 상태 초기화
        navigate("/"); // 메인 페이지로 이동
      } else {
        navigate("/"); // 삭제 후 메인 페이지로 이동
      }
    } catch (error) {
      console.error("회원 삭제 중 오류 발생:", error);

      if (
        error.response &&
        error.response.data &&
        error.response.data.message === "비밀번호가 올바르지 않습니다."
      ) {
        alert("비밀번호가 올바르지 않습니다. 다시 시도해주세요.");
      } else {
        alert("회원 삭제에 실패했습니다. 다시 시도해주세요.");
      }
    }
  };

  return (
    <div className="container-delete">
      <h2>회원 삭제</h2>
      <div className="input-group-delete">
        <input
          type="text"
          name="id"
          placeholder="회원 ID 입력"
          value={credentials.id}
          onChange={handleChange}
        />
        <input
          type="password"
          name="password"
          placeholder="비밀번호 입력"
          value={credentials.password}
          onChange={handleChange}
        />
        <button onClick={handleDelete}>회원 삭제</button>
      </div>
    </div>
  );
};

export default DeleteComponent;
