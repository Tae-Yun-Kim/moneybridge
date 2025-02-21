// import axios from "axios";
// import { useEffect, useState } from "react";

// const LoanProductList = () => {
//   const [loanProducts, setLoanProducts] = useState([]);

//   useEffect(() => {
//     axios
//       .get("http://localhost:8080/api/loan-products")
//       .then((response) => {
//         console.log("✅ API Response:", response.data); // 응답 데이터 확인
//         if (Array.isArray(response.data)) {
//           setLoanProducts(response.data); // ✅ 배열이면 그대로 저장
//         } else {
//           console.error("❌ API 응답이 배열이 아닙니다:", response.data);
//           setLoanProducts([]); // ❗ 배열이 아닐 경우 빈 배열로 설정
//         }
//       })
//       .catch((error) => {
//         console.error("Error fetching loan products:", error);
//         setLoanProducts([]); // ❗ 에러 발생 시 빈 배열로 설정
//       });
//   }, []);

//   return (
//     <div>
//       {loanProducts.length > 0 ? (
//         <ul>
//           {loanProducts.map((product) => (
//             <li key={product.finPrdtCd}>
//               <strong>{product.finPrdtNm}</strong> - {product.korCoNm} <br />
//               금리:{" "}
//               {product.crdtGradAvg ? `${product.crdtGradAvg}%` : "정보 없음"}
//             </li>
//           ))}
//         </ul>
//       ) : (
//         <p>❗ 데이터가 없습니다.</p> // ❗ 데이터가 없을 경우 예외 처리
//       )}
//     </div>
//   );
// };

// export default LoanProductList;

import axios from "axios";
import { useEffect, useState } from "react";
import "./LoanProductList.css"; // CSS 파일 연결

const LoanProductList = () => {
  const [loanProducts, setLoanProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;

  // 백엔드에서 데이터 가져오기
  useEffect(() => {
    axios
      .get("http://localhost:8080/api/loan-products")
      .then((response) => {
        if (Array.isArray(response.data)) {
          setLoanProducts(response.data);
        } else {
          setLoanProducts([]);
        }
      })
      .catch((error) => {
        console.error("Error fetching loan products:", error);
        setLoanProducts([]);
      });
  }, []);

  // 현재 페이지 데이터 계산
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = loanProducts.slice(indexOfFirstItem, indexOfLastItem);

  // 총 페이지 수 계산
  const totalPages = Math.ceil(loanProducts.length / itemsPerPage);

  // 페이지 변경 핸들러
  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="loan-product-container">
      {/* <h1 className="title">은행 대출 이자율 API</h1> */}
      <div className="product-list">
        {currentItems.map((product) => (
          <div key={product.finPrdtCd} className="product-card">
            <p className="product-bank">{product.korCoNm}</p>
            <p className="product-name">{product.finPrdtNm}</p>
            <p className="product-rate">
              금리:{" "}
              <span>
                {product.crdtGradAvg ? `${product.crdtGradAvg}%` : "정보 없음"}
              </span>
            </p>
          </div>
        ))}
      </div>
      <div className="pagination-l">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
          <button
            key={number}
            onClick={() => handlePageChange(number)}
            className={`page-button ${number === currentPage ? "active" : ""}`}
          >
            {number}
          </button>
        ))}
      </div>
    </div>
  );
};

export default LoanProductList;
