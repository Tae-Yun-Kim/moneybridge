import BasicMenu from "../components/menus/BasicMenu";
import Rightsidemenu from "../components/menus/Rightsidemenu";
import Leftsidemenu from "../components/menus/Leftsidemenu";
import Footerbar from "../components/menus/Footerbar";
import "./BasicLayout.css"; // CSS 파일 import

// 메인화면 출력
const BasicLayout = ({ children }) => {
  return (
    <>
      <BasicMenu />
      <div>
        <div className="layout-container-l">
          {/* Left Sidebar */}
          <div className="sidebar left-sidebar">
            <Leftsidemenu />
          </div>

          {/* Main Content */}
          <main className="main-content">{children}</main>

          {/* Right Sidebar */}
          <div className="sidebar right-sidebar">
            <Rightsidemenu />
          </div>
        </div>

        <Footerbar />
      </div>
    </>
  );
};

export default BasicLayout;
