import DeleteComponent from "../../components/member/DeleteComponent";
import UpdateComponent from "../../components/member/UpdateComponent";
import BasicLayout from "../../layouts/BasicLayout";

const UpdatePage = () => {
  return (
    <BasicLayout>
      <div className="bg-white w-full mt-4 p-2">
        <DeleteComponent></DeleteComponent>
      </div>
    </BasicLayout>
  );
};

export default UpdatePage;
