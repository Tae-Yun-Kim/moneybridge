import { useEffect, useState, useRef } from "react";
import { getQnAList } from "../../api/qnaApi";
import FetchingModal from "../../components/common/FetchingModal";
import PageComponent from "../../components/common/PageComponent";
import { useNavigate } from "react-router-dom";
// import "./Qna.css";
import "./oneToOne.css";

const OneToOneInquiryPage = () => {
  const [serverData, setServerData] = useState({
    dtoList: [],
    pageNumList: [],
    pageRequestDTO: null,
    prev: false,
    next: false,
    totalCount: 0,
    totalPage: 1,
    current: 1,
  });
  const [fetching, setFetching] = useState(false);
  const ITEMS_PER_PAGE = 10;
  const navigate = useNavigate();
  const isFirstRender = useRef(true);

  // ✅ localStorage에서 사용자 정보 가져오기
  const userData = localStorage.getItem("member");
  const user = userData ? JSON.parse(userData) : null;
  const id = user?.id || null;
  const isAdmin = user?.role === "ROLE_ADMIN"; // 관리자 여부

  // 로그인 여부 확인 후 리다이렉트
  useEffect(() => {
    if (!id) {
      alert("로그인이 필요합니다.");
      navigate("/member/login");
    }
  }, [id, navigate]);

  // QnA 리스트 가져오기
  useEffect(() => {
    if (!id || !isFirstRender.current) return;
    isFirstRender.current = false;

    setFetching(true);
    getQnAList({ page: serverData.current, size: ITEMS_PER_PAGE })
      .then((data) => {
        if (!data || !data.dtoList) {
          throw new Error("서버에서 데이터를 받을 수 없습니다.");
        }

        console.log("Fetched data:", data);

        // ================================
        // 1) 관리자면 전체 목록 그대로 사용
        // 2) 일반 사용자면 본인 글(id)만 필터링
        // ================================
        const filteredList = isAdmin
          ? data.dtoList
          : data.dtoList.filter((qna) => qna.id === id);

        // 페이지 계산도 필터링한 length 기준
        const totalCount = filteredList.length;
        const totalPage = Math.max(1, Math.ceil(totalCount / ITEMS_PER_PAGE));

        setServerData({
          ...data,
          dtoList: filteredList,
          totalCount,
          totalPage,
          current: data.pageRequestDTO?.page || 1,
          prev: data.prev || false,
          next: data.next || false,
        });
      })
      .catch((error) => {
        console.error("Error fetching inquiries:", error);
        alert(error.message || "문의글을 불러오는 중 오류가 발생했습니다.");
      })
      .finally(() => {
        setFetching(false);
      });
  }, [id, serverData.current, isAdmin]);

  // 문의글 클릭 시 처리
  const handleInquiryClick = (inquiry) => {
    navigate(`/qna/read/${inquiry.qno}`);
  };

  return (
    <div className="oneToOne-container">
      <h2 className="oneToOneInquiryPageTitle-o">문의 내역</h2>
      {fetching ? (
        <FetchingModal />
      ) : serverData.dtoList.length > 0 ? (
        <div className="inquiryListContainer-o">
          {serverData.dtoList.map((inquiry) => (
            <div
              key={inquiry.qno}
              className="inquiryItem-o"
              onClick={() => handleInquiryClick(inquiry)}
            >
              <h3 className="qna-title-o">
                {inquiry.isSecret && inquiry.id !== id && !isAdmin ? (
                  "🔒 비밀글입니다"
                ) : (
                  <>
                    {inquiry.qnaTitle}{" "}
                    <h3 className="qna-status-o">
                      {inquiry.complete && "(답변완료)"}
                    </h3>
                  </>
                )}
              </h3>
              <p>작성자: {inquiry.id || "알 수 없음"}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="noInquiriesText-o">문의글이 없습니다.</div>
      )}

      {/* 페이지 이동 컴포넌트 */}
      <div className="qna-pagination">
        <PageComponent
          serverData={serverData}
          movePage={(page) =>
            setServerData((prev) => ({ ...prev, current: page }))
          }
        />
      </div>
    </div>
  );
};

export default OneToOneInquiryPage;
