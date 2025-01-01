import { JOBSTATUS, PAYMENT_METHOD } from "../constants";
import * as Location from "expo-location";

export const formatDate = (date, time) => {
  const dayOfWeek = date.getUTCDay() === 7 ? "CN" : date.getUTCDay() + 1;
  return `Th ${dayOfWeek}, thg ${
    date.getMonth() + 1
  } ${date.getDate()}, ${time.getUTCHours()}:${time.getMinutes()}`;
};
// export const formatDate = (date, time) => {
//     return `${date.getDate()}/${date.getMonth() +
//       1}/${date.getFullYear()} ${time.getHours()}:${time.getMinutes()}`;
//   };
export const getCurrentDate = () => {
  const currentDate = new Date();

  const day = currentDate.getDate();
  const month = currentDate.getMonth() + 1; // Note: Month is zero-based
  const year = currentDate.getFullYear();

  return `${year}/${month}/${day}`;
};
export const getCurrentDateTime = () => {
  const currentDate = new Date();

  const day = currentDate.getDate();
  const month = currentDate.getMonth() + 1; // Note: Month is zero-based
  const year = currentDate.getFullYear();
  const hour = currentDate.getHours();
  const minute = currentDate.getMinutes();
  return `${year}-${month}-${day} ${hour}:${minute}`;
};

export const getVietnamesDay = (date) => {
  const daysInVietnames = [
    "Chủ Nhật",
    "Thứ Hai",
    "Thứ Ba",
    "Thứ Tư",
    "Thứ Năm",
    "Thứ Sáu",
    "Thứ Bảy",
  ];
  return daysInVietnames[new Date(date).getDay()];
};

export const getVietnamesMonth = (date) => {
  const daysInVietnames = [
    "Thg 1",
    "Thg 2",
    "Thg 3",
    "Thg 4",
    "Thg 5",
    "Thg 6",
    "Thg 7",
    "Thg 8",
    "Thg 9",
    "Thg 10",
    "Thg 11",
    "Thg 12",
  ];
  return daysInVietnames[new Date(date).getMonth()];
};

export function formatDateTimeToVietnamese(dateString, timeString) {
  const monthsInVietnamese = [
    "thg 1",
    "thg 2",
    "thg 3",
    "thg 4",
    "thg 5",
    "thg 6",
    "thg 7",
    "thg 8",
    "thg 9",
    "thg 10",
    "thg 11",
    "thg 12",
  ];

  const arr = dateString.split("/");
  m = +arr[1] - 1;
  const dateObject = new Date(+arr[0], m, +arr[2]);
  const day = dateObject.getDate();
  const monthIndex = dateObject.getMonth();
  const monthInVietnamese = monthsInVietnamese[monthIndex];

  const formattedDate = `Th ${
    dateObject.getDay() + 1
  }, ${monthInVietnamese} ${day}, ${timeString}`;

  return formattedDate;
}
export function formatMomentDateToVietnamese(dateString) {
  // "2024-01-14 20:00:00"
  var moment = require("moment-timezone");
  moment.tz.setDefault("Asia/Ho_Chi_Minh");
  const date = moment(dateString);

  const day = date.day() + 1;
  const strDay = day === 1 ? "CN" : `Th ${day}`;

  const formattedDate = `${strDay}, ${date.date()} thg ${date.month() + 1}`;

  return formattedDate;
}

export function formatMomentDateToVietnamese2(dateString) {
  // "2024-01-14 20:00:00"
  var moment = require("moment-timezone");
  moment.tz.setDefault("Asia/Ho_Chi_Minh");
  const date = moment(dateString);
  const diff = getDiffBetweenTwoTime(dateString);

  const day = date.day() + 1;
  const hour = date.hour();
  const minute = date.minute();
  const strM = minute >= 10 ? minute : `0${minute}`;
  if (diff.day <= 1) {
    return `Hôm nay, ${hour}:${strM}`;
  } else {
    return `${date.date()} Th${date.month() + 1},${hour}:${strM}`;
  }
}

export const getDiffBetweenTwoTime = (time) => {
  var moment = require("moment-timezone");
  moment.tz.setDefault("Asia/Ho_Chi_Minh");
  const orderTiem = moment(time);
  const diff = orderTiem.diff(moment());
  const duration = moment.duration(diff);

  return { hour: duration.hours(), day: duration.days() };
};

