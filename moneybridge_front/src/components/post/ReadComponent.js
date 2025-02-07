import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getLoanPostById } from "../../api/postApi"; // getLoanPostById 함수 import

const initState = {
  id: 0,
  writerId: "",
  title: "", // ✅ title 추가
  loanAmount: 0,
  repaymentPeriod: 0,
  additionalConditions: "",
};

const ReadComponent = ({ id }) => {
  const [loanPost, setLoanPost] = useState(initState);
  const navigate = useNavigate();

  useEffect(() => {
    // API 호출로 데이터를 가져옵니다
    getLoanPostById(id)
      .then((response) => {
        console.log(response); // 서버에서 받은 데이터
        setLoanPost(response); // 상태 업데이트
      })
      .catch((error) => {
        console.error(
          `Error in fetching loan post by ID (${id}):`,
          error.response?.data || error.message
        );
      });
  }, [id]);

  const handleListClick = () => {
    navigate("/post/list"); // 목록 페이지로 이동
  };

  const handleModifyClick = () => {
    navigate(`/post/modify/${loanPost.id}`); // 수정 페이지로 이동
  };

  return (
    <div className="border-2 border-sky-200 mt-10 m-2 p-4">
      <div className="flex justify-center">
        <div className="relative mb-4 flex w-full flex-wrap items-stretch">
          <div className="w-1/5 p-6 text-right font-bold">ID</div>
          <div className="w-4/5 p-6 rounded-r border border-solid shadow-md">
            {loanPost.id}
          </div>
        </div>
      </div>

      <div className="flex justify-center">
        <div className="relative mb-4 flex w-full flex-wrap items-stretch">
          <div className="w-1/5 p-6 text-right font-bold">제목</div>
          <div className="w-4/5 p-6 rounded-r border border-solid shadow-md">
            {loanPost.title || "제목 없음"} {/* ✅ 제목 표시 */}
          </div>
        </div>
      </div>

      <div className="flex justify-center">
        <div className="relative mb-4 flex w-full flex-wrap items-stretch">
          <div className="w-1/5 p-6 text-right font-bold">Writer</div>
          <div className="w-4/5 p-6 rounded-r border border-solid shadow-md">
            {loanPost.writerId}
          </div>
        </div>
      </div>

      <div className="flex justify-center">
        <div className="relative mb-4 flex w-full flex-wrap items-stretch">
          <div className="w-1/5 p-6 text-right font-bold">Loan Amount</div>
          <div className="w-4/5 p-6 rounded-r border border-solid shadow-md">
            {loanPost.loanAmount} 원
          </div>
        </div>
      </div>

      <div className="flex justify-center">
        <div className="relative mb-4 flex w-full flex-wrap items-stretch">
          <div className="w-1/5 p-6 text-right font-bold">Repayment Period</div>
          <div className="w-4/5 p-6 rounded-r border border-solid shadow-md">
            {loanPost.repaymentPeriod} months
          </div>
        </div>
      </div>

      <div className="flex justify-center">
        <div className="relative mb-4 flex w-full flex-wrap items-stretch">
          <div className="w-1/5 p-6 text-right font-bold">
            Additional Conditions
          </div>
          <div className="w-4/5 p-6 rounded-r border border-solid shadow-md">
            {loanPost.additionalConditions || "None"}
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex justify-end p-4">
        <button
          type="button"
          className="rounded p-4 m-2 text-xl w-32 text-white bg-blue-500"
          onClick={handleListClick}
        >
          List
        </button>
        <button
          type="button"
          className="rounded p-4 m-2 text-xl w-32 text-white bg-red-500"
          onClick={handleModifyClick}
        >
          Modify
        </button>
      </div>
    </div>
  );
};

export default ReadComponent;
