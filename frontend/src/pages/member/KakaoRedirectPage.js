import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { getAccessToken, getMemberWithAccessToken } from "../../api/kakaoApi";
import { useDispatch } from "react-redux";
import { login } from "../../slices/loginSlice";
import useCustomLogin from "../../hooks/useCustomLogin";

const KakaoRedirectPage = () => {
  const [searchParams] = useSearchParams();

  const { moveToPath } = useCustomLogin();

  const dispatch = useDispatch();

  console.log("Current URL:", window.location.href);

  // 인가코드 받기위한 변수
  const authCode = searchParams.get("code");

  console.log("Authorization Code:", authCode); // authCode 값 확인

  useEffect(() => {
    if (!authCode) {
      //   console.error("Authorization Code is missing!");
      moveToPath("/member/login");
      return;
    }

    getAccessToken(authCode)
      .then((accessToken) => {
        console.log("Access Token:", accessToken);

        // back에서 사용자 정보를 받아와서 memberInfo로 전달.
        return getMemberWithAccessToken(accessToken);
      })
      .then((memberInfo) => {
        console.log("------------------");
        console.log(memberInfo);

        dispatch(login(memberInfo));

        // 비어있는 값이 있으면 추가 정보 입력 페이지로 이동
        if (
          !memberInfo.address ||
          !memberInfo.accountNumber ||
          !memberInfo.residentNumber
        ) {
          moveToPath("/member/social-info-completion");
        } else {
          moveToPath("/");
        }
      })
      .catch((error) => {
        console.error("카카오 소셜 로그인 중 오류 발생:", error);
        alert("소셜 로그인 중 문제가 발생했습니다. 다시 시도해주세요.");
        moveToPath("/member/login");
      });
  }, [authCode]);

  return (
    <div>
      <div>Kakao Login Redirect</div>
      <div>{authCode}</div>
    </div>
  );
};

export default KakaoRedirectPage;
