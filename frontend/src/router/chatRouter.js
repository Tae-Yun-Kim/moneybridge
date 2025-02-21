import { Suspense, lazy } from "react";

// 페이지 컴포넌트 lazy import
const ChatPage = lazy(() => import("../pages/chat/ChatPage"));

const Loading = <div>Loading....</div>;

const chatRouter = () => {
  return [
    {
      path: "messages", // 채팅 메시지 페이지
      element: (
        <Suspense fallback={Loading}>
          <ChatPage />
        </Suspense>
      ),
    },
  ];
};

export default chatRouter;
