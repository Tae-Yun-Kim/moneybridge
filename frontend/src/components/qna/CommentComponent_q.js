import React, { useEffect, useState } from "react";
import {
  getQnaComments,
  addQnaComment,
  modifyQnaComment,
  removeQnaComment,
  updateQnaCompleteStatus,
  getQnA,
} from "../../api/qnaApi";
// import "./qna.css"; // 위 CSS를 임포트
import "./CommentComponent_q.css";
import {
  createNotification,
  createQnaNotification,
} from "../../api/notificationApi";

const CommentComponent_q = ({ qno }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [editComment, setEditComment] = useState(null);
  const [editContent, setEditContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [qnaAuthorId, setQnaAuthorId] = useState(null); // ✅ QnA 작성자 ID 저장

  // ✅ localStorage에서 사용자 정보
  const userData = localStorage.getItem("member");
  const user = userData ? JSON.parse(userData) : null;
  const isAdmin = user?.role === "ROLE_ADMIN";

  // useEffect(() => {
  //   const fetchComments = async () => {
  //     setLoading(true);
  //     try {
  //       const data = await getQnaComments(qno);
  //       setComments(data);
  //     } catch (error) {
  //       console.error("Error fetching comments:", error);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };
  //   fetchComments();
  // }, [qno]);

  useEffect(() => {
    const fetchComments = async () => {
      setLoading(true);
      try {
        const data = await getQnaComments(qno);
        setComments(data);
      } catch (error) {
        console.error("❌ Error fetching comments:", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchQnaDetails = async () => {
      try {
        const data = await getQnA(qno);
        setQnaAuthorId(data.id); // ✅ QnA 작성자 ID 저장
      } catch (error) {
        console.error("❌ QnA 불러오기 오류:", error);
      }
    };

    fetchComments();
    fetchQnaDetails();
  }, [qno]);

  // const handleAddComment = async () => {
  //   if (!newComment.trim()) {
  //     alert("댓글 내용을 입력하세요.");
  //     return;
  //   }
  //   try {
  //     const data = await addQnaComment({
  //       qno,
  //       qnaCommentContent: newComment,
  //     });
  //     setComments([...comments, data]);
  //     setNewComment("");
  //   } catch (error) {
  //     console.error("댓글 추가 오류:", error);
  //     alert("댓글 추가에 실패했습니다.");
  //   }
  // };

  // ✅ 댓글 추가 + QnA 상태 변경
  const handleAddComment = async () => {
    if (!newComment.trim()) {
      alert("댓글 내용을 입력하세요.");
      return;
    }
    try {
      // 1️⃣ 댓글 추가 API 호출
      const data = await addQnaComment({
        qno,
        qnaCommentContent: newComment,
      });

      // 2️⃣ 댓글 목록 업데이트
      setComments([...comments, data]);
      setNewComment("");

      // 3️⃣ QnA 상태를 `complete: true`로 변경
      await updateQnaCompleteStatus(qno);

      console.log("QnA complete 상태 업데이트 완료!");

      // 4️⃣ QnA 작성자에게 알림 전송 (관리자가 댓글을 단 경우)
      // if (isAdmin && qnaAuthorId) {
      //   await createQnaNotification(qnaAuthorId, qno);
      //   console.log(
      //     `📢 알림 전송 완료! QnA ID: ${qno}, 작성자: ${qnaAuthorId}`
      //   );
      // }
    } catch (error) {
      console.error("알림 생성 오류:", error);
      alert("알림 생성에 실패했습니다.");
    }
  };

  const handleModifyComment = async (qcno) => {
    if (!editContent.trim()) {
      alert("댓글 내용을 입력하세요.");
      return;
    }

    try {
      const updatedComment = await modifyQnaComment(qcno, {
        qnaCommentContent: editContent,
      });
      setComments(
        comments.map((comment) =>
          comment.qcno === qcno
            ? {
                ...comment,
                qnaCommentContent: updatedComment.qnaCommentContent,
              }
            : comment
        )
      );
      setEditComment(null);
      setEditContent("");
    } catch (error) {
      console.error("댓글 수정 오류:", error);
      alert("댓글 수정에 실패했습니다.");
    }
  };

  const handleDeleteComment = async (qcno) => {
    if (!window.confirm("댓글을 삭제하시겠습니까?")) return;

    try {
      await removeQnaComment(qcno);
      setComments(comments.filter((comment) => comment.qcno !== qcno));
    } catch (error) {
      console.error("댓글 삭제 오류:", error);
      alert("댓글 삭제에 실패했습니다.");
    }
  };

  return (
    <div className="comment-section">
      <h3>댓글</h3>
      {loading && <p>Loading...</p>}
      {/* 관리자인 경우만 댓글 추가 가능 */}
      {isAdmin && (
        <div className="add-comment-box">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="댓글을 입력하세요..."
          ></textarea>
          <button onClick={handleAddComment}>댓글 추가</button>
        </div>
      )}

      <ul>
        {comments.map((comment) => (
          <li key={comment.qcno} className="comment-item">
            <p>관리자 : {comment.qnaCommentContent}</p>
            {isAdmin && (
              <div>
                <button
                  onClick={() => {
                    setEditComment(comment.qcno);
                    setEditContent(comment.qnaCommentContent);
                  }}
                >
                  수정
                </button>
                <button onClick={() => handleDeleteComment(comment.qcno)}>
                  삭제
                </button>
              </div>
            )}
            {editComment === comment.qcno && (
              <div className="edit-section">
                <textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                ></textarea>
                <div className="edit-buttons">
                  <button onClick={() => handleModifyComment(comment.qcno)}>
                    저장
                  </button>
                  <button onClick={() => setEditComment(null)}>취소</button>
                </div>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CommentComponent_q;
