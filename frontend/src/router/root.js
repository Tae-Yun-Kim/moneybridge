import { Suspense, lazy } from "react";
import { createBrowserRouter } from "react-router-dom";
// import todoRouter from "./todoRouter";
// import productsRouter from "./productsRouter";
import memberRouter from "./memberRouter";
import walletRouter from "./walletRouter";

const Loading = <div>Loading....</div>;
const Main = lazy(() => import("../pages/MainPage"));
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
    path: "wallet",
    children: walletRouter(),
  },
]);

export default root;
