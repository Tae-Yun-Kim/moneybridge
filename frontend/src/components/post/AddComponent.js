import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createLoanPost } from "../../api/postApi";
import "./AddComponent.css";

const AddComponent = () => {
  const [loanPost, setLoanPost] = useState({
    title: "",
    loanAmount: "",
    repaymentPeriod: "",
    additionalConditions: "",
    writerId: "",
  });
  const navigate = useNavigate();

  // 아래는 "userid"로 작성자 나오게 로컬에서 가져온것

  // useEffect(() => {
  //   const userId = localStorage.getItem("userId");
  //   if (userId) {
  //     setLoanPost((prev) => ({ ...prev, writerId: userId }));
  //   } else {
  //     alert("로그인 정보가 없습니다. 다시 로그인해주세요.");
  //     navigate("/login");
  //   }
  // }, [navigate]);

  // 아래는 member에서 파싱해서 가져온 것
  useEffect(() => {
    const userData = localStorage.getItem("member");
    if (userData) {
      const parsedUser = JSON.parse(userData); // JSON 파싱 추가
      const userId = parsedUser.id; // userId만 추출
      setLoanPost((prev) => ({ ...prev, writerId: userId }));
    } else {
      alert("로그인 정보가 없습니다. 다시 로그인해주세요.");
      navigate("/member/login");
    }
  }, [navigate]);

  const handleChangeLoanPost = (e) => {
    const { name, value } = e.target;
    setLoanPost((prev) => ({ ...prev, [name]: value }));
  };

  const handleClickAdd = async () => {
    if (!loanPost.loanAmount || !loanPost.repaymentPeriod) {
      alert("대출 금액과 상환 기간을 모두 입력해 주세요.");
      return;
    }

    try {
      const isLender = localStorage.getItem("isLender");
      if (!isLender || isLender !== "true") {
        alert("출자자만 대출 게시글을 추가할 수 있습니다.");
        return;
      }

      await createLoanPost(loanPost);
      alert("대출 게시글이 성공적으로 추가되었습니다.");
      navigate("/post/list");
    } catch (err) {
      console.error("게시글 생성 중 오류 발생:", err);
      alert("게시글 생성에 실패했습니다. 다시 시도해주세요.");
    }
  };

  return (
    <div className="post-add-body-a">
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
      </div>

      <div>
        <div>
          <div>대출 금액</div>
          <input
            name="loanAmount"
            type="number"
            placeholder="ex) 1000000"
            value={loanPost.loanAmount}
            onChange={handleChangeLoanPost}
          />
        </div>
      </div>

      <div>
        <div>
          <div>상환 기간</div>
          <input
            name="repaymentPeriod"
            type="number"
            placeholder="월 단위로 입력해주세요."
            value={loanPost.repaymentPeriod}
            onChange={handleChangeLoanPost}
          />
        </div>
      </div>

      <div>
        <div>
          <div>추가 조건</div>
          <textarea
            name="additionalConditions"
            value={loanPost.additionalConditions}
            onChange={handleChangeLoanPost}
          />
        </div>
      </div>

      <div>
        <div>
          <div>작성자 ID</div>
          <input
            name="writerId"
            type="text"
            value={loanPost.writerId}
            readOnly
          />
        </div>
      </div>

      <div className="post-add-a">
        <button type="button" onClick={handleClickAdd}>
          추가
        </button>
      </div>
    </div>
  );
};

export default AddComponent;
