import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getLoanPostById } from "../../api/postApi";
import ModifyComponent from "../../components/post/ModifyComponent";

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
    <div className="p-4 w-full bg-white">
      <div className="text-3xl font-extrabold">Loan Post Modify Page</div>
      <ModifyComponent initialLoanPost={loanPost} /> {/* 게시글 데이터 전달 */}
    </div>
  );
};

export default ModifyPage;
