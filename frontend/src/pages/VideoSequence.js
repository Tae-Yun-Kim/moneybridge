import React, { useState } from "react";
import YouTube from "react-youtube";

const VideoSequence = () => {
  const [currentVideo, setCurrentVideo] = useState(0);

  // 재생할 유튜브 영상 리스트 (순서대로 재생)
  const videoList = ["mzccer0uF7M", "fAbHEnOGrfs"]; // 여기에 원하는 유튜브 영상 ID 추가

  // 유튜브 플레이어 옵션 설정
  const opts = {
    height: "315",
    width: "560",
    playerVars: {
      autoplay: 1, // 자동 재생
      controls: 1, // 컨트롤러 보이기
      mute: 1, // 음소거 상태로 재생
      modestbranding: 1, // 유튜브 로고 숨김
      rel: 0, // 관련 동영상 비활성화
      iv_load_policy: 3, // 인포그래픽(주석) 비활성화
    },
  };

  // 영상 종료 시 다음 영상으로 전환
  const handleVideoEnd = () => {
    // 다음 영상으로 전환하고 마지막 영상이면 첫 번째 영상으로 돌아감
    setCurrentVideo((prevVideo) => (prevVideo + 1) % videoList.length);
  };

  return (
    <div className="youtube-container">
      <YouTube
        videoId={videoList[currentVideo]} // 현재 재생 중인 영상 ID
        opts={opts}
        onEnd={handleVideoEnd} // 영상 종료 시 이벤트 트리거
      />
    </div>
  );
};

export default VideoSequence;
