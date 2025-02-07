import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import ReadComponent from "../../components/post/ReadComponent";
import CommentComponent from "../../components/post/CommentComponent";

const ReadPage = () => {
  const { id } = useParams();

  return (
    <div className="font-extrabold w-full bg-white mt-6">
      <div className="text-2xl">Loan Post Read Page Component {id}</div>

      {/* 게시글 내용 */}
      <ReadComponent id={id} />

      {/* 댓글 컴포넌트 */}
      <CommentComponent postId={id} />
    </div>
  );
};

export default ReadPage;
