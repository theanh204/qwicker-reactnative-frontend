import axios from "axios";
// export const BASE_URL = "http://192.168.100.16:8888/api/v3/";
export const BASE_URL = "http://192.168.23.254:8888/api/v3/";
export const webSocketUrl = `${BASE_URL}ws`;
export const END_POINTS = {
  "check-username-exists": "identity/accounts/check-username-exists",
  "check-email-exists": "identity/accounts/check-email-exists",
  "registration-sent-otp": "identity/accounts/registration/sent-opt",
  "registration-verify-otp": "identity/accounts/registration/verify-opt",
  "register-user": "identity/accounts/registration",
  "find-all-vehicel": "post/vehicles",
  "find-all-product-category": "post/product-category",
  "find-user-profile": (type) => `profile/users/my-profile?type=${type}`,
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

export const virtualearthDrivingv3 = (lat1, long1, lat2, long2) =>
  axios.create({
    baseURL: `https://dev.virtualearth.net/REST/v1/Routes/Driving?o=json&wp.0=${lat1},${long1}&wp.1=${lat2},${long2}&key=AiG0p7k1VuqiubVqZ22aZXS6HEih9Yg95wRzucCj_gRvT0HeaMMuanyX13L4qGfd`,
  });

export default axios.create({
  baseURL: BASE_URL,
});
