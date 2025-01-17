import UpdateComponent from "../../components/member/UpdateComponent";
import BasicLayout from "../../layouts/BasicLayout";

const UpdatePage = () => {
  return (
    <BasicLayout>
      <div className=" text-3xl">회원수정 페이지</div>

      <div className="bg-white w-full mt-4 p-2">
        <UpdateComponent></UpdateComponent>
      </div>
    </BasicLayout>
  );
};

export default UpdatePage;
