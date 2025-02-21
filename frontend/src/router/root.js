import { Suspense, lazy } from "react";
import { createBrowserRouter } from "react-router-dom";
// import todoRouter from "./todoRouter";
// import productsRouter from "./productsRouter";
import memberRouter from "./memberRouter";
import walletRouter from "./walletRouter";
import debtRouter from "./debtRouter";
import loanPostRouter from "./postRouter";
import QnaRouter from "./qnaRouter";
import searchRouter from "./searchRouter";
import UserGuide from "../components/menus/UserGuide";
import chatRouter from "./chatRouter";

const Loading = <div>Loading....</div>;
const Main = lazy(() => import("../pages/MainPage"));
const ContractPage = lazy(() => import("../pages/contract/ContractPage"));
const ContractHistoryPage = lazy(() =>
  import("../pages/contract/ContractHistoryPage")
);

// const About = lazy(() => import("../pages/AboutPage"));
// const TodoIndex = lazy(() => import("../pages/todo/IndexPage"));
// const TodoList = lazy(() => import("../pages/todo/ListPage"));
// const ProductsRouter = lazy(() => import("../pages/products/IndexPage"));

const root = createBrowserRouter([
  {
    path: "/",
    element: (
      <Suspense fallback={Loading}>
        <Main />
      </Suspense>
    ),
  },

  {
    path: "member",
    children: [
      ...memberRouter(),
      {
        path: "contract-history",
        element: (
          <Suspense fallback={Loading}>
            <ContractHistoryPage />
          </Suspense>
        ),
      },
    ],
  },
  {
    path: "wallet",
    children: walletRouter(),
  },
  {
    path: "debt",
    children: debtRouter(),
  },
  {
    path: "post", // loanPostRouter의 경로 설정
    children: loanPostRouter(),
  },
  {
    path: "qna",
    children: QnaRouter(),
  },
  {
    path: "contract/:contractId", // ✅ 계약서 페이지 라우트 추가
    element: (
      <Suspense fallback={Loading}>
        <ContractPage />
      </Suspense>
    ),
  },
  {
    path: "search",
    children: searchRouter(),
  },
  {
    path: "user-guide",
    element: (
      <Suspense fallback={Loading}>
        <UserGuide />
      </Suspense>
    ),
  },

  {
    path: "chat",
    children: chatRouter(),
  },
]);

export default root;
