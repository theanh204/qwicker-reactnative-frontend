import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { DELIVERY_TIME_TYPE, ROUTES } from "../../../constants";
import {
  Entypo,
  Foundation,
  Octicons,
  Ionicons,
  SimpleLineIcons,
} from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import {
  getDiffBetweenTwoTime,
  formatMomentDateToVietnamese,
  formatCurrency,
} from "../../../features/ultils";

const Order = ({ data }) => {
  const { payment, product, dropLocation, pickupLocation, ...p } = data;
  const navigation = useNavigation();
  var moment = require("moment-timezone");
  moment.tz.setDefault("Asia/Ho_Chi_Minh");
  const orderTime = moment(p.deliveryTimeRequest || p.postTime);
  const getType = () => {
    if (p.deliveryTimeType === DELIVERY_TIME_TYPE.NOW) {
      return "now";
    } else {
      const restTime = getDiffBetweenTwoTime(p.pickupDatetime || p.postTime);
      if (restTime.day >= 1) {
        return "later";
      } else {
        return "today";
      }
    }
  };
  const type = getType();
  const headerColor =
    type === "now"
      ? "bg-orange-500"
      : type === "today"
      ? "bg-yellow-500"
      : "bg-[#3422F1]";
  const headerTitle =
    type === "now"
      ? "Giao ngay"
      : type === "today"
      ? "Hôm nay"
      : formatMomentDateToVietnamese(p.pickupDatetime || p.postTime);
  const headerTime =
    orderTime.minute() < 10
      ? `${orderTime.hour()}:0${orderTime.minute()}`
      : `${orderTime.hour()}:${orderTime.minute()}`;
  return (
    <TouchableOpacity
      onPress={() =>
        navigation.navigate(ROUTES.PICK_ORDER_DRIVER_TAB, { data: data })
      }
      className="flex-col rounded-md overflow-hidden my-2 bg-white pb-3"
    >
      <View
        className={`flex-row justify-between items-center p-3 ${headerColor}`}
      >
        <Text className="text-lg text-white">{headerTitle}</Text>
        {type !== "now" && (
          <View className="flex-row items-center space-x-1">
            <SimpleLineIcons name="clock" size={18} color="white" />
            <Text className="text-lg font-medium text-white">{headerTime}</Text>
          </View>
        )}
      </View>
      <View className="flex-row px-4 pt-2">
        <View className="basis-1/6 flex-col justify-center space-y-3">
          <View className="flex items-center w-10">
            <Entypo name="circle" size={18} color="#3422F1" />
          </View>
          <View className="flex items-center w-10">
            <Foundation name="marker" size={22} color="#3422F1" />
          </View>
        </View>
        <View className="basis-5/6 ml-[-12] ">
          <View>
            <Text className="font-medium text-lg">
              {pickupLocation.addressLine}
            </Text>
          </View>
          <View className="py-2 flex-row justify-between items-center ">
            <Text className="font-medium text-lg">
              {dropLocation.addressLine}
            </Text>
          </View>
        </View>
      </View>
      {p.descripttion && (
        <View className="flex-row items-center space-x-4 px-4 mt-2">
          <Octicons name="note" size={24} color="rgb(75 ,85 ,99)" />
          <Text className="text-base text-gray-600">{p.descripttion}</Text>
        </View>
      )}
      <View className="flex-row justify-between items-center p-4 ">
        <View className="flex-row items-center space-x-1">
          <Ionicons name="cash-outline" size={24} color="#3422F1" />
          <Text>{payment.paymentMethod}</Text>
        </View>
        <Text className="text-xl font-semibold">
          đ{formatCurrency(payment.price)}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default Order;
