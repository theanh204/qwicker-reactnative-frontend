import { View, Text } from "react-native";
import React, { useState } from "react";
import { ROUTES } from "../../constants";
import { AntDesign } from "@expo/vector-icons";
const CompleteRegister = ({ navigation }) => {
  const [info1] = useState(true);
  const [info2] = useState(false);

  return (
    <View className="flex-1 px-4 py-6 flex-col justify-between">
      <View>
        <Text className="text-2xl font-semibold py-2">
          Cảm ơn bạn đã đăng ký!
        </Text>
        <Text className="text-base text-gray-600">
          Sẽ chỉ mất 1 ngày để xác thực những thông tin bạn đã gửi
        </Text>
        <Text className="text-gray-600 font-medium mt-7 mb-4">
          Những thông tin đã được duyệt
        </Text>
        <View
          style={{
            backgroundColor: info2
              ? "rgb(220, 252, 231)"
              : "rgb(209, 213, 219)",
          }}
          className="flex-row justify-between items-center p-4 py-3  rounded-lg mb-3"
        >
          <View>
            <Text
              className="text-lg font-semibold"
              style={{ color: info2 ? "rgb(22 ,163, 74)" : "rgb(75, 85, 99)" }}
            >
              {info2 ? "Đã chấp nhận" : "Đang duyệt"}
            </Text>
            <Text className="text-xl font-semibold">Thông tin cá nhân</Text>
          </View>
          {info2 ? (
            <AntDesign name="checkcircle" size={24} color="rgb(20, 83, 45)" />
          ) : (
            <AntDesign name="clockcircleo" size={24} color="black" />
          )}
        </View>

        <View
          style={{
            backgroundColor: info2
              ? "rgb(220, 252, 231)"
              : "rgb(209, 213, 219)",
          }}
          className="flex-row justify-between items-center p-4 py-3  rounded-lg mb-3"
        >
          <View>
            <Text
              className="text-lg font-semibold"
              style={{ color: info2 ? "rgb(22 ,163, 74)" : "rgb(75, 85, 99)" }}
            >
              {info2 ? "Đã chấp nhận" : "Đang duyệt"}
            </Text>
            <Text className="text-xl font-semibold">Thông tin phương tiện</Text>
          </View>
          {info2 ? (
            <AntDesign name="checkcircle" size={24} color="rgb(20, 83, 45)" />
          ) : (
            <AntDesign name="clockcircleo" size={24} color="black" />
          )}
        </View>

        <View
          style={{
            backgroundColor: info1
              ? "rgb(220, 252, 231)"
              : "rgb(209, 213, 219)",
          }}
          className="flex-row justify-between items-center p-4 py-3  rounded-lg mb-3"
        >
          <View>
            <Text
              className="text-lg font-semibold"
              style={{ color: info1 ? "rgb(22 ,163, 74)" : "rgb(75, 85, 99)" }}
            >
              {info1 ? "Đã chấp nhận" : "Đang duyệt"}
            </Text>
            <Text className="text-xl font-semibold">Tạo tài khoản</Text>
          </View>
          {info1 ? (
            <AntDesign name="checkcircle" size={24} color="rgb(20, 83, 45)" />
          ) : (
            <AntDesign name="clockcircleo" size={24} color="black" />
          )}
        </View>
      </View>
    </View>
  );
};

export default CompleteRegister;
