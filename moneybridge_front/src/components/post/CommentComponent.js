import { useEffect, useState } from "react";
import {
  getCommentsByPostId,
  createComment,
  updateComment,
  deleteComment,
  selectComment,
} from "../../api/commentApi";

const CommentComponent = ({ postId }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState({
    interestRate: "",
    commentText: "",
  });
  const [userInfo, setUserInfo] = useState({
    userId: "",
    memberGrade: "",
    isLender: false,
  });
  const [error, setError] = useState(null);
  const [editingComment, setEditingComment] = useState(null);
  const [updatedText, setUpdatedText] = useState("");
  const [updatedInterestRate, setUpdatedInterestRate] = useState("");

  // 로컬 스토리지에서 사용자 정보 가져오기
  const fetchUserInfo = () => {
    const userId = localStorage.getItem("userId");
    const memberGrade = localStorage.getItem("memberGrade");
    const isLender = localStorage.getItem("isLender") === "true";
    if (!userId || !memberGrade) {
      alert("로그인이 필요합니다. 다시 로그인해주세요.");
      window.location.href = "/login";
      return;
    }
    setUserInfo({ userId, memberGrade, isLender });
  };

  // 에러 처리
  const handleTokenError = (error) => {
    if (error.response?.status === 401) {
      alert("세션이 만료되었습니다. 다시 로그인해주세요.");
      window.location.href = "/login";
    }
    setError("오류가 발생했습니다.");
  };

  // 댓글 목록 가져오기
  const fetchComments = async () => {
    try {
      const data = await getCommentsByPostId(postId);
      setComments(data);
    } catch (error) {
      handleTokenError(error);
    }
  };

  // 댓글 생성
  const handleCreateComment = async () => {
    if (!newComment.commentText.trim() || !newComment.interestRate.trim()) {
      alert("이자율과 댓글 내용을 입력해주세요.");
      return;
    }
    try {
      await createComment(postId, newComment);
      setNewComment({ interestRate: "", commentText: "" });
      fetchComments();
    } catch (error) {
      handleTokenError(error);
    }
  };

  // 댓글 수정
  const handleUpdateComment = async (commentId) => {
    const commentToUpdate = comments.find(
      (comment) => comment.id === commentId
    );
    if (!commentToUpdate) return;

    try {
      await updateComment(commentId, {
        commentText: updatedText,
        interestRate: updatedInterestRate || commentToUpdate.interestRate,
      });
      setEditingComment(null);
      fetchComments();
    } catch (error) {
      handleTokenError(error);
    }
  };

  // 댓글 삭제
  const handleDeleteComment = async (commentId) => {
    if (!window.confirm("정말로 댓글을 삭제하시겠습니까?")) return;
    try {
      await deleteComment(commentId);
      fetchComments();
    } catch (error) {
      handleTokenError(error);
    }
  };

  // ✅ 출자자가 댓글을 선택하는 함수 (계약 생성이 아니라 댓글 선택)
  const handleSelectComment = async (commentId) => {
    if (!userInfo.isLender) {
      alert("출자자만 댓글을 선택할 수 있습니다.");
      return;
    }

    try {
      await selectComment(postId, commentId); // ✅ 댓글 선택 API 호출
      alert("댓글이 선택되었습니다. 대출자의 마이페이지에서 확인하세요.");

      // ✅ 댓글 선택 후 대출자의 마이페이지 데이터 새로고침 이벤트 발생
      window.dispatchEvent(new Event("contractCreated"));

      fetchComments(); // ✅ 선택된 댓글 즉시 반영
    } catch (error) {
      handleTokenError(error);
    }
  };

  // ✅ useEffect에서 데이터 가져오기
  useEffect(() => {
    fetchUserInfo(); // 사용자 정보 가져오기
    fetchComments(); // 댓글 목록 가져오기
  }, [postId]);

  return (
    <div className="border-2 border-gray-300 p-4 mt-4 rounded-md">
      <h2 className="text-xl font-bold mb-4">댓글</h2>
      {error && <p className="text-red-500">{error}</p>}

      {/* 댓글 입력 폼 */}
      <div className="mb-4">
        <input
          type="number"
          placeholder="이자율(%)"
          value={newComment.interestRate}
          onChange={(e) =>
            setNewComment({ ...newComment, interestRate: e.target.value })
          }
          className="w-full p-2 border border-gray-300 rounded-md"
        />
        <textarea
          placeholder="댓글 입력..."
          value={newComment.commentText}
          onChange={(e) =>
            setNewComment({ ...newComment, commentText: e.target.value })
          }
          className="w-full p-2 border border-gray-300 rounded-md mt-2"
        />
        <button
          onClick={handleCreateComment}
          className="px-4 py-2 bg-blue-500 text-white rounded-md mt-2"
        >
          댓글 작성
        </button>
      </div>

      {/* 댓글 목록 */}
      {comments.map((comment) => (
        <div key={comment.id} className="p-4 mb-2 border-b border-gray-200">
          <strong>
            {comment.memberName} ({comment.memberId})
          </strong>{" "}
          ({comment.memberGrade})<br />
          <span>이자율: {comment.interestRate}%</span>
          <br />
          {editingComment === comment.id ? (
            <>
              <input
                type="number"
                value={updatedInterestRate}
                onChange={(e) => setUpdatedInterestRate(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md"
              />
              <textarea
                value={updatedText}
                onChange={(e) => setUpdatedText(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md"
              />
              <button
                onClick={() => handleUpdateComment(comment.id)}
                className="px-4 py-1 bg-green-500 text-white rounded-md"
              >
                저장
              </button>
              <button
                onClick={() => setEditingComment(null)}
                className="px-4 py-1 bg-gray-500 text-white rounded-md ml-2"
              >
                취소
              </button>
            </>
          ) : (
            <span>{comment.commentText}</span>
          )}
          <div className="mt-2">
            {userInfo.userId === comment.memberId && (
              <>
                <button
                  onClick={() => setEditingComment(comment.id)}
                  className="px-4 py-1 bg-yellow-500 text-white rounded-md"
                >
                  수정
                </button>
                <button
                  onClick={() => handleDeleteComment(comment.id)}
                  className="px-4 py-1 bg-red-500 text-white rounded-md ml-2"
                >
                  삭제
                </button>
              </>
            )}
            {userInfo.isLender && (
              <button
                onClick={() => handleSelectComment(comment.id)}
                className="px-4 py-1 bg-blue-500 text-white rounded-md ml-2"
              >
                계약 생성
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default CommentComponent;
