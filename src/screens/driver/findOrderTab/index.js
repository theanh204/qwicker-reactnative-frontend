import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  RefreshControl,
  Alert,
} from "react-native";
import React, { useCallback, useEffect, useReducer, useState } from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import LottieView from "lottie-react-native";
import Order from "./Order";
import { useDispatch, useSelector } from "react-redux";
import {
  getShipperProfile,
  getToken,
  setOfflie,
  setOnline,
} from "../../../redux/shipperSlice";
import { useFetchPaginatedData } from "../../../hooks/useFetchPaginatedData";
import { connectWebsocket, getSocket } from "../../../redux/socketSlice";
import { ALERT_TYPE, Toast } from "react-native-alert-notification";
import { JOBSTATUS, POSTSTATUS } from "../../../constants";
import { unwrapResult } from "@reduxjs/toolkit";
import Spinner from "react-native-loading-spinner-overlay";

const FILTER_DATA = [
  { id: 1, content: "Tất cả" },
  { id: 2, content: "Ngay bây giờ" },
  { id: 3, content: "Hôm nay" },
  { id: 4, content: "Khác" },
];
const SORT_DATA = [
  { id: 1, content: "Thời gian" },
  { id: 2, content: "Địa điểm" },
];

const fakePostv3 = {
  deliveryTimeType: "NOW",
  deliveryTimeRequest: null,
  description: "hang de vo",
  dropDateTime: null,
  dropLocation: {
    addressLine: "Dong Thanh",
    contact: "Anh C",
    formattedAddress: "Dong Thanh Hoc Mon Ho Chi Minh",
    id: "01d5d910-e236-4076-8759-220fe4c01b8d",
    latitude: 10.832908477228857,
    longitude: 106.66512466520459,
    phoneNumber: "023485349",
    postalCode: "2345",
  },
  history: null,
  id: "d849502e-ed12-4e18-820d-31bb242bac25",
  payment: {
    paymentMethod: "VNPAY",
    postId: "d849502e-ed12-4e18-820d-31bb242bac25",
    posterPay: false,
    price: 200000,
  },
  pickupDatetime: null,
  pickupLocation: {
    addressLine: "Dong Thanh",
    contact: "Chi A",
    formattedAddress: "Dong Thanh Hoc Mon Ho Chi Minh",
    id: "63ac7568-c2e2-41c2-a52f-22fd15166a11",
    latitude: 10.9063187,
    longitude: 106.6481415,
    phoneNumber: "023485349",
    postalCode: "2345",
  },
  postTime: "2024-12-29T09:10:46.64681364",
  product: {
    category: {
      id: "2",
      name: "Văn phòng phẩm",
    },
    id: "25bb4d48-2e45-41e2-a028-85b40471d3a0",
    image: null,
    mass: "20Kg",
    quantity: 234,
  },
  status: "WAITING_PAY",
  vehicleType: {
    capacity: "1.7 x 1.2 x 1.2 Mét Lên đến 500 kg",
    description: "Hoạt Động Tất Cả Khung Giờ | Chở Tối Đa 500Kg * 1.5CBM",
    icon: "https://res.cloudinary.com/dqpo9h5s2/image/upload/v1706106556/vehicle_icon/pkbqdybiilwiynh0yyxv.png",
    id: "2",
    name: "Xe Van 500 kg",
  },
};

