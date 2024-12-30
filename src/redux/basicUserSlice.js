import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API, {
  accountEndpoints,
  authAPI,
  baseEndpoints,
  basicUserEndpoints,
  ENDPOINTS,
  jobEndpoints,
  POST_ENDPOINTS,
} from "../configs/API";
import { objectToFormData } from "../features/ultils";
import APIv3, { authAPIv3, END_POINTS, ENG_POINTS } from "../configs/APIv3";
import { PROFILE_TYPE } from "../constants";

const INIT_STATE = {
  user: {},
  status: "idle",
  token: { access_token: "", expiryTime: "" },
};

const basicUserSlice = createSlice({
  name: "basicUserSlice",
  initialState: INIT_STATE,
  reducers: {
    resetBasicUserSlice: (state, action) => {
      Object.assign(state, INIT_STATE);
    },
    setUserInfo: (state, action) => {
      state.user = action.payload;
    },
    setToken: (state, action) => {
      state.token = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(register.pending, (state) => {
        state.status = "pending";
      })
      .addCase(register.fulfilled, (state, action) => {
        if (action.payload) {
          state.user = action.payload.user;
          state.token.access_token = action.payload.token.token;
          state.token.expiryTime = action.payload.token.expiryTime;
        }
        state.status = "idle";
      })
      .addCase(register.rejected, (state, action) => {
        state.status = "idle";
      })

      .addCase(login.pending, (state) => {
        state.status = "pending";
      })
      .addCase(login.fulfilled, (state, action) => {
        if (action.payload) {
          state.user = action.payload.user;
          state.token.access_token = action.payload.token.token;
          state.token.expiryTime = action.payload.token.expiryTime;
        }
        state.status = "idle";
      })
      .addCase(login.rejected, (state, action) => {
        state.status = "idle";
      })

      .addCase(updateProfile.pending, (state) => {
        state.status = "pending";
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.user = action.payload;
        state.status = "idle";
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.status = "idle";
      });
  },
});

export const register = createAsyncThunk(
  "user,registerUser",
  async (form, { rejectWithValue }) => {
    const formData = objectToFormData(form);
    try {
      const createdAccount = await APIv3.post(
        END_POINTS["register-user"],
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      const token = await APIv3.post(END_POINTS["token"], {
        username: form.username,
        password: form.password,
      });

      let user = await authAPIv3(token?.data?.result?.token).get(
        END_POINTS["find-user-profile"](PROFILE_TYPE.DEFAULT)
      );
      return {
        user: user?.data?.result,
        token: token?.data?.result,
      };
    } catch (e) {
      console.log(e);

      return rejectWithValue(e?.response?.data);
    }
  }
);

export const login = createAsyncThunk(
  "user,loginUser",
  async (data, { rejectWithValue }) => {
    try {
      const token = await APIv3.post(END_POINTS["token"], {
        username: data?.username,
        password: data?.password,
      });

      let user = await authAPIv3(token.data?.result?.token).get(
        END_POINTS["find-user-profile"](PROFILE_TYPE.DEFAULT)
      );

      return {
        user: user?.data?.result,
        token: token?.data?.result,
      };
    } catch (err) {
      console.log(err);

      return rejectWithValue(err?.response?.data);
    }
  }
);

export const googleLogin = createAsyncThunk(
  "user,loginUser",
  async (access_token, { rejectWithValue }) => {
    try {
      const res = await API.post(
        accountEndpoints["convert-token"],
        {
          token: access_token,
          backend: "google-oauth2",
          grant_type: "convert_token",
        },
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      let user = await authAPI(res.data.access_token).get(
        basicUserEndpoints["current-user"]
      );
      return {
        user: user.data,
        token: res.data,
      };
    } catch (err) {
      console.log(err);
      return rejectWithValue(err?.response?.data);
    }
  }
);

export const updateProfile = createAsyncThunk(
  "user,updateUser",
  async (data, { rejectWithValue }) => {
    const { access_token, formData } = data;
    try {
      const user = await authAPI(access_token).put(
        basicUserEndpoints["current-user"],
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return user.data;
    } catch (err) {
      return rejectWithValue(err?.response.data);
    }
  }
);

export const postJob = createAsyncThunk(
  "job,PostJob",
  async (data, { rejectWithValue }) => {
    const { access_token, formData } = data;
    try {
      const res = await authAPIv3(access_token).post(
        END_POINTS["create-post"],
        formData
      );

      return res?.data?.result;
    } catch (err) {
      return rejectWithValue(err?.response?.data);
    }
  }
);

export const myJob = createAsyncThunk(
  "job,myJob",
  async (data, { rejectWithValue }) => {
    const { access_token, params } = data;
    try {
      const res = await authAPIv3(access_token).get(
        END_POINTS["find-post-by-status-list"](params)
      );
      return res.data.result;
    } catch (err) {
      return rejectWithValue(err?.response.data);
    }
  }
);

export const retrieve = createAsyncThunk(
  "job,Retrieve",
  async (data, { rejectWithValue }) => {
    const { access_token, orderId } = data;
    try {
      const res = await authAPIv3(access_token).get(
        END_POINTS["find-post-by-id"](orderId)
      );
      return res.data.result;
    } catch (err) {
      return rejectWithValue(err?.response.data);
    }
  }
);

export const getJoinedShipper = createAsyncThunk(
  "job,getShipper",
  async (data, { rejectWithValue }) => {
    const { access_token, orderId } = data;
    try {
      const res = await authAPI(access_token).get(
        jobEndpoints["listShipper"](orderId)
      );
      return res.data;
    } catch (err) {
      return rejectWithValue(err?.response.data);
    }
  }
);

export const getWinShipper = createAsyncThunk(
  "shipper,getWinShipper",
  async (data, { rejectWithValue }) => {
    const { access_token, orderId } = data;
    try {
      const res = await authAPI(access_token).get(
        POST_ENDPOINTS["get-winner"](orderId)
      );
      return res.data.result;
    } catch (err) {
      return rejectWithValue(err?.response.data);
    }
  }
);

export const getCurrentShipperLocation = createAsyncThunk(
  "shipperLocation,getWinShipperLocation",
  async (data, { rejectWithValue }) => {
    const { access_token, shipperId } = data;
    try {
      const res = await authAPI(access_token).get(
        ENDPOINTS["current-shipper-location"](shipperId)
      );
      return res.data.result;
    } catch (err) {
      return rejectWithValue(err?.response.data);
    }
  }
);

export const myFeedback = createAsyncThunk(
  "feedBack,myFeedback",
  async (data, { rejectWithValue }) => {
    const { access_token, orderId } = data;
    try {
      const res = await authAPI(access_token).get(
        POST_ENDPOINTS["get-feedback"](orderId)
      );
      return res.data.result;
    } catch (err) {
      console.log("feedBack,myFeedback");
      console.log(err?.response.data);

      return rejectWithValue(err?.response.data);
    }
  }
);

export const sendFeedback = createAsyncThunk(
  "job,sendFeedback",
  async (data, { rejectWithValue }) => {
    const { access_token, body, postId } = data;
    try {
      const res = await authAPI(access_token).post(
        POST_ENDPOINTS["sent-feedback"](postId),
        body
      );
      return res?.data?.result;
    } catch (err) {
      console.log(err);
      return rejectWithValue(err?.response?.data);
    }
  }
);

export const viewFeedback = createAsyncThunk(
  "feedback,viewFeedback",
  async (data, { rejectWithValue }) => {
    const { access_token, shipperId } = data;
    try {
      const res = await authAPI(access_token).get(
        basicUserEndpoints["view_feedbacks"](shipperId)
      );
      return res.data;
    } catch (err) {
      return rejectWithValue(err?.response.data);
    }
  }
);

export const vnPayCreatePaymentUrl = createAsyncThunk(
  "vnPay,vnPayCreatePayment",
  async (data, { rejectWithValue }) => {
    const { access_token, params } = data;
    try {
      const res = await authAPI(access_token).get(
        POST_ENDPOINTS["create-vnpay-url"](params)
      );
      return res.data.result;
    } catch (err) {
      console.log(err?.response?.data);
      return rejectWithValue(err?.response?.data);
    }
  }
);

export const getCoupon = createAsyncThunk(
  "coupon,getCoupon",
  async (data, { rejectWithValue }) => {
    const { access_token, key } = data;
    const formData = new FormData();
    formData.append("key", key);
    try {
      const res = await authAPI(access_token).post(
        baseEndpoints["my-coupon"],
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return res.data;
    } catch (err) {
      return rejectWithValue(err?.response.data);
    }
  }
);

export const getBasicUserToken = (state) => state.basicUserSlice.token;
export const getBasicUserStatus = (state) => state.basicUserSlice.status;
export const getBasicUserProfile = (state) => state.basicUserSlice.user;
export const { setToken, resetBasicUserSlice } = basicUserSlice.actions;
export default basicUserSlice.reducer;
