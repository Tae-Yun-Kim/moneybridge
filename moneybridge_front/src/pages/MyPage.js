import ContractProgressComponent from "../components/post/ContractProgressComponent";

const MyPage = () => {
  const userId = localStorage.getItem("userId");
  const isLender = localStorage.getItem("isLender") === "true";

  return (
    <div>
      <h1>내 계약 현황</h1>
      <ContractProgressComponent userId={userId} isLender={isLender} />
    </div>
  );
};

export default MyPage;
