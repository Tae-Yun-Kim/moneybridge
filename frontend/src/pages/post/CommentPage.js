import CommentComponent from "../../components/post/CommentComponent";
import BasicMenu from "../../components/menus/BasicMenu";
import Footerbar from "../../components/menus/Footerbar"; 
import Leftsidemenu from "../../components/menus/Leftsidemenu"; 
import Rightsidemenu from "../../components/menus/Rightsidemenu"; 
import "./PostPage.css"; 

const CommentPage = ({ postId }) => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* 기본 메뉴 */}
      <div className="fixed top-0 left-0 z-[1055] w-full">
        <BasicMenu />
      </div>

      {/* 페이지 내용 */}
      <div className="layout-container pt-[140px] px-6"> {/* 상단 메뉴 높이 + 여백 조정 */}
        {/* 좌측 메뉴 */}
        <div className="left-sidebar p-4">
          <Leftsidemenu />
        </div>

        {/* 댓글 */}
        <div className="main-content p-4">
          <h1 className="text-2xl font-bold mb-4">게시글 댓글</h1>
          <CommentComponent postId={postId} />
        </div>

        {/* 우측 메뉴 */}
        <div className="right-sidebar p-4">
          <Rightsidemenu />
        </div>
      </div>

      {/* 푸터 */}
      <div className="w-full mt-auto p-4">
        <Footerbar />
      </div>
    </div>
  );
};

export default CommentPage;
