import axios from "axios";
import { useEffect, useState } from "react";
import "./TopMembersList.css"; // CSS 파일 연결

const TopMembersList = () => {
  const [members, setMembers] = useState([]);

  // 백엔드에서 상위 10명 데이터를 가져오기
  useEffect(() => {
    axios
      .get("http://localhost:8080/api/member/top-members")
      .then((response) => {
        const topMembers = response.data.slice(0, 10);
        setMembers(topMembers);
      })
      .catch((error) => {
        console.error("Error fetching top members:", error);
      });
  }, []);

  return (
    <div className="top-members-container">
      <ul className="member-list">
        {members.map((member, index) => (
          <li key={member.id} className="member-item">
            <span className="rank">{index + 1}.</span>
            <span className="name">{member.name}</span>
            <span className="transaction-count">
              ({member.transactionCount}건)
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TopMembersList;
