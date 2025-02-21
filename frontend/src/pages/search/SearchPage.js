import React from "react";
import ListComponent from "../../components/post/ListComponent";
import BasicLayout from "../../layouts/BasicLayout";

const SearchPage = () => {
  return (
    <BasicLayout>
      <div className="main-content bg-white rounded-lg shadow-lg p-6">
        <h1 className="search-results-title">검색 결과 창</h1>
        <ListComponent />
      </div>
    </BasicLayout>
  );
};

export default SearchPage;
