// FetchingModal.js로딩 표시 전용 컴포넌트

// FetchingModal 컴포넌트 정의
// 이 컴포넌트는 화면 중앙에 "Loading..." 텍스트를 표시하는 모달을 렌더링합니다.
const FetchingModal = () => {
  return (
    // 모달 배경 설정: 화면 전체를 덮는 투명한 검은 배경
    <div
      className={`fixed top-0 left-0 z-[1055] flex h-full w-full  place-items-center justify-center bg-black bg-opacity-20`}
    >
      {/* 모달 컨테이너 */}
      <div className="bg-white rounded-3xl opacity-100 min-w-min h-1/4  min-w-[600px] flex justify-center items-center ">
        {/* 로딩 텍스트 */}
        <div className="text-4xl font-extrabold text-orange-400 m-20">
          Loading.....
        </div>
      </div>
    </div>
  );
};

// FetchingModal 컴포넌트를 내보냅니다.
export default FetchingModal;
