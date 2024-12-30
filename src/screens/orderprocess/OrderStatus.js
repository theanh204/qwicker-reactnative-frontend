import {
  View,
  Text,
  Dimensions,
  Animated,
  TouchableOpacity,
  Image,
  ScrollView,
} from "react-native";
import React, { useEffect, useReducer, useRef, useState } from "react";
import MapView, { Marker, Polyline } from "react-native-maps";
import call from "react-native-phone-call";
import {
  MaterialIcons,
  Ionicons,
  Entypo,
  Foundation,
  AntDesign,
  MaterialCommunityIcons,
  Feather,
} from "@expo/vector-icons";
import { Easing } from "react-native-reanimated";
import {
  averageRatingPoint,
  formatCurrency,
  getVNPaymentMethodName,
  uuidToNumber,
} from "../../features/ultils";
import { JOBSTATUS, POSTSTATUS, ROUTES } from "../../constants";
import { useDispatch, useSelector } from "react-redux";
import {
  getBasicUserToken,
  getCurrentShipperLocation,
  getWinShipper,
  retrieve,
} from "../../redux/basicUserSlice";
import { unwrapResult } from "@reduxjs/toolkit";
import { ALERT_TYPE, Toast } from "react-native-alert-notification";
import { getSocket } from "../../redux/socketSlice";
import { getDuration } from "../../redux/shipperSlice";
import Spinner from "react-native-loading-spinner-overlay";
const { width, height } = Dimensions.get("window");

