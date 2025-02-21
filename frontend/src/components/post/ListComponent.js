// import { useEffect, useState } from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import { getAllLoanPosts } from "../../api/postApi";
// // import "../../pages/post/PostPage.css"; // 스타일 import
// import { format } from "date-fns"; // 날짜 포맷팅을 위한 라이브러리
// import "./ListComponent.css";

// const ListComponent = () => {
//   const [posts, setPosts] = useState([]);
//   const [totalPages, setTotalPages] = useState(0);
//   const [filteredPosts, setFilteredPosts] = useState([]); // 검색 결과
//   const [totalElements, setTotalElements] = useState(0);
//   const [currentPage, setCurrentPage] = useState(0);
//   const [pageSize, setPageSize] = useState(10);
//   const [hideCompleted, setHideCompleted] = useState(false); // ✅ 계약 완료 숨기기 상태 추가

//   const navigate = useNavigate();
//   const location = useLocation();
//   const queryParams = new URLSearchParams(location.search);
//   const searchTerm = queryParams.get("query") || "";

//   const fetchPosts = (page, size) => {
//     getAllLoanPosts(page, size, searchTerm)
//       .then((data) => {
//         if (data.content) {
//           console.log("Fetched posts:", data.content); // ✅ 데이터 확인용 로그

//           // 🔹 최신순 정렬 (내림차순)
//           const sortedPosts = data.content.sort(
//             (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
//           );
//           setPosts(sortedPosts);
//           setTotalPages(data.totalPages);
//           setTotalElements(data.totalElements);
//         } else {
//           setPosts([]);
//         }
//       })
//       .catch((err) => {
//         console.error("Error fetching loan posts:", err);
//       });
//   };

//   useEffect(() => {
//     fetchPosts(currentPage, pageSize);
//   }, [currentPage, pageSize, searchTerm]);

//   // const handleViewDetails = (postId) => {
//   //   navigate(`/post/view/${postId}`);
//   // };
//   const handleViewDetails = (post) => {
//     console.log("Checking contractStatus:", post.contractStatus); // ✅ 올바른 값 출력

//     if (
//       post.contractStatus === "진행 중" ||
//       post.contractStatus === "계약 완료"
//     ) {
//       alert("해당 게시글은 계약이 진행 중이거나 완료되어 조회할 수 없습니다.");
//       return;
//     }

//     navigate(`/post/view/${post.id}`);
//   };

//   const handleAddPost = () => {
//     navigate("/post/add");
//   };

//   const handlePageChange = (newPage) => {
//     if (newPage >= 0 && newPage < totalPages) {
//       setCurrentPage(newPage);
//     }
//   };

//   const normalizeNumber = (value) => {
//     // '만', '억' 등의 한국어 단위를 숫자로 변환
//     const unitMap = { 만: 10000, 억: 100000000 };
//     let normalized = value.replace(/[^0-9만억]/g, "");

//     for (const [unit, multiplier] of Object.entries(unitMap)) {
//       if (normalized.includes(unit)) {
//         const parts = normalized.split(unit);
//         return (
//           parseInt(parts[0]) * multiplier + (parts[1] ? parseInt(parts[1]) : 0)
//         );
//       }
//     }

//     return parseInt(normalized);
//   };

//   const filterPosts = (post) => {
//     if (!searchTerm) return true;
//     const lowerSearchTerm = searchTerm.toLowerCase();
//     const normalizedSearchAmount = normalizeNumber(lowerSearchTerm);

//     return (
//       post.writerId.toLowerCase().includes(lowerSearchTerm) ||
//       post.loanAmount === normalizedSearchAmount ||
//       post.loanAmount.toString().includes(lowerSearchTerm)
//     );
//   };

//   return (
//     <div className="post-list-container">
//       {searchTerm && <h2>'{searchTerm}' 검색 결과</h2>}

//       {!searchTerm && (
//         <div className="post-add">
//           <button className="post-add-button" onClick={handleAddPost}>
//             게시글 추가
//           </button>
//         </div>
//       )}

