import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const orderSlice = createSlice({
  name: "order",
  initialState: {
    vehicle: {
      capacity: "0.5 x 0.4 x 0.5 Mét Lên đến 30kg",
      description: "Vận chuyển mặt hàng nhỏ giá trị đến 3 triệu đồng",
      icon: "https://res.cloudinary.com/dqpo9h5s2/image/upload/v1706106196/vehicle_icon/gjisuqtnu1gl7rtpdron.png",
      id: "1",
      name: "Xe Máy",
    },
  },
  reducers: {
    resetOrderSlice: (state, action) => {
      Object.assign(state, {});
    },
    saveStateAsTemp: (state, action) => {
      const temp = state;
      Object.assign(state, { temp: temp });
    },
    restoreStateFromTemp: (state, action) => {
      Object.assign(state, state.temp);
    },
    addVehicle: (state, action) => {
      state.vehicle = action.payload;
    },
    addDescription: (state, action) => {
      state.description = action.payload;
    },
  },
});
export const getSelectedVehicle = (state) => state.order.vehicle;
export const getOrder = (state) => state.order;
export const {
  addVehicle,
  addDescription,
  resetOrderSlice,
  saveStateAsTemp,
  restoreStateFromTemp,
} = orderSlice.actions;
export default orderSlice.reducer;
