/**
 * PageComponent: 페이지네이션 UI를 렌더링하는 컴포넌트.
 *
 * @param {Object} serverData - 서버에서 가져온 페이지네이션 데이터.
 * @param {Function} movePage - 페이지 이동을 처리하는 함수.
 * @returns {JSX.Element} - 페이지네이션 UI를 포함하는 JSX 요소.
 */
const PageComponent = ({ serverData, movePage }) => {
  return (
    <div className="m-6 flex justify-center">
      {/* 페이지네이션 컨테이너: Tailwind CSS로 스타일 지정 */}

      {/* 이전 페이지 버튼 */}
      {serverData.prev ? (
        <div
          className="m-2 p-2 w-16 text-center  font-bold text-blue-400"
          // Tailwind CSS 스타일: 마진, 패딩, 텍스트 정렬, 파란색 텍스트, 굵은 글씨체.
          onClick={() => movePage({ page: serverData.prevPage })}
          // 이전 페이지로 이동: movePage 호출 시 이전 페이지 번호(prevPage)를 전달.
        >
          Prev {/* 버튼 텍스트 */}
        </div>
      ) : (
        <></> // 이전 페이지가 없을 경우 아무 것도 렌더링하지 않음.
      )}

      {/* 페이지 번호 버튼들 */}
      {serverData.pageNumList.map((pageNum) => (
        <div
          key={pageNum} // 각 페이지 번호의 고유 키로 pageNum을 사용.
          className={`m-2 p-2 w-12 text-center rounded shadow-md text-white ${
            serverData.current === pageNum ? "bg-gray-500" : "bg-blue-400"
          }`}
          // Tailwind CSS 스타일:
          // - 마진, 패딩, 텍스트 정렬, 둥근 모서리, 그림자 효과, 흰색 텍스트.
          // - 현재 페이지와 일치하면 배경색을 회색(bg-gray-500)으로, 그렇지 않으면 파란색(bg-blue-400)으로 설정.
          onClick={() => movePage({ page: pageNum })}
          // 특정 페이지로 이동: movePage 호출 시 해당 페이지 번호(pageNum)를 전달.
        >
          {pageNum} {/* 버튼에 표시할 페이지 번호 */}
        </div>
      ))}

      {/* 다음 페이지 버튼 */}
      {serverData.next ? (
        <div
          className="m-2 p-2 w-16 text-center font-bold text-blue-400"
          // Tailwind CSS 스타일: 마진, 패딩, 텍스트 정렬, 파란색 텍스트, 굵은 글씨체.
          onClick={() => movePage({ page: serverData.nextPage })}
          // 다음 페이지로 이동: movePage 호출 시 다음 페이지 번호(nextPage)를 전달.
        >
          Next {/* 버튼 텍스트 */}
        </div>
      ) : (
        <></> // 다음 페이지가 없을 경우 아무 것도 렌더링하지 않음.
      )}
    </div>
  );
};

export default PageComponent;
// PageComponent를 다른 파일에서 사용할 수 있도록 내보냅니다.
