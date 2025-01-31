import { Suspense, lazy } from "react";
import SignupPage from "../pages/member/SignupPage";
import SocialInfoCompletionPage from "../pages/member/SocialInfoCompletionPage";
import AccountPage from "../pages/member/AccountPage";
import MyPage from "../pages/member/MyPage";
import AdminPage from "../pages/AdminPage";

const Loading = <div>Loading....</div>;
const LoginPage = lazy(() => import("../pages/member/LoginPage"));
const LogoutPage = lazy(() => import("../pages/member/LogoutPage"));
const KakaoRedirect = lazy(() => import("../pages/member/KakaoRedirectPage"));
const UpdateModify = lazy(() => import("../pages/member/UpdatePage"));
const DeletePage = lazy(() => import("../pages/member/DeletePage"));

const LenderPage = lazy(() => import("../pages/lender/LenderPage"));
const AdminLenderApproval = lazy(() => import("../pages/AdminPage"));

const memberRouter = () => {
  return [
    {
      path: "login",
      element: (
        <Suspense fallback={Loading}>
          <LoginPage />
        </Suspense>
      ),
    },
    {
      path: "logout",
      element: (
        <Suspense fallback={Loading}>
          <LogoutPage />
        </Suspense>
      ),
    },
    {
      path: "kakao",
      element: (
        <Suspense fallback={Loading}>
          <KakaoRedirect />
        </Suspense>
      ),
    },

    {
      path: "update",
      element: (
        <Suspense fallback={Loading}>
          <UpdateModify />
        </Suspense>
      ),
    },

    {
      path: "signup",
      element: (
        <Suspense fallback={Loading}>
          <SignupPage />
        </Suspense>
      ),
    },

    {
      path: "social-info-completion", // 새 경로 추가
      element: (
        <Suspense fallback={Loading}>
          <SocialInfoCompletionPage />
        </Suspense>
      ),
    },

    {
      path: "delete", // 새 경로 추가
      element: (
        <Suspense fallback={Loading}>
          <DeletePage />
        </Suspense>
      ),
    },

    {
      path: "account",
      element: (
        <Suspense fallback={Loading}>
          <AccountPage />
        </Suspense>
      ),
    },

    {
      path: "mypage",
      element: (
        <Suspense fallback={Loading}>
          <MyPage />
        </Suspense>
      ),
    },

    {
      path: "lender",
      element: (
        <Suspense fallback={Loading}>
          <LenderPage />
        </Suspense>
      ),
    },

    {
      path: "admin",
      element: (
        <Suspense fallback={Loading}>
          <AdminPage />
        </Suspense>
      ),
    },
  ];
};

export default memberRouter;
