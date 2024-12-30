import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { Entypo, Foundation, Octicons, Ionicons } from "@expo/vector-icons";
import {
  formatCurrency,
  getTitleDependStatus,
  uuidToNumber,
} from "../../../features/ultils";
import { useNavigation } from "@react-navigation/native";

const OrderItem = ({ data, TO_ROUTE }) => {
  const navigation = useNavigation();
  const handleNavigate = () => {
    navigation.navigate(TO_ROUTE, { data: data });
  };
  return (
    <TouchableOpacity
      onPress={handleNavigate}
      className="flex-col bg-white rounded-xl overflow-hidden my-3"
    >
      <View className="flex-row justify-between items-center p-3 bg-orange-500">
        <Text className="text-white text-lg font-semibold ">
          {data?.status && getTitleDependStatus(data?.status)}
        </Text>
        {/* <View className="flex-row items-center space-x-1">
            <Text className="text-lg font-medium text-gray-500">
              {formatMomentDateToVietnamese2(shipment.pickupDatetime)}
            </Text>
          </View> */}
      </View>

      <View className="flex-row items-center justify-between pt-4 pb-2 px-4">
        <Text className="text-gray-600 text-sm">{`3.65 kilomet`}</Text>
        <Text className="text-gray-600 text-sm">
          {data?.id && uuidToNumber(data?.id)}
        </Text>
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
              {data?.pickupLocation.addressLine}
            </Text>
          </View>
          <View className="py-2 flex-row justify-between items-center ">
            <Text className="font-medium text-lg">
              {data?.dropLocation.addressLine}
            </Text>
          </View>
        </View>
      </View>

      {data?.description && (
        <View className="flex-row items-center space-x-4 px-4 mt-2">
          <Octicons name="note" size={24} color="rgb(75 ,85 ,99)" />
          <Text className="text-base text-gray-600">{data?.description}</Text>
        </View>
      )}
      <View className="flex-row justify-between items-center p-4">
        <View className="flex-row items-center space-x-1">
          <Ionicons name="cash-outline" size={24} color="#3422F1" />
          <Text className="text-base">{data?.payment?.paymentMethod}</Text>
        </View>
        <Text className="text-xl font-semibold">
          {formatCurrency(data?.payment?.price)}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default OrderItem;