export var objectToFormData = function (obj, form, namespace) {
  var fd = form || new FormData();
  var formKey;
  for (var property in obj) {
    if (obj.hasOwnProperty(property)) {
      if (namespace) {
        formKey = namespace + "[" + property + "]";
      } else {
        formKey = property;
      }
      // if the property is an object, but not a File,
      // use recursivity.
      if (
        typeof obj[property] === "object" &&
        !(obj[property] instanceof File)
      ) {
        objectToFormData(obj[property], fd, property);
      } else {
        // if it's a string or a File object
        fd.append(formKey, obj[property]);
      }
    }
  }
  return fd;
};

export const formatCurrency = (amount) => {
  const formatter = new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  });

  return formatter.format(amount);
};

export const getTitleDependStatus = (status) => {
  switch (status) {
    case JOBSTATUS.PENDING:
      return "Đang tìm shipper";
    case JOBSTATUS.FOUND_SHIPPER:
      return "Đang đợi shipper";
    case JOBSTATUS.CONFIRM_WITH_CUSTOMER:
      return "Đã xác nhận với khách hàng";
    case JOBSTATUS.WAITING_PAY:
      return "Chờ thanh toán";
    case JOBSTATUS.SHIPPED:
      return "Đang giao";
    case JOBSTATUS.DELIVERED:
      return "Hoàn thành";
    case JOBSTATUS.CANCELLED:
      return "Đã huỷ";
    default:
      return "Undefine";
  }
};

export const getCurrentLocation = async () => {
  const currentLocation = await Location.getCurrentPositionAsync({
    accuracy: Location.Accuracy.High,
  });
  return {
    latitude: currentLocation.coords.latitude,
    longitude: currentLocation.coords.longitude,
    timestamp: currentLocation.timestamp,
  };
};

export function uuidToNumber(uuid) {
  const hex = uuid.replace(/-/g, ""); // Loại bỏ dấu gạch ngang
  let number = "";

  // Chuyển đổi từng cặp ký tự hex thành số
  for (let i = 0; i < hex.length; i += 2) {
    const value = parseInt(hex.substring(i, i + 2), 16); // Chuyển đổi từng cặp hex thành số
    number += value.toString(); // Thêm số vào chuỗi
  }

  // Giới hạn độ dài chuỗi số nếu cần thiết
  return number.substring(0, 10); // Ví dụ: lấy 20 ký tự đầu tiên
}
// "ratings": [
//             {
//                 "rating": 4.5,
//                 "feedback": "Tình trạng phương tiện tốt",
//                 "createdAt": "2024-09-08T00:47:38.163096",
//                 "user": {
//                     "username": "theanh1",
//                     "firstName": "Chai",
//                     "lastName": "Nguyen",
//                     "email": "a@example.com",
//                     "avatar": null
//                 }
//             }
//         ]
export function averageRatingPoint(ratings) {
  if (!ratings || ratings.length === 0) return 0;
  const result = ratings.reduce(
    (prve, curr) => {
      return {
        totalPoint: prve.totalPoint + curr.rating,
        num: prve.num + 1,
      };
    },
    { totalPoint: 0, num: 0 }
  );
  return result.totalPoint / result.num;
}

export function getVNPaymentMethodName(method) {
  if (method === PAYMENT_METHOD.VNPAY) {
    return "VnPay";
  } else return "Tien Mat";
}

export function calculateInitialRegion(startPoint, endPoint) {
  if (!startPoint || !endPoint) {
    throw new Error("Both startPoint and endPoint are required.");
  }

  const latitudeDelta = Math.abs(startPoint.latitude - endPoint.latitude) * 1.5;
  const longitudeDelta =
    Math.abs(startPoint.longitude - endPoint.longitude) * 1.5;

  const initialRegion = {
    latitude: (startPoint.latitude + endPoint.latitude) / 2,
    longitude: (startPoint.longitude + endPoint.longitude) / 2,
    latitudeDelta: latitudeDelta || 0.01, // Giá trị mặc định nhỏ nếu khoảng cách bằng 0
    longitudeDelta: longitudeDelta || 0.01,
  };

  return initialRegion;
}
