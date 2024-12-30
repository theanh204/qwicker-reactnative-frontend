import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { PAYMENT_METHOD } from "../constants";

export const INIT_PAYMENT = {
  method: PAYMENT_METHOD.CASH,
  price: null,
  isPosterPay: true,
  paid_at: null,
};

const paymentSlice = createSlice({
  name: "orderdetail",
  initialState: {
    payment: INIT_PAYMENT,
    status: "idle",
  },
  reducers: {
    resetPaymentSlice: (state, action) => {
      Object.assign(state, INIT_PAYMENT);
    },
    addPayment: (state, action) => {
      state.payment = action.payload;
    },
    initPayment: (state, action) => {
      state.payment = INIT_PAYMENT;
    },
  },
});
export const getPayment = (state) => state.paymentSlice.payment;
export const { addPayment, initPayment, resetPaymentSlice } =
  paymentSlice.actions;
export default paymentSlice.reducer;
