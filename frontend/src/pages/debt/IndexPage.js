import React from 'react';
import { Outlet } from 'react-router-dom';

const IndexPage = () => {
  return (
    <div className="debt-container">
      <h1>부채 관리</h1>
      <Outlet />
    </div>
  );
};

export default IndexPage;