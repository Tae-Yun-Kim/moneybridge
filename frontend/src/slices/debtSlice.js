import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { debtApi } from '../api/debtApi'; 

// 모든 부채를 가져오는 비동기 함수
export const fetchAllDebts = createAsyncThunk(
  'debt/fetchAll',
  async (accessToken) => {
    try {
      // console.log('Sending request to fetch debts...');  // 요청 전 로그
      const response = await debtApi.getAllDebts(accessToken);
      // console.log('API Response:', response);  // 응답 로그
      return response.data;  // 데이터 반환
    } catch (error) {
      console.error('Error fetching debts:', error);  // 에러 로그
      throw error;  // 에러 처리
    }
  }
);

// 새로운 부채를 생성하는 비동기 함수
export const createDebt = createAsyncThunk(
  'debt/create',
  async ({ debtData, accessToken }) => { 
    // console.log("debtSlice debtData: ", debtData);
    return await debtApi.createDebt(debtData, accessToken); // API로 새로운 부채를 생성
  }
);

// 부채 연장을 요청하는 비동기 함수
export const requestExtension = createAsyncThunk(
  'debt/requestExtension',
  async ({ debtId, accessToken }) => { 
    return await debtApi.requestExtension(debtId, accessToken); // 부채 ID로 연장 요청을 API에 전달
  }
);

// redux 슬라이스에서 fetchAllDebts 리듀서 처리
const debtSlice = createSlice({
  name: 'debt',
  initialState: { 
    debts: [],
    loading: false,
    error: null 
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllDebts.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAllDebts.fulfilled, (state, action) => {
        console.log('Action received in reducer:', action);  // 액션 확인
        state.loading = false;
        state.debts = action.payload;  // 상태 업데이트
        console.log('Updated debts state:', state.debts);  // 상태 업데이트 확인
        state.error = null;
      })
      .addCase(fetchAllDebts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(createDebt.pending, (state) => {
        state.loading = true;
      })
      .addCase(createDebt.fulfilled, (state, action) => {
        state.loading = false;
        state.debts.push(action.payload);  // 새로운 부채 추가
        state.error = null;
      })
      .addCase(createDebt.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(requestExtension.pending, (state) => {
        state.loading = true;
      })
      .addCase(requestExtension.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(requestExtension.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  }
});

export default debtSlice.reducer;
