import {
  createSlice,
  createAsyncThunk,
  createSelector,
} from "@reduxjs/toolkit";
import { DELIVERY_TIME_TYPE } from "../constants";
import { getCurrentDateTime } from "../features/ultils";

export const INITIAL_ADDRESS = {
  contact: "",
  phoneNumber: "",
  apartmentNumber: "",

  postalCode: "",
  addressLine: "",
  formattedAddress: "",
  latitude: "",
  longitude: "",
};

export const INIT_STATE = {
  pickupLocation: {
    addressLine: "",
  },
  dropLocation: INITIAL_ADDRESS,
  deliveryTimeType: DELIVERY_TIME_TYPE.NOW,
  pickupDatetime: {
    date: null,
    time: "00:00",
  },
  cost: null,
};

export const INIT_STATE2 = {
  pickupLocation: {
    addressLine: "8 Đông Thạnh 8",
    apartmentNumber: "29",
    contact: "Anh A",
    formattedAddress:
      "8, Đông Thạnh 8, Đông Thạnh, Hóc Môn, Hồ Chí Minh 71708, Việt Nam",
    latitude: 10.9013251,
    longitude: 106.6503643,
    phoneNumber: "0734518565",
    postalCode: "71708",
  },
  dropLocation: {
    addressLine: "3 Nguyễn Kiệm",
    apartmentNumber: "49",
    contact: "Chị K",
    formattedAddress: "3, Nguyễn Kiệm, Phường 3, Gò Vấp, Hồ Chí Minh, Việt Nam",
    latitude: 10.8143297,
    longitude: 106.6785364,
    phoneNumber: "0754816532",
    postalCode: 100000,
  },
  deliveryTimeType: DELIVERY_TIME_TYPE.NOW,
  pickupDatetime: {
    date: null,
    time: "00:00",
  },
  cost: 200000,
};

const shipmentSlice = createSlice({
  name: "shipment",
  initialState: INIT_STATE2,
  reducers: {
    resetShipmentSlice: (state, action) => {
      Object.assign(state, INIT_STATE);
    },
    saveStateAsTemp: (state, action) => {
      const temp = state;
      Object.assign(state, { temp: temp });
    },
    restoreStateFromTemp: (state, action) => {
      Object.assign(state, state.temp);
    },
    addPickUp: (state, action) => {
      for (var key in action.payload) {
        if (state.pickupLocation.hasOwnProperty(key)) {
          state.pickupLocation[key] = action.payload[key];
        }
      }
    },
    addDeliveryAddress: (state, action) => {
      for (var key in action.payload) {
        if (state.dropLocation.hasOwnProperty(key)) {
          state.dropLocation[key] = action.payload[key];
        }
      }
    },
    addAdditionalPickUpInfo: (state, action) => {
      state.pickupLocation.contact = action.payload.contact;
      state.pickupLocation.phoneNumber = action.payload.phoneNumber;
    },
    addAdditionalDeliveryAddressInfo: (state, action) => {
      state.dropLocation.contact = action.payload.contact;
      state.dropLocation.phoneNumber = action.payload.phoneNumber;
    },

    addDate: (state, action) => {
      state.pickupDatetime.date = action.payload;
      state.deliveryTimeType = DELIVERY_TIME_TYPE.LATTER;
    },
    addTime: (state, action) => {
      state.pickupDatetime.time = action.payload;
      state.deliveryTimeType = DELIVERY_TIME_TYPE.LATTER;
    },
    setShipmentTypeToNow: (state, action) => {
      state.deliveryTimeType = DELIVERY_TIME_TYPE.NOW;
      state.pickupDatetime.date = null;
      state.pickupDatetime.time = null;
    },
    addCost: (state, action) => {
      state.cost = action.payload;
    },
    addDiscount: (state, action) => {
      const discount = action.payload;
      (state.cost / 100) * discount;
    },
  },
});

export const getDate = (state) => state.shipment.pickupDatetime.date;
export const getTime = (state) => state.shipment.pickupDatetime.time;
export const isDateTimeFulFill = createSelector(
  getDate,
  getTime,
  (date, time) => {
    return date !== null && time !== null;
  }
);

export const {
  addPickUp,
  addDeliveryAddress,
  addAdditionalPickUpInfo,
  addAdditionalDeliveryAddressInfo,
  addDate,
  addTime,
  setShipmentTypeToNow,
  addCost,
  resetShipmentSlice,
  addDiscount,
  saveStateAsTemp,
  restoreStateFromTemp,
} = shipmentSlice.actions;
export const getShipmentType = (state) => state.shipment.deliveryTimeType;
export const getPickUP = (state) => state.shipment.pickupLocation;
export const getDeliveryAddress = (state) => state.shipment.dropLocation;
export const getCost = (state) => state.shipment.cost;
export const getShipment = (state) => state.shipment;
export const getShipMentForm = createSelector(
  (state) => state.shipment,
  (s) => {
    let { pickupDatetime, pickupLocation, dropLocation, ...rest } = s;
    let deliveryTimeRequest = "";
    if (s.deliveryTimeType === DELIVERY_TIME_TYPE.NOW) {
      deliveryTimeRequest = getCurrentDateTime();
    } else {
      deliveryTimeRequest = `${pickupDatetime.date.replaceAll("/", "-")} ${
        pickupDatetime.time
      }`;
    }
    return {
      pickupLocation: pickupLocation,
      dropLocation: dropLocation,
      deliveryTimeRequest: deliveryTimeRequest,
      ...rest,
    };
  }
);
export default shipmentSlice.reducer;
