import { useParams } from "react-router-dom";
import { useState } from "react";
import ReadComponent from "../../components/post/ReadComponent"; // 수정 버튼 없이
import BasicMenu from "../../components/menus/BasicMenu";
import Footerbar from "../../components/menus/Footerbar"; 
import Leftsidemenu from "../../components/menus/Leftsidemenu"; 
import Rightsidemenu from "../../components/menus/Rightsidemenu"; 
import "./PostPage.css"; 

const ReadPage = () => {
  const { id } = useParams();

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

        {/* 게시글 읽기 */}
        <div className="main-content p-4">
          <div className="text-4xl font-extrabold mb-8">게시글 상세 페이지</div>
          {/* 게시글 내용 */}
          <ReadComponent id={id} />
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

export default ReadPage;
