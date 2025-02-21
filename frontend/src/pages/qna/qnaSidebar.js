import React from "react";
import { NavLink } from "react-router-dom";
import UserGuide from "../../components/menus/UserGuide";
// import "./Qna.css"; // 🔹 CSS 적용

const QnaSidebar = () => {
  return (
    <div>
      <UserGuide />
      <aside>
        <nav className="nav-q">
          <NavLink
            to="/qna/list"
            className={({ isActive }) =>
              isActive ? "nav-link-q active" : "nav-link-q"
            }
          >
            QnA List
          </NavLink>
          <NavLink
            to="/qna/add"
            className={({ isActive }) =>
              isActive ? "nav-link-q active" : "nav-link-q"
            }
          >
            질문하기
          </NavLink>
          <NavLink
            to="/qna/one-to-one"
            className={({ isActive }) =>
              isActive ? "nav-link-q active" : "nav-link-q"
            }
          >
            내 문의 내역
          </NavLink>
        </nav>
      </aside>
    </div>
  );
};

export default QnaSidebar;