//       <div className="post-cards">
//         {posts.filter(filterPosts).length > 0 ? (
//           posts.filter(filterPosts).map((post) => (
//             <div
//               key={post.id}
//               className="post-card"
//               onClick={() => handleViewDetails(post)}
//             >
//               {/* 왼쪽: 제목 + 작성 시간 */}
//               <div className="post-header">
//                 <p className="post-title">
//                   {post.title}{" "}
//                   {post.contractStatus !== "모집 중" &&
//                     `(${post.contractStatus})`}
//                 </p>
//                 <div className="post-created-at">
//                   작성 시간:{" "}
//                   {format(new Date(post.createdAt), "yyyy-MM-dd HH:mm")}
//                 </div>
//               </div>

//               {/* 오른쪽: 글쓴이 ID + 대출 금액 */}
//               <div className="post-body">
//                 <p className="post-writer">글쓴이 ID: {post.writerId}</p>
//                 <div className="post-loan-amount">
//                   대출 금액: {post.loanAmount.toLocaleString()} 원
//                 </div>
//               </div>
//             </div>
//           ))
//         ) : (
//           <p className="no-posts">
//             {searchTerm ? "검색 결과가 없습니다." : "대출 게시글이 없습니다."}
//           </p>
//         )}
//       </div>
//       <div className="pagination-p">
//         <button
//           className="pagination-button-p"
//           onClick={() => handlePageChange(currentPage - 1)}
//           disabled={currentPage === 0}
//         >
//           이전
//         </button>
//         <span className="pagination-info-p">
//           {currentPage + 1} / {totalPages}
//         </span>
//         <button
//           className="pagination-button-p"
//           onClick={() => handlePageChange(currentPage + 1)}
//           disabled={currentPage === totalPages - 1}
//         >
//           다음
//         </button>
//       </div>
//     </div>
//   );
// };

// export default ListComponent;

// import { useEffect, useState } from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import { getAllLoanPosts } from "../../api/postApi";
// import { format } from "date-fns";
// import "./ListComponent.css";

// const ListComponent = () => {
//   const [posts, setPosts] = useState([]); // 전체 게시글
//   const [filteredPosts, setFilteredPosts] = useState([]); // 검색된 게시글
//   const [currentPage, setCurrentPage] = useState(0); // 현재 페이지
//   const [pageSize] = useState(10); // 페이지당 게시글 수
//   const navigate = useNavigate();
//   const location = useLocation();
//   const queryParams = new URLSearchParams(location.search);
//   const searchTerm = queryParams.get("query") || ""; // 검색어

//   // 🔹 서버에서 게시글 가져오기
//   const fetchPosts = () => {
//     getAllLoanPosts(0, 1000) // ✅ 최대 1000개까지 가져옴
//       .then((data) => {
//         if (data.content) {
//           const sortedPosts = data.content.sort(
//             (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
//           );
//           setPosts(sortedPosts);
//         } else {
//           setPosts([]);
//         }
//       })
//       .catch((err) => console.error("Error fetching loan posts:", err));
//   };

//   useEffect(() => {
//     fetchPosts();
//   }, []);

//   // 🔹 숫자 변환 함수 (검색어에서 '만', '억' 처리)
//   const normalizeNumber = (value) => {
//     const unitMap = { 만: 10000, 억: 100000000 };
//     let normalized = value.replace(/[^0-9만억]/g, "");
//     for (const [unit, multiplier] of Object.entries(unitMap)) {
//       if (normalized.includes(unit)) {
//         const parts = normalized.split(unit);
//         return (
//           parseInt(parts[0]) * multiplier + (parts[1] ? parseInt(parts[1]) : 0)
//         );
//       }
//     }
//     return parseInt(normalized);
//   };

//   // 🔹 검색 필터링 적용
//   useEffect(() => {
//     if (!searchTerm) {
//       setFilteredPosts(posts);
//     } else {
//       const lowerSearchTerm = searchTerm.toLowerCase();
//       const normalizedSearchAmount = normalizeNumber(lowerSearchTerm);

//       const filtered = posts.filter(
//         (post) =>
//           post.writerId.toLowerCase().includes(lowerSearchTerm) ||
//           post.loanAmount === normalizedSearchAmount ||
//           post.loanAmount.toString().includes(lowerSearchTerm)
//       );

