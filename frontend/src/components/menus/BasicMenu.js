import { Link, useLocation, useNavigate } from "react-router-dom";
import logo from "../../images/logo.png";
import { FaSearch } from "react-icons/fa"; // 아이콘 추가
import "./BasicMenu.css"; // 일반 CSS import
import { useSelector } from "react-redux";
import useCustomLogin from "../../hooks/useCustomLogin";
import DonationProgress from "./DonationProgress";
import NotificationComponent from "../notification/NotificationComponent"; // NotificationComponent 추가
import { useState } from "react";
import SearchBar from "../search/SearchBar";

const BasicMenu = () => {
  const { doLogout, moveToPath } = useCustomLogin();
  const location = useLocation(); // 현재 경로 가져오기
  const [query, setQuery] = useState("");
  const navigate = useNavigate(); // 🔹 페이지 이동을 위한 훅

  const handleClickLogout = () => {
    doLogout();
    alert("로그아웃되었습니다.");
    moveToPath("/");
  };

  const handleSearch = (searchTerm) => {
    if (searchTerm.trim() === "") return;
    navigate(`/search?query=${encodeURIComponent(searchTerm)}`);
  };

  const loginState = useSelector((state) => state.loginSlice);

  // 현재 경로와 비교하여 활성화된 메뉴에 클래스 추가
  const isActive = (path) => location.pathname === path;

  return (
    <div>
      <div className="nav-login">
        <NotificationComponent /> {/* 여기서 알림 컴포넌트를 호출 */}
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
      <nav className="navbar">
        <div className="next">
          <div className="nav-logo">
            <div className="nav-logo-second">
              <Link to={"/"}>
                <img src={logo} alt="Logo" />
              </Link>
            </div>
          </div>
          <div>
            {/* 상단 바 */}
            <div className="nav-container">
              <div className="second">
                <SearchBar onSearch={handleSearch} />

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
                        to={"/post/list"}
                        className={
                          location.pathname === "/post/list" ? "active" : ""
                        }
                      >
                        빌려드려요
                      </Link>
                    </li>
                    <li>
                      <Link
                        to={"/debt"}
                        className={
                          location.pathname === "/debt" ? "active" : ""
                        }
                      >
                        대행서비스
                      </Link>
                    </li>
                    <li>
                      <Link
                        to={"/chat/messages"}
                        className={
                          location.pathname === "/chat/messages" ? "active" : ""
                        }
                      >
                        채팅
                      </Link>
                    </li>
                    <li>
                      <Link
                        to={"/qna/list"}
                        className={
                          location.pathname.startsWith("/qna/") ? "active" : ""
                        }
                      >
                        고객센터
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default BasicMenu;
