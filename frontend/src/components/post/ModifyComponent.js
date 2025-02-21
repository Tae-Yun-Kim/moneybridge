// import { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { deleteLoanPost, updateLoanPost } from "../../api/postApi";
// import "./ModifyComponent.css";

// const ModifyComponent = ({ initialLoanPost }) => {
//   const [loanPost, setLoanPost] = useState({
//     id: "",
//     writerId: "",
//     loanAmount: "",
//     repaymentPeriod: "",
//     additionalConditions: "",
//   });

//   const navigate = useNavigate();

//   useEffect(() => {
//     if (initialLoanPost && initialLoanPost.id) {
//       setLoanPost({
//         id: initialLoanPost.id,
//         writerId: initialLoanPost.writerId || "",
//         loanAmount: initialLoanPost.loanAmount || "",
//         repaymentPeriod: initialLoanPost.repaymentPeriod || "",
//         additionalConditions: initialLoanPost.additionalConditions || "",
//       });
//     }
//   }, [initialLoanPost]);

//   const handleClickModify = async () => {
//     if (!loanPost.id) {
//       alert("게시글 ID가 없습니다. 다시 시도해주세요.");
//       console.error("Missing loan post ID:", loanPost);
//       return;
//     }

//     try {
//       await updateLoanPost(loanPost.id, loanPost);
//       alert("수정이 완료되었습니다.");
//       navigate(`/post/view/${loanPost.id}`);
//     } catch (error) {
//       console.error("Error modifying loan post:", error);
//       alert("수정 중 오류가 발생했습니다.");
//     }
//   };

//   const handleClickDelete = async () => {
//     if (!loanPost.id) {
//       alert("게시글 ID가 없습니다. 다시 시도해주세요.");
//       console.error("Missing loan post ID:", loanPost);
//       return;
//     }

//     try {
//       await deleteLoanPost(loanPost.id);
//       alert("삭제가 완료되었습니다.");
//       navigate("/post/list");
//     } catch (error) {
//       console.error("Error deleting loan post:", error);
//       alert("삭제 중 오류가 발생했습니다.");
//     }
//   };

//   const handleChangeLoanPost = (e) => {
//     const { name, value } = e.target;
//     setLoanPost((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   return (
//     <div>
//       <div className="post-modify-body">
//         <div>
//           <div>대출 금액</div>
//           <input
//             name="loanAmount"
//             type="number"
//             value={loanPost.loanAmount}
//             onChange={handleChangeLoanPost}
//           />
//         </div>
//         <div>
//           <div>상환 기간 (일 기준)</div>
//           <input
//             name="repaymentPeriod"
//             type="number"
//             value={loanPost.repaymentPeriod}
//             onChange={handleChangeLoanPost}
//           />
//         </div>

//         <div>
//           <div>추가 조건</div>
//           <textarea
//             name="additionalConditions"
//             value={loanPost.additionalConditions}
//             onChange={handleChangeLoanPost}
//           />
//         </div>

//         <div className="post-modify-button-container">
//           <button
//             type="button"
//             onClick={handleClickDelete}
//             className="post-modify-button"
//           >
//             삭제
//           </button>
//           <button
//             type="button"
//             onClick={handleClickModify}
//             className="post-modify-button"
//           >
//             수정
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ModifyComponent;

import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getLoanPostById,
  deleteLoanPost,
  updateLoanPost,
} from "../../api/postApi";
import { deleteNotification } from "../../api/notificationApi"; // 알림 삭제 API 호출
import "./ModifyComponent.css";

const ModifyComponent = () => {
  const { id } = useParams(); // URL에서 ID 가져오기
  const navigate = useNavigate();
  const [loanPost, setLoanPost] = useState(null);

  useEffect(() => {
    console.log("Fetching loan post with id:", id);
    getLoanPostById(id)
      .then((response) => {
        console.log("Fetched post:", response);
        setLoanPost(response);
      })
      .catch((error) => {
        console.error("Error fetching post:", error);
        alert("게시글을 불러오는데 실패했습니다.");
      });
  }, [id]);

  if (!loanPost) {
    return <div>로딩 중...</div>;
  }

  const handleClickModify = async () => {
    try {
      await updateLoanPost(loanPost.id, loanPost);
      alert("수정이 완료되었습니다.");
      navigate(`/post/view/${loanPost.id}`);
    } catch (error) {
      console.error("Error modifying loan post:", error);
      alert("수정 중 오류가 발생했습니다.");
    }
  };

  const handleClickDelete = async () => {
    try {
      // 1. 알림 삭제 (알림에서 해당 게시글 ID를 외래키로 가지고 있는 알림 삭제)
      if (loanPost.id) {
        await deleteNotification(loanPost.id);
        console.log("알림 삭제 완료");
      }

      // 2. 게시글 삭제
      await deleteLoanPost(loanPost.id);
      alert("삭제가 완료되었습니다.");
      navigate("/post/list");
    } catch (error) {
      console.error("Error deleting loan post or notifications:", error);
      alert("삭제 중 오류가 발생했습니다.");
    }
  };

  const handleChangeLoanPost = (e) => {
    const { name, value } = e.target;
    setLoanPost((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="post-modify-body">
      <div>
        <div>
          <div>제목</div>
          <input
            name="title"
            type="text"
            value={loanPost.title}
            onChange={handleChangeLoanPost}
          />
        </div>
        <div>대출 금액</div>
        <input
          name="loanAmount"
          type="number"
          value={loanPost.loanAmount}
          onChange={handleChangeLoanPost}
        />
      </div>
      <div>
        <div>상환 기간 (월 기준)</div>
        <input
          name="repaymentPeriod"
          type="number"
          placeholder="ex) 1 => 1개월"
          value={loanPost.repaymentPeriod}
          onChange={handleChangeLoanPost}
        />
      </div>
      <div>
        <div>추가 조건</div>
        <textarea
          name="additionalConditions"
          value={loanPost.additionalConditions}
          onChange={handleChangeLoanPost}
        />
      </div>
      <div className="post-modify-button-container">
        <button
          type="button"
          onClick={handleClickDelete}
          className="post-modify-button"
        >
          삭제
        </button>
        <button
          type="button"
          onClick={handleClickModify}
          className="post-modify-button"
        >
          수정
        </button>
      </div>
    </div>
  );
};

export default ModifyComponent;
