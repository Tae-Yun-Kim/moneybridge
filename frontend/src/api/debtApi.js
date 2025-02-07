import axios from 'axios';

export const API_SERVER_HOST = "http://localhost:8080";

const host = `${API_SERVER_HOST}/api/debt`;

export const debtApi = {
  // 부채 생성
  createDebt: async (debtData) => {
    const token = localStorage.getItem('accessToken'); // 로컬 스토리지에서 토큰 가져오기
    console.log('보내는 부채 데이터:', debtData);
    if (!token) {
      throw new Error("토큰이 없습니다. 로그인 후 다시 시도해주세요.");
    }

    const response = await axios.post(`${host}/register`, debtData, {
      headers: {
        Authorization: `Bearer ${token}`, 
        'Content-Type': 'application/json' 
      }
    });
    console.log('API Response:', response);  // 전체 응답 로그 확인
    return response.data;
  },


// memberId로(백단에서) 모든 부채 조회
getAllDebts: async () => {
  const token = localStorage.getItem('accessToken'); // 로컬 스토리지에서 토큰 가져오기
  if (!token) {
    throw new Error("토큰이 없습니다. 로그인 후 다시 시도해주세요.");
  }

  try {
    const response = await axios.get(`${host}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    // console.log('API Response:', response); // 응답을 콘솔에 찍어 확인
    return response.data;  // 부채 목록을 반환
  } catch (error) {
    console.error('API Error:', error); // 오류가 있을 경우 콘솔에 오류 찍기
    throw error; // 에러를 던져서 액션에서 처리
  }
},

  // ID로 대출 부채 조회
  // getDebtById: async (debtId) => {
  //   const token = localStorage.getItem('accessToken'); // 로컬 스토리지에서 토큰 가져오기
  //   if (!token) {
  //     throw new Error("토큰이 없습니다. 로그인 후 다시 시도해주세요.");
  //   }

  //   const response = await axios.get(`${host}/${debtId}`, {
  //     headers: {
  //       Authorization: `Bearer ${token}`, 
  //       'Content-Type': 'application/json' 
  //     }
  //   });
  //   return response.data;
  // },

    // 상환 상태 업데이트
    updateRepaymentStatus: async (debtId, status) => {
      const token = localStorage.getItem('accessToken'); // 로컬 스토리지에서 토큰 가져오기
      if (!token) {
        throw new Error("토큰이 없습니다. 로그인 후 다시 시도해주세요.");
      }
  
      const response = await axios.patch(`${host}/${debtId}`, {}, {
        headers: {
          Authorization: `Bearer ${token}`, 
          'Content-Type': 'application/json' 
        }
      });
      return response.data;
    },


  // 연장 요청
  requestExtension: async (debtId) => {
    const token = localStorage.getItem('accessToken'); // 로컬 스토리지에서 토큰 가져오기
    if (!token) {
      throw new Error("토큰이 없습니다. 로그인 후 다시 시도해주세요.");
    }

    const response = await axios.post(`${host}/${debtId}/extension`, {}, {
      headers: {
        Authorization: `Bearer ${token}`, 
        'Content-Type': 'application/json' 
      }
    });
    return response.data;
  },

  // 멤버 정보 조회 (isLender 값 포함)
  getMemberInfo: async () => {
    const token = localStorage.getItem('accessToken'); // 로컬 스토리지에서 토큰 가져오기
    if (!token) {
      throw new Error("토큰이 없습니다. 로그인 후 다시 시도해주세요.");
    }

    const response = await axios.get(`${API_SERVER_HOST}/api/debt/member`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  },

  // 부채 삭제
  deleteDebt: async (debtId) => {
    const token = localStorage.getItem('accessToken'); // 로컬 스토리지에서 토큰 가져오기
    if (!token) {
      throw new Error("토큰이 없습니다. 로그인 후 다시 시도해주세요.");
    }

    try {
      const response = await axios.delete(`${host}/${debtId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      return response.data;  // 삭제 성공 시 반환되는 데이터
    } catch (error) {
      console.error('API Error:', error); // 오류가 있을 경우 콘솔에 오류 찍기
      throw error; // 에러를 던져서 액션에서 처리
    }
  }
};
