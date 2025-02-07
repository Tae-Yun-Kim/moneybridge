import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { format } from "date-fns"; // 날짜 포맷팅 라이브러리 추가
import { getCommentsByPostId, createComment, deleteComment, selectComment } from "../../api/commentApi";

const CommentComponent = ({ postId, loanAmount, repaymentPeriod }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState({
    interestRate: "",
    commentText: "",
    fee: 0,
    totalAmount: 0,
  });
  const [userInfo, setUserInfo] = useState({
    userId: "",
    memberGrade: "",
    isLender: false,
  });
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log("Received loanAmount in CommentComponent:", loanAmount);
    console.log("Received postId in CommentComponent:", postId);
    fetchUserInfo();
    fetchComments();
  }, [postId, loanAmount, repaymentPeriod]);

  const fetchUserInfo = () => {
    const userId = localStorage.getItem("userId");
    const memberGrade = localStorage.getItem("memberGrade");
    const isLender = localStorage.getItem("isLender") === "true";
    if (userId && memberGrade) {
      setUserInfo({ userId, memberGrade, isLender });
    }
  };

  const calculateFeeAndTotalAmount = (rate) => {
    if (!rate || rate <= 0 || !loanAmount || !repaymentPeriod) {
      return { fee: 0, totalAmount: 0 };
    }

    const numericLoanAmount = Number(loanAmount);
    if (isNaN(numericLoanAmount)) {
      console.error("Invalid loan amount:", loanAmount);
      return { fee: 0, totalAmount: 0 };
    }

    // 수수료 계산
    const fee = Math.floor(numericLoanAmount / 1000000) * 1000;

    // 이자율 % 변환 후 일일 이자율 계산
    const dailyRate = (rate / 100) / 365;
    const totalInterest = numericLoanAmount * dailyRate * repaymentPeriod;
    const totalAmount = numericLoanAmount + totalInterest + fee;

    return {
      fee,
      totalAmount: Math.round(totalAmount),
    };
  };

  const handleInterestRateChange = (e) => {
    const rate = parseFloat(e.target.value);

    if (isNaN(rate) || rate <= 0) {
      setNewComment(prev => ({
        ...prev,
        interestRate: "",
        fee: 0,
        totalAmount: 0
      }));
      return;
    }

    const { fee, totalAmount } = calculateFeeAndTotalAmount(rate);

    setNewComment(prev => ({
      ...prev,
      interestRate: rate,
      fee,
      totalAmount
    }));
  };

  const handleCreateComment = async () => {
    if (!newComment.interestRate || !newComment.commentText.trim()) {
      alert("이자율과 댓글 내용을 모두 입력해주세요.");
      return;
    }

    if (!userInfo.userId) {
      alert("로그인 후 댓글을 작성할 수 있습니다.");
      navigate("/member/login"); 
      return;
    }

    try {
      const { fee, totalAmount } = calculateFeeAndTotalAmount(newComment.interestRate);

      const commentData = {
        ...newComment,
        memberId: userInfo.userId,
        memberGrade: userInfo.memberGrade,
        fee,
        totalAmount
      };

      await createComment(postId, commentData);
      setNewComment({
        interestRate: "",
        commentText: "",
        fee: 0,
        totalAmount: 0
      });
      fetchComments();
      console.log("commentData", commentData);

    } catch (error) {
      handleTokenError(error);
    }
  };

  const fetchComments = async () => {
    try {
      const data = await getCommentsByPostId(postId);
      const updatedComments = data.map(comment => {
        const numericRate = parseFloat(comment.interestRate);
        const { fee, totalAmount } = calculateFeeAndTotalAmount(numericRate);

        return {
          ...comment,
          fee,
          totalAmount
        };
      });
      setComments(updatedComments);
    } catch (error) {
      handleTokenError(error);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm("정말로 댓글을 삭제하시겠습니까?")) return;

    try {
      await deleteComment(commentId);
      alert("댓글이 삭제되었습니다.");
      fetchComments();
    } catch (error) {
      handleTokenError(error);
    }
  };

  const handleSelectComment = async (commentId) => {
    if (!userInfo.isLender) {
      alert("출자자만 댓글을 선택할 수 있습니다.");
      return;
    }
    try {
      await selectComment(postId, commentId);
      alert("댓글이 선택되었습니다.");
      fetchComments();
    } catch (error) {
      handleTokenError(error);
    }
  };

  const handleTokenError = (error) => {
    if (error.response?.status === 401) {
      alert("세션이 만료되었습니다. 다시 로그인해주세요.");
      navigate("/member/login");
    }
    setError("오류가 발생했습니다.");
  };

  return (
    <div>
      <div className="comment-list">
        {/* 댓글 개수 표시 */}
        <div className="comment-count">
          댓글 개수: {comments.length}
        </div>

        {comments.map((comment) => (
          <div key={comment.id}>
            <div className="comment-header">
              <div>대출 희망자 이름: {comment.memberName} {comment.memberId}</div>
              <div className="comment-created-at">
                작성 시간: {comment.createdAt ? format(new Date(comment.createdAt), "yyyy-MM-dd HH:mm") : "시간 정보 없음"}
              </div>
            </div>
            <div className="comment-body">
              이자율: {comment.interestRate}%<br />
              수수료: {comment.fee.toLocaleString()} 원<br />
              총상환액: {comment.totalAmount.toLocaleString()} 원<br />
              댓글: {comment.commentText}
            </div>
            
            <div className="button-container">
              {userInfo.userId === comment.memberId && (
                <button className="select-button" onClick={() => handleDeleteComment(comment.id)}>
                  삭제
                </button>
              )}

              {userInfo.isLender && (
                <button className="select-button" onClick={() => handleSelectComment(comment.id)}>
                  선택
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="comment-form">
        <h3>댓글 쓰기</h3>
        <input
          type="number"
          step="0.1"
          value={newComment.interestRate}
          onChange={handleInterestRateChange}
          placeholder="이자율 (%)"
        />

        <textarea
          value={newComment.commentText}
          onChange={(e) => setNewComment(prev => ({ ...prev, commentText: e.target.value }))}
          rows="3"
          placeholder="댓글 내용"
        />
        <button onClick={handleCreateComment}>댓글 작성</button>
      </div>
    </div>
  );
};

export default CommentComponent;
