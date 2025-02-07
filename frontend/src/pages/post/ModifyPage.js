import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getLoanPostById } from "../../api/postApi";
import ModifyComponent from "../../components/post/ModifyComponent";
import BasicMenu from "../../components/menus/BasicMenu";
import Footerbar from "../../components/menus/Footerbar"; 
import Leftsidemenu from "../../components/menus/Leftsidemenu"; 
import Rightsidemenu from "../../components/menus/Rightsidemenu"; 
import "./PostPage.css";

const ModifyPage = () => {
  const { id } = useParams();
  const [loanPost, setLoanPost] = useState(null); // 게시글 데이터 상태
  const [loading, setLoading] = useState(true); // 로딩 상태

  useEffect(() => {
    const fetchLoanPost = async () => {
      try {
        const data = await getLoanPostById(id); // API 호출로 데이터 가져오기
        setLoanPost(data);
      } catch (error) {
        console.error("Error fetching loan post:", error);
      } finally {
        setLoading(false); // 로딩 상태 해제
      }
    };

    fetchLoanPost();
  }, [id]);

  if (loading) {
    return <div>Loading...</div>; // 로딩 중일 때 표시
  }

  if (!loanPost) {
    return <div>게시글을 찾을 수 없습니다.</div>; // 데이터가 없을 때 표시
  }

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

        {/* 수정 게시글 */}
        <div className="main-content p-4">
          <div>게시글 수정 페이지</div>
          <ModifyComponent initialLoanPost={loanPost} /> {/* 게시글 데이터 전달 */}
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

export default ModifyPage;
