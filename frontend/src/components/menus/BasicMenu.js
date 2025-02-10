import React, { useState, useEffect } from 'react';
import { Link, useLocation } from "react-router-dom";
import logo from "../../images/logo.png";
import { FaSearch } from "react-icons/fa"; // 아이콘 추가
import { useSelector } from "react-redux";
import useCustomLogin from "../../hooks/useCustomLogin";
import DonationProgress from "./DonationProgress";
import NotificationComponent from '../notification/NotificationComponent';  // NotificationComponent 추가

const BasicMenu = () => {
  const { doLogout, moveToPath } = useCustomLogin();
  const location = useLocation(); // 현재 경로 가져오기

  const loginState = useSelector((state) => state.loginSlice);

  const handleClickLogout = () => {
    doLogout();
    alert("로그아웃되었습니다.");
    moveToPath("/");
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar">
      <div className="nav-logo">
        <Link to={"/"}>
          <img src={logo} alt="Logo" />
        </Link>
      </div>
      <div className="nav-container">
        <div className="second">
          <div className="search-bar">
            <form>
              <input type="text" placeholder="검색어를 입력해주세요" />
              <button>
                <FaSearch />
              </button>
            </form>
          </div>
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
                  to={"/post/list"}
                  className={location.pathname === "/post/" ? "active" : ""}
                >
                  빌려드려요
                </Link>
              </li>
              <li>
                <Link
                  to={"/debtCollection"}
                  className={location.pathname === "/debtCollection" ? "active" : ""}
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
        <NotificationComponent />  {/* 여기서 알림 컴포넌트를 호출 */}
      </div>
    </nav>
  );
};

export default BasicMenu;
