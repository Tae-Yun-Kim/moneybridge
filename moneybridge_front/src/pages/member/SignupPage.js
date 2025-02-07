import React from "react";
import SignupComponent from "../../components/member/SignupComponent";
import BasicMenu from "../../components/menus/BasicMenu";

const SignupPage = () => {
  return (
    <div className="fixed top-0 left-0 z-[1055] flex flex-col h-full w-full">
      <BasicMenu />

      <div className="w-full flex flex-wrap  h-full justify-center  items-center border-2">
        <SignupComponent></SignupComponent>
      </div>
    </div>
  );
};

export default SignupPage;
