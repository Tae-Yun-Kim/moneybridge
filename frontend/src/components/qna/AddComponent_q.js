import React, { useState, useEffect, useRef } from "react"; // React 및 훅 임포트
import { postQnA } from "../../api/qnaApi"; // QnA API 함수 임포트
import FetchingModal from "../common/FetchingModal"; // FetchingModal 컴포넌트 임포트
import ResultModal from "../common/ResultModal"; // ResultModal 컴포넌트 임포트
import useCustomMove from "../../hooks/useCustomMove"; // 커스텀 훅 임포트
import { useNavigate } from "react-router-dom";
import "./AddComponent_q.css";

// 초기 상태 설정
const initState = {
  qnaTitle: "",
  qnaContent: "",
  isSecret: false,
  id: "",
};

const AddComponent_q = () => {
  const navigate = useNavigate();
  const { moveToList } = useCustomMove();
  const [qna, setQna] = useState({ ...initState });
  const [fetching, setFetching] = useState(false);
  const [result, setResult] = useState(null);
  const isFirstRender = useRef(true); // ✅ 첫 실행 여부 확인

  useEffect(() => {
    // ✅ `localStorage`에서 로그인 정보 가져오기
    const userData = localStorage.getItem("member");
    const user = userData ? JSON.parse(userData) : null;

    if (!user || !user.id) {
      alert("로그인이 필요합니다.");
      navigate("/user/login");
    } else {
      // ✅ 첫 실행일 때만 `setQna` 실행
      if (isFirstRender.current) {
        isFirstRender.current = false; // 이후에는 실행되지 않도록 변경
        setQna((prevQna) => ({
          ...prevQna,
          id: user.id, // ✅ 로그인한 사용자의 ID 설정
        }));
      }
    }
  }, [navigate]); // ✅ 의존성 배열에서 `user` 제거

  // 입력 핸들러
  const handleChangeQna = (e) => {
    const { name, value, type, checked } = e.target;
    console.log("Input Change - Name:", name, "Value:", value);

    setQna((prevQna) => ({
      ...prevQna,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // 등록 버튼 클릭
  const handleClickAdd = async () => {
    console.log("Current QnA State:", qna);

    if (!qna.qnaTitle.trim()) {
      alert("제목을 입력하세요.");
      return;
    }
    if (!qna.qnaContent.trim()) {
      alert("내용을 입력하세요.");
      return;
    }

    setFetching(true);

    try {
      const data = await postQnA(qna);
      // setResult(data);

      // 상태 초기화
      setQna({ ...initState, id: qna.id });
      alert("등록되었습니다.");
      navigate("/qna/list");
    } catch (error) {
      console.error("Error adding QnA:", error);
      alert("QnA 등록에 실패했습니다.");
    } finally {
      setFetching(false);
    }
  };

  const closeModal = () => {
    setResult(null);
    moveToList({ page: 1 });
  };

  return (
    <div className="qna-form-container">
      {fetching && <FetchingModal />}
      {result && (
        <ResultModal
          title="QnA 등록 결과"
          content="QnA 등록이 완료되었습니다."
          callbackFn={closeModal}
        />
      )}

      <h2 className="qna-form-title">QnA 작성</h2>

      <div className="qna-form-group">
        <label htmlFor="qnaTitle">제목</label>
        <input
          id="qnaTitle"
          name="qnaTitle"
          type="text"
          className="qna-input"
          value={qna.qnaTitle}
          onChange={handleChangeQna}
          placeholder="제목을 입력하세요"
          required
        />
      </div>

      <div className="qna-form-group">
        <label htmlFor="qnaContent">내용</label>
        <textarea
          id="qnaContent"
          name="qnaContent"
          className="qna-textarea"
          value={qna.qnaContent}
          onChange={handleChangeQna}
          placeholder="내용을 입력하세요"
          required
        />
      </div>

      <div className="qna-checkbox">
        <input
          type="checkbox"
          name="isSecret"
          checked={qna.isSecret}
          onChange={handleChangeQna}
        />
        비밀글로 설정
      </div>

      <div className="qna-submit">
        <button className="qna-submit-button" onClick={handleClickAdd}>
          등록
        </button>
      </div>
    </div>
  );
};

export default AddComponent_q;
