import { Suspense, lazy } from "react";

const SearchPage = lazy(() => import("../pages/search/SearchPage"));

const Loading = <div>Loading....</div>;

const searchRouter = () => [
  {
    path: "",
    element: (
      <Suspense fallback={Loading}>
        <SearchPage />
      </Suspense>
    ),
  },
];

export default searchRouter;
