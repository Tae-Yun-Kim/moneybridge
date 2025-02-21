import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getQnAList } from "../../api/qnaApi";
import useCustomMove from "../../hooks/useCustomMove";
import FetchingModal from "../common/FetchingModal";
import PageComponent from "../common/PageComponent";
import "./ListComponent_q.css";

const faqList = [
  {
    qno: -1,
    qnaTitle: "돈을 갚지 않으면 어떻게 되나요?",
    id: "관리자",
    answer: "채무자 의향에 따라 대리추심, 소송이 일어날수 있습니다",
    isSecret: false,
  },
  {
    qno: -2,
    qnaTitle: "대리 추심은 어떻게 하면되나요?",
    id: "관리자",
    answer: "본 사이트의 대행서비스>추심신청 박스를 선택하시면 됩니다",
    isSecret: false,
  },
];

const ListComponent_q = () => {
  const { page, size, refresh, moveToList } = useCustomMove();
  const navigate = useNavigate();
  const ITEMS_PER_PAGE = 20;

  // ✅ `localStorage`에서 사용자 정보 가져오기
  const userData = localStorage.getItem("member");
  const user = userData ? JSON.parse(userData) : null;
  const loggedInUserId = user?.id || "";
  const isAdmin = user?.role === "ROLE_ADMIN"; // 관리자 여부

  const [serverData, setServerData] = useState({
    dtoList: [],
    pageNumList: [],
    totalCount: 0,
    totalPage: 1,
    current: 1,
  });

  const [fetching, setFetching] = useState(false);
  const [activeQuestion, setActiveQuestion] = useState(null);

  // ✅ QnA 클릭 핸들러 (비밀글 확인 후 이동)
  const handleQnaClick = (qna) => {
    const isFaq = faqList.some((faq) => faq.qno === qna.qno);

    // FAQ인 경우 토글 방식으로 답변 열고 닫기
    if (isFaq) {
      setActiveQuestion(activeQuestion === qna.qno ? null : qna.qno);
      return;
    }

    // ✅ 비밀글 권한 체크: 작성자 본인 또는 관리자
    if (qna.isSecret && !(loggedInUserId === qna.id || isAdmin)) {
      alert("비밀글은 작성자 혹은 관리자만 조회할 수 있습니다.");
      return;
    }

    navigate(`/qna/read/${qna.qno}`);
  };

  // ✅ QnA 리스트 불러오기
  useEffect(() => {
    if (!loggedInUserId) {
      alert("로그인이 필요합니다.");
      navigate("/member/login");
      return;
    }

    setFetching(true);
    getQnAList({ page, size: ITEMS_PER_PAGE - faqList.length })
      .then((data) => {
        // FAQ 항목 + 서버에서 가져온 dtoList 합치기
        const combinedData = [
          ...faqList.map((faq) => ({ ...faq, isFaq: true })), // FAQ 포함
          ...(data?.dtoList || []).map((qna) => ({ ...qna, isFaq: false })), // 서버 데이터 포함
        ];
        setServerData({
          ...data,
          dtoList: combinedData,
        });
      })
      .catch((error) => {
        console.error("Error fetching QnA list:", error);
        setServerData({ dtoList: faqList, totalCount: faqList.length });
      })
      .finally(() => {
        setFetching(false);
      });
  }, [page, refresh, loggedInUserId, navigate]);

  return (
    <div className="qna-container">
      {fetching && <FetchingModal />}
      <h2 className="qna-title">QnA</h2>
      {/* 질문하기 버튼
      <div className="qna-add">
        <button className="qna-add-button">질문하기</button>
      </div> */}
      {/* QnA 리스트 */}
      <div className="qna-list">
        {serverData.dtoList.length > 0 ? (
          serverData.dtoList.map((qna) => (
            // <div
            //   key={qna.qno}
            //   className="qna-card"
            //   onClick={() => handleQnaClick(qna)}
            // >
            <div
              key={qna.qno}
              className={`qna-card ${qna.isFaq ? "faq-card" : ""}`} // ✅ FAQ 배경색 클래스 추가
              onClick={() => handleQnaClick(qna)}
            >
              <div>
                <h3 className="qna-card-title">
                  {qna.isSecret &&
                  !qna.isFaq &&
                  !(loggedInUserId === qna.id || isAdmin) ? (
                    <span className="qna-secret">🔒 비밀글입니다.</span>
                  ) : (
                    qna.qnaTitle
                  )}
                </h3>
                <p className="qna-card-author">
                  작성자: {qna.isFaq ? "관리자" : qna.id || "알 수 없음"}
                </p>
                {qna.answer && <div className="qna-answer">{qna.answer}</div>}
              </div>
            </div>
          ))
        ) : (
          <div className="qna-empty">QnA 목록이 없습니다.</div>
        )}
      </div>
      {/* 페이지네이션 */}
      <div className="qna-pagination">
        <PageComponent serverData={serverData} movePage={moveToList} />
      </div>
    </div>
  );
};

export default ListComponent_q;
