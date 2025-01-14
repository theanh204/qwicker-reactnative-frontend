import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import API, { baseEndpoints } from "../configs/API";
import APIv3, { END_POINTS } from "../configs/APIv3";

const appSlice = createSlice({
  name: "app",
  initialState: {
    isUseAppBefore: true,
    role: 2, // 1:user, 2:shipper,
    typeChoosingLocation: 1, // 1: pick up, 2:deliver address,
    locationPermission: false,
    vehicles: [],
    productcategories: [],
    paymentMethods: [],
  },
  reducers: {
    setRole: (state, action) => {
      state.role = action.payload;
    },
    setTypeChoosingLocation: (state, action) => {
      state.typeChoosingLocation = action.payload;
    },
    setIsUseAppBefore: (state, action) => {
      state.isUseAppBefore = true;
    },
    setLocationPermission: (state, action) => {
      state.locationPermission = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchVehicles.pending, (state) => {
        state.status = "pending";
      })
      .addCase(fetchVehicles.fulfilled, (state, action) => {
        state.vehicles = action.payload;
        state.status = "idle";
      })
      .addCase(fetchVehicles.rejected, (state, action) => {
        state.status = "idle";
      })

      .addCase(fetchProductCategories.pending, (state) => {
        state.status = "pending";
      })
      .addCase(fetchProductCategories.fulfilled, (state, action) => {
        state.productcategories = action.payload;
        state.status = "idle";
      })
      .addCase(fetchProductCategories.rejected, (state, action) => {
        state.status = "idle";
      })

      .addCase(fetchPaymentMethods.pending, (state) => {
        state.status = "pending";
      })
      .addCase(fetchPaymentMethods.fulfilled, (state, action) => {
        state.paymentMethods = action.payload;
        state.status = "idle";
      })
      .addCase(fetchPaymentMethods.rejected, (state, action) => {
        state.status = "idle";
      });
  },
});

export const fetchVehicles = createAsyncThunk(
  "vehicles,getVehicles",
  async (form, { rejectWithValue }) => {
    try {
      const res = await APIv3.get(END_POINTS["find-all-vehicel"]);
      return res.data?.result;
    } catch (e) {
      return rejectWithValue(e?.response?.data);
    }
  }
);

export const fetchProductCategories = createAsyncThunk(
  "categories,getCategories",
  async (form, { rejectWithValue }) => {
    try {
      const res = await APIv3.get(END_POINTS["find-all-product-category"]);
      return res.data.result;
    } catch (e) {
      console.log(e);
      return rejectWithValue(e?.response?.data);
    }
  }
);

export const fetchPaymentMethods = createAsyncThunk(
  "paymentMethods,getPaymentMethods",
  async (form, { rejectWithValue }) => {
    try {
      const res = await API.get(baseEndpoints["payment-method"]);
      return res.data.result;
    } catch (e) {
      return rejectWithValue(e.response.data);
    }
  }
);

export const getPaymentMethods = (state) => state.app.paymentMethods;
export const getCategories = (state) => state.app.productcategories;
export const getVehicles = (state) => state.app.vehicles;
export const getRole = (state) => state.app.role;
export const getIsUseAppBefore = (state) => state.app.isUseAppBefore;
export const getLocationPermission = (state) => state.app.locationPermission;
export const getTypeChoosingLocation = (state) =>
  state.app.typeChoosingLocation;
export const {
  setRole,
  setTypeChoosingLocation,
  setIsUseAppBefore,
  setLocationPermission,
} = appSlice.actions;
export default appSlice.reducer;
