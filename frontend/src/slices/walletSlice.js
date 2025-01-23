import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getWalletById,
  getWalletByMemberId,
  createWallet,
  updateWalletBalance,
  transferFromWalletToAccount,
  transferFromAccountToWallet,
} from "../api/walletApi";

const initialState = {
  wallet: null,
  loading: false,
  error: null,
};

// Thunks
export const fetchWalletById = createAsyncThunk(
  "wallet/fetchById",
  async (walletId, { rejectWithValue }) => {
    try {
      return await getWalletById(walletId);
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const createNewWallet = createAsyncThunk(
  "wallet/create",
  async (walletData, { rejectWithValue }) => {
    try {
      return await createWallet(walletData);
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// 기타 Thunks 추가: updateWalletBalance, transferFromWalletToAccount 등

const walletSlice = createSlice({
  name: "wallet",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchWalletById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWalletById.fulfilled, (state, action) => {
        state.loading = false;
        state.wallet = action.payload;
      })
      .addCase(fetchWalletById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
    // 다른 Thunks에 대한 처리 추가
  },
});

export default walletSlice.reducer;
