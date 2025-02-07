import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const BasicMenu = () => {
  const loginState = useSelector((state) => state.loginSlice); // 로그인 상태 가져오기

  return (
    <nav id="navbar" className="flex bg-blue-300">
      <div className="w-4/5 bg-gray-500">
        <ul className="flex p-4 text-white font-bold">
          <li className="pr-6 text-2xl">
            <Link to={"/"}>Main</Link>
          </li>
          <li className="pr-6 text-2xl">
            <Link to={"/about"}>About</Link>
          </li>
          <li className="pr-6 text-2xl">
            <Link to={"/post/list"}>Post</Link> {/* ✅ 로그인 없이도 표시 */}
          </li>
          {loginState.id && ( // 로그인한 사용자만 볼 수 있는 메뉴
            <>
              <li className="pr-6 text-2xl">
                <Link to={"/post/add"}>Post Add</Link>{" "}
                {/* ✅ 추가된 Post Add 링크 */}
              </li>
              <li className="pr-6 text-2xl">
                <Link to={"/todo/"}>Todo</Link>
              </li>
              <li className="pr-6 text-2xl">
                <Link to={"/products/"}>Products</Link>
              </li>
              <li className="pr-6 text-2xl">
                <Link to={"/mypage"}>My Page</Link>
              </li>
            </>
          )}
        </ul>
      </div>

      <div className="w-1/5 flex justify-end bg-orange-300 p-4 font-medium">
        {!loginState.id ? (
          <div className="text-white text-sm m-1 rounded">
            <Link to={"/member/login"}>Login</Link>
          </div>
        ) : (
          <div className="text-white text-sm m-1 rounded">
            <Link to={"/member/logout"}>Logout</Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default BasicMenu;