//       setFilteredPosts(filtered);
//     }
//     setCurrentPage(0); // 검색 시 첫 페이지로 이동
//   }, [searchTerm, posts]);

//   // 🔹 페이징 처리
//   const totalPages = Math.ceil(filteredPosts.length / pageSize);
//   const paginatedPosts = filteredPosts.slice(
//     currentPage * pageSize,
//     (currentPage + 1) * pageSize
//   );

//   // 🔹 페이지 변경 핸들러
//   const handlePageChange = (newPage) => {
//     if (newPage >= 0 && newPage < totalPages) {
//       setCurrentPage(newPage);
//     }
//   };

//   // 🔹 상세 보기로 이동
//   const handleViewDetails = (post) => {
//     if (
//       post.contractStatus === "진행 중" ||
//       post.contractStatus === "계약 완료"
//     ) {
//       alert("해당 게시글은 계약이 진행 중이거나 완료되어 조회할 수 없습니다.");
//       return;
//     }
//     navigate(`/post/view/${post.id}`);
//   };

//   // 🔹 게시글 추가로 이동
//   const handleAddPost = () => {
//     navigate("/post/add");
//   };

//   return (
//     <div className="post-list-container">
//       {searchTerm && <h2>'{searchTerm}' 검색 결과</h2>}

//       {!searchTerm && (
//         <div className="post-add">
//           <button className="post-add-button" onClick={handleAddPost}>
//             게시글 추가
//           </button>
//         </div>
//       )}

//       <div className="post-cards">
//         {paginatedPosts.length > 0 ? (
//           paginatedPosts.map((post) => (
//             <div
//               key={post.id}
//               className="post-card"
//               onClick={() => handleViewDetails(post)}
//             >
//               {/* 왼쪽: 제목 + 작성 시간 */}
//               <div className="post-header">
//                 <p className="post-title">
//                   {post.title}{" "}
//                   {post.contractStatus !== "모집 중" &&
//                     `(${post.contractStatus})`}
//                 </p>
//                 <div className="post-created-at">
//                   작성 시간:{" "}
//                   {format(new Date(post.createdAt), "yyyy-MM-dd HH:mm")}
//                 </div>
//               </div>

//               {/* 오른쪽: 글쓴이 ID + 대출 금액 */}
//               <div className="post-body">
//                 <p className="post-writer">글쓴이 ID: {post.writerId}</p>
//                 <div className="post-loan-amount">
//                   대출 금액: {post.loanAmount.toLocaleString()} 원
//                 </div>
//               </div>
//             </div>
//           ))
//         ) : (
//           <p className="no-posts">
//             {searchTerm ? "검색 결과가 없습니다." : "대출 게시글이 없습니다."}
//           </p>
//         )}
//       </div>

//       {/* 페이지네이션 */}
//       {totalPages > 1 && (
//         <div className="pagination-p">
//           <button
//             className="pagination-button-p"
//             onClick={() => handlePageChange(currentPage - 1)}
//             disabled={currentPage === 0}
//           >
//             이전
//           </button>
//           <span className="pagination-info-p">
//             {currentPage + 1} / {totalPages}
//           </span>
//           <button
//             className="pagination-button-p"
//             onClick={() => handlePageChange(currentPage + 1)}
//             disabled={currentPage >= totalPages - 1}
//           >
//             다음
//           </button>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ListComponent;

// import { useEffect, useState } from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import { getAllLoanPosts } from "../../api/postApi";
// import { format } from "date-fns";
// import "./ListComponent.css";

// const ListComponent = () => {
//   const [posts, setPosts] = useState([]); // 전체 게시글
//   const [filteredPosts, setFilteredPosts] = useState([]); // 검색된 게시글
//   const [currentPage, setCurrentPage] = useState(0); // 현재 페이지
//   const [pageSize] = useState(10); // 페이지당 게시글 수
//   const [showMyPosts, setShowMyPosts] = useState(false); // ✅ 내 글만 보기 여부
//   const navigate = useNavigate();
//   const location = useLocation();
//   const queryParams = new URLSearchParams(location.search);
//   const searchTerm = queryParams.get("query") || ""; // 검색어

