// import { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { createLoanPost } from "../../api/postApi";

// const AddComponent = () => {
//   const [loanPost, setLoanPost] = useState({
//     loanAmount: "",
//     repaymentPeriod: "",
//     additionalConditions: "",
//     writerId: "", // 작성자 ID 추가
//   });
//   const navigate = useNavigate();

//   useEffect(() => {
//     // 로컬 스토리지에서 작성자 ID를 가져와 설정
//     const userId = localStorage.getItem("userId");
//     if (userId) {
//       setLoanPost((prev) => ({ ...prev, writerId: userId }));
//     } else {
//       alert("로그인 정보가 없습니다. 다시 로그인해주세요.");
//       navigate("/login"); // 로그인 페이지로 이동
//     }
//   }, [navigate]);

//   const handleChangeLoanPost = (e) => {
//     const { name, value } = e.target;
//     setLoanPost((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleClickAdd = async () => {
//     // 필수 입력값 검증
//     if (!loanPost.loanAmount || !loanPost.repaymentPeriod) {
//       alert("대출 금액과 상환 기간을 모두 입력해 주세요.");
//       return;
//     }

//     try {
//       // 로컬 스토리지에서 출자자 여부 확인
//       const isLender = localStorage.getItem("isLender");
//       if (!isLender || isLender !== "true") {
//         alert("출자자만 대출 게시글을 추가할 수 있습니다.");
//         return;
//       }

//       // 게시글 생성 요청
//       await createLoanPost(loanPost);
//       alert("대출 게시글이 성공적으로 추가되었습니다."); // 성공 알림
//       navigate("/post/list"); // 리스트 페이지로 이동
//     } catch (err) {
//       console.error("게시글 생성 중 오류 발생:", err);
//       alert("게시글 생성에 실패했습니다. 다시 시도해주세요.");
//     }
//   };

//   return (
//     <div className="border-2 border-sky-200 mt-10 m-2 p-4">
//       <div className="flex justify-center">
//         <div className="relative mb-4 flex w-full flex-wrap items-stretch">
//           <div className="w-1/5 p-6 text-right font-bold">대출 금액</div>
//           <input
//             className="w-4/5 p-6 rounded-r border border-solid border-neutral-500 shadow-md"
//             name="loanAmount"
//             type="number"
//             value={loanPost.loanAmount}
//             onChange={handleChangeLoanPost}
//           />
//         </div>
//       </div>

//       <div className="flex justify-center">
//         <div className="relative mb-4 flex w-full flex-wrap items-stretch">
//           <div className="w-1/5 p-6 text-right font-bold">상환 기간</div>
//           <input
//             className="w-4/5 p-6 rounded-r border border-solid border-neutral-500 shadow-md"
//             name="repaymentPeriod"
//             type="number"
//             value={loanPost.repaymentPeriod}
//             onChange={handleChangeLoanPost}
//           />
//         </div>
//       </div>

//       <div className="flex justify-center">
//         <div className="relative mb-4 flex w-full flex-wrap items-stretch">
//           <div className="w-1/5 p-6 text-right font-bold">추가 조건</div>
//           <textarea
//             className="w-4/5 p-6 rounded-r border border-solid border-neutral-500 shadow-md"
//             name="additionalConditions"
//             value={loanPost.additionalConditions}
//             onChange={handleChangeLoanPost}
//           />
//         </div>
//       </div>

//       {/* 작성자 ID (사용자가 수정하지 못하도록 비활성화) */}
//       <div className="flex justify-center">
//         <div className="relative mb-4 flex w-full flex-wrap items-stretch">
//           <div className="w-1/5 p-6 text-right font-bold">작성자 ID</div>
//           <input
//             className="w-4/5 p-6 rounded-r border border-solid border-neutral-500 shadow-md bg-gray-200"
//             name="writerId"
//             type="text"
//             value={loanPost.writerId}
//             readOnly // 읽기 전용 설정
//           />
//         </div>
//       </div>

//       <div className="flex justify-end">
//         <button
//           type="button"
//           className="rounded p-4 w-36 bg-blue-500 text-xl text-white"
//           onClick={handleClickAdd}
//         >
//           추가
//         </button>
//       </div>
//     </div>
//   );
// };

