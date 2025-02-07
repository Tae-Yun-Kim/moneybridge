import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllLoanPosts } from "../../api/postApi";
import "../../pages/post/PostPage.css"; // 스타일 import
import { format } from "date-fns"; // 날짜 포맷팅을 위한 라이브러리

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
    <div>
      <div className="post-add">
        <button onClick={handleAddPost}>게시글 추가</button>
      </div>
      <div>
        {posts.length > 0 ? (
          posts.map((post) => (
            <div 
              key={post.id} 
              className="post" 
              onClick={() => handleViewDetails(post.id)} // 글 클릭 시 상세페이지로 이동
            >
              <div className="post-header">글쓴이 ID: {post.writerId}
                <div className="post-created-at">
                  작성 시간: {format(new Date(post.createdAt), "yyyy-MM-dd HH:mm")} {/* 작성 시간 포맷팅 */}
                </div>
              </div>
              <div className="post-body">
                <div>대출 금액: {post.loanAmount.toLocaleString()} 원</div>
                {/* <div>상환 기간: {post.repaymentPeriod}일</div>
                <div>추가 조건: {post.additionalConditions || "없음"}</div> */}
              </div>
              {/* <div className="post-footer">
                <button onClick={() => handleViewDetails(post.id)}>댓글작성</button>
              </div> */}
            </div>
          ))
        ) : (
          <p>대출 게시글이 없습니다.</p>
        )}
      </div>
      <div className="pagination">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 0}
        >
          이전
        </button>
        <span>
          {currentPage + 1} / {totalPages}
        </span>
        <button
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
