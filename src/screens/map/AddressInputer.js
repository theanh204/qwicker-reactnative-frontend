import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  FlatList,
} from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons, Entypo, Feather, Foundation } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import {
  addDeliveryAddress,
  addPickUp,
  getDeliveryAddress,
  getPickUP,
} from "../../redux/shipmentSlice";
import { getTypeChoosingLocation } from "../../redux/appSlice";
import { LOCATION, ROUTES } from "../../constants";
import useDebounce from "../../hooks/useDebouce";
import Spinner from "react-native-loading-spinner-overlay";
import {
  googMapAutocomplete,
  googMapGetDetailPlaceById,
} from "../../configs/APIv3";
const AddressInputer = ({ navigation }) => {
  const dispatch = useDispatch();
  const type = useSelector(getTypeChoosingLocation);
  const pickUp = useSelector(getPickUP);
  const deliveryAddress = useSelector(getDeliveryAddress);
  const [addressSuggest, setAddressSuggest] = useState([]);
  const [loading, setLoading] = useState(false);
  const [txt, setTxt] = useState("");
  const debounceValue = useDebounce(txt, 600);
  const handleClearText = () => {
    setTxt("");
    setAddressSuggest([]);
  };
  const handleBack = () => {
    if (pickUp.addressLine === null || deliveryAddress.addressLine === null) {
      navigation.getParent().setOptions({
        headerShown: true,
      });
    }
    navigation.goBack();
  };
  const handleChooseLocation = useCallback(async (item) => {
    try {
      setLoading(true);
      const res = await googMapGetDetailPlaceById(item.place_id).get();
      const geometry = res?.data?.result?.geometry?.location;
      item = {
        ...item,
        latitude: geometry.lat,
        longitude: geometry.lng,
      };
      switch (type) {
        case LOCATION.pickupLocation:
          dispatch(addPickUp(item));
          break;
        case LOCATION.dropLocation:
          dispatch(addDeliveryAddress(item));
          break;
      }
      setLoading(false);
      navigation.navigate(ROUTES.MAP_STACK, { location: item });
    } catch (e) {
      console.log(e);
      setLoading(false);
    }
  }, []);

  const fetchLocation = async () => {
    try {
      setLoading(true);
      const res = await googMapAutocomplete(debounceValue).get();
      const predictions = res?.data?.predictions.map((prediction) => {
        const { place_id, description, structured_formatting } = prediction;
        return {
          place_id,
          addressLine: structured_formatting?.main_text || "",
          formattedAddress: description || "",
        };
      });
      setAddressSuggest(predictions);
      setLoading(false);
    } catch (e) {
      console.log(e);
      setLoading(false);
    }
  };
  useEffect(() => {
    if (!debounceValue.trim()) {
      return;
    }
    fetchLocation();
  }, [debounceValue]);

  useEffect(() => {
    navigation.getParent().setOptions({
      headerShown: false,
    });
  }, []);

  return (
    <SafeAreaView className="relative bg-white flex-1">
      <Spinner
        visible={loading}
        size="large"
        animation="fade"
        className="z-50"
      />
      <View className="flex-row items-center py-2 px-4 absolute top-14 left-5 right-5 bg-white border border-gray-200 rounded-xl">
        <TouchableOpacity
          className="basis-1/12 justify-center"
          onPress={handleBack}
        >
          <MaterialIcons name="keyboard-arrow-left" size={30} color="black" />
        </TouchableOpacity>
        <View className="basis-1/12 justify-center pl-2">
          <Entypo name="circle" size={12} color="#3422F1" />
        </View>
        <TextInput
          className="text-lg mr-[-18] basis-10/12 pr-8 pl-2 pb-2"
          value={txt}
          onChangeText={setTxt}
          placeholder={
            type === LOCATION.pickupLocation
              ? "Địa điểm lấy hàng"
              : "Địa chỉ trả hàng"
          }
          autoFocus={true}
        />
        <TouchableOpacity onPress={handleClearText}>
          <Feather name="x" size={22} color="gray" />
        </TouchableOpacity>
      </View>
      {addressSuggest.length > 0 && (
        <FlatList
          className="px-4 absolute top-28 left-5 right-5"
          data={addressSuggest}
          renderItem={({ item }) => {
            return (
              <TouchableOpacity
                onPress={() => handleChooseLocation(item)}
                className="w-full flex-row mb-8"
              >
                <View className="basis-1/8 flex justify-center items-center">
                  <Foundation name="marker" size={24} color="black" />
                </View>
                <View className="basis-7/8 pl-4 flex-col flex-shrink-0">
                  <Text className="text-lg font-semibold">
                    {item.addressLine}
                  </Text>
                  <Text className="text-gray-600">{item.formattedAddress}</Text>
                </View>
              </TouchableOpacity>
            );
          }}
          keyExtractor={(item) => item.place_id}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
};

export default AddressInputer;
