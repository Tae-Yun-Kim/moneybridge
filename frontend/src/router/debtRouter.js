import { Suspense, lazy } from "react";

const Loading = <div>Loading....</div>;

const DebtIndex = lazy(() => import("../pages/debt/IndexPage"));

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
        // {
        //   path: "list",
        //   element: (
        //     <Suspense fallback={Loading}>
        //       <DebtListPage />
        //     </Suspense>
        //   ),
        // },
      ],
    },
  ];
};

export default debtRouter;
