import { useState } from "react";
// React의 상태 관리(useState)를 가져옵니다.

import {
  createSearchParams, // 객체를 쿼리 문자열로 변환하는 유틸리티 함수.
  useNavigate, // 페이지 이동을 처리하는 React Router 훅.
  useSearchParams, // 현재 URL의 쿼리 문자열을 읽거나 설정하는 훅.
} from "react-router-dom";

/**
 * 유틸리티 함수: 쿼리 파라미터 값을 정수로 변환하거나 기본값을 반환.
 *
 * @param {string | null} param - 쿼리 문자열에서 가져온 값.
 * @param {number} defaultValue - 값이 없을 때 사용할 기본값.
 * @returns {number} - 정수로 변환된 값 또는 기본값.
 */
const getNum = (param, defaultValue) => {
  if (!param) {
    // 쿼리 문자열에 값이 없으면 기본값을 반환.
    return defaultValue;
  }

  // 값이 있으면 문자열을 정수로 변환하여 반환.
  return parseInt(param);
};

/**
 * useCustomMove: 페이지 이동과 URL 쿼리 파라미터 관리를 처리하는 커스텀 훅.
 * @returns {Object} - 페이지 이동 함수와 현재 URL의 쿼리 파라미터를 반환.
 */
const useCustomMove = () => {
  const navigate = useNavigate(); // React Router의 navigate 함수를 가져옵니다.

  const [refresh, setRefresh] = useState(false);
  // 페이지 이동 후 강제 리렌더링을 위한 상태. true/false를 토글하여 리렌더링을 유도.

  const [queryParams] = useSearchParams(); // 현재 URL의 쿼리 문자열을 읽어옵니다.

  // 현재 URL에서 "page"와 "size" 쿼리 파라미터 값을 가져오고 기본값(1, 10)을 설정.
  const page = getNum(queryParams.get("page"), 1);
  const size = getNum(queryParams.get("size"), 10);

  // 기본 쿼리 문자열 생성. 현재 page와 size를 기준으로 생성됩니다.
  const queryDefault = createSearchParams({ page, size }).toString();

  /**
   * moveToList: 페이지 이동 함수.
   *
   * @param {Object} [pageParam] - 페이지 번호와 크기를 포함하는 객체.
   * @param {number} [pageParam.page] - 이동할 페이지 번호. 기본값: 1.
   * @param {number} [pageParam.size] - 이동할 페이지 크기. 기본값: 10.
   */
  const moveToList = (pageParam) => {
    let queryStr = ""; // 최종적으로 URL에 추가될 쿼리 문자열.

    if (pageParam) {
      // pageParam이 제공된 경우:
      // pageParam에서 "page"와 "size"를 읽어 정수로 변환.
      const pageNum = getNum(pageParam.page, 1);
      const sizeNum = getNum(pageParam.size, 10);

      // 제공된 값으로 쿼리 문자열을 생성.
      queryStr = createSearchParams({
        page: pageNum,
        size: sizeNum,
      }).toString();
    } else {
      // pageParam이 제공되지 않은 경우: 기본 쿼리 문자열 사용.
      queryStr = queryDefault;
    }

    // 경로 이동: "../list"로 이동하며, 생성된 쿼리 문자열을 search에 추가.
    navigate({
      pathname: `../list`,
      search: queryStr,
    });

    setRefresh(!refresh); // refresh 상태를 반전시켜 강제 리렌더링.
  };

  /**
   * moveToModify: 수정 페이지로 이동하는 함수.
   *
   * @param {number} num - 수정할 Todo 항목의 고유 번호.
   */
  const moveToModify = (num) => {
    console.log(queryDefault); // 디버깅 목적으로 기본 쿼리 문자열 출력.

    navigate({
      pathname: `../modify/${num}`, // 수정 경로 설정.
      search: queryDefault, // 기존 쿼리 문자열을 유지.
    });
  };

  /**
   * moveToRead: 상세 페이지로 이동하는 함수.
   *
   * @param {number} num - 읽을 Todo 항목의 고유 번호.
   */
  const moveToRead = (num) => {
    console.log(queryDefault); // 디버깅 목적으로 기본 쿼리 문자열 출력.

    navigate({
      pathname: `../read/${num}`, // 상세 경로 설정.
      search: queryDefault, // 기존 쿼리 문자열을 유지.
    });
  };

  const moveToPost = (num) => {
    console.log(queryDefault); // 디버깅 목적으로 기본 쿼리 문자열 출력.

    navigate({
      pathname: `../community/read/${num}`, // 상세 경로 설정.
      search: queryDefault, // 기존 쿼리 문자열을 유지.
    });
  };
  
  const moveToPostList = (pageParam) => {
    // pageParam을 받는 방식으로 수정. pageParam은 page와 size를 포함해야 함
    let queryStr = ""; // 쿼리 문자열을 생성할 변수
  
    // pageParam이 전달되면, 페이지 번호와 사이즈를 처리
    if (pageParam) {
      const pageNum = getNum(pageParam.page, 1); // page 값 확인
      const sizeNum = getNum(pageParam.size, 10); // size 값 확인
  
      queryStr = createSearchParams({
        page: pageNum, // 쿼리 파라미터로 페이지 번호
        size: sizeNum, // 쿼리 파라미터로 페이지 사이즈
      }).toString(); // 쿼리 문자열로 변환
    }
  
    // /mypage/posts로 이동하면서 쿼리 문자열을 전달
    navigate({
      pathname: `/mypage/posts`, // 마이페이지의 내가 쓴 글 목록 페이지
      search: queryStr, // 생성한 쿼리 파라미터를 URL에 포함
    });
  };
  
  // 필요한 다른 이동 함수들도 여기에 추가할 수 있습니다.

  // 페이지 이동 함수들과 현재 쿼리 파라미터, refresh 상태를 반환.
  return { moveToRead, moveToModify, moveToList, moveToPost, moveToPostList, page, size, refresh };
};

export default useCustomMove;
// useCustomMove 훅을 다른 파일에서 사용할 수 있도록 내보냅니다.