const FindOrderTab = ({ navigation, route }) => {
  const { access_token } = useSelector(getToken);
  const { accountId } = useSelector(getShipperProfile);
  const ws = useSelector(getSocket);
  const [posts, setPosts] = useState([]);
  const [isOnline, setIsOnline] = useState(true);
  const [filter, updateFilter] = useReducer(
    (prev, next) => ({
      ...prev,
      ...next,
    }),
    {
      showFilter: false,
      filterIndex: 1,
      sortIndex: 1,
    }
  );
  const dispatch = useDispatch();
  const fetcher = useFetchPaginatedData(access_token);
  const [loading, setLoading] = useState(false);
  const handleClearFilter = () => {
    updateFilter({
      filterIndex: 1,
      sortIndex: 1,
    });
  };
  const handleApplyFilter = () => {
    updateFilter({ showFilter: false });
  };

  useEffect(() => {
    let subscription = null;
    if (ws && ws.connected) {
      subscription = ws.subscribe(`/topic/shipper/${accountId}`, (message) => {
        const messageBody = JSON.parse(message.body);
        if (messageBody.postMessageType === "DELIVERY_REQUEST") {
          setPosts((prev) => {
            return [JSON.parse(messageBody.postResponse), ...prev];
          });
        }
      });
    }
    return () => {
      if (subscription) {
        subscription.unsubscribe();
      }
    };
  }, [isOnline]);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          className="mr-4"
          onPress={() => updateFilter({ showFilter: !filter.showFilter })}
        >
          <MaterialCommunityIcons
            name="filter-variant"
            size={24}
            color="black"
          />
        </TouchableOpacity>
      ),
      title: "Đang làm việc",
      headerTitle: () => (
        <TouchableOpacity
          onPress={handleToogleStatus}
          className={`flex-row items-center border ${
            isOnline ? "border-[#3422F1]" : "border-gray-600"
          } rounded-2xl py-2 pl-6 pr-7`}
        >
          <Text
            className={`font-medium ${
              isOnline ? "text-[#3422F1]" : "text-gray-600"
            }`}
          >
            {isOnline ? "Đang làm việc" : "Không hoạt động"}
          </Text>
          <View
            className={`${
              isOnline ? "bg-[#3422F1]" : "bg-gray-600"
            } h-2 w-2 translate-x-3  rounded-full`}
          ></View>
        </TouchableOpacity>
      ),
    });
  }, [navigation, isOnline]);
  const handleToogleStatus = () => {
    if (isOnline) {
      Alert.alert("Tắt trạng thái hoạt động?", "", [
        {
          text: "Huỷ",
          style: "cancel",
        },
        {
          text: "OK",
          onPress: () => {
            setLoading(true);
            dispatch(setOfflie(ws))
              .then(unwrapResult)
              .then((r) => {
                setIsOnline(false);
                setLoading(false);
              })
              .catch((e) => {
                setIsOnline(false);
                Toast.show({
                  type: "error",
                  text1: e,
                });
              });
          },
        },
      ]);
    } else {
      Alert.alert("Bạn có thể nhận và giao hàng lúc này? ", "", [
        {
          text: "Huỷ",
          style: "cancel",
        },
        {
          text: "OK",
          onPress: () => {
            setLoading(true);
            dispatch(connectWebsocket(access_token))
              .then(unwrapResult)
              .then((res) => {
                dispatch(setOnline({ ws: res, shipperId: accountId }))
                  .then(unwrapResult)
                  .then((r) => {
                    setIsOnline(true);
                    setLoading(false);
                  })
                  .catch((e) => {
                    setIsOnline(false);
                    Toast.show({
                      type: "error",
                      text1: e,
                    });
                  });
              })
              .catch((e) => {
                setLoading(false);
                Toast.show({
                  type: "error",
                  text1: "Khong the ket noi toi websocket",
                  text2: "Hay thu lai sau",
                });
              });
          },
        },
      ]);
    }
  };
  // ---------------------Refesh order data--------------
  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setPosts([]);
      setRefreshing(false);
    }, 1000);
  }, []);
  return (
    <View className="relative flex-1 px-3 bg-gray-100 pb-20">
      <Spinner visible={loading} size="large" animation="fade" />

      {/* ---------------Filter space--------------- */}
      {filter.showFilter && (
        <TouchableOpacity
          onPress={handleApplyFilter}
          activeOpacity={1}
          className="absolute top-0 left-0 right-0 bottom-0 z-10"
          style={{ backgroundColor: "rgba(0,0,0,0.3)" }}
        >
          <View className="absolute top-0 left-0 right-0 flex-col  px-4 py-5 bg-white">
            <View className="basis-1/2 flex-col ">
              <Text className="text-lg font-semibold mb-3">Sắp xếp</Text>
              <FlatList
                horizontal={true}
                data={SORT_DATA}
                showsHorizontalScrollIndicator={false}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    activeOpacity={1}
                    onPress={() => updateFilter({ sortIndex: item.id })}
                    key={item.id}
                    className="flex justify-center items-center py-2 px-6 ml-3 rounded-3xl"
                    style={
                      item.id === filter.sortIndex && {
                        borderColor: "rgb(249 ,115 ,22)",
                        borderWidth: 1,
                      }
                    }
                  >
                    <Text
                      style={{
                        color:
                          item.id === filter.sortIndex
                            ? "rgb(249 ,115, 22)"
                            : "rgb(75, 85, 99)",
                      }}
                    >
                      {item.content}
                    </Text>
                  </TouchableOpacity>
                )}
              />
            </View>
            <View className="basis-1/2 flex-col">
              <Text className="text-lg font-semibold mb-3">Lọc</Text>
              <FlatList
                horizontal={true}
                data={FILTER_DATA}
                showsHorizontalScrollIndicator={false}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    activeOpacity={1}
                    onPress={() => updateFilter({ filterIndex: item.id })}
                    key={item.id}
                    className="flex justify-center items-center py-2 px-6 ml-3 rounded-3xl"
                    style={
                      item.id === filter.filterIndex && {
                        borderColor: "rgb(249 ,115 ,22)",
                        borderWidth: 1,
                      }
                    }
                  >
                    <Text
                      style={{
                        color:
                          item.id === filter.filterIndex
                            ? "rgb(249 ,115, 22)"
                            : "rgb(75, 85, 99)",
                      }}
                    >
                      {item.content}
                    </Text>
                  </TouchableOpacity>
                )}
              />
            </View>
          </View>
        </TouchableOpacity>
      )}
      {/* ---------------Data space----------------- */}
      <FlatList
        data={posts.length > 0 ? posts : [{ id: 1 }]}
        renderItem={({ item }) => {
          if (posts.length > 0) return <Order data={item} />;
          if (isOnline) {
            return (
              <View className="flex justify-center items-center mt-24">
                <LottieView
                  style={{ width: 250, height: 250 }}
                  source={require("../../../assets/animations/onboarding4.json")}
                  loop
                  autoPlay
                />
                <Text className="text-lg mb-5 text-center">
                  Thử xoá tuỳ chọn bộ lọc để xem thêm các đơn hàng
                </Text>
                <TouchableOpacity
                  className="py-3 px-5 rounded-lg bg-[#3422F1]"
                  onPress={handleClearFilter}
                >
                  <Text className="text-white font-medium text-xl">
                    Xoá tất cả bộ lọc
                  </Text>
                </TouchableOpacity>
              </View>
            );
          }
          return (
            <View className="flex justify-center items-center mt-24">
              <LottieView
                style={{ width: 250, height: 250 }}
                source={require("../../../assets/animations/offline.json")}
                loop
                autoPlay
              />
              <Text className="text-lg mb-8 text-center">
                Bật trạng thái hoạt động để nhận những đơn hàng mới nào!
              </Text>
              <TouchableOpacity
                className="py-3 px-5 rounded-lg bg-[#3422F1]"
                onPress={handleToogleStatus}
              >
                <Text className="text-white font-medium text-xl">
                  Có thể giao hàng
                </Text>
              </TouchableOpacity>
            </View>
          );
        }}
        keyExtractor={(item) => item.id}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        onEndReached={() => fetcher.next()}
      />
    </View>
  );
};

export default FindOrderTab;
