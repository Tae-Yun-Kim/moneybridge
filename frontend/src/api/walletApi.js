import jwtAxios from "../util/jwtUtil";

const API_SERVER_HOST = "http://localhost:8080";
const host = `${API_SERVER_HOST}/api/wallets`;

// 지갑 생성
export const createWallet = async (walletData) => {
  try {
    const response = await jwtAxios.post(host, walletData);
    console.log("지갑 생성 완료:", response.data);
    return response.data;
  } catch (error) {
    console.error("지갑 생성 실패:", error.message);
    throw error;
  }
};

// 지갑 조회 (지갑 ID 기준)
export const getWalletById = async (walletId) => {
  try {
    const response = await jwtAxios.get(`${host}/${walletId}`);
    console.log("지갑 조회 결과:", response.data);
    return response.data;
  } catch (error) {
    console.error("지갑 조회 실패:", error.message);
    throw error;
  }
};

// 회원 ID로 지갑 조회
export const getWalletByMemberId = async (memberId) => {
  try {
    const response = await jwtAxios.get(`${host}/member/${memberId}`);
    console.log("회원 ID로 지갑 조회 결과:", response.data);
    return response.data;
  } catch (error) {
    console.error("회원 ID로 지갑 조회 실패:", error.message);
    throw error;
  }
};

// 지갑 잔액 업데이트
export const updateWalletBalance = async (walletId, amount) => {
  try {
    const response = await jwtAxios.put(`${host}/${walletId}/balance`, null, {
      params: { amount },
    });
    console.log("지갑 잔액 업데이트 완료:", response.data);
    return response.data;
  } catch (error) {
    console.error("지갑 잔액 업데이트 실패:", error.message);
    throw error;
  }
};

// 지갑 → 계좌 송금
export const transferFromWalletToAccount = async (memberId, amount) => {
  try {
    const response = await jwtAxios.post(`${host}/${memberId}/transfer`, null, {
      params: { amount },
    });
    console.log("지갑에서 계좌로 송금 완료:", response.data);
    return response.data;
  } catch (error) {
    console.error("지갑에서 계좌로 송금 실패:", error.message);
    throw error;
  }
};

// 계좌 → 지갑 송금
export const transferFromAccountToWallet = async (memberId, amount) => {
  try {
    const response = await jwtAxios.post(`${host}/${memberId}/deposit`, null, {
      params: { amount },
    });
    console.log("계좌에서 지갑으로 송금 완료:", response.data);
    return response.data;
  } catch (error) {
    console.error("계좌에서 지갑으로 송금 실패:", error.message);
    throw error;
  }
};

// 지갑 잠금
export const lockWallet = async (walletId) => {
  try {
    const response = await jwtAxios.put(`${host}/${walletId}/lock`);
    console.log("지갑 잠금 성공:", response.data);
    return response.data;
  } catch (error) {
    console.error("지갑 잠금 실패:", error.message);
    throw error;
  }
};

// 지갑 잠금 해제
export const unlockWallet = async (walletId) => {
  try {
    const response = await jwtAxios.put(`${host}/${walletId}/unlock`);
    console.log("지갑 잠금 해제 성공:", response.data);
    return response.data;
  } catch (error) {
    console.error("지갑 잠금 해제 실패:", error.message);
    throw error;
  }
};

// 거래 횟수 증가
export const incrementTransactionCount = async (walletId) => {
  try {
    const response = await jwtAxios.put(
      `${host}/${walletId}/increment-transaction`
    );
    console.log("거래 횟수 증가 성공:", response.data);
    return response.data;
  } catch (error) {
    console.error("거래 횟수 증가 실패:", error.message);
    throw error;
  }
};

// PIN 번호 변경
export const updatePinNumber = async (walletId, oldPin, newPin) => {
  try {
    const response = await jwtAxios.put(`${host}/${walletId}/pin`, null, {
      params: { oldPin, newPin },
    });
    console.log("PIN 번호 변경 성공:", response.data);
    return response.data;
  } catch (error) {
    console.error("PIN 번호 변경 실패:", error.message);
    throw error;
  }
};

// 지갑 간 송금
export const transferBetweenWallets = async (
  fromWalletId,
  toWalletId,
  amount
) => {
  try {
    const response = await jwtAxios.post(
      `${API_SERVER_HOST}/api/wallets/${fromWalletId}/transfer/${toWalletId}`,
      null,
      {
        params: { amount },
      }
    );
    console.log("지갑 간 송금 완료:", response.data);
    return response.data;
  } catch (error) {
    console.error("지갑 간 송금 실패:", error.message);
    throw error;
  }
};
