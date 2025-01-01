import axios from "axios";
export const BASE_URL = "http://192.168.100.7:8888/api/v3/";
export const webSocketUrl = "http://192.168.100.7:8088/websocket/ws";
export const END_POINTS = {
  "check-username-exists": "identity/accounts/check-username-exists",
  "check-email-exists": "identity/accounts/check-email-exists",
  "registration-sent-otp": "identity/accounts/registration/sent-opt",
  "registration-verify-otp": "identity/accounts/registration/verify-opt",
  "register-user": "identity/accounts/registration",
  "find-all-vehicel": "post/vehicles",
  "find-all-product-category": "post/product-category",
  "create-post": "post/posts",
  "find-post-by-id": (id) => `post/posts/${id}`,
  "find-post-by-status-list": (params) => `/api/posts?${params}`,
  "find-user-profile": (type) => `profile/users/my-profile?type=${type}`,
  "find-shipper-profile": "profile/shippers/my-profile",
  token: "/identity/auth/token",
};

export const authAPIv3 = (access_token) =>
  axios.create({
    baseURL: BASE_URL,
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  });

export const virtualearthLocationv3 = (query) =>
  axios.create({
    baseURL: `https://dev.virtualearth.net/REST/v1/Locations?query=${query}&key=AiG0p7k1VuqiubVqZ22aZXS6HEih9Yg95wRzucCj_gRvT0HeaMMuanyX13L4qGfd`,
  });

export const virtualearthAutoSuggestv3 = (query) =>
  axios.create({
    baseURL: `https://dev.virtualearth.net/REST/v1/Autosuggest?query=${query}&key=AiG0p7k1VuqiubVqZ22aZXS6HEih9Yg95wRzucCj_gRvT0HeaMMuanyX13L4qGfd`,
  });

export const googMapDistanceMatrix = (origin, destination) =>
  axios.create({
    baseURL: `https://rsapi.goong.io/DistanceMatrix?origins=${origin}&destinations=${destination}&vehicle=car&api_key=mSU8H8q4TEUcZmaniecYM0Tm4RLQuKOqAC8kzhGr`,
  });

export const googMapDirection = (origin, destination) =>
  axios.create({
    baseURL: `https://rsapi.goong.io/Direction?origin=${origin}&destination=${destination}&vehicle=car&api_key=mSU8H8q4TEUcZmaniecYM0Tm4RLQuKOqAC8kzhGr`,
  });

export const googMapAutocomplete = (input) =>
  axios.create({
    baseURL: `https://rsapi.goong.io/Place/AutoComplete?api_key=mSU8H8q4TEUcZmaniecYM0Tm4RLQuKOqAC8kzhGr&input=${input}`,
  });

export const googMapGetDetailPlaceById = (id) =>
  axios.create({
    baseURL: `https://rsapi.goong.io/Place/Detail?place_id=${id}&api_key=mSU8H8q4TEUcZmaniecYM0Tm4RLQuKOqAC8kzhGr`,
  });

export const googMapReverseGeocoding = (latlng) =>
  axios.create({
    baseURL: `https://rsapi.goong.io/Geocode?latlng=${latlng}&api_key=mSU8H8q4TEUcZmaniecYM0Tm4RLQuKOqAC8kzhGr`,
  });

export default axios.create({
  baseURL: BASE_URL,
});
