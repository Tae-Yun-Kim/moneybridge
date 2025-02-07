import { Suspense, lazy } from "react";
import { createBrowserRouter } from "react-router-dom";
// import todoRouter from "./todoRouter";
// import productsRouter from "./productsRouter";
import memberRouter from "./memberRouter";
import walletRouter from "./walletRouter";
import debtRouter from "./debtRouter";
import loanPostRouter from "./postRouter"

const Loading = <div>Loading....</div>;
const Main = lazy(() => import("../pages/MainPage"));
const ContractPage = lazy(() => import("../pages/post/ContractPage")); // ✅ ContractPage 추가
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
  //   {
  //     path: "/about",
  //     element: (
  //       <Suspense fallback={Loading}>
  //         <About />
  //       </Suspense>
  //     ),
  //   },
  //   {
  //     path: "/todo",
  //     element: (
  //       <Suspense fallback={Loading}>
  //         <TodoIndex />
  //       </Suspense>
  //     ),
  //     children: todoRouter(),
  //   },
  //   {
  //     path: "products",
  //     element: (
  //       <Suspense fallback={Loading}>
  //         <ProductsRouter />
  //       </Suspense>
  //     ),
  //     children: productsRouter(),
  //   },
  {
    path: "member",
    children: memberRouter(),
  },
  {
    path: "post", // loanPostRouter의 경로 설정
    children: loanPostRouter(),
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
    path: "contract/:contractId",
    element: (
      <Suspense fallback={Loading}>
        <ContractPage />
      </Suspense>
    ),
  },
]);

export default root;
