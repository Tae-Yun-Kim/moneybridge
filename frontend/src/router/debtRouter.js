import { Suspense, lazy } from "react";

const Loading = <div>Loading....</div>;

const DebtIndex = lazy(() => import("../pages/debt/IndexPage"));
const DebtListPage = lazy(() => import("../pages/debt/ListPage"));
const CreateDebtPage = lazy(() => import("../pages/debt/CreatePage"));
const UpdateDebtPage = lazy(() => import("../pages/debt/UpdatePage"));

const debtRouter = () => {
  return [
    {
      path: "",
      element: (
        <Suspense fallback={Loading}>
          <DebtIndex />
        </Suspense>
      ),
      children: [
        {
          path: "list",
          element: (
            <Suspense fallback={Loading}>
              <DebtListPage />
            </Suspense>
          ),
        },
        {
          path: "create",
          element: (
            <Suspense fallback={Loading}>
              <CreateDebtPage />
            </Suspense>
          ),
        },
        {
          path: "update/:debtId",
          element: (
            <Suspense fallback={Loading}>
              <UpdateDebtPage />
            </Suspense>
          ),
        },
      ],
    },
  ];
};

export default debtRouter;