//   // ✅ 로그인된 사용자 ID 가져오기 (예제: localStorage 사용)
//   const userId = localStorage.getItem("userId") || ""; // 로그인 시스템에 맞게 변경

//   // 🔹 서버에서 게시글 가져오기
//   const fetchPosts = () => {
//     getAllLoanPosts(0, 1000) // ✅ 최대 1000개까지 가져옴
//       .then((data) => {
//         if (data.content) {
//           const sortedPosts = data.content.sort(
//             (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
//           );
//           setPosts(sortedPosts);
//         } else {
//           setPosts([]);
//         }
//       })
//       .catch((err) => console.error("Error fetching loan posts:", err));
//   };

//   useEffect(() => {
//     fetchPosts();
//   }, []);

//   // 🔹 숫자 변환 함수 (검색어에서 '만', '억' 처리)
//   const normalizeNumber = (value) => {
//     const unitMap = { 만: 10000, 억: 100000000 };
//     let normalized = value.replace(/[^0-9만억]/g, "");
//     for (const [unit, multiplier] of Object.entries(unitMap)) {
//       if (normalized.includes(unit)) {
//         const parts = normalized.split(unit);
//         return (
//           parseInt(parts[0]) * multiplier + (parts[1] ? parseInt(parts[1]) : 0)
//         );
//       }
//     }
//     return parseInt(normalized);
//   };

//   // 🔹 검색 & 필터링 적용
//   useEffect(() => {
//     let filtered = posts;

//     if (searchTerm) {
//       const lowerSearchTerm = searchTerm.toLowerCase();
//       const normalizedSearchAmount = normalizeNumber(lowerSearchTerm);

//       filtered = posts.filter(
//         (post) =>
//           post.writerId.toLowerCase().includes(lowerSearchTerm) ||
//           post.loanAmount === normalizedSearchAmount ||
//           post.loanAmount.toString().includes(lowerSearchTerm)
//       );
//     }

//     // ✅ "내 글만 보기" 활성화 시 필터링
//     if (showMyPosts && userId) {
//       filtered = filtered.filter((post) => post.writerId === userId);
//     }

//     setFilteredPosts(filtered);
//     setCurrentPage(0); // 검색 및 필터링 시 첫 페이지로 이동
//   }, [searchTerm, posts, showMyPosts]);

//   // 🔹 페이징 처리
//   const totalPages = Math.ceil(filteredPosts.length / pageSize);
//   const paginatedPosts = filteredPosts.slice(
//     currentPage * pageSize,
//     (currentPage + 1) * pageSize
//   );

//   // 🔹 페이지 변경 핸들러
//   const handlePageChange = (newPage) => {
//     if (newPage >= 0 && newPage < totalPages) {
//       setCurrentPage(newPage);
//     }
//   };

//   // 🔹 상세 보기로 이동
//   const handleViewDetails = (post) => {
//     if (
//       post.contractStatus === "진행 중" ||
//       post.contractStatus === "계약 완료"
//     ) {
//       alert("해당 게시글은 계약이 진행 중이거나 완료되어 조회할 수 없습니다.");
//       return;
//     }
//     navigate(`/post/view/${post.id}`);
//   };

//   // 🔹 게시글 추가로 이동
//   const handleAddPost = () => {
//     navigate("/post/add");
//   };

//   return (
//     <div className="post-list-container">
//       {/* 검색 결과 제목 */}
//       {searchTerm && <h2>'{searchTerm}' 검색 결과</h2>}

//       {/* 게시글 추가 & 내 글 보기 버튼 */}
//       <div className="post-actions">
//         <button className="post-add-button" onClick={handleAddPost}>
//           게시글 추가
//         </button>
//         <button
//           className={`my-posts-button ${showMyPosts ? "active" : ""}`}
//           onClick={() => setShowMyPosts(!showMyPosts)}
//         >
//           {showMyPosts ? "🔄 모든 글 보기" : "📌 내 글만 보기"}
//         </button>
//       </div>

