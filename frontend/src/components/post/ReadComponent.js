import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getLoanPostById } from "../../api/postApi";
import CommentComponent from "./CommentComponent";
import { format } from "date-fns";
import "./ReadComponent.css";

const ReadComponent = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [parsedUserId, setCurrentUserId] = useState();

  useEffect(() => {
    const userId = localStorage.getItem("member");
    if (userId) {
      const parsedUserId = JSON.parse(userId);
      setCurrentUserId(parsedUserId);
    }

    console.log("Fetching post with id:", id);
    getLoanPostById(id)
      .then((response) => {
        console.log("Fetched post:", response);
        // setPost(response);

        // ✅ 게시글 상태 체크 후 차단
        if (
          ["계약 완료", "진행중", "계약 취소"].includes(response.contractStatus)
        ) {
          alert(
            `이 게시글은 '${response.contractStatus}' 상태로 접근할 수 없습니다.`
          );
          navigate("/post/list"); // 게시글 목록으로 이동
          return;
        }

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

  if (!post) {
    return <div>로딩 중...</div>;
  }

  return (
    <div className="post-read-container">
      <div className="post-read-buttons">
        {parsedUserId && parsedUserId.id === post.writerId && (
          <button
            type="button"
            className="post-read-btn post-read-modify-btn"
            onClick={handleEditClick}
          >
            수정
          </button>
        )}
        <button
          type="button"
          className="post-read-btn post-read-list-btn"
          onClick={() => navigate("/post/list")}
        >
          글목록
        </button>
      </div>
      <div className="post-read-header">
        <div className="post-read-title">{post.title}</div>
      </div>

      <div className="post-read-content-box">
        <div className="post-read-author-info">
          작성자: {post.writerId || "알 수 없음"}
          <span style={{ margin: "0 8px" }}>|</span>
          작성일:{" "}
          {post.createdAt
            ? format(new Date(post.createdAt), "yyyy-MM-dd HH:mm")
            : "알 수 없음"}
        </div>

        <div className="post-read-content">
          <div>대출 정보</div>
          <p></p>
          <div>대출 금액: {post.loanAmount.toLocaleString()} 원</div>
          <div>상환 기간: {post.repaymentPeriod}개월</div>
          <div>추가 조건: {post.additionalConditions || "없음"}</div>
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
