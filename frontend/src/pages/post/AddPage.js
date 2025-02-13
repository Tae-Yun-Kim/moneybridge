import AddComponent from "../../components/post/AddComponent";
import BasicMenu from "../../components/menus/BasicMenu";
import Footerbar from "../../components/menus/Footerbar";
import Leftsidemenu from "../../components/menus/Leftsidemenu";
import Rightsidemenu from "../../components/menus/Rightsidemenu";
import BasicLayout from "../../layouts/BasicLayout";
// import "./PostPage.css";

const AddPage = () => {
  return (
    <BasicLayout>
      {/* 대출 게시글 리스트 페이지 메인 콘텐츠 */}
      <div className="main-content bg-white rounded-lg shadow-lg p-6">
        <h1 className="post-list-title">게시글 작성</h1>
        <AddComponent />
      </div>
    </BasicLayout>
  );
};

export default AddPage;
