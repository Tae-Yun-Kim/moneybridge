import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getLoanPostById } from "../../api/postApi";
import CommentComponent from "./CommentComponent";
import { format } from 'date-fns';
import "../../pages/post/PostPage.css";

const ReadComponent = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  // 로그인한 사용자 ID 상태 추가
  const [parsedUserId, setCurrentUserId] = useState();
  
  useEffect(() => {
    // 로컬 스토리지에서 로그인한 사용자 ID 가져오기
    const userId = localStorage.getItem("member");
    if (userId) {
      const parsedUserId = JSON.parse(userId);  // JSON 문자열을 객체로 변환
      setCurrentUserId(parsedUserId);             // 변환된 객체를 상태에 저장
    }  

    console.log("Fetching post with id:", id);
    getLoanPostById(id)
      .then((response) => {
        console.log("Fetched post:", response);
        setPost(response);
      })
      .catch((error) => {
        console.error("Error fetching post:", error);
        alert("게시글을 불러오는데 실패했습니다.");
      });
  }, [id]);

  const handleEditClick = () => {
    navigate(`/post/modify/${id}`);
  };

  // post가 없을 때 로딩 표시
  if (!post) {
    return <div>로딩 중...</div>;
  }

  return (
    <div>
      {/* 로그인한 사용자 ID와 글쓴이 ID가 같을 때만 수정 버튼 표시 */}
      {parsedUserId && parsedUserId.id === post.writerId && (
      <div className="post-read-body">
        <div className="post-read-modify-button-container">
          <button type="button" onClick={handleEditClick} className="post-read-modify-button">
          수정하기
        </button>
      </div>
      </div>
      )}


      <div className="post-read">
        <div className="post-header">
          <div>글쓴이 ID: {post.writerId}</div>
          <div className="post-created-at">
            작성 시간: {post.createdAt ? format(new Date(post.createdAt), "yyyy-MM-dd HH:mm") : "시간 정보 없음"}
          </div>
          {/* <div className="post-created-at">
            작성 시간: {post.createdAt ? format(new Date(post.createdAt), "yyyy-MM-dd HH:mm") : "없음"}
          </div> */}
        </div>
        <div className="post-body">
          <div>대출 금액: {post.loanAmount.toLocaleString()} 원</div>
          <div>상환 기간: {post.repaymentPeriod}일</div>
          <div>추가 조건: {post.additionalConditions || "없음"}</div>
        </div>
        <div className="post-footer">
          <button onClick={() => navigate("/post/list")}>목록으로</button>
        </div>
      </div>

      <div className="comment-section">
        <CommentComponent
          postId={post.id}
          loanAmount={post.loanAmount}
          repaymentPeriod={post.repaymentPeriod}
        />
      </div>
    </div>
  );
};

export default ReadComponent;
