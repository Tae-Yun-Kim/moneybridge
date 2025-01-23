import { Suspense, lazy } from "react";

const Loading = <div>Loading....</div>;

const CreateWalletPage = lazy(() => import("../pages/wallet/CreateWalletPage"));
const GetWalletPage = lazy(() => import("../pages/wallet/GetWalletPage"));
const UpdateBalancePage = lazy(() =>
  import("../pages/wallet/UpdateBalancePage")
);
const TransferPage = lazy(() => import("../pages/wallet/TransferPage"));
const UpdatePinPage = lazy(() => import("../pages/wallet/UpdatePinPage"));
const LockWalletPage = lazy(() => import("../pages/wallet/LockWalletPage"));
const IncrementTransactionPage = lazy(() =>
  import("../pages/wallet/IncrementTransactionPage")
);
const WalletTransferPage = lazy(() =>
  import("../pages/wallet/WalletTransferPage")
);

const walletRouter = () => {
  return [
    {
      path: "create",
      element: (
        <Suspense fallback={Loading}>
          <CreateWalletPage />
        </Suspense>
      ),
    },
    {
      path: "get",
      element: (
        <Suspense fallback={Loading}>
          <GetWalletPage />
        </Suspense>
      ),
    },
    {
      path: "update-balance",
      element: (
        <Suspense fallback={Loading}>
          <UpdateBalancePage />
        </Suspense>
      ),
    },
    {
      path: "increment-transaction",
      element: (
        <Suspense fallback={Loading}>
          <IncrementTransactionPage />
        </Suspense>
      ),
    },
    {
      path: "transfer",
      element: (
        <Suspense fallback={Loading}>
          <TransferPage />
        </Suspense>
      ),
    },
    {
      path: "update-pin",
      element: (
        <Suspense fallback={Loading}>
          <UpdatePinPage />
        </Suspense>
      ),
    },
    {
      path: "lock-wallet",
      element: (
        <Suspense fallback={Loading}>
          <LockWalletPage />
        </Suspense>
      ),
    },
    {
      path: "wallet-transfer",
      element: (
        <Suspense fallback={Loading}>
          <WalletTransferPage />
        </Suspense>
      ),
    },
  ];
};

export default walletRouter;
