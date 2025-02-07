import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // useNavigate import 추가
import { deleteLoanPost, updateLoanPost } from "../../api/postApi";
import ResultModal from "../common/ResultModal";

const ModifyComponent = ({ initialLoanPost }) => {
  const [loanPost, setLoanPost] = useState({
    id: "",
    writer: "",
    title: "", // ✅ title 추가
    loanAmount: "",
    repaymentPeriod: "",
    additionalConditions: "",
  });

  const [result, setResult] = useState(null);
  const navigate = useNavigate(); // useNavigate 훅 사용

  // 초기값 설정
  useEffect(() => {
    if (initialLoanPost && initialLoanPost.id) {
      setLoanPost({
        id: initialLoanPost.id,
        writer: initialLoanPost.writer || "",
        title: initialLoanPost.title || "", // ✅ title 초기값 설정
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
      const data = await updateLoanPost(loanPost.id, loanPost);
      console.log("Modify result: ", data);
      setResult("수정이 완료되었습니다.");

      // 리드 페이지로 이동
      setTimeout(() => {
        navigate(`/post/view/${loanPost.id}`); // 리드 페이지 경로로 이동
      }, 2000); // 2초 후 이동
    } catch (error) {
      console.error("Error modifying loan post:", error);
      setResult("수정 중 오류가 발생했습니다.");
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
      console.log("Delete result: Deleted");
      setResult("삭제가 완료되었습니다.");

      navigate("/post/list");
    } catch (error) {
      console.error("Error deleting loan post:", error);
      setResult("삭제 중 오류가 발생했습니다.");
    }
  };

  const handleChangeLoanPost = (e) => {
    const { name, value } = e.target;
    setLoanPost((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const closeModal = () => {
    setResult(null);
  };

  return (
    <div className="border-2 border-sky-200 mt-10 m-2 p-4">
      {result && (
        <ResultModal
          title={"처리결과"}
          content={result}
          callbackFn={closeModal}
        />
      )}
      <div className="flex justify-center mt-10">
        <div className="relative mb-4 flex w-full flex-wrap items-stretch">
          <div className="w-1/5 p-6 text-right font-bold">제목</div>
          <input
            className="w-4/5 p-6 rounded-r border border-solid border-neutral-300 shadow-md"
            name="title"
            type="text"
            value={loanPost.title}
            onChange={handleChangeLoanPost} // ✅ 제목 변경 가능하도록 추가
          />
        </div>
      </div>

      <div className="flex justify-center mt-10">
        <div className="relative mb-4 flex w-full flex-wrap items-stretch">
          <div className="w-1/5 p-6 text-right font-bold">ID</div>
          <div className="w-4/5 p-6 rounded-r border border-solid shadow-md bg-gray-100">
            {loanPost.id || "ID 없음"}
          </div>
        </div>
      </div>

      <div className="flex justify-center">
        <div className="relative mb-4 flex w-full flex-wrap items-stretch">
          <div className="w-1/5 p-6 text-right font-bold">WRITER</div>
          <div className="w-4/5 p-6 rounded-r border border-solid shadow-md bg-gray-100">
            {loanPost.writer}
          </div>
        </div>
      </div>

      <div className="flex justify-center">
        <div className="relative mb-4 flex w-full flex-wrap items-stretch">
          <div className="w-1/5 p-6 text-right font-bold">LOAN AMOUNT</div>
          <input
            className="w-4/5 p-6 rounded-r border border-solid border-neutral-300 shadow-md"
            name="loanAmount"
            type="number"
            value={loanPost.loanAmount}
            onChange={handleChangeLoanPost}
          />
        </div>
      </div>

      <div className="flex justify-center">
        <div className="relative mb-4 flex w-full flex-wrap items-stretch">
          <div className="w-1/5 p-6 text-right font-bold">REPAYMENT PERIOD</div>
          <input
            className="w-4/5 p-6 rounded-r border border-solid border-neutral-300 shadow-md"
            name="repaymentPeriod"
            type="number"
            value={loanPost.repaymentPeriod}
            onChange={handleChangeLoanPost}
          />
        </div>
      </div>

      <div className="flex justify-center">
        <div className="relative mb-4 flex w-full flex-wrap items-stretch">
          <div className="w-1/5 p-6 text-right font-bold">
            ADDITIONAL CONDITIONS
          </div>
          <textarea
            className="w-4/5 p-6 rounded-r border border-solid border-neutral-300 shadow-md"
            name="additionalConditions"
            value={loanPost.additionalConditions}
            onChange={handleChangeLoanPost}
          />
        </div>
      </div>

      <div className="flex justify-end p-4">
        <button
          type="button"
          className="inline-block rounded p-4 m-2 text-xl w-32 text-white bg-red-500"
          onClick={handleClickDelete}
        >
          Delete
        </button>
        <button
          type="button"
          className="rounded p-4 m-2 text-xl w-32 text-white bg-blue-500"
          onClick={handleClickModify}
        >
          Modify
        </button>
      </div>
    </div>
  );
};

export default ModifyComponent;
