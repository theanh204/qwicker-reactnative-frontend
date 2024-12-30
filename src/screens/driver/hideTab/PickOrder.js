import { View, Text, TouchableOpacity, Image } from "react-native";
import React, { useEffect, useState } from "react";
import {
  MaterialIcons,
  Entypo,
  Foundation,
  Ionicons,
  Octicons,
} from "@expo/vector-icons";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { useDispatch, useSelector } from "react-redux";
import {
  getDistance,
  getNumShipperJoined,
  getShipperProfile,
  getToken,
} from "../../../redux/shipperSlice";
import { unwrapResult } from "@reduxjs/toolkit";
import { formatCurrency, getCurrentLocation } from "../../../features/ultils";
import { ALERT_TYPE, Toast } from "react-native-alert-notification";
import Spinner from "react-native-loading-spinner-overlay";
import { LOCATION, ROUTES } from "../../../constants";
import { CountdownCircleTimer } from "react-native-countdown-circle-timer";
import { getSocket } from "../../../redux/socketSlice";
const PickOrder = ({ route, navigation }) => {
  const { data } = route.params;
  const {
    product,
    payment,
    vehicleType,
    pickupLocation,
    dropLocation,
    ...order
  } = data;
  const [showImage, setShowImage] = useState(false);
  const [loading, setLoading] = useState(false);
  const [distance, setDistance] = useState();
  const [numShipperJoin, setNumShipperJoin] = useState(2);
  const [isJoined, setIsJoined] = useState(false);
  const { id } = useSelector(getShipperProfile);
  const { access_token } = useSelector(getToken);
  const [isPostTaken, setIsPostTaken] = useState(false);
  const dispatch = useDispatch();
  const ws = useSelector(getSocket);
  useEffect(() => {
    setLoading(true);
    dispatch(
      getDistance({
        origin: `${pickupLocation.latitude},${pickupLocation.longitude}`,
        destination: `${dropLocation.latitude},${dropLocation.longitude}`,
      })
    )
      .then(unwrapResult)
      .then((res) => {
        setDistance(res);
        setLoading(false);
      })
      .catch((err) => {
        Toast.show({
          type: ALERT_TYPE.WARNING,
          title: "Tính quãng đường không thành công",
        });
        setLoading(false);
      });

    dispatch(getNumShipperJoined({ token: access_token, jobId: data.id }))
      .then(unwrapResult)
      .then((res) => {
        setNumShipperJoin(res);
      })
      .catch((err) => {
        setNumShipperJoin(0);
      });
    let postSubscription = null;
    if (ws && ws.connected) {
      postSubscription = ws.subscribe(`/topic/post/${data.id}`, (message) => {
        const messageBody = JSON.parse(message.body);
        if (messageBody.messageType === "NUM_SHIPPER_JOINED") {
          setNumShipperJoin(messageBody.content);
        } else if (messageBody.messageType === "FOUND_SHIPPER") {
          const shipper = messageBody.shipper;
          const post = messageBody.post;
          setIsPostTaken(true);
          if (shipper.id === id) {
            Toast.show({
              type: ALERT_TYPE.SUCCESS,
              title: "Nhận đơn hàng thành công!",
            });
            navigation.navigate(ROUTES.VIEW_ORDER_BEFORE_SHIP, { data: post });
          } else if (messageBody.messageType === "POST_WAS_TAKEN") {
            if (isJoined) {
              Toast.show({
                type: ALERT_TYPE.WARNING,
                title: "Tham gia thất bại",
                textBody: "Đơn hàng này đã được nhận bởi người khác",
              });
              postSubscription.unsubscribe();
              navigation.navigate(ROUTES.FIND_ORDER_DRIVER_TAB, {
                removePostID: data.id,
              });
            }
          }
        }
      });
    }
    return () => {
      if (postSubscription) {
        postSubscription.unsubscribe();
      }
    };
  }, [data]);

  const handleJoinJob = () => {
    if (!isJoined && !isPostTaken) {
      setIsJoined(true);
      if (ws && ws.connected) {
        ws.publish({
          destination: `/app/post/${data.id}`,
          body: {
            messageType: "REQUEST_JOIN_POST",
          },
        });
      } else {
        Toast.show({
          type: ALERT_TYPE.WARNING,
          title: "Tham gia thất bại",
          textBody: "Lỗi hệ thống do websocket",
        });
      }
    } else {
      Toast.show({
        type: ALERT_TYPE.WARNING,
        title: "Tham gia thất bại",
        textBody: "Đơn hàng này đã được nhận bởi người khác",
      });
      navigation.navigate(ROUTES.FIND_ORDER_DRIVER_TAB, {
        removePostID: data.id,
      });
    }
  };

  const viewDistance = async (type) => {
    if (type === LOCATION.pickupLocation) {
      setLoading(true);
      const startPoint = await getCurrentLocation();
      setLoading(false);
      navigation.navigate(ROUTES.DRIVER_VIEW_DISTANCE, {
        locationType: type,
        startPoint: startPoint,
        endPoint: pickupLocation,
        data: data,
      });
    } else {
      navigation.navigate(ROUTES.DRIVER_VIEW_DISTANCE, {
        startPoint: pickupLocation,
        endPoint: dropLocation,
        locationType: type,
        data: data,
      });
    }
  };

  return (
    <View className="flex-1">
      <Spinner visible={loading} size="large" animation="fade" />
      <View className="px-4 bg-[#3422F1] pb-8">
        <Text className="text-lg font-medium text-white ">Nhận đơn ngay</Text>
        <Text className="text-base text-white my-1">Cách ~ {distance}</Text>
      </View>
      <View className="relative  flex-1">
        <View className="absolute left-0 right-0 px-4 top-[-20] z-10">
          {/* ----------Location---------- */}
          <View className="flex-col bg-white rounded-lg border border-gray-300 pb-4 mb-2">
            <View className="py-2">
              <Text className="text-gray-600 pl-4 py-1">
                {distance?.travelDistance} {distance?.distanceUnit}
              </Text>
            </View>
            <View className="flex-col space-y-4">
              {/* -----------Delivery Address------------- */}
              <TouchableOpacity
                onPress={() => viewDistance(LOCATION.pickupLocation)}
                className="flex-row "
              >
                <View className="basis-1/6 flex justify-center items-center">
                  <Entypo name="circle" size={18} color="#3422F1" />
                </View>
                <View className="flex-col basis-5/6 ">
                  <Text className="text-lg font-semibold">
                    {pickupLocation.addressLine}
                  </Text>
                  <Text className="text-gray-600">
                    {pickupLocation.formattedAddress}
                  </Text>
                </View>
              </TouchableOpacity>
              {/* -----------Pick up------------- */}
              <TouchableOpacity
                onPress={() => viewDistance(LOCATION.dropLocation)}
                className="flex-row "
              >
                <View className="basis-1/6 flex justify-center items-center">
                  <Foundation name="marker" size={28} color="#3422F1" />
                </View>
                <View className="flex-col basis-5/6 ">
                  <Text className="text-lg font-semibold">
                    {dropLocation.addressLine}
                  </Text>
                  <Text className="text-gray-600">
                    {dropLocation.formattedAddress}
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>

          {/* ----------Hình ảnh------------- */}
          <TouchableOpacity
            onPress={() => setShowImage(!showImage)}
            className="flex-col bg-white rounded-lg border border-gray-300 p-4 mb-2"
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
                    source={{ uri: product?.image }}
                    className="w-[150] h-[150]"
                  />
                </View>
              )}
            </View>
          </TouchableOpacity>
          {/* ----------vehicleType---------- */}
          {vehicleType && (
            <View className="flex-col bg-white rounded-lg border border-gray-300 p-4 mb-2">
              <View className="flex-col">
                <View className="flex-row justify-between">
                  <Text className="text-lg font-medium">
                    {vehicleType?.name}
                  </Text>
                </View>

                {order.descripttion && (
                  <View className="flex-row items-center space-x-2 pt-3">
                    <Octicons name="note" size={24} color="rgb(75 ,85 ,99)" />
                    <Text className="text-base text-gray-600">
                      {order?.descripttion}
                    </Text>
                  </View>
                )}
              </View>
            </View>
          )}

          {/* ----------Price---------- */}
          <View className="flex-row bg-white rounded-lg border border-gray-300 p-4 mb-2 space-x-4 items-center">
            <Ionicons name="cash-outline" size={24} color="#3422F1" />
            <View className="flex-col">
              <Text className="text-xl font-semibold">
                đ{formatCurrency(payment.price)}
              </Text>
              <Text className="text-base font-medium text-gray-400 ">
                {payment?.paymentMethod}
              </Text>
            </View>
          </View>
          {/* ----------Product type---------- */}
          <View className="flex-row bg-white rounded-lg border border-gray-300 p-4 mb-2 space-x-4 items-center">
            <FontAwesome5 name="bars" size={24} color="#3422F1" />
            <View className="flex-col">
              <Text className="text-xl font-semibold">
                {product.category.name}
              </Text>
            </View>
          </View>
        </View>
        {/* ---------Confirm Button Sheet-------- */}
        <View className="absolute left-0 right-0 bottom-0 bg-white border-t border-gray-300 px-4 py-6 z-40">
          <View className="flex-row space-x-2">
            <CountdownCircleTimer
              isPlaying={isJoined}
              duration={7}
              size={50}
              colors="#3422F1"
            >
              {({ remainingTime }) => (
                <Text className="text-[#3422F1] font-medium">
                  {remainingTime}
                </Text>
              )}
            </CountdownCircleTimer>
            <View className="flex items-start">
              <Text className="text-xl font-semibold">
                {isJoined ? "Đừng rời đi" : "Hãy trở thành người đầu tiên"}
              </Text>
              <Text className="text-base font-medium text-gray-400 ">
                {numShipperJoin} Tài xế đang tham gia
              </Text>
            </View>
          </View>
          <TouchableOpacity
            onPress={handleJoinJob}
            className="rounded-lg w-full flex justify-center items-center h-14 mt-5 bg-[#3422F1]"
          >
            <Text className="text-lg font-medium text-white">
              Tham gia ngay
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default PickOrder;
