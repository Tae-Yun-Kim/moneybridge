import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { format } from "date-fns"; // 날짜 포맷팅 라이브러리 추가
import {
  getCommentsByPostId,
  createComment,
  deleteComment,
  selectComment,
} from "../../api/commentApi";
import "./CommentComponent.css";


import { createContractPendingNotification } from "../../api/notificationApi";

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
    const dailyRate = rate / 100 / 365;
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
      setNewComment((prev) => ({
        ...prev,
        interestRate: "",
        fee: 0,
        totalAmount: 0,
      }));
      return;
    }

    const { fee, totalAmount } = calculateFeeAndTotalAmount(rate);

    setNewComment((prev) => ({
      ...prev,
      interestRate: rate,
      fee,
      totalAmount,
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
      const { fee, totalAmount } = calculateFeeAndTotalAmount(
        newComment.interestRate
      );

      const commentData = {
        ...newComment,
        memberId: userInfo.userId,
        memberGrade: userInfo.memberGrade,
        fee,
        totalAmount,
      };

      await createComment(postId, commentData);
      setNewComment({
        interestRate: "",
        commentText: "",
        fee: 0,
        totalAmount: 0,
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
      const updatedComments = data.map((comment) => {
        const numericRate = parseFloat(comment.interestRate);
        const { fee, totalAmount } = calculateFeeAndTotalAmount(numericRate);

        return {
          ...comment,
          fee,
          totalAmount,
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

  // const handleSelectComment = async (commentId) => {
  //   if (!userInfo.isLender) {
  //     alert("출자자만 댓글을 선택할 수 있습니다.");
  //     return;
  //   }
  //   try {
  //     await selectComment(postId, commentId);
  //     alert("댓글이 선택되었습니다.");
  //     fetchComments();
  //   } catch (error) {
  //     handleTokenError(error);
  //   }
  // };
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

      // ✅ 선택된 댓글 객체 찾기
      const selectedComment = comments.find(comment => comment.id === commentId);
      if (!selectedComment) {
        console.error("선택된 댓글을 찾을 수 없습니다.");
      return;
    }

       // ✅ 계약 진행 알림 생성 API 호출
       const receiverId = selectedComment.memberId; // ✅ 댓글 작성자의 ID

       // ✅ 계약 진행 알림 생성 API 호출
       await createContractPendingNotification(receiverId, postId);
   
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

  const handleTokenError = (error) => {
    if (error.response?.status === 401) {
      alert("세션이 만료되었습니다. 다시 로그인해주세요.");
      navigate("/member/login");
    }
    setError("오류가 발생했습니다.");
  };

  return (
    <div className="comment-container-c">
      <div className="comment-list-c">
        {/* 댓글 개수 표시 */}
        <div className="comment-count-c">댓글 개수: {comments.length}</div>

        {comments.map((comment) => (
          <div key={comment.id} className="comment-item-c">
            <div className="comment-header-c">
              <div>
                대출 희망자 이름: {comment.memberName} {comment.memberId}
              </div>
              <div className="comment-created-at-c">
                작성 시간:{" "}
                {comment.createdAt
                  ? format(new Date(comment.createdAt), "yyyy-MM-dd HH:mm")
                  : "시간 정보 없음"}
              </div>
            </div>
            <div className="comment-body-c">
              이자율: {comment.interestRate}%<br />
              수수료: {comment.fee.toLocaleString()} 원<br />
              총상환액: {comment.totalAmount.toLocaleString()} 원<br />
              댓글: {comment.commentText}
            </div>

            <div className="button-container-c">
              {userInfo.userId === comment.memberId && (
                <button
                  className="select-button-c"
                  onClick={() => handleDeleteComment(comment.id)}
                >
                  삭제
                </button>
              )}

              {userInfo.isLender && (
                <button
                  className="select-button-c"
                  onClick={() => handleSelectComment(comment.id)}
                >
                  선택
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="comment-form-c">
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
          onChange={(e) =>
            setNewComment((prev) => ({ ...prev, commentText: e.target.value }))
          }
          rows="3"
          placeholder="댓글 내용"
        />
        <div className="coment-form-c-write">
          <button onClick={handleCreateComment}>댓글 작성</button>
        </div>
      </div>
    </div>
  );
};

export default CommentComponent;