//       {/* 게시글 목록 */}
//       <div className="post-cards">
//         {paginatedPosts.length > 0 ? (
//           paginatedPosts.map((post) => (
//             <div
//               key={post.id}
//               className="post-card"
//               onClick={() => handleViewDetails(post)}
//             >
//               {/* 왼쪽: 제목 + 작성 시간 */}
//               <div className="post-header">
//                 <p className="post-title">
//                   {post.title}{" "}
//                   {post.contractStatus !== "모집 중" &&
//                     `(${post.contractStatus})`}
//                 </p>
//                 <div className="post-created-at">
//                   작성 시간:{" "}
//                   {format(new Date(post.createdAt), "yyyy-MM-dd HH:mm")}
//                 </div>
//               </div>

//               {/* 오른쪽: 글쓴이 ID + 대출 금액 */}
//               <div className="post-body">
//                 <p className="post-writer">글쓴이 ID: {post.writerId}</p>
//                 <div className="post-loan-amount">
//                   대출 금액: {post.loanAmount.toLocaleString()} 원
//                 </div>
//               </div>
//             </div>
//           ))
//         ) : (
//           <p className="no-posts">
//             {searchTerm
//               ? "검색 결과가 없습니다."
//               : showMyPosts
//               ? "내가 작성한 게시글이 없습니다."
//               : "대출 게시글이 없습니다."}
//           </p>
//         )}
//       </div>

//       {/* 페이지네이션 */}
//       {totalPages > 1 && (
//         <div className="pagination-p">
//           <button
//             className="pagination-button-p"
//             onClick={() => handlePageChange(currentPage - 1)}
//             disabled={currentPage === 0}
//           >
//             이전
//           </button>
//           <span className="pagination-info-p">
//             {currentPage + 1} / {totalPages}
//           </span>
//           <button
//             className="pagination-button-p"
//             onClick={() => handlePageChange(currentPage + 1)}
//             disabled={currentPage >= totalPages - 1}
//           >
//             다음
//           </button>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ListComponent;

import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getAllLoanPosts } from "../../api/postApi";
import { format } from "date-fns";
import "./ListComponent.css";

