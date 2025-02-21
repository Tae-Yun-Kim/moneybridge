import { Suspense, lazy } from "react";
import { Navigate } from "react-router-dom"; // 🔹 리디렉션을 위한 Navigate 추가

const Loading = <div>Loading....</div>;
const QnaIndex = lazy(() => import("../pages/qna/qnaIndex"));
const QnaList = lazy(() => import("../pages/qna/qnaList"));
const QnaAdd = lazy(() => import("../pages/qna/qnaAdd"));
const QnaRead = lazy(() => import("../pages/qna/qnaRead.js"));
const QnaModify = lazy(() => import("../pages/qna/qnaModify"));
const OneToOnePage = lazy(() => import("../pages/qna/oneToone"));

const QnaRouter = () => {
  return [
    {
      path: "/qna",
      element: (
        <Suspense fallback={Loading}>
          <QnaIndex />
        </Suspense>
      ),
      children: [
        {
          path: "",
          element: <Navigate replace to="list" />, // 🔹 기본적으로 /qna/list로 이동
        },
        {
          path: "list",
          element: (
            <Suspense fallback={Loading}>
              <QnaList />
            </Suspense>
          ),
        },
        {
          path: "add",
          element: (
            <Suspense fallback={Loading}>
              <QnaAdd />
            </Suspense>
          ),
        },
        {
          path: "read/:qno",
          element: (
            <Suspense fallback={Loading}>
              <QnaRead />
            </Suspense>
          ),
        },
        {
          path: "modify/:qno",
          element: (
            <Suspense fallback={Loading}>
              <QnaModify />
            </Suspense>
          ),
        },
        {
          path: "one-to-one",
          element: (
            <Suspense fallback={Loading}>
              <OneToOnePage />
            </Suspense>
          ),
        },
      ],
    },
  ];
};

export default QnaRouter;
