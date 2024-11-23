import { View, Text, Dimensions, TouchableOpacity, Image } from "react-native";
import React, { useEffect, useRef, useState } from "react";
import MapView, { Marker, Polyline } from "react-native-maps";
import { useDispatch, useSelector } from "react-redux";
import Spinner from "react-native-loading-spinner-overlay";
import {
  getDuration,
  getShipperProfile,
  getToken,
  updateOrder,
} from "../../../redux/shipperSlice";
import { unwrapResult } from "@reduxjs/toolkit";
import { Feather, Entypo, AntDesign, MaterialIcons } from "@expo/vector-icons";
import call from "react-native-phone-call";
import RBSheet from "react-native-raw-bottom-sheet";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import { LOCATION, POSTSTATUS, ROUTES } from "../../../constants";
import { ALERT_TYPE, Toast } from "react-native-alert-notification";

const { width, height } = Dimensions.get("window");
const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.01;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
const INIT_REGION = {
  latitude: 10.8203378,
  longitude: 106.6788052,
  latitudeDelta: LATITUDE_DELTA,
  longitudeDelta: LONGITUDE_DELTA,
};
const Routing = ({ navigation, route }) => {
  let { startPoint, endPoint, locationType } = route.params;
  const [data, setData] = useState(route.params.data);
  const dispatch = useDispatch();
  const { access_token } = useSelector(getToken);
  const [region, setRegion] = useState();
  const { vehicle } = useSelector(getShipperProfile);
  const [loading, setLoading] = useState(false);
  const [routeCoordinates, setRouteCoordinates] = useState([]);
  const [duration, setDuration] = useState();
  const [processArrived, setProcessArrived] = useState(0); //0: init, 1: show confirm box
  const fetchData = async () => {
    setLoading(true);
    dispatch(
      getDuration({
        lat1: startPoint.latitude,
        long1: startPoint.longitude,
        lat2: endPoint.latitude,
        long2: endPoint.longitude,
      })
    )
      .then(unwrapResult)
      .then((res) => {
        setDuration(res);
        const route = res.routeLegs[0].itineraryItems;
        const routePath = route.map((route) => ({
          latitude: route.maneuverPoint.coordinates[0],
          longitude: route.maneuverPoint.coordinates[1],
        }));
        setRouteCoordinates([
          { latitude: startPoint.latitude, longitude: startPoint.longitude },
          ...routePath,
          { latitude: endPoint.latitude, longitude: endPoint.longitude },
        ]);
        setRegion({
          latitude: (startPoint.latitude + endPoint.latitude) / 2,
          longitude: (startPoint.longitude + endPoint.longitude) / 2,
          latitudeDelta:
            Math.abs(startPoint.latitude - endPoint.latitude) * 1.5,
          longitudeDelta:
            Math.abs(startPoint.longitude - endPoint.longitude) * 1.5,
        });
        setLoading(false);
      })
      .catch((e) => {
        console.log(e);
        setLoading(false);
      });
  };
  useEffect(() => {
    fetchData();
  }, [locationType, data, endPoint]);
  const takePhotoRBS = useRef();

  const updatePost = (base64) => {
    setLoading(true);
    if (LOCATION.pickupLocation === locationType) {
      dispatch(
        updateOrder({
          access_token: access_token,
          orderId: data?.id,
          body: {
            status: POSTSTATUS.SHIPPED,
            photo: base64,
          },
        })
      )
        .then(unwrapResult)
        .then((res) => {
          setData(res);
          Toast.show({
            type: ALERT_TYPE.SUCCESS,
            title: "Lấy Hàng Thành Công!",
            textBody: "Giờ Hãy Giao Đến Điểm Hẹn",
          });
          navigation.navigate(ROUTES.VIEW_ORDER_BEFORE_SHIP, {
            data: res,
          });
          setLoading(false);
        })
        .catch((e) => {
          console.log(e);
          setLoading(false);
        });
    } else {
      dispatch(
        updateOrder({
          access_token: access_token,
          orderId: data.id,
          body: {
            status: POSTSTATUS.DELIVERED,
            photo: base64,
          },
        })
      )
        .then(unwrapResult)
        .then((res) => {
          setData(res);
          setLoading(false);
          Toast.show({
            type: ALERT_TYPE.SUCCESS,
            title: "Giao Hàng Thành Công Thành Công!",
          });
          navigation.navigate(ROUTES.VIEW_ORDER_BEFORE_SHIP, {
            data: res,
          });
        })
        .catch((e) => {
          console.log(e);
          setLoading(false);
        });
    }
  };

  const pickImage = async () => {
    let { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      alert("Permissions denied!");
    } else {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        quality: 0.5,
        base64: true,
      });
      if (!result.canceled) {
        const uri = result.assets[0]?.uri;
        if (uri) {
          try {
            const base64 = await FileSystem.readAsStringAsync(uri, {
              encoding: FileSystem.EncodingType.Base64,
            });
            takePhotoRBS.current.close();
            updatePost(base64);
            setProcessArrived(0);
          } catch (readError) {
            console.error("Error reading image as base64:", readError);
          }
        } else {
          console.log("Invalid avatar_user data:", result);
        }
      }
    }
  };

  const setShowTakePhotoRBS = (isShow) => {
    if (isShow) {
      takePhotoRBS.current.open();
      setProcessArrived(-99);
    } else {
      setProcessArrived(0);
      takePhotoRBS.current.close();
    }
  };

  return (
    <View className="flex-1 relative">
      <Spinner
        visible={loading}
        size="large"
        animation="fade"
        className="z-50 absolute left-0 top-0 right-0 bottom-0"
      />
      <MapView
        className="w-full h-full"
        region={region}
        initialRegion={INIT_REGION}
        loadingEnabled={true}
        loadingIndicatorColor="#3422F1"
        // provider={PROVIDER_GOOGLE}
      >
        {duration && (
          <Marker.Animated coordinate={startPoint}>
            <Image
              source={{ uri: vehicle?.icon }}
              style={{
                width: 30,
                height: 30,
              }}
              resizeMode="contain"
            />
          </Marker.Animated>
        )}
        {duration && <Marker coordinate={endPoint} />}

        {routeCoordinates.length > 0 && (
          <Polyline
            strokeWidth={4}
            strokeColor="#3422F1"
            coordinates={routeCoordinates}
          />
        )}
      </MapView>
      {processArrived === 0 && (
        <View className="absolute left-0 right-0 bottom-4 p-2 h-40 flex-col items-end">
          <View className="p-4 bg-white flex-row items-center mb-4  h-14 ">
            <Text
              numberOfLines={1}
              className="font-semibold text-xl basis-10/12"
            >
              Liên hệ: {endPoint.contact}
            </Text>
            <TouchableOpacity
              onPress={() =>
                call({
                  number: endPoint.phoneNumber, // String value with the number to call
                  prompt: false, // Optional boolean property. Determines if the user should be prompted prior to the call
                  skipCanOpen: true, // Skip the canOpenURL check
                })
              }
              className="basis-2/12 flex justify-center items-end"
            >
              <Feather name="phone" size={24} color="#3422F1" />
            </TouchableOpacity>
          </View>

          <View className="w-full">
            <TouchableOpacity
              onPress={() => setProcessArrived(1)}
              className="rounded-lg flex justify-center items-center w-full h-14 p-4 bg-[#3422F1]"
            >
              <Text className="text-lg font-medium text-white">Đã Tới</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
      {processArrived == 1 && (
        <View className="h-52 w-full pt-3 pb-8 flex justify-center items-start absolute bottom-0 left-0 right-0 rounded-2xl bg-white">
          <Text className="text-xl font-bold px-5">
            Bạn có muốn nhận hàng tại đây?
          </Text>

          <TouchableOpacity
            onPress={() => setShowTakePhotoRBS(true)}
            className="h-full w-full px-5 flex-1 "
          >
            <View className=" h-full w-full flex justify-center items-start border-b-2 border-gray-400">
              <Text className="text-base text-gray-700 font-bold ">
                Vâng, nhận hàng tại đây
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setProcessArrived(0)}
            className="h-full w-full px-5 flex-1 flex justify-center items-start  "
          >
            <Text className="text-base text-gray-700 font-bold ">
              Không, tôi không muốn nhận ở đây
            </Text>
          </TouchableOpacity>
        </View>
      )}

      <RBSheet
        ref={takePhotoRBS}
        customStyles={{
          wrapper: {
            backgroundColor: "rgba(0,0,0,0.3)",
          },
          draggableIcon: {
            backgroundColor: "#000",
          },
          container: {
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            overflow: "hidden",
            height: 140,
          },
        }}
      >
        <View className="h-full w-full flex-col bg-white">
          <TouchableOpacity
            onPress={() => setShowTakePhotoRBS(false)}
            className="px-5 pt-5 pb-2"
          >
            <MaterialIcons name="keyboard-arrow-left" size={28} color="black" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={pickImage}
            className="w-full px-5 flex-row justify-start items-start space-x-1 h-full pt-2 "
          >
            <AntDesign name="camera" size={24} color="#3422F1" />
            <Text className="text-lg font-medium">Thêm ảnh</Text>
          </TouchableOpacity>
        </View>
      </RBSheet>
    </View>
  );
};

export default Routing;
