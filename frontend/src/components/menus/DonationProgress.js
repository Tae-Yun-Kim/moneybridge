import React, { useEffect, useState } from "react";
import { getMonthlyDonationStatsWithProfit } from "../../api/donationApi";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid,
  LabelList,
} from "recharts";
import "./DonationProgress.css";

const DonationProgress = () => {
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [months, setMonths] = useState("");

  // 🔹 서버에서 최근 3개월 기부금 데이터 가져오기
  useEffect(() => {
    const fetchDonationData = async () => {
      setLoading(true);
      try {
        const data = await getMonthlyDonationStatsWithProfit();

        // 🔹 최근 3개월 데이터만 추출
        const recentThreeMonths = data.filter((item) =>
          ["12", "01", "02"].includes(item.month.slice(-2))
        );

        // 🔹 월을 '12월', '01월', '02월' 형태로 변환
        const formattedData = recentThreeMonths
          .map((item) => ({
            ...item,
            month: item.month.slice(-2) + "월",
          }))
          .sort((a, b) => {
            const order = { "12월": 0, "01월": 1, "02월": 2 }; // 정렬 기준 설정
            return order[a.month] - order[b.month];
          });

        setChartData(formattedData);

        // 🔹 최근 3개월의 월 표시
        const monthList = formattedData.map((item) => item.month).join(", ");
        setMonths(monthList);
      } catch (error) {
        console.error("🚨 기부금 데이터 불러오기 실패:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDonationData();
  }, []);

  return (
    <div className="donation-chart-container">
      <h3>❤️📆 최근 3개월 기부 현황</h3>
      {loading ? (
        <p>🔄 기부 데이터 불러오는 중...</p>
      ) : chartData.length > 0 ? (
        <>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart
              data={chartData}
              margin={{ top: 20, right: 30, left: 30, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              {/* 🔹 X축 왼쪽부터 12월 → 1월 → 2월 순서로 표시 */}
              <XAxis
                dataKey="month"
                tick={{ fontSize: 14 }}
                padding={{ left: 45, right: 45 }}
              />
              <YAxis
                tickFormatter={(value) => `${value / 10000}만원`}
                domain={[0, "auto"]}
                tickCount={11}
                interval={0}
                tick={{ fontSize: 14 }}
                tickMargin={20}
              />
              <Tooltip formatter={(value) => `${value.toLocaleString()}원`} />
              <Legend />

              {/* 🔹 Line + Label 표시 */}
              <Line
                type="monotone"
                dataKey="totalDonation"
                stroke="#82ca9d"
                strokeWidth={3}
                dot={{ r: 5 }}
              >
                <LabelList
                  dataKey="totalDonation"
                  position="top"
                  formatter={(value) => `${value.toLocaleString()}원`}
                />
              </Line>
            </LineChart>
          </ResponsiveContainer>
        </>
      ) : (
        <p>📊 기부 데이터가 없습니다.</p>
      )}
    </div>
  );
};

export default DonationProgress;
