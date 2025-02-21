import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getLoanPostById } from "../../api/postApi";
import ModifyComponent from "../../components/post/ModifyComponent";
import BasicMenu from "../../components/menus/BasicMenu";
import Footerbar from "../../components/menus/Footerbar";
import Leftsidemenu from "../../components/menus/Leftsidemenu";
import Rightsidemenu from "../../components/menus/Rightsidemenu";
import BasicLayout from "../../layouts/BasicLayout";
// import "./PostPage.css";

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
    <BasicLayout>
      {/* 대출 게시글 리스트 페이지 메인 콘텐츠 */}
      <div className="main-content bg-white rounded-lg shadow-lg p-6">
        <h1 className="post-list-title-r"></h1>
        <ModifyComponent />
      </div>
    </BasicLayout>
  );
};

export default ModifyPage;
