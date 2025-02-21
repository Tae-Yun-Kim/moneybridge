import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getQnA, putQnA, deleteQnA } from "../../api/qnaApi";
import ResultModal from "../common/ResultModal";
import useCustomMove from "../../hooks/useCustomMove";
import "./ModifyComponent_q.css";

const initState = {
  qno: 0,
  qnaTitle: "",
  qnaContent: "",
  id: "",
};

const ModifyComponent_q = ({ qno }) => {
  const [qna, setQna] = useState({ ...initState });

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const { moveToList } = useCustomMove();

  // ✅ localStorage에서 사용자 정보 가져오기
  const userData = localStorage.getItem("member");
  const user = userData ? JSON.parse(userData) : null;
  const loggedInUserId = user?.id || "";

  // 로그인하지 않은 경우
  useEffect(() => {
    if (!loggedInUserId) {
      alert("로그인이 필요합니다.");
      navigate("/member/login");
    } else {
      setLoading(true);
      setError(null);

      getQnA(qno)
        .then((data) => setQna({ ...initState, ...data }))
        .catch(() => setError("QnA 데이터를 불러오는데 실패했습니다."))
        .finally(() => setLoading(false));
    }
  }, [qno, loggedInUserId, navigate]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setQna((prevQna) => ({
      ...prevQna,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleClickModify = async () => {
    if (loggedInUserId !== qna.id) {
      alert("수정 권한이 없습니다.");
      return;
    }

    const qnaData = {
      qno: qna.qno,
      qnaTitle: qna.qnaTitle,
      qnaContent: qna.qnaContent,
      isSecret: qna.isSecret,
    };

    try {
      await putQnA(qno, qnaData);
      setResult("Modified");
    } catch (error) {
      console.error("Error during QnA modify:", error);
      setResult("Failed");
    }
  };

  const handleClickDelete = async () => {
    if (loggedInUserId !== qna.id) {
      alert("삭제 권한이 없습니다.");
      return;
    }

    if (window.confirm("정말로 삭제하시겠습니까?")) {
      try {
        await deleteQnA(qno);
        setResult("Deleted");
      } catch {
        setResult("Failed");
      }
    }
  };

  const closeModal = () => {
    moveToList();
  };

  if (!loggedInUserId) return null;
  if (loading) return <div>로딩 중...</div>;
  if (error) return <div>{error}</div>;

  const isOwner = loggedInUserId === qna.id;

  return (
    <div className="modify-container">
      {result && (
        <ResultModal
          title="처리결과"
          content={
            result === "Modified"
              ? "수정 성공!"
              : result === "Deleted"
              ? "삭제 성공!"
              : "처리 실패"
          }
          callbackFn={closeModal}
        />
      )}

      <h1 className="modify-title">QnA 수정</h1>

      <div className="input-group">
        <label className="input-label">작성자</label>
        <div className="readonly-box">{qna.id || "알 수 없음"}</div>
      </div>

      <div className="input-group">
        <input
          className="input-field"
          name="qnaTitle"
          type="text"
          value={qna.qnaTitle}
          onChange={handleChange}
          placeholder="QnA 제목"
          required
          disabled={!isOwner}
        />
      </div>

      <div className="input-group">
        <textarea
          className="textarea-field"
          name="qnaContent"
          value={qna.qnaContent}
          onChange={handleChange}
          placeholder="QnA 내용"
          required
          rows="6"
          disabled={!isOwner}
        />
      </div>

      {isOwner && (
        <div className="button-container">
          <button className="modify-button" onClick={handleClickModify}>
            수정
          </button>
          <button className="delete-button" onClick={handleClickDelete}>
            삭제
          </button>
        </div>
      )}
    </div>
  );
};

export default ModifyComponent_q;
