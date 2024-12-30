import { View, Text, TouchableOpacity } from "react-native";
import React, { memo, useReducer, useRef, useState } from "react";
import {
  Foundation,
  Entypo,
  MaterialIcons,
  AntDesign,
  Ionicons,
} from "@expo/vector-icons";
import RBSheet from "react-native-raw-bottom-sheet";
import DatePicker from "react-native-modern-datepicker";

import {
  formatDateTimeToVietnamese,
  getCurrentDate,
} from "../../features/ultils";
import {
  DELIVERY_TIME_TYPE,
  LOCATION,
  ROUTES,
  SHIPMENTYPE,
} from "../../constants";
import { useDispatch, useSelector } from "react-redux";
import { setTypeChoosingLocation } from "../../redux/appSlice";
import {
  addDate,
  addTime,
  getDate,
  getDeliveryAddress,
  getPickUP,
  getShipmentType,
  getTime,
  isDateTimeFulFill,
  setShipmentTypeToNow,
} from "../../redux/shipmentSlice";
import { useNavigation } from "@react-navigation/native";

const LocationDatePicker = () => {
  const dispath = useDispatch();
  const navigation = useNavigation();
  const pickUp = useSelector(getPickUP);
  const deliveryAddress = useSelector(getDeliveryAddress);

  const displayLocation = (type) => {
    switch (type) {
      case LOCATION.pickupLocation:
        if (pickUp.addressLine) return pickUp.addressLine;
        if (pickUp.formattedAddress) return pickUp.formattedAddress;
      case LOCATION.dropLocation:
        if (deliveryAddress.addressLine) return deliveryAddress.addressLine;
        if (deliveryAddress.formattedAddress)
          return deliveryAddress.formattedAddress;
    }
    return "";
  };

  const handleChooseLocation = (type) => {
    dispath(setTypeChoosingLocation(type));
    navigation.navigate(
      displayLocation(type) ? ROUTES.MAP_STACK : ROUTES.ADDRESS_INPUTER_STACK
    );
  };
  //    Date time
  const refRBSheet = useRef();
  const [data, updateData] = useReducer(
    (prev, next) => ({
      ...prev,
      ...next,
    }),
    {
      date: useSelector(getDate),
      time: useSelector(getTime),
      deliveryTimeType: useSelector(getShipmentType),
      showDateTimePicker: useSelector(isDateTimeFulFill),
    }
  );
  let dateTimeFulFill = data.date !== null && data.time !== null;
  const openButtonSheet = () => {
    refRBSheet.current.open();
  };
  const pickCurrentDate = () => {
    dispath(setShipmentTypeToNow());
    updateData({
      showDateTimePicker: false,
      deliveryTimeType: DELIVERY_TIME_TYPE.NOW,
      date: null,
      time: null,
    });
    refRBSheet.current.close();
  };
  const handleSetDateTime = () => {
    if (data.date !== null) {
      dispath(addDate(data.date));
      dispath(addTime(data.time));
      updateData({
        showDateTimePicker: false,
        deliveryTimeType: DELIVERY_TIME_TYPE.LATTER,
      });
      refRBSheet.current.close();
    }
  };
  return (
    <View className="px-4 pt-2 relative">
      {/* -----------Location---------- */}
      <View className=" rounded-xl py-3  flex-col border border-gray-200">
        {dateTimeFulFill && (
          <TouchableOpacity
            className="flex-row items-center py-2 pl-6 space-x-3 border-b border-gray-300"
            onPress={openButtonSheet}
          >
            <AntDesign name="calendar" size={24} color="black" />
            <Text className="font-bold">{`Lấy hàng ${formatDateTimeToVietnamese(
              data.date,
              data.time
            )}`}</Text>
          </TouchableOpacity>
        )}
        <View className="flex-row px-4 pt-2">
          <View className="basis-1/6 flex-col justify-center space-y-2">
            <View className="flex items-center w-10">
              <Entypo name="circle" size={18} color="#3422F1" />
            </View>
            <View className="flex items-center w-10">
              <Foundation name="marker" size={22} color="#3422F1" />
            </View>
          </View>
          <View className="basis-5/6 ml-[-12] ">
            <View className="flex-row justify-between items-center border-b border-gray-300 py-2">
              <TouchableOpacity
                onPress={() => handleChooseLocation(LOCATION.pickupLocation)}
              >
                {displayLocation(LOCATION.pickupLocation) ? (
                  <Text className="font-medium text-sm">
                    {displayLocation(LOCATION.pickupLocation)}
                  </Text>
                ) : (
                  <Text className="font-medium text-sm text-gray-600">
                    Địa điểm lấy hàng
                  </Text>
                )}
              </TouchableOpacity>
              {!dateTimeFulFill && (
                <TouchableOpacity
                  onPress={openButtonSheet}
                  className="flex-row space-x-1"
                >
                  <Text className="text-base font-medium">Ngay bây giờ</Text>
                  <MaterialIcons
                    name="keyboard-arrow-down"
                    size={24}
                    color="black"
                  />
                </TouchableOpacity>
              )}
            </View>
            <TouchableOpacity
              onPress={() => handleChooseLocation(LOCATION.dropLocation)}
              className="py-2 flex-row justify-between items-center "
            >
              {displayLocation(LOCATION.dropLocation) ? (
                <Text className="font-medium text-sm">
                  {displayLocation(LOCATION.dropLocation)}
                </Text>
              ) : (
                <Text className="font-medium text-sm text-gray-600">
                  Địa điểm trả hàng
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
      {/* ----------DateTime----------- */}
      <RBSheet
        ref={refRBSheet}
        customStyles={{
          wrapper: {
            backgroundColor: "rgba(0,0,0,0.4)",
          },
          draggableIcon: {
            backgroundColor: "#000",
          },
          container: {
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            overflow: "hidden",
            height: data.showDateTimePicker ? 650 : 190,
          },
        }}
        onClose={() => {
          if (!dateTimeFulFill) {
            dispath(setShipmentTypeToNow());
            updateData({
              showDateTimePicker: false,
              deliveryTimeType: DELIVERY_TIME_TYPE.NOW,
            });
          }
        }}
      >
        <View className="h-full w-full px-4 py-5 flex-col justify-center">
          <View className="mb-4">
            <Text className="text-xl font-semibold">Thời gian nhận hàng</Text>
          </View>
          <TouchableOpacity
            className="border-b border-gray-400 py-3 relative flex-row items-center"
            onPress={pickCurrentDate}
          >
            <View className="flex-row space-x-3 items-center">
              <Ionicons name="alarm-outline" size={24} color="black" />
              <Text className="text-lg">Ngay bây giờ</Text>
            </View>
            {data.deliveryTimeType === DELIVERY_TIME_TYPE.NOW && (
              <View className="absolute right-0">
                <AntDesign name="checkcircle" size={26} color="#3422F1" />
              </View>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            className="flex-row items-center space-x-3 py-3 relative"
            onPress={() =>
              updateData({
                showDateTimePicker: true,
                deliveryTimeType: DELIVERY_TIME_TYPE.LATTER,
              })
            }
          >
            <View className="flex-row space-x-3 items-center">
              <AntDesign name="calendar" size={24} color="black" />
              <Text className="text-lg">
                {dateTimeFulFill
                  ? formatDateTimeToVietnamese(data.date, data.time)
                  : "Đặt lịch giao và nhận hàng"}
              </Text>
            </View>
            {data.deliveryTimeType === DELIVERY_TIME_TYPE.LATTER && (
              <View className="absolute right-0">
                <AntDesign name="checkcircle" size={26} color="#3422F1" />
              </View>
            )}
          </TouchableOpacity>

          {data.showDateTimePicker && (
            <>
              <DatePicker
                className="rounded-lg py-2"
                minuteInterval={5}
                current={getCurrentDate()}
                minimumDate={getCurrentDate()}
                onTimeChange={(selectedTime) =>
                  updateData({ time: selectedTime })
                }
                onDateChange={(selectedDate) =>
                  updateData({ date: selectedDate })
                }
              />
              <TouchableOpacity
                onPress={handleSetDateTime}
                className="flex justify-center items-center py-3 rounded-lg bg-gray-400"
                style={data.date && { backgroundColor: "#3422F1" }}
              >
                <Text className="text-lg font-bold text-white">
                  Đặt lịch giao
                </Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </RBSheet>
    </View>
  );
};

export default memo(LocationDatePicker);
