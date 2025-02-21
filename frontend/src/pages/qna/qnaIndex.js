import BasicLayout from "../../layouts/BasicLayout";
import { Suspense } from "react";
import { Outlet } from "react-router-dom"; // 🔹 React Router에서 현재 선택된 페이지를 렌더링하는 Outlet 추가
import QnaSidebar from "./qnaSidebar";
import "./Qna.css";

const Loading = <div>Loading...</div>;

const QnaIndex = () => {
  return (
    <BasicLayout>
      {/* 🔹 메인 레이아웃 내부의 컨테이너 (세로 정렬) */}
      <div className="main-container-q">
        {/* 🔹 상단에 네비게이션 바 (QnaSidebar) */}
        <QnaSidebar />

        {/* 🔹 네비게이션 아래에 QnA 컨텐츠가 표시됨 */}
        <div className="content-q">
          <Suspense fallback={Loading}>
            <Outlet /> {/* 🔹 현재 선택된 QnA 페이지가 이 위치에 렌더링됨 */}
          </Suspense>
        </div>
      </div>
    </BasicLayout>
  );
};

export default QnaIndex;
