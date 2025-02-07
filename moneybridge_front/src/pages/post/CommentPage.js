import CommentComponent from "../../components/post/CommentComponent";

const CommentPage = ({ postId }) => {
  return (
    <div className="container mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-4">게시글 댓글</h1>
      <CommentComponent postId={postId} />
    </div>
  );
};

export default CommentPage;
