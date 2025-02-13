import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllLoanPosts } from "../../api/postApi";
// import "../../pages/post/PostPage.css"; // 스타일 import
import { format } from "date-fns"; // 날짜 포맷팅을 위한 라이브러리
import "./ListComponent.css";

const ListComponent = () => {
  const [posts, setPosts] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const navigate = useNavigate();

  const fetchPosts = (page, size) => {
    getAllLoanPosts(page, size)
      .then((data) => {
        if (data.content) {
          setPosts(data.content);
          setTotalPages(data.totalPages);
          setTotalElements(data.totalElements);
        } else {
          setPosts([]);
        }
      })
      .catch((err) => {
        console.error("Error fetching loan posts:", err);
      });
  };

  useEffect(() => {
    fetchPosts(currentPage, pageSize);
  }, [currentPage, pageSize]);

  const handleViewDetails = (postId) => {
    navigate(`/post/view/${postId}`);
  };

  const handleAddPost = () => {
    navigate("/post/add");
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < totalPages) {
      setCurrentPage(newPage);
    }
  };

  return (
    <div className="post-list-container">
      <div className="post-add">
        <button className="post-add-button" onClick={handleAddPost}>
          게시글 추가
        </button>
      </div>
      <div className="post-cards">
        {posts.length > 0 ? (
          posts.map((post) => (
            <div
              key={post.id}
              className="post-card"
              onClick={() => handleViewDetails(post.id)}
            >
              <div className="post-header">
                <h3>글쓴이 ID: {post.writerId}</h3>
                <div className="post-created-at">
                  작성 시간:{" "}
                  {format(new Date(post.createdAt), "yyyy-MM-dd HH:mm")}
                </div>
              </div>
              <div className="post-body">
                <p>대출 금액: {post.loanAmount.toLocaleString()} 원</p>
              </div>
            </div>
          ))
        ) : (
          <p className="no-posts">대출 게시글이 없습니다.</p>
        )}
      </div>
      <div className="pagination-p">
        <button
          className="pagination-button-p"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 0}
        >
          이전
        </button>
        <span className="pagination-info-p">
          {currentPage + 1} / {totalPages}
        </span>
        <button
          className="pagination-button-p"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages - 1}
        >
          다음
        </button>
      </div>
    </div>
  );
};

export default ListComponent;
