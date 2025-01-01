import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Alert,
  StyleSheet,
} from "react-native";
import React, {
  useCallback,
  useEffect,
  useReducer,
  useRef,
  useState,
} from "react";
import MapView from "react-native-maps";
import { MaterialIcons, Entypo } from "@expo/vector-icons";
import { LOCATION, ROUTES } from "../../constants";
import { useDispatch, useSelector } from "react-redux";
import { getTypeChoosingLocation } from "../../redux/appSlice";
import {
  INITIAL_ADDRESS,
  addDeliveryAddress,
  addPickUp,
  getDeliveryAddress,
  getPickUP,
} from "../../redux/shipmentSlice";
import { AntDesign } from "@expo/vector-icons";
import RBSheet from "react-native-raw-bottom-sheet";
import { googMapReverseGeocoding } from "../../configs/APIv3";

const Map = ({ navigation }) => {
  const dispatch = useDispatch();
  const refRBSheet = useRef();
  const type = useSelector(getTypeChoosingLocation);
  const [data, updateData] = useReducer(
    (prev, next) => ({
      ...prev,
      ...next,
    }),
    useSelector(
      type === LOCATION.pickupLocation ? getPickUP : getDeliveryAddress
    )
  );
  const [region, setRegion] = useState({
    latitude: data.latitude,
    longitude: data.longitude,
    latitudeDelta: 0.01, // Adjust zoom level
    longitudeDelta: 0.01,
  });
  const [isDragging, setIsDragging] = useState(false);
  // Khi người dùng kéo bản đồ
  const handleRegionChange = () => {
    setIsDragging(true); // Đang kéo
  };

  const setShowHeader = (show) => {
    navigation.getParent().setOptions({
      headerShown: show,
    });
  };
  useEffect(() => {
    setShowHeader(false);
    refRBSheet.current.open();
  }, []);

  const goBack = () => {
    setShowHeader(true);
    navigation.navigate(ROUTES.HOME_STACK);
  };

  const handleBack = () => {
    if (isFullfil()) {
      goBack();
    } else {
      Alert.alert("Quay trở lại?", "Địa chỉ bạn đã chọn sẽ không được lưu", [
        {
          text: "Cancel",
          style: "cancel",
        },
        { text: "OK", onPress: () => handleConfirmGoback() },
      ]);
    }
  };

  const handleConfirm = () => {
    if (isFullfil()) {
      if (type === LOCATION.pickupLocation) {
        dispatch(addPickUp(data));
      } else {
        dispatch(addDeliveryAddress(data));
      }
      goBack();
    }
  };

  const handleConfirmGoback = () => {
    if (type === LOCATION.pickupLocation) {
      dispatch(addPickUp(INITIAL_ADDRESS));
    } else {
      dispatch(addDeliveryAddress(INITIAL_ADDRESS));
    }
    goBack();
  };

  const handleShowBottomSheet = () => {
    if (data.showBottomSheet) {
      refRBSheet.current.close();
    } else {
      refRBSheet.current.open();
    }
    updateData({ showBottomSheet: !data.showBottomSheet });
  };

  const isFullfil = () => {
    const { phoneNumber, contact, apartmentNumber } = data;
    return phoneNumber !== "" && contact !== "" && apartmentNumber !== "";
  };
  // // Khi người dùng thả tay
  const handleRegionChangeComplete = async (region) => {
    setRegion(region);
    try {
      const rest = await googMapReverseGeocoding(
        `${region.latitude},${region.longitude}`
      ).get();
      const newLocation = rest?.data?.results[0];
      updateData({
        latitude: region.latitude,
        longitude: region.longitude,
        addressLine: newLocation.name,
        formattedAddress: newLocation.formatted_address,
      });
    } catch (e) {
      console.log(e);
    }
    setIsDragging(false);
  };
  return (
    <View className="flex-1 relative">
      <MapView
        className="w-full h-full"
        region={region}
        onRegionChangeComplete={handleRegionChangeComplete}
        onRegionChange={handleRegionChange}
      >
        <View style={styles.markerContainer}>
          <View style={styles.marker} />
        </View>
      </MapView>

      <View className="flex-row py-2 px-4 absolute top-12 left-5 right-5 bg-white border border-gray-200 rounded-xl">
        <TouchableOpacity
          className="basis-1/12 justify-center"
          onPress={handleBack}
        >
          <MaterialIcons name="keyboard-arrow-left" size={30} color="black" />
        </TouchableOpacity>
        <View className="basis-1/12 justify-center pl-2">
          <Entypo name="circle" size={12} color="#3422F1" />
        </View>
        <TouchableOpacity
          className="basis-10/12 flex-col flex-shrink-0 pl-2"
          onPress={() => navigation.navigate(ROUTES.ADDRESS_INPUTER_STACK)}
        >
          {isDragging ? (
            <Text className="text-base text-gray-500">
              Đang cập nhập vị trí...
            </Text>
          ) : (
            <>
              <Text className="text-base font-bold">{data.addressLine}</Text>
              <Text className="text text-gray-500">
                {data.formattedAddress}
              </Text>
            </>
          )}
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        onPress={handleShowBottomSheet}
        className={`absolute right-4 bg-white rounded-lg p-4 flex justify-center items-center`}
        style={{ bottom: data.showBottomSheet ? 370 : 36 }}
      >
        {data.showBottomSheet ? (
          <AntDesign name="up" size={24} color="black" />
        ) : (
          <AntDesign name="down" size={24} color="black" />
        )}
      </TouchableOpacity>
      {/* ------------Bottom Sheet------------ */}
      <RBSheet
        ref={refRBSheet}
        customStyles={{
          wrapper: {
            backgroundColor: "rgba(0,0,0,0.0)",
          },
          draggableIcon: {
            backgroundColor: "#000",
          },
          container: {
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            overflow: "hidden",
          },
        }}
        height={360}
        onClose={() => updateData({ showBottomSheet: false })}
      >
        <View className="h-full w-full px-4 pt-5 pb-8 flex-col">
          <View>
            <Text className="text-2xl font-bold pb-4">Chi tiết địa chỉ</Text>
          </View>
          <View className="flex-col w-full">
            <TextInput
              placeholder="Số tầng hoặc số phòng"
              placeholderTextColor={"#4B5563"}
              className="p-3 rounded-md border border-gray-300"
              value={data.apartmentNumber}
              onChangeText={(t) => updateData({ apartmentNumber: t })}
            />
            <TextInput
              placeholder="Số di động"
              placeholderTextColor={"#4B5563"}
              className="p-3 rounded-md border border-gray-300 mt-4"
              keyboardType="numeric"
              value={data.phoneNumber === "" ? "" : String(data.phoneNumber)}
              onChangeText={(t) => updateData({ phoneNumber: t })}
            />
            <TextInput
              placeholder="Tên liên lạc"
              placeholderTextColor={"#4B5563"}
              className="p-3 rounded-md border border-gray-300 mt-4"
              value={data.contact}
              onChangeText={(t) => updateData({ contact: t })}
            />
            <TouchableOpacity
              onPress={handleConfirm}
              className="py-4 flex justify-center items-center rounded-lg mt-6"
              style={{
                backgroundColor: isFullfil() ? "#3422F1" : "rgb(156, 163, 175)",
              }}
            >
              <Text
                className="text-xl font-bold"
                style={{ color: isFullfil() ? "white" : "rgb(75, 85, 99)" }}
              >
                Xác nhận
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </RBSheet>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
  markerContainer: {
    position: "absolute",
    top: "50%",
    left: "50%",
    marginLeft: -12, // Center the marker horizontally
    marginTop: -24, // Center the marker vertically
  },
  marker: {
    height: 24,
    width: 24,
    backgroundColor: "red",
    borderRadius: 12,
  },
  coordinatesContainer: {
    position: "absolute",
    bottom: 20,
    left: 20,
    backgroundColor: "rgba(255,255,255,0.9)",
    padding: 10,
    borderRadius: 8,
    elevation: 5,
  },
});
export default Map;
