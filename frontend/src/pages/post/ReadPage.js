import { useParams } from "react-router-dom";
import { useState } from "react";
import ReadComponent from "../../components/post/ReadComponent"; // 수정 버튼 없이
import BasicMenu from "../../components/menus/BasicMenu";
import Footerbar from "../../components/menus/Footerbar";
import Leftsidemenu from "../../components/menus/Leftsidemenu";
import Rightsidemenu from "../../components/menus/Rightsidemenu";
import BasicLayout from "../../layouts/BasicLayout";
// import "./PostPage.css";

const ReadPage = () => {
  const { id } = useParams();

  return (
    <BasicLayout>
      {/* 대출 게시글 리스트 페이지 메인 콘텐츠 */}
      <div className="main-content bg-white rounded-lg shadow-lg p-6">
        <h1 className="post-list-title-r"></h1>
        <ReadComponent />
      </div>
    </BasicLayout>
  );
};

export default ReadPage;
