import React from "react";
import BasicMenu from "../../components/menus/BasicMenu";
import TransferComponent from "../../components/wallet/TransferComponent";

const TransferPage = () => {
  return (
    <div className="fixed top-0 left-0 z-[1055] flex flex-col h-full w-full">
      <BasicMenu />

      <div className="w-full flex flex-wrap h-full justify-center items-center border-2">
        <TransferComponent />
      </div>
    </div>
  );
};

export default TransferPage;
