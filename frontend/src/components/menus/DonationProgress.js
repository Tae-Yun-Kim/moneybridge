// components/DonationProgress.js
import React from "react";
import "./DonationProgress.css"; // 스타일 별도로 관리
import "./BasicMenu.css";

const DonationProgress = ({ donation = 70, goal = 100 }) => {
  // 기부 진행률 계산
  const progress = Math.min((donation / goal) * 100, 100); // 최대 100% 제한

  return (
    <div className="donation">
      <h3>월간기부현황</h3>
      <div>
        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <p>
          {donation}원 / {goal}원
        </p>
      </div>
    </div>
  );
};

export default DonationProgress;
