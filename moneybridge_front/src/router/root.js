import { Suspense, lazy } from "react";
import { createBrowserRouter } from "react-router-dom";
import memberRouter from "./memberRouter";
import walletRouter from "./walletRouter";
import loanPostRouter from "./postRouter";

const Loading = <div>Loading....</div>;
const Main = lazy(() => import("../pages/MainPage"));
const MyPage = lazy(() => import("../pages/MyPage")); // ✅ MyPage 추가
const ContractPage = lazy(() => import("../pages/post/ContractPage")); // ✅ ContractPage 추가

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
    children: memberRouter(),
  },
  {
    path: "wallet",
    children: walletRouter(),
  },
  {
    path: "post",
    children: loanPostRouter(),
  },
  {
    path: "mypage", // ✅ MyPage 추가
    element: (
      <Suspense fallback={Loading}>
        <MyPage />
      </Suspense>
    ),
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
