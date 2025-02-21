import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getQnA } from "../../api/qnaApi";
import CommentComponent_q from "./CommentComponent_q";
import FetchingModal from "../common/FetchingModal";
// import "./qna.css";
import "./ReadComponent_q.css";

const initState = {
  qno: 0,
  qnaTitle: "",
  qnaContent: "",
  id: "",
  isSecret: false,
  regDate: "", // 작성일
};

const ReadComponent_q = () => {
  const [qna, setQna] = useState(initState);
  const [fetching, setFetching] = useState(false);

  const navigate = useNavigate();
  const { qno } = useParams();

  const userData = localStorage.getItem("member");
  const user = userData ? JSON.parse(userData) : null;
  const id = user?.id || "";
  const isAdmin = user?.role === "ROLE_ADMIN";

  useEffect(() => {
    if (!id) {
      alert("로그인이 필요합니다.");
      navigate("/member/login");
      return;
    }

    setFetching(true);

    getQnA(qno)
      .then((qnaData) => {
        if (qnaData.isSecret && !(qnaData.id === id || isAdmin)) {
          alert("해당 게시글을 볼 수 있는 권한이 없습니다.");
          navigate("/qna/list");
          return;
        }
        setQna(qnaData);
      })
      .catch((error) => {
        alert(error.message || "QnA 데이터를 불러오는데 실패했습니다.");
        navigate("/qna/list");
      })
      .finally(() => {
        setFetching(false);
      });
  }, [qno, navigate, id, isAdmin]);

  const handleModifyClick = () => {
    if (!id) {
      alert("로그인이 필요합니다.");
      navigate("/member/login");
      return;
    }
    if (qna.id !== id) {
      alert("해당 게시글을 수정할 권한이 없습니다.");
      return;
    }
    navigate(`/qna/modify/${qno}`);
  };

  const moveToList = () => navigate("/qna/list");

  return (
    <div className="read-container">
      {fetching ? (
        <FetchingModal />
      ) : (
        <>
          <div className="contentBox">
            {/* 제목 */}
            <div className="btn-container">
              {qna.id === id && (
                <button
                  type="button"
                  className="btn-common btn-modify"
                  onClick={handleModifyClick}
                >
                  수정
                </button>
              )}
              <button
                type="button"
                className="btn-common btn-list"
                onClick={moveToList}
              >
                글목록
              </button>
            </div>
            <div className="titleBox">{qna.qnaTitle}</div>

            {/* 작성자 & 작성일 */}
            <div className="authorText">
              작성자: {qna.id || "알 수 없음"}
              <span style={{ margin: "0 8px" }}>|</span>
              작성일: {qna.regDate || "알 수 없음"}
            </div>

            {/* 내용 */}
            <div className="contentText">
              <div>문의 내용</div>
              <p></p>
              {qna.qnaContent}
            </div>
          </div>

          <CommentComponent_q qno={qno} />
        </>
      )}
    </div>
  );
};

export default ReadComponent_q;
