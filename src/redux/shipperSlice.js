import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API, {
  ENDPOINTS,
  POST_ENDPOINTS,
  ShipperJobEndpoints,
  accountEndpoints,
  authAPI,
  shipperEndpoints,
} from "../configs/API";
import { getCurrentLocation, objectToFormData } from "../features/ultils";
import APIv3, {
  authAPIv3,
  END_POINTS,
  googMapDistanceMatrix,
  virtualearthDrivingv3,
} from "../configs/APIv3";

const INIT_STATE = {
  user: {},
  status: "idle",
  token: { access_token: "", refresh_token: "" },
  lastTimeoutId: null,
  location: null,
};

const shipperSlice = createSlice({
  name: "shipperSlice",
  initialState: INIT_STATE,
  reducers: {
    resetShipperSlice: (state, action) => {
      clearInterval(state?.lastTimeoutId);
      Object.assign(state, INIT_STATE);
    },
    setUserInfo: (state, action) => {
      state.user = action.payload;
    },
    setToken: (state, action) => {
      state.token = action.payload;
    },
    setLocation: (state, action) => {
      state.location = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(register.pending, (state) => {
        state.status = "pending";
      })
      .addCase(register.fulfilled, (state, action) => {
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

      .addCase(setOnline.fulfilled, (state, action) => {
        state.lastTimeoutId = action.payload;
        state.status = "idle";
      });
  },
});

export const register = createAsyncThunk(
  "user,registerUser",
  async (form, { rejectWithValue }) => {
    const formData = objectToFormData(form);
    try {
      await APIv3.post(END_POINTS["register-user"], formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return;
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
        END_POINTS["find-shipper-profile"]
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

export const viewJob = createAsyncThunk(
  "job, viewJob",
  async (data, { rejectWithValue }) => {
    const { token, jobId } = data;
    try {
      const res = await authAPI(token).get(
        ShipperJobEndpoints["job-retrieve"](jobId)
      );
      return res.data;
    } catch (err) {
      console.log(err);
      return rejectWithValue(err?.response?.data);
    }
  }
);

export const getDistance = createAsyncThunk(
  "distance, getDistance",
  async (data, { rejectWithValue }) => {
    const { origin, destination } = data;
    try {
      const res = await googMapDistanceMatrix(origin, destination).get();
      return res.data?.rows[0].elements[0].distance.text;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const getNumShipperJoined = createAsyncThunk(
  "numShipperJoined, getNumShipperJoined",
  async (data, { rejectWithValue }) => {
    const { token, jobId } = data;
    try {
      const res = await authAPI(token).get(
        POST_ENDPOINTS["get-num-shipper-joined"](jobId)
      );
      return res.data.result.num;
    } catch (err) {
      console.log(err);
      return rejectWithValue(err?.response);
    }
  }
);

export const getInComeStatistic = createAsyncThunk(
  "statistic, getStatistic",
  async (data, { rejectWithValue }) => {
    const { token, body } = data;
    try {
      const res = await authAPI(token).post(ENDPOINTS["statistic"], body);
      return res.data.result;
    } catch (err) {
      console.log(err);
      return rejectWithValue(err?.response);
    }
  }
);

export const joinJob = createAsyncThunk(
  "job, joinJob",
  async (data, { rejectWithValue }) => {
    const { token, postId } = data;
    try {
      const res = await authAPI(token).post(
        POST_ENDPOINTS["get-post-by-id"](postId)
      );
      return res.status;
    } catch (err) {
      console.log(err);
      return rejectWithValue(err?.response);
    }
  }
);

export const myJobs = createAsyncThunk(
  "job, myJobs",
  async (data, { rejectWithValue }) => {
    const { access_token, params } = data;
    try {
      const res = await authAPI(access_token).get(
        ENDPOINTS["shipper-post"](params)
      );
      return res?.data.result;
    } catch (err) {
      console.log(err?.response?.data);
      return rejectWithValue(err?.response?.data);
    }
  }
);

export const updateOrder = createAsyncThunk(
  "job, myJobs",
  async (data, { rejectWithValue }) => {
    const { access_token, orderId, body } = data;
    try {
      const res = await authAPI(access_token).post(
        POST_ENDPOINTS["update-post-by-id"](orderId),
        body
      );
      return res.data.result;
    } catch (err) {
      console.log(err);
      return rejectWithValue(err?.response?.data);
    }
  }
);

export const collectCash = createAsyncThunk(
  "cash, collectCash",
  async (data, { rejectWithValue }) => {
    const { access_token, orderId } = data;
    try {
      const res = await authAPI(access_token).post(
        ENDPOINTS["collect-cash"](orderId)
      );
      return res.data.result;
    } catch (err) {
      return rejectWithValue(err?.response);
    }
  }
);

export const getOrder = createAsyncThunk(
  "job, myJobs",
  async (data, { rejectWithValue }) => {
    const { access_token, orderId } = data;
    try {
      const res = await authAPI(access_token).get(
        POST_ENDPOINTS["get-post-by-id"](orderId)
      );
      return res.data.result;
    } catch (err) {
      return rejectWithValue(err?.response);
    }
  }
);

export const setOnline = createAsyncThunk(
  "online,setOnline",
  async (data, { getState, rejectWithValue, dispatch }) => {
    const { ws, shipperId } = data;
    try {
      if (ws.connected) {
        return setInterval(async () => {
          const newLocation = await getCurrentLocation();
          const { shipperSlice } = getState();
          const { location } = shipperSlice;

          const body = {
            messageType: "UPDATE_SHIPPER_LOCATION",
            content: JSON.stringify({
              ...newLocation,
              shipperId: shipperId,
            }),
          };
          if (location) {
            body.content["prevLatitude"] = location.latitude;
            body.content["prevLongitude"] = location.longitude;
          }
          ws.publish({
            destination: `/app/shipper/${shipperId}`,
            body: body,
          });
          dispatch(setLocation(newLocation));
        }, 5000);
      }
    } catch (err) {
      console.error("Error in setOnline:", err);
      return rejectWithValue(err?.response || "An unexpected error occurred");
    }
  }
);

export const { setToken, resetShipperSlice, setLocation } =
  shipperSlice.actions;
export const getToken = (state) => state.shipperSlice.token;
export const getShipperProfile = (state) => state.shipperSlice.user;
export default shipperSlice.reducer;
