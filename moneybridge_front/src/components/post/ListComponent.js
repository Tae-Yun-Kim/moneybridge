import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllLoanPosts } from "../../api/postApi";

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
        console.log(data);
        if (data.content) {
          setPosts(data.content);
          setTotalPages(data.totalPages);
          setTotalElements(data.totalElements);
        } else {
          console.error("Unexpected data format:", data);
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

  const handleViewDetails = (id) => {
    navigate(`/post/view/${id}`);
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < totalPages) {
      setCurrentPage(newPage);
    }
  };

  return (
    <div className="border-2 border-blue-100 mt-10 mr-2 ml-2">
      <div className="flex flex-wrap mx-auto justify-center p-6">
        {posts.length > 0 ? (
          posts.map((post) => (
            <div
              key={post.id}
              className="w-full min-w-[400px] p-4 m-4 rounded-lg shadow-lg border bg-white"
            >
              <div className="flex items-center justify-between p-4 border-b">
                <div className="text-xl font-bold text-gray-800">
                  {post.title || "제목 없음"}
                </div>
                <div className="text-lg font-medium text-gray-700">
                  {post.loanAmount} 원
                </div>
              </div>
              <div className="p-4 text-gray-600">작성자: {post.writerId}</div>
              <div className="p-4 text-right">
                <button
                  className="rounded bg-blue-500 text-white px-4 py-2"
                  onClick={() => handleViewDetails(post.id)}
                >
                  상세보기
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-lg text-gray-500">
            대출 게시글이 없습니다.
          </p>
        )}
      </div>
      <div className="text-center p-4">
        <p className="text-sm text-gray-500">
          총 {totalElements}개의 게시글이 있습니다.
        </p>
        <div className="flex justify-center items-center space-x-2">
          <button
            className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 0}
          >
            이전
          </button>
          <span>
            {currentPage + 1} / {totalPages}
          </span>
          <button
            className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages - 1}
          >
            다음
          </button>
        </div>
      </div>
    </div>
  );
};

export default ListComponent;
