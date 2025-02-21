import React, { useEffect, useState } from "react";
import axios from "axios";
import "./InterestRateChart.css";

const InterestRateChart = () => {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    axios
      .get("http://localhost:7000/chart")
      .then((response) => {
        if (response.data.image) {
          setChartData(response.data.image);
        }
      })
      .catch((error) => console.error("이자율 차트 불러오기 실패:", error));
  }, []);

  return (
    <div className="interest-rate">
      <h3>최근 4일간 채택된 이자율</h3>
      {chartData ? (
        <img src={`data:image/png;base64,${chartData}`} alt="이자율 차트" />
      ) : (
        <p>차트 로딩 중...</p>
      )}
    </div>
  );
};

export default InterestRateChart;