// export default AddComponent;
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createLoanPost } from "../../api/postApi";

const AddComponent = () => {
  const [loanPost, setLoanPost] = useState({
    title: "", // 제목 추가
    loanAmount: "",
    repaymentPeriod: "",
    additionalConditions: "",
    writerId: "",
  });
  const navigate = useNavigate();

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (userId) {
      setLoanPost((prev) => ({ ...prev, writerId: userId }));
    } else {
      alert("로그인 정보가 없습니다. 다시 로그인해주세요.");
      navigate("/login");
    }
  }, [navigate]);

  const handleChangeLoanPost = (e) => {
    const { name, value } = e.target;
    setLoanPost((prev) => ({ ...prev, [name]: value }));
  };

  const handleClickAdd = async () => {
    if (
      !loanPost.title.trim() ||
      !loanPost.loanAmount ||
      !loanPost.repaymentPeriod
    ) {
      alert("제목, 대출 금액, 상환 기간을 모두 입력해 주세요.");
      return;
    }

    try {
      const isLender = localStorage.getItem("isLender");
      if (!isLender || isLender !== "true") {
        alert("출자자만 대출 게시글을 추가할 수 있습니다.");
        return;
      }

      console.log("게시글 추가 요청: ", loanPost);

      await createLoanPost(loanPost);
      alert("대출 게시글이 성공적으로 추가되었습니다.");
      navigate("/post/list");
    } catch (err) {
      console.error("게시글 생성 중 오류 발생:", err);
      alert("게시글 생성에 실패했습니다. 다시 시도해주세요.");
    }
  };

  return (
    <div className="border-2 border-sky-200 mt-10 m-2 p-4">
      <div className="flex justify-center">
        <div className="relative mb-4 flex w-full flex-wrap items-stretch">
          <div className="w-1/5 p-6 text-right font-bold">제목</div>
          <input
            className="w-4/5 p-6 rounded-r border border-solid border-neutral-500 shadow-md"
            name="title"
            type="text"
            value={loanPost.title}
            onChange={handleChangeLoanPost}
          />
        </div>
      </div>

      <div className="flex justify-center">
        <div className="relative mb-4 flex w-full flex-wrap items-stretch">
          <div className="w-1/5 p-6 text-right font-bold">대출 금액</div>
          <input
            className="w-4/5 p-6 rounded-r border border-solid border-neutral-500 shadow-md"
            name="loanAmount"
            type="number"
            value={loanPost.loanAmount}
            onChange={handleChangeLoanPost}
          />
        </div>
      </div>

      <div className="flex justify-center">
        <div className="relative mb-4 flex w-full flex-wrap items-stretch">
          <div className="w-1/5 p-6 text-right font-bold">상환 기간</div>
          <input
            className="w-4/5 p-6 rounded-r border border-solid border-neutral-500 shadow-md"
            name="repaymentPeriod"
            type="number"
            value={loanPost.repaymentPeriod}
            onChange={handleChangeLoanPost}
          />
        </div>
      </div>

      <div className="flex justify-center">
        <div className="relative mb-4 flex w-full flex-wrap items-stretch">
          <div className="w-1/5 p-6 text-right font-bold">추가 조건</div>
          <textarea
            className="w-4/5 p-6 rounded-r border border-solid border-neutral-500 shadow-md"
            name="additionalConditions"
            value={loanPost.additionalConditions}
            onChange={handleChangeLoanPost}
          />
        </div>
      </div>

      <div className="flex justify-center">
        <div className="relative mb-4 flex w-full flex-wrap items-stretch">
          <div className="w-1/5 p-6 text-right font-bold">작성자 ID</div>
          <input
            className="w-4/5 p-6 rounded-r border border-solid border-neutral-500 shadow-md bg-gray-200"
            name="writerId"
            type="text"
            value={loanPost.writerId}
            readOnly
          />
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="button"
          className="rounded p-4 w-36 bg-blue-500 text-xl text-white"
          onClick={handleClickAdd}
        >
          추가
        </button>
      </div>
    </div>
  );
};

export default AddComponent;
