// import { Link, useLocation } from "react-router-dom";
// import logo from "../../images/logo.png";
// import { FaSearch } from "react-icons/fa"; // 아이콘 추가
// import "./BasicMenu.css"; // 일반 CSS import
// import { useSelector } from "react-redux";
// import useCustomLogin from "../../hooks/useCustomLogin";
// import DonationProgress from "./DonationProgress";

// const BasicMenu = () => {
//   const { doLogout, moveToPath } = useCustomLogin();
//   const location = useLocation(); // 현재 경로 가져오기

//   const handleClickLogout = () => {
//     doLogout();
//     alert("로그아웃되었습니다.");
//     moveToPath("/");
//   };

//   const loginState = useSelector((state) => state.loginSlice);

//   // 현재 경로와 비교하여 활성화된 메뉴에 클래스 추가
//   const isActive = (path) => location.pathname === path;

//   return (
//     <nav className="navbar">
//       {/* 상단 바 */}
//       <div className="nav-container">
//         <div className="nav-header">
//           {/* 로고 */}
//           <div className="nav-logo">
//             <Link to={"/"}>
//               <img src={logo} alt="Logo" />
//             </Link>
//           </div>

//           {/* 로그인/로그아웃 */}
//           <div className="nav-login">
//             {!loginState.id ? (
//               <Link to={"/member/login"}>Login</Link>
//             ) : (
//               <>
//                 {loginState.role === "ROLE_ADMIN" && (
//                   <Link to={"/member/admin"} className="admin-page-link">
//                     관리자 페이지
//                   </Link>
//                 )}
//                 <Link to={"/member/lender"}>채권/채무 변경 신청</Link>
//                 <Link to={"/member/login"} onClick={handleClickLogout}>
//                   Logout
//                 </Link>
//               </>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* 월간 기부 현황 */}
//       <div className="donation-container">
//         <DonationProgress donation={50} goal={100} />
//       </div>

//       {/* 서치바 */}
//       <div className="search-bar">
//         <form>
//           <input type="text" placeholder="검색어를 입력해주세요" />
//           <button>
//             <FaSearch />
//           </button>
//         </form>
//       </div>

//       {/* 하단 메뉴바 */}
//       <div className="nav-bottom">
//         <ul className="menu-bar">
//           <li>
//             <Link
//               to={"/member/mypage"}
//               className={isActive("/member/mypage") ? "active" : ""}
//             >
//               내지갑
//             </Link>
//           </li>
//           <li>
//             <Link to={"/post/"} className={isActive("/post/") ? "active" : ""}>
//               빌려드려요
//             </Link>
//           </li>
//           <li>
//             <Link
//               to={"/debtCollection"}
//               className={isActive("/debtCollection") ? "active" : ""}
//             >
//               대행서비스
//             </Link>
//           </li>
//           <li>
//             <Link to={"/qna/"} className={isActive("/qna/") ? "active" : ""}>
//               QnA
//             </Link>
//           </li>
//         </ul>
//       </div>
//     </nav>
//   );
// };

// export default BasicMenu;

import { Link, useLocation } from "react-router-dom";
import logo from "../../images/logo.png";
import { FaSearch } from "react-icons/fa"; // 아이콘 추가
import "./BasicMenu.css"; // 일반 CSS import
import { useSelector } from "react-redux";
import useCustomLogin from "../../hooks/useCustomLogin";
import DonationProgress from "./DonationProgress";

const BasicMenu = () => {
  const { doLogout, moveToPath } = useCustomLogin();
  const location = useLocation(); // 현재 경로 가져오기

  const handleClickLogout = () => {
    doLogout();
    alert("로그아웃되었습니다.");
    moveToPath("/");
  };

  const loginState = useSelector((state) => state.loginSlice);

  // 현재 경로와 비교하여 활성화된 메뉴에 클래스 추가
  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar">
      <div className="nav-logo">
        <Link to={"/"}>
          <img src={logo} alt="Logo" />
        </Link>
      </div>
      {/* 상단 바 */}
      <div className="nav-container">
        {/* 로고 */}
        {/* <div className="nav-logo">
          <Link to={"/"}>
            <img src={logo} alt="Logo" />
          </Link>
        </div> */}
        <div className="second">
          <div className="search-bar">
            <form>
              <input type="text" placeholder="검색어를 입력해주세요" />
              <button>
                <FaSearch />
              </button>
            </form>
          </div>

          {/* 로그인/로그아웃
          <div className="nav-login">
            {!loginState.id ? (
              <Link to={"/member/login"}>Login</Link>
            ) : (
              <>
                {loginState.role === "ROLE_ADMIN" && (
                  <Link to={"/member/admin"} className="admin-page-link">
                    관리자 페이지
                  </Link>
                )}
                <Link to={"/member/lender"}>채권/채무 변경 신청</Link>
                <Link to={"/member/login"} onClick={handleClickLogout}>
                  Logout
                </Link>
              </>
            )}
          </div> */}
          <div className="nav-bottom">
            <ul className="menu-bar">
              <li>
                <Link
                  to={"/member/mypage"}
                  className={
                    location.pathname === "/member/mypage" ? "active" : ""
                  }
                >
                  내지갑
                </Link>
              </li>
              <li>
                <Link
                  to={"/post/"}
                  className={location.pathname === "/post/" ? "active" : ""}
                >
                  빌려드려요
                </Link>
              </li>
              <li>
                <Link
                  to={"/debtCollection"}
                  className={
                    location.pathname === "/debtCollection" ? "active" : ""
                  }
                >
                  대행서비스
                </Link>
              </li>
              <li>
                <Link
                  to={"/qna/"}
                  className={location.pathname === "/qna/" ? "active" : ""}
                >
                  QnA
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* 서치바
      <div className="search-bar">
        <form>
          <input type="text" placeholder="검색어를 입력해주세요" />
          <button>
            <FaSearch />
          </button>
        </form>
      </div> */}

      {/* 하단 메뉴바
      <div className="nav-bottom">
        <ul className="menu-bar">
          <li>
            <Link
              to={"/member/mypage"}
              className={location.pathname === "/member/mypage" ? "active" : ""}
            >
              내지갑
            </Link>
          </li>
          <li>
            <Link
              to={"/post/"}
              className={location.pathname === "/post/" ? "active" : ""}
            >
              빌려드려요
            </Link>
          </li>
          <li>
            <Link
              to={"/debtCollection"}
              className={
                location.pathname === "/debtCollection" ? "active" : ""
              }
            >
              대행서비스
            </Link>
          </li>
          <li>
            <Link
              to={"/qna/"}
              className={location.pathname === "/qna/" ? "active" : ""}
            >
              QnA
            </Link>
          </li>
        </ul>
      </div> */}
      {/* 로그인/로그아웃 */}
      <div className="nav-login">
        {!loginState.id ? (
          <Link to={"/member/login"}>Login</Link>
        ) : (
          <>
            {loginState.role === "ROLE_ADMIN" && (
              <Link to={"/member/admin"} className="admin-page-link">
                관리자 페이지
              </Link>
            )}
            <Link to={"/member/lender"}>채권/채무 변경 신청</Link>
            <Link to={"/member/login"} onClick={handleClickLogout}>
              Logout
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default BasicMenu;
