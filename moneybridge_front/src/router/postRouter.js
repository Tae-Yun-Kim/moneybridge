import { Suspense, lazy } from "react";

const ListPage = lazy(() => import("../pages/post/ListPage"));
const ReadPage = lazy(() => import("../pages/post/ReadPage"));
const AddPage = lazy(() => import("../pages/post/AddPage"));
const ModifyPage = lazy(() => import("../pages/post/ModifyPage"));

const Loading = <div>Loading....</div>;

const loanPostRouter = () => {
  return [
    {
      path: "list", // 대출 게시글 목록
      element: (
        <Suspense fallback={Loading}>
          <ListPage />
        </Suspense>
      ),
    },
    {
      path: "add", // 대출 게시글 작성
      element: (
        <Suspense fallback={Loading}>
          <AddPage />
        </Suspense>
      ),
    },
    {
      path: "view/:id", // 대출 게시글 상세 조회
      element: (
        <Suspense fallback={Loading}>
          <ReadPage />
        </Suspense>
      ),
    },
    {
      path: "modify/:id", // 대출 게시글 수정
      element: (
        <Suspense fallback={Loading}>
          <ModifyPage />
        </Suspense>
      ),
    },
  ];
};

export default loanPostRouter;
