import React, { useEffect, useState } from "react";
import PendingRequestListComponent from "../components/lender/PendingRequestListComponent";
import { getPendingLenderRequests } from "../api/lenderApi";
import { useNavigate } from "react-router-dom";
import BasicMenu from "../components/menus/BasicMenu";

const AdminPage = () => {
  const [pendingRequests, setPendingRequests] = useState([]);
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

  return (
    <div>
      <BasicMenu />
      <div>
        <h1>채권자 신청 관리</h1>
        <PendingRequestListComponent
          pendingRequests={pendingRequests}
          setPendingRequests={setPendingRequests}
        />
      </div>
    </div>
  );
};

export default AdminPage;