const OrderStatus = ({ navigation, route }) => {
  const dispatch = useDispatch();
  const { access_token } = useSelector(getBasicUserToken);
  const ws = useSelector(getSocket);
  let { orderId } = route.params;
  const [post, setPost] = useState();
  const [shipper, setShipper] = useState();
  const [mapViewData, setMapViewData] = useReducer(
    (prev, next) => ({
      ...prev,
      ...next,
    }),
    {
      region: "",
      routeCoordinates: [],
    }
  );
  const [startPoint, setStartPoint] = useState();
  const [endPoint, setEndpoint] = useState();
  const [shipperPoint, setShipperPoint] = useState();
  const [loading, setLoading] = useState(false);
  // ---------------Marker Animation--------------
  const animatedColor = useRef(new Animated.Value(0)).current;
  const color = animatedColor.interpolate({
    inputRange: [0, 0.4, 0.8, 1],
    outputRange: [
      "rgba(254, 202, 202,0.2)",
      "rgba(252, 165, 165,0.2)",
      "rgba(248, 113, 113,0.2)",
      "rgba(248, 113, 113,0)",
    ],
  });
  const animatedScale = useRef(new Animated.Value(0)).current;
  const scale = animatedScale.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1], // <-- value that larger than your content's height
  });
  useEffect(() => {
    let title = "Thông Tin Đơn Hàng Của Bạn";
    if (post?.status === JOBSTATUS.PENDING) {
      title = "Đang Tìm Shipper";
    } else if (
      post?.status === JOBSTATUS.FOUND_SHIPPER ||
      post?.status === JOBSTATUS.CONFIRM_WITH_CUSTOMER
    ) {
      title = "Đợi Shipper";
    } else {
      title = "Shipper Đang Giao Hàng";
    }
    navigation.setOptions({
      headerTitle: title,
    });
  }, [post]);
  const getRoutePaths = (p1, p2) => {
    setLoading(true);
    dispatch(
      getDuration({
        lat1: p1.latitude,
        long1: p1.longitude,
        lat2: p2.latitude,
        long2: p2.longitude,
      })
    )
      .then(unwrapResult)
      .then((res) => {
        const routePath = res.routeLegs[0].itineraryItems.map((route) => ({
          latitude: route.maneuverPoint.coordinates[0],
          longitude: route.maneuverPoint.coordinates[1],
        }));
        setMapViewData({
          region: {
            latitude: (p1.latitude + p2.latitude) / 2,
            longitude: (p1.longitude + p2.longitude) / 2,
            latitudeDelta: Math.abs(p1.latitude - p2.latitude) * 2,
            longitudeDelta: Math.abs(p1.longitude - p2.longitude) * 2,
          },
          routeCoordinates: [p1, ...routePath, p2],
        });
        setLoading(false);
      })
      .catch((e) => {
        setLoading(false);
      });
  };
  //--------fetch post by id-------------
  useEffect(() => {
    let chanel = null;
    dispatch(retrieve({ access_token: access_token, orderId: orderId }))
      .then(unwrapResult)
      .then((res) => {
        setPost(res);
        setLoading(false);
        //----------------animation-------------------
        if (res.status === POSTSTATUS.PENDING) {
          Animated.loop(
            Animated.timing(animatedColor, {
              toValue: 1,
              duration: 2000,
              useNativeDriver: true,
              easing: Easing.linear,
            })
          ).start();
          Animated.loop(
            Animated.timing(animatedScale, {
              toValue: 1.5,
              duration: 2000,
              useNativeDriver: true,
              easing: Easing.linear,
            })
          ).start();
        }
        //---------------------websocket-----------------
        chanel = `/topic/post/${orderId}`;
        ws.subscribe(chanel, (message) => {
          const messageBody = JSON.parse(message.body);
          if (messageBody.messageType === "FOUND_SHIPPER") {
            setPost({
              ...JSON.parse(messageBody.postResponse),
              status: JOBSTATUS.FOUND_SHIPPER,
            });
            setShipper(JSON.parse(messageBody.shipperResponse));
            setLoading(true);
            dispatch(
              getCurrentShipperLocation({
                access_token: access_token,
                shipperId: messageBody.shipper.id,
              })
            )
              .then(unwrapResult)
              .then((shipperLocation) => {
                const sPoint = {
                  latitude: shipperLocation.latitude,
                  longitude: shipperLocation.longitude,
                };
                const ePoint = {
                  latitude: res?.pickupLocation?.latitude,
                  longitude: res?.pickupLocation?.longitude,
                };
                setStartPoint(sPoint);
                setEndpoint(ePoint);
                setShipperPoint(sPoint);
                getRoutePaths(sPoint, ePoint);
                setLoading(false);
              })
              .catch((e) => {
                setLoading(false);
              });
            Toast.show({
              type: ALERT_TYPE.SUCCESS,
              title: `Tìm thấy một shipper`,
            });
          } else if (messageBody.messageType === "SHIPPER_LOCATION") {
            setShipperPoint({
              latitude: messageBody.latitude,
              longitude: messageBody.longitude,
            });
          } else if (messageBody.messageType === "UPDATE_POST_STATUS") {
            //-------------Done------------
            if (JOBSTATUS.DELIVERED === messageBody.content) {
              Toast.show({
                type: ALERT_TYPE.SUCCESS,
                title: `Đơn Hàng Của Bạn Đã Được Giao`,
              });
              navigation.navigate(ROUTES.REVIEW_ORDER_DRAWER, {
                orderId: post.id,
              });
            } else if (JOBSTATUS.SHIPPED === messageBody.content) {
              //-------------The order has been picked up and is currently being shipped
              const ePoint = {
                latitude: post.pickupLocation.latitude,
                longitude: post.pickupLocation.longitude,
              };
              setEndpoint(ePoint);
              getRoutePaths(shipperPoint, ePoint);
            }
            setPost((prev) => {
              return { ...prev, status: messageBody.content };
            });
          }
        });
        //-----------------get winner---------------------
        if (!shipper && res.status != JOBSTATUS.PENDING) {
          setLoading(true);
          dispatch(
            getWinShipper({ access_token: access_token, orderId: res.id })
          )
            .then(unwrapResult)
            .then((shipper) => {
              setShipper(shipper);
              //------------get current shipper location--------------
              dispatch(
                getCurrentShipperLocation({
                  access_token: access_token,
                  shipperId: shipper.id,
                })
              )
                .then(unwrapResult)
                .then((shipperLocation) => {
                  const sPoint = {
                    latitude: shipperLocation.latitude,
                    longitude: shipperLocation.longitude,
                  };
                  const ePoint =
                    JOBSTATUS.SHIPPED === res.status
                      ? {
                          latitude: res?.dropLocation?.latitude,
                          longitude: res?.dropLocation?.longitude,
                        }
                      : {
                          latitude: res?.pickupLocation?.latitude,
                          longitude: res?.pickupLocation?.longitude,
                        };
                  setStartPoint(sPoint);
                  setEndpoint(ePoint);
                  setShipperPoint(sPoint);
                  getRoutePaths(sPoint, ePoint);
                  setLoading(false);
                })
                .catch((e) => {
                  setLoading(false);
                });
            })
            .catch((e) => {
              setLoading(false);
            });
        }
      });
    return () => {
      if (chanel) {
        ws.unsubscribe(chanel);
      }
    };
  }, [orderId]);
  useEffect(() => {
    navigation.getParent().setOptions({
      headerShown: false,
    });
    navigation.setOptions({
      headerLeft: () => (
        <TouchableOpacity onPress={handleBack}>
          <AntDesign name="left" size={16} color="black" />
        </TouchableOpacity>
      ),
    });
  });
  const handleBack = () => {
    navigation.getParent().setOptions({
      headerShown: true,
    });
    navigation.navigate("Đơn hàng");
  };
  return (
    <View className="flex-1 relative">
      {/* <Spinner
        visible={loading}
        spinnerKey={post?.id}
        size="large"
        animation="fade"
        className="z-50 absolute left-0 top-0 right-0 bottom-0"
      /> */}

      {JOBSTATUS.PENDING === post?.status ? (
        <MapView
          region={{
            latitude: post?.pickupLocation?.latitude,
            longitude: post?.pickupLocation?.longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01 * (width / height),
          }}
          className="h-full w-full"
        >
          <Marker
            coordinate={{
              latitude: post?.pickupLocation?.latitude,
              longitude: post?.pickupLocation?.longitude,
            }}
            className="relative flex justify-center items-center w-80 h-80"
          >
            <Animated.View
              style={{
                backgroundColor: color,
                width: 220,
                height: 220,
                borderRadius: 1000,
                transform: [{ scale: scale }],
              }}
            ></Animated.View>
            <View className="w-4 h-4 bg-red-500 rounded-full absolute bottom-1/2 right-1/2 translate-x-2 translate-y-2"></View>
          </Marker>
        </MapView>
      ) : (
        mapViewData.routeCoordinates.length > 0 && (
          <MapView
            className="w-full h-full"
            region={mapViewData.region}
            // provider={PROVIDER_GOOGLE}
          >
            <Marker coordinate={startPoint} />
            {shipperPoint && (
              <Marker.Animated coordinate={shipperPoint}>
                <Image
                  source={{ uri: shipper?.vehicle?.icon }}
                  style={{
                    width: 30,
                    height: 30,
                  }}
                  resizeMode="contain"
                />
              </Marker.Animated>
            )}
            <Marker coordinate={endPoint} />
            <Polyline
              strokeWidth={4}
              strokeColor="#3422F1"
              coordinates={mapViewData.routeCoordinates}
            />
          </MapView>
        )
      )}

      <ScrollView className="absolute left-0 top-2/4 right-0 bottom-0 px-4">
        {/* ------------Finding------------ */}
        <View className="flex-col items-center bg-white rounded-lg pt-4 mb-5">
          <MaterialIcons name="keyboard-arrow-up" size={24} color="#e5e7eb" />
          {post?.status == JOBSTATUS.PENDING && (
            <>
              <Text className="text-lg font-semibold py-1">
                Đang tìm tất cả shipper gần bạn
              </Text>
              <Text className="text-gray-500 mb-4">
                Vui lòng đợi trong ít phút
              </Text>
            </>
          )}
          {shipper && (
            <View className="flex-col bg-white rounded-lg">
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate(ROUTES.VIEW_FEEDBACK_STACK, {
                    shipper: shipper,
                  })
                }
                className="flex-row px-3 py-4"
              >
                <View className="basis-2/6 px-3">
                  <Image
                    source={{ uri: shipper?.user.avatar }}
                    className="h-14 w-14 rounded-full"
                  />
                </View>
                <View className="basis-4/6 flex-col space-y-1">
                  <Text>{`${shipper?.user?.firstName} ${shipper?.user?.lastName}`}</Text>
                  <View className="flex-row items-center space-x-1">
                    <AntDesign name="star" size={15} color="#FFB534" />
                    <Text className="text-xs text-gray-600">
                      {shipper?.ratings && averageRatingPoint(shipper?.ratings)}
                    </Text>
                  </View>
                  <View className="bg-gray-100 rounded-md px-1">
                    <Text className="text-xs text-gray-600 font-semibold">{`${shipper?.vehicleNumber} ${shipper?.vehicle.name}`}</Text>
                  </View>
                </View>
              </TouchableOpacity>
              <View className="flex-row border-t border-gray-200">
                <TouchableOpacity
                  activeOpacity={1}
                  className="flex-row flex-1 items-center justify-center py-3 border-r border-gray-100 space-x-2"
                >
                  <MaterialCommunityIcons
                    name="android-messages"
                    size={24}
                    color="#3422F1"
                  />
                  <Text className="font-medium">Nhắn Tin</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  activeOpacity={1}
                  onPress={() =>
                    call({
                      number: 123456789, // String value with the number to call
                      prompt: false, // Optional boolean property. Determines if the user should be prompted prior to the call
                      skipCanOpen: true, // Skip the canOpenURL check
                    })
                  }
                  className="flex-row flex-1 items-center justify-center space-x-2"
                >
                  <Feather name="phone" size={24} color="#3422F1" />
                  <Text className="font-medium">Gọi Điện</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>
        {/* ------------ Order sumary---------- */}
        <View className="flex-col bg-white rounded-lg mb-5">
          <View className="border-b border-gray-300 py-2">
            <Text className="text-gray-600 pl-4 py-1">
              {post?.vehicleType?.name}
            </Text>
          </View>
          {/* -----Time----- */}
          <View className="flex-col px-4 pt-6">
            <View className="flex-row">
              <View className="basis-1/6"></View>
              <View>
                <Text className="basis-5/6 text-gray-600">
                  {/* {pickupDatetime} */}
                </Text>
              </View>
            </View>
          </View>
          {/* -----Places and Payment method----- */}
          <View className="flex-col px-4 pb-4 space-y-4">
            {/* -----------Drop Location------------- */}
            <View className="flex-row ">
              <View className="basis-1/6 flex justify-center items-center">
                <Entypo name="circle" size={18} color="#3422F1" />
              </View>
              <View className="flex-col basis-5/6 ">
                <View className="flex-row items-center ">
                  <Text className="text-lg font-semibold">
                    {post?.pickupLocation?.addressLine}
                  </Text>
                  {post?.payment?.posterPay && (
                    <View className="ml-2 p-1 rounded-md bg-gray-300">
                      <Text>
                        {getVNPaymentMethodName(post?.payment?.paymentMethod)}
                      </Text>
                    </View>
                  )}
                </View>
                <Text className="text-gray-600">
                  {post?.pickupLocation?.formattedAddress}
                </Text>
              </View>
            </View>
            {/* -----------Pick up location------------- */}
            <View className="flex-row ">
              <View className="basis-1/6 flex justify-center items-center">
                <Foundation name="marker" size={28} color="#3422F1" />
              </View>
              <View className="flex-col basis-5/6 ">
                <View className="flex-row items-center ">
                  <Text className="text-lg font-semibold">
                    {post?.dropLocation?.addressLine}
                  </Text>
                  {!post?.payment?.posterPay && (
                    <View className="ml-2 p-1 rounded-md bg-gray-300">
                      <Text>
                        {getVNPaymentMethodName(post?.payment?.paymentMethod)}
                      </Text>
                    </View>
                  )}
                </View>
                <Text className="text-gray-600">
                  {post?.dropLocation?.formattedAddress}
                </Text>
              </View>
            </View>
          </View>
          {/* -----------------Share location---------------- */}
          <View className="border-t border-gray-300 py-4 flex justify-center items-center">
            <View className="flex-row items-center space-x-1">
              <Ionicons name="share-outline" size={24} color="black" />
              <Text className="text-lg font-semibold">Chia sẻ</Text>
            </View>
          </View>
        </View>

        {/* ------------ Additional info ---------- */}
        <View className="flex-col bg-white rounded-lg mb-5 ">
          <View className="border-b border-gray-300 py-2">
            <Text className="text-gray-600 pl-4 py-1">Thông tin thêm</Text>
          </View>
          <View className="px-4 border-b border-gray-300">
            <View className="flex-row justify-between items-center py-3">
              <View className="flex-col">
                <Text className="text-base  font-semibold">
                  {post?.id && uuidToNumber(post?.id)}
                </Text>
                <Text className="text-gray-600">Mã đơn hàng</Text>
              </View>
              <View>
                <MaterialIcons name="content-copy" size={24} color="black" />
              </View>
            </View>
          </View>
          <View className="px-4 border-b border-gray-300">
            <View className="flex-col py-3">
              <Text className="text-base  font-semibold">{`${post?.pickupLocation?.contact} ${post?.pickupLocation?.phoneNumber}`}</Text>
              <Text className="text-gray-600">Thông tin liên hệ</Text>
            </View>
          </View>
          <View className="flex-col px-4 pt-3 pb-5">
            <Text className="text-base font-semibold">
              {post?.product?.category.name}
            </Text>
            <Text className="text-base  font-semibold">
              {post?.product?.quantity} gói hàng
            </Text>
            <Text className="text-gray-600">Chi tiết đơn hàng</Text>
          </View>
        </View>
        {/* -----------------Fee---------------- */}
        <View className="flex-row justify-between items-center bg-white rounded-lg px-4 py-5 mb-14 ">
          <Text className="text-base font-semibold text-gray-600">
            {getVNPaymentMethodName(post?.payment?.paymentMethod)}
          </Text>
          <View className="flex-row space-x-2 items-center">
            <Text className="text-lg font-bold">
              {post?.payment?.price && formatCurrency(post?.payment?.price)}
            </Text>
            <AntDesign name="exclamationcircleo" size={20} color="black" />
          </View>
        </View>
      </ScrollView>
    </View>
  );
};
export default OrderStatus;
