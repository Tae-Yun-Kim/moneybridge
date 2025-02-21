import React, { useEffect, useState } from "react";
import PendingRequestListComponent from "../components/lender/PendingRequestListComponent";
import { getPendingLenderRequests } from "../api/lenderApi";
import { useNavigate } from "react-router-dom";
import "./AdminPage.css";
import BasicLayout from "../layouts/BasicLayout";
import { getMonthlyDonationStatsWithProfit } from "../api/donationApi";

const AdminPage = () => {
  const [pendingRequests, setPendingRequests] = useState([]);
  const [donationStats, setDonationStats] = useState([]); // ✅ 전체 데이터를 저장
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // 사용자 권한 확인
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("member"));

    if (!user || user.role !== "ROLE_ADMIN") {
      alert("관리자 권한이 필요합니다.");
      navigate("/"); // 권한이 없는 경우 홈 페이지로 리디렉션
    }
  }, [navigate]);

  useEffect(() => {
    const fetchPendingRequests = async () => {
      try {
        const response = await getPendingLenderRequests();
        console.log("API 응답 데이터:", response);
        if (Array.isArray(response)) {
          setPendingRequests(response);
        } else {
          console.error("API에서 반환된 데이터가 배열이 아닙니다:", response);
          setPendingRequests([]);
        }
      } catch (error) {
        console.error("API 호출 중 오류 발생:", error);
        setPendingRequests([]); // 에러 발생 시 빈 배열로 설정
      }
    };

    fetchPendingRequests();
  }, []);

  // 💙 모든 월별 기부 및 관리자 수익 데이터 가져오기
  useEffect(() => {
    const fetchDonationStats = async () => {
      setLoading(true);
      try {
        const data = await getMonthlyDonationStatsWithProfit(); // ✅ API에서 모든 데이터를 가져오도록 수정
        setDonationStats(data); // ✅ 필터링 없이 그대로 저장
      } catch (error) {
        console.error("💥 기부 및 관리자 수익 현황 조회 실패:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDonationStats();
  }, []);

  return (
    <div className="admin-page">
      <BasicLayout>
        <div className="admin-content">
          <h1 className="admin-title">📌 채권자 신청 관리</h1>
          <PendingRequestListComponent
            pendingRequests={pendingRequests}
            setPendingRequests={setPendingRequests}
          />

          {/* 📊 모든 월별 기부 및 관리자 수익 현황 표시 */}
          <div className="donation-stats">
            <h2>💸 전체 월별 기부 및 관리자 수익 현황</h2>
            {loading ? (
              <p>🔄 데이터를 불러오는 중입니다...</p>
            ) : donationStats.length > 0 ? (
              <table
                className="donation-table"
                border="1"
                cellPadding="5"
                cellSpacing="0"
              >
                <thead>
                  <tr>
                    <th>📆 월</th>
                    <th>💙 총 기부금(₩)</th>
                    <th>💼 관리자 수익(₩)</th>
                  </tr>
                </thead>
                <tbody>
                  {donationStats.map((stat, index) => (
                    <tr key={index}>
                      <td>{stat.month}</td>
                      <td>{stat.totalDonation.toLocaleString()}원</td>
                      <td>{stat.totalAdminProfit.toLocaleString()}원</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>📊 기부 및 관리자 수익 데이터가 없습니다.</p>
            )}
          </div>
        </div>
      </BasicLayout>
    </div>
  );
};

export default AdminPage;
