import { createSelector, createSlice } from "@reduxjs/toolkit";
import { useSelector } from "react-redux";
import { getRole } from "./appSlice";
import { ROLE } from "../constants";

const INIT_STATE = {
  basicAccountInfo: {
    profileType: "DEFAULT",
  },
  additionalInfo: {}, // use for driver
};

const formRegisterSlice = createSlice({
  name: "formRegister",
  initialState: INIT_STATE,
  reducers: {
    resetFormRegisterSlice: (state, action) => {
      Object.assign(state, INIT_STATE);
    },
    addBasicField: (state, action) => {
      state.basicAccountInfo = { ...state.basicAccountInfo, ...action.payload };
    },
    addAdditionalField: (state, action) => {
      state.additionalInfo = { ...state.additionalInfo, ...action.payload };
    },
  },
});
const basicAccountInfo = (state) => state.formRegister.basicAccountInfo;
export const getBasicAccountInfo = createSelector(
  getRole,
  basicAccountInfo,
  (role, infor) => {
    if (role === ROLE.TRADITIONAL_USER) {
      return {
        ...infor,
        accountType: "USER",
      };
    } else {
      return {
        accountType: "SHIPPER",
        ...infor,
      };
    }
  }
);

export const { addBasicField, addAdditionalField, resetFormRegisterSlice } =
  formRegisterSlice.actions;

export const getAdditionalInfo = (state) => state.formRegister.additionalInfo;
export default formRegisterSlice.reducer;
