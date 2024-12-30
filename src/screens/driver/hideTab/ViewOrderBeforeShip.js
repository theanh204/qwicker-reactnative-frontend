import { View, Text, TouchableOpacity, ScrollView, Image } from "react-native";
import React, { useEffect, useState } from "react";

import {
  Feather,
  MaterialCommunityIcons,
  Ionicons,
  Octicons,
  Foundation,
  Entypo,
  FontAwesome,
  AntDesign,
  MaterialIcons,
} from "@expo/vector-icons";
import {
  formatCurrency,
  formatMomentDateToVietnamese2,
  getCurrentLocation,
  uuidToNumber,
} from "../../../features/ultils";
import { LOCATION, POSTSTATUS, ROUTES } from "../../../constants";
import { useDispatch, useSelector } from "react-redux";
import {
  updateOrder,
  getToken,
  getOrder,
  collectCash,
} from "../../../redux/shipperSlice";
import { unwrapResult } from "@reduxjs/toolkit";
import call from "react-native-phone-call";
import Spinner from "react-native-loading-spinner-overlay";
import { ALERT_TYPE, Toast } from "react-native-alert-notification";
const ViewOrderBeforeShip = ({ navigation, route }) => {
  const dispatch = useDispatch();
  const [data, setData] = useState(route.params.data);
  const { access_token } = useSelector(getToken);
  const [showImage, setShowImage] = useState(false);
  const [loading, setLoading] = useState(false);
  const handleConfirmWithCustomer = () => {
    call({
      number: data?.pickupLocation.phoneNumber, // String value with the number to call
      prompt: false, // Optional boolean property. Determines if the user should be prompted prior to the call
      skipCanOpen: true, // Skip the canOpenURL check
    }).then(() => {
      if (data?.status === POSTSTATUS.FOUND_SHIPPER) {
        handleUpdateOrder(POSTSTATUS.CONFIRM_WITH_CUSTOMER);
      }
    });
  };

  const handleUpdateOrder = (status) => {
    setLoading(false);
    dispatch(
      updateOrder({
        access_token: access_token,
        orderId: data.id,
        body: {
          status: status,
        },
      })
    )
      .then(unwrapResult)
      .then((res) => {
        setData(res);
        setLoading(false);
      })
      .catch((e) => {
        console.log(e);
        setLoading(false);
      });
  };
  const handlePayment = () => {
    setLoading(false);
    dispatch(
      collectCash({
        access_token: access_token,
        orderId: data.id,
      })
    )
      .then(unwrapResult)
      .then(() => {
        navigation.navigate(ROUTES.ORDER_DRIVER_TAB);
        setLoading(false);
      })
      .catch((e) => {
        console.log(e);
        setLoading(false);
      });
  };
  const goToPickUpLocation = async () => {
    if (data?.status === POSTSTATUS.CONFIRM_WITH_CUSTOMER) {
      setLoading(true);
      const startPoint = await getCurrentLocation();
      setLoading(false);
      navigation.navigate(ROUTES.ROUTING_TAB, {
        locationType: LOCATION.pickupLocation,
        startPoint: startPoint,
        endPoint: data?.pickupLocation,
        data: data,
        title: "Lấy hàng...",
      });
    } else {
      Toast.show({
        type: ALERT_TYPE.WARNING,
        title: "Chưa thể tới nơi lấy hàng!",
        textBody: "Bạn cần liên hệ với khách hàng trước",
      });
    }
  };
  const goToDropLocation = async () => {
    if (data?.status === POSTSTATUS.SHIPPED) {
      setLoading(true);
      const startPoint = await getCurrentLocation();
      setLoading(false);
      navigation.navigate(ROUTES.ROUTING_TAB, {
        startPoint: startPoint,
        endPoint: data?.dropLocation,
        locationType: LOCATION.dropLocation,
        data: data,
        title: "Trả hàng...",
      });
    } else {
      Toast.show({
        type: ALERT_TYPE.WARNING,
        title: "Chưa thể tới nơi trả hàng!",
        textBody: "Bạn cần lấy hàng trước",
      });
    }
  };
  useEffect(() => {
    dispatch(
      getOrder({
        access_token: access_token,
        orderId: data.id,
      })
    )
      .then(unwrapResult)
      .then((res) => setData(res));
  }, []);
  return (
    <View className="p-2 flex-1 flex-col relative">
      <Spinner visible={loading} size="large" animation="fade" />
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* ----------------Contact with comsumer------------ */}
        <View className="p-4 bg-white flex-row items-center mb-4">
          <Text numberOfLines={1} className="font-semibold text-xl basis-10/12">
            Liên hệ khách hàng: {data?.pickupLocation.contact}
          </Text>
          <View className="basis-1/12 flex justify-center items-start">
            <MaterialCommunityIcons
              name="android-messages"
              size={24}
              color="#3422F1"
            />
          </View>
          <TouchableOpacity
            onPress={handleConfirmWithCustomer}
            className="basis-1/12 flex justify-center items-end"
          >
            <Feather name="phone" size={24} color="#3422F1" />
          </TouchableOpacity>
        </View>
        {/* ---------  Price-------------- */}
        <View className="flex-row bg-white p-4 space-x-4 items-center mb-4">
          <Ionicons name="cash-outline" size={24} color="#3422F1" />
          <View className="flex-col">
            <Text className="text-xl font-semibold">
              {formatCurrency(data?.payment.price)}
            </Text>
            <Text className="text-base font-medium text-gray-400 ">
              {data?.payment?.paymentMethod}
            </Text>
          </View>
        </View>
        {/* -----------Location, date time, uuid----------- */}
        <View className="flex-col bg-white p-4 mb-4 ">
          <View className="flex-row items-center justify-between">
            <Text className="text-base text-gray-500">
              {formatMomentDateToVietnamese2(
                data?.pickupDatetime ? data?.pickupDatetime : data?.postTime
              )}
            </Text>
            <Text className="text-gray-600 text-base">{`#${uuidToNumber(
              data?.id
            )}`}</Text>
          </View>
          <TouchableOpacity className="bg-blue-100 rounded-md flex-row space-x-2 py-3 px-6 my-4 items-center">
            <Foundation name="clipboard-pencil" size={24} color="black" />
            <Text>Cần xác nhận giao hàng thành công tại điểm trả hàng.</Text>
          </TouchableOpacity>

          <View className="flex-row space-x-2">
            <View className="mt-2 relative">
              <Entypo name="circle" size={18} color="#3422F1" />
            </View>

            <View className="basis-5/6 flex-col">
              <Text className="text-xl font-semibold">
                {data?.pickupLocation.addressLine}
              </Text>
              <Text className="text-lg text-gray-600">
                {data?.pickupLocation.formattedAddress}
              </Text>
              <Text className="text-lg text-gray-600">{`${data?.pickupLocation.contact}: ${data?.pickupLocation.phoneNumber}`}</Text>
            </View>
            {data?.status === POSTSTATUS.CONFIRM_WITH_CUSTOMER && (
              <TouchableOpacity
                onPress={goToPickUpLocation}
                className="basis-1/6 flex justify-center items-start"
              >
                <FontAwesome name="location-arrow" size={30} color="#3422F1" />
              </TouchableOpacity>
            )}
          </View>
          <View className="flex-row space-x-2">
            <View className="mt-2 relative">
              <Foundation name="marker" size={22} color="#3422F1" />
            </View>

            <View className="basis-5/6 flex-col mt-2">
              <Text className="text-xl font-semibold">
                {data?.dropLocation.addressLine}
              </Text>
              <Text className="text-lg text-gray-600">
                {data?.dropLocation.formattedAddress}
              </Text>
              <Text className="text-lg text-gray-600">{`${data?.dropLocation.contact}: ${data?.dropLocation.phoneNumber}`}</Text>
            </View>
            {data?.status === POSTSTATUS.SHIPPED && (
              <TouchableOpacity
                onPress={goToDropLocation}
                className="basis-1/6 flex justify-center items-start"
              >
                <FontAwesome name="location-arrow" size={30} color="#3422F1" />
              </TouchableOpacity>
            )}
          </View>
        </View>
        {/* -------------vehicleType, comment----------- */}
        <View className="flex-col bg-white p-4 mb-4 ">
          <Text className="font-semibold text-xl">
            {data?.vehicleType?.name}
          </Text>
          {data?.description && (
            <View className="flex-row items-center space-x-4 px-4 mt-2">
              <Octicons name="note" size={24} color="rgb(75 ,85 ,99)" />
              <Text className="text-base text-gray-600">
                {data?.description}
              </Text>
            </View>
          )}
        </View>
        {/* -------------ProductType----------- */}
        <View className="flex-row bg-white p-4 mb-2 space-x-2 items-center">
          <MaterialCommunityIcons
            name="format-list-bulleted-type"
            size={24}
            color="black"
          />
          <View className="flex-col">
            <Text className="text-xl font-semibold">
              {data?.product.category.name}
            </Text>
          </View>
        </View>
        {/* ----------Hình ảnh------------- */}
        <TouchableOpacity
          onPress={() => setShowImage(!showImage)}
          className="flex-col bg-white p-4 mb-2 space-x-2"
        >
          <View className="flex-col">
            <View className="flex-row justify-between">
              <Text className="text-lg font-medium">Hình ảnh</Text>
              {showImage ? (
                <MaterialIcons
                  name="keyboard-arrow-up"
                  size={24}
                  color="black"
                />
              ) : (
                <MaterialIcons
                  name="keyboard-arrow-down"
                  size={24}
                  color="black"
                />
              )}
            </View>
            {showImage && (
              <View className="flex justify-center items-center">
                <Image
                  source={{ uri: data?.product?.image }}
                  className="w-[150] h-[150]"
                />
              </View>
            )}
          </View>
        </TouchableOpacity>
        <View className="h-80"></View>
      </ScrollView>
      {/* -----------Confirm bottom btn---------- */}
      {data?.status === POSTSTATUS.FOUND_SHIPPER && (
        <View className="absolute left-0 right-0 bottom-0 bg-white border-t border-gray-300 px-4 py-6">
          <Text className="text-sm font-medium text-gray-400 text-center ">
            Xác nhận với khách hàng về các loại phí phát sinh
          </Text>
          <TouchableOpacity
            onPress={handleConfirmWithCustomer}
            className="rounded-lg w-full flex justify-center items-center h-14 mt-5 bg-[#3422F1]"
          >
            <Text className="text-lg font-medium text-white">
              Liên hệ với khách hàng
            </Text>
          </TouchableOpacity>
        </View>
      )}
      {data?.status === POSTSTATUS.CONFIRM_WITH_CUSTOMER && (
        <View className="absolute left-0 right-0 bottom-0 bg-white border-t border-gray-300 px-4 py-6">
          <TouchableOpacity
            onPress={goToPickUpLocation}
            className="rounded-lg w-full flex justify-center items-center h-14 mt-5 bg-[#3422F1]"
          >
            <Text className="text-lg font-medium text-white">
              Đến Nơi Lấy Hàng
            </Text>
          </TouchableOpacity>
        </View>
      )}
      {data?.status === POSTSTATUS.SHIPPED && (
        <View className="absolute left-0 right-0 bottom-0 bg-white border-t border-gray-300 px-4 py-6">
          <TouchableOpacity
            onPress={goToDropLocation}
            className="rounded-lg w-full flex justify-center items-center h-14 mt-5 bg-[#3422F1]"
          >
            <Text className="text-lg font-medium text-white">
              Đến Nơi Trả Hàng
            </Text>
          </TouchableOpacity>
        </View>
      )}
      {data?.status === POSTSTATUS.DELIVERED &&
        data?.payment.method?.id === "1" && (
          <View className="absolute left-0 right-0 bottom-0 bg-white border-t border-gray-300 px-4 py-6">
            <TouchableOpacity
              onPress={handlePayment}
              className="rounded-lg w-full flex justify-center items-center h-14 mt-5 bg-[#3422F1]"
            >
              <Text className="text-lg font-medium text-white">
                Thu Tiền Mặt
              </Text>
            </TouchableOpacity>
          </View>
        )}
    </View>
  );
};

export default ViewOrderBeforeShip;