const ListComponent = () => {
  const [posts, setPosts] = useState([]); // 전체 게시글
  const [filteredPosts, setFilteredPosts] = useState([]); // 검색된 게시글
  const [currentPage, setCurrentPage] = useState(0); // 현재 페이지
  const [pageSize] = useState(10); // 페이지당 게시글 수
  const [filterOption, setFilterOption] = useState("all"); // ✅ 필터 옵션 (기본: 모든 글)
  const [excludeContractPosts, setExcludeContractPosts] = useState(false); // 계약 상태 필터링
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const searchTerm = queryParams.get("query") || ""; // 검색어

  // ✅ 로그인된 사용자 ID 가져오기 (예제: localStorage 사용)
  const userId = localStorage.getItem("userId") || ""; // 로그인 시스템에 맞게 변경

  // 🔹 서버에서 게시글 가져오기
  const fetchPosts = () => {
    getAllLoanPosts(0, 1000) // ✅ 최대 1000개까지 가져옴
      .then((data) => {
        if (data.content) {
          console.log("List : ", data);
          const sortedPosts = data.content.sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
          );
          setPosts(sortedPosts);
        } else {
          setPosts([]);
        }
      })
      .catch((err) => console.error("Error fetching loan posts:", err));
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  // 🔹 숫자 변환 함수 (검색어에서 '만', '억' 처리)
  const normalizeNumber = (value) => {
    const unitMap = { 만: 10000, 억: 100000000 };
    let normalized = value.replace(/[^0-9만억]/g, "");
    for (const [unit, multiplier] of Object.entries(unitMap)) {
      if (normalized.includes(unit)) {
        const parts = normalized.split(unit);
        return (
          parseInt(parts[0]) * multiplier + (parts[1] ? parseInt(parts[1]) : 0)
        );
      }
    }
    return parseInt(normalized);
  };

  // 🔹 검색 & 필터링 적용
  useEffect(() => {
    let filtered = posts;

    if (searchTerm) {
      const lowerSearchTerm = searchTerm.toLowerCase();
      const normalizedSearchAmount = normalizeNumber(lowerSearchTerm);

      filtered = posts.filter(
        (post) =>
          post.writerId.toLowerCase().includes(lowerSearchTerm) ||
          post.loanAmount === normalizedSearchAmount ||
          post.loanAmount.toString().includes(lowerSearchTerm)
      );
    }

    // ✅ 필터 옵션 적용 (내 글만 보기)
    if (filterOption === "myPosts" && userId) {
      filtered = filtered.filter((post) => post.writerId === userId);
    }

    // 계약 상태 필터링 적용
    if (excludeContractPosts) {
      filtered = filtered.filter(
        (post) =>
          post.contractStatus !== "진행 중" &&
          post.contractStatus !== "계약 완료" &&
          post.contractStatus !== "계약 취소"
      );
    }

    setFilteredPosts(filtered);
    setCurrentPage(0); // 검색 및 필터링 시 첫 페이지로 이동
  }, [searchTerm, posts, filterOption, excludeContractPosts]);

  // 🔹 페이징 처리
  const totalPages = Math.ceil(filteredPosts.length / pageSize);
  const paginatedPosts = filteredPosts.slice(
    currentPage * pageSize,
    (currentPage + 1) * pageSize
  );

  // 🔹 페이지 변경 핸들러
  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < totalPages) {
      setCurrentPage(newPage);
    }
  };

  // 🔹 상세 보기로 이동
  const handleViewDetails = (post) => {
    console.log("Checking contractStatus:", post.contractStatus); // 디버깅 로그

    if (
      post.contractStatus === "진행 중" ||
      post.contractStatus === "계약 완료" ||
      post.contractStatus === "계약 취소"
    ) {
      alert("해당 게시글은 계약을 진행 할 수 없습니다.");
      return;
    }
    navigate(`/post/view/${post.id}`);
  };

  // 🔹 게시글 추가로 이동
  const handleAddPost = () => {
    navigate("/post/add");
  };

  const handleExcludeContractPostsToggle = () => {
    setExcludeContractPosts((prev) => !prev); // 계약 상태 필터링 토글
  };

  return (
    <div className="post-list-container">
      {/* 검색 결과 제목 */}
      {searchTerm && <h2>'{searchTerm}' 검색 결과</h2>}

      {/* 게시글 추가 & 필터 옵션 (셀렉트 박스) */}
      <div className="post-actions">
        <button className="post-add-button" onClick={handleAddPost}>
          게시글 추가
        </button>

        <div className="list-category">
          <select
            className="filter-select"
            value={filterOption}
            onChange={(e) => setFilterOption(e.target.value)}
          >
            <option value="all">📌 모든 글 보기</option>
            <option value="myPosts">✏️ 내 글만 보기</option>
          </select>

          {/* 계약 중/완료 글 제외 체크박스 */}
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={excludeContractPosts}
              onChange={(e) => setExcludeContractPosts(e.target.checked)}
            />
            계약 진행 중/완료 글 제외
          </label>
        </div>
      </div>

      {/* 게시글 목록 */}
      <div className="post-cards">
        {paginatedPosts.length > 0 ? (
          paginatedPosts.map((post) => (
            <div
              key={post.id}
              className="post-card"
              onClick={() => handleViewDetails(post)}
            >
              {/* 왼쪽: 제목 + 작성 시간 */}
              <div className="post-header">
                <p className="post-title">
                  {post.title}{" "}
                  <p className="post-status">
                    {post.contractStatus !== "모집 중" &&
                      `(${post.contractStatus})`}
                  </p>
                </p>
                <div className="post-created-at">
                  작성 시간:{" "}
                  {format(new Date(post.createdAt), "yyyy-MM-dd HH:mm")}
                </div>
              </div>

              {/* 오른쪽: 글쓴이 ID + 대출 금액 */}
              <div className="post-body">
                <p className="post-writer">글쓴이 ID: {post.writerId}</p>
                <div className="post-loan-amount">
                  대출 금액: {post.loanAmount.toLocaleString()} 원
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="no-posts">
            {searchTerm
              ? "검색 결과가 없습니다."
              : filterOption === "myPosts"
              ? "내가 작성한 게시글이 없습니다."
              : "대출 게시글이 없습니다."}
          </p>
        )}
      </div>

      {/* 페이지네이션 */}
      {totalPages > 1 && (
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
            disabled={currentPage >= totalPages - 1}
          >
            다음
          </button>
        </div>
      )}
    </div>
  );
};

export default ListComponent;
