import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { deleteLoanPost, updateLoanPost } from "../../api/postApi";
import "./ModifyComponent.css";

const ModifyComponent = ({ initialLoanPost }) => {
  const [loanPost, setLoanPost] = useState({
    id: "",
    writerId: "",
    loanAmount: "",
    repaymentPeriod: "",
    additionalConditions: "",
  });

  const navigate = useNavigate();

  useEffect(() => {
    if (initialLoanPost && initialLoanPost.id) {
      setLoanPost({
        id: initialLoanPost.id,
        writerId: initialLoanPost.writerId || "",
        loanAmount: initialLoanPost.loanAmount || "",
        repaymentPeriod: initialLoanPost.repaymentPeriod || "",
        additionalConditions: initialLoanPost.additionalConditions || "",
      });
    }
  }, [initialLoanPost]);

  const handleClickModify = async () => {
    if (!loanPost.id) {
      alert("게시글 ID가 없습니다. 다시 시도해주세요.");
      console.error("Missing loan post ID:", loanPost);
      return;
    }

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
    if (!loanPost.id) {
      alert("게시글 ID가 없습니다. 다시 시도해주세요.");
      console.error("Missing loan post ID:", loanPost);
      return;
    }

    try {
      await deleteLoanPost(loanPost.id);
      alert("삭제가 완료되었습니다.");
      navigate("/post/list");
    } catch (error) {
      console.error("Error deleting loan post:", error);
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
    <div>
      <div className="post-modify-body">
        <div>
          <div>대출 금액</div>
          <input
            name="loanAmount"
            type="number"
            value={loanPost.loanAmount}
            onChange={handleChangeLoanPost}
          />
        </div>
        <div>
          <div>상환 기간 (일 기준)</div>
          <input
            name="repaymentPeriod"
            type="number"
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
    </div>
  );
};

export default ModifyComponent;
