import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchVehicles, getRole, getVehicles } from "../../redux/appSlice";
import { SafeAreaView } from "react-native-safe-area-context";
import { ROLE, ROUTES } from "../../constants";
import { Dropdown } from "react-native-element-dropdown";
import { Ionicons, AntDesign } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import { addAdditionalField } from "../../redux/formRegisterSlice";
import { unwrapResult } from "@reduxjs/toolkit";

const DriverInfoRegister = ({ navigation }) => {
  const initVehicles = useSelector(getVehicles);
  const dispatch = useDispatch();
  const [vehicles, setVehicles] = useState(initVehicles);
  const [vehicleNumber, setVehicleNumber] = useState("");
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [image, setImage] = useState(null);
  const pickImage = async () => {
    let { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      alert("Permissions denied!");
    } else {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        quality: 1,
        base64: true,
      });
      if (!result.canceled) {
        setImage(result.assets[0].uri);
        const uri = result.assets[0]?.uri;
        const mintype = result.assets[0]?.mimeType;

        if (uri) {
          try {
            const base64 = await FileSystem.readAsStringAsync(uri, {
              encoding: FileSystem.EncodingType.Base64,
            });
            setImage(base64);
          } catch (readError) {
            console.error("Error reading image as base64:", readError);
          }
        } else {
          console.log("Invalid avatar_user data:", result);
        }
      }
    }
  };
  const role = useSelector(getRole);
  const isFullfil = () => {
    return (
      image !== null && vehicleNumber.length > 0 && selectedVehicle !== null
    );
  };

  useEffect(() => {
    if (vehicles.length === 0) {
      dispatch(fetchVehicles())
        .then(unwrapResult)
        .then((res) => setVehicles(res))
        .catch((e) => console.log(e));
    }
  }, []);

  const handleNext = () => {
    if (isFullfil()) {
      dispatch(
        addAdditionalField({
          identityFBase64: image,
          vehicleId: selectedVehicle,
          vehicleNumber: vehicleNumber,
        })
      );
      navigation.navigate(ROUTES.AVATAR_REGISTER);
    }
  };

  const [isFocus, setIsFocus] = useState(false);

  return (
    <SafeAreaView className="flex-1 flex-col px-4 py-6">
      <Text className="text-lg font-normal">{`Bước 4/${
        role === ROLE.TRADITIONAL_USER ? "4" : "5"
      }`}</Text>
      <Text className="text-2xl font-semibold">Thông tin người vận chuyển</Text>

      <View className="flex-col space-y-3 pt-6">
        <View className="flex-col space-y-3 pt-6">
          <TouchableOpacity
            onPress={pickImage}
            className="flex-row  border rounded-lg items-center overflow-hidden"
            style={{
              borderColor: image ? "rgb(34 ,197 ,94)" : " rgb(59, 130, 246)",
              backgroundColor: image
                ? "rgb(240, 253, 244)"
                : " rgb(239, 246, 255)",
            }}
          >
            <View
              className="basis-1/6 bg-green-400 h-16 flex justify-center items-center"
              style={{
                backgroundColor: image
                  ? "rgb(74, 222, 128)"
                  : "rgb(96, 165, 250)",
              }}
            >
              <View className="bg-white rounded-full h-10 w-10 flex justify-center items-center">
                {image ? (
                  <AntDesign name="check" size={22} color="rgb(22 ,163, 74)" />
                ) : (
                  <Ionicons name="share-outline" size={22} color="#3422F1" />
                )}
              </View>
            </View>

            <View className="basis-5/6 pl-4">
              <Text
                className="text-lg font-semibold "
                style={{
                  color: image ? "rgb(21 ,128 ,61)" : "#3422F1",
                }}
              >
                {image ? "Đã tải" : "Mặt trước CMND/CCCD"}
              </Text>
            </View>
          </TouchableOpacity>
        </View>
        <View className="rounded-lg border-2 border-[#D1D1D1] p-4 bg-[#FFFFFF]">
          <TextInput
            onChangeText={(txt) => setVehicleNumber(txt)}
            placeholderTextColor={"#A5A5A5"}
            placeholder="Biển số xe"
            value={vehicleNumber}
          />
        </View>
      </View>

      <Dropdown
        style={styles.dropdown}
        placeholderStyle={styles.placeholderStyle}
        selectedTextStyle={styles.selectedTextStyle}
        data={vehicles}
        maxHeight={300}
        labelField="name"
        valueField="id"
        placeholder={
          !isFocus ? "Lựa chọn phương tiện của bạn" : selectedVehicle
        }
        value={selectedVehicle}
        onFocus={() => setIsFocus(true)}
        onBlur={() => setIsFocus(false)}
        onChange={(item) => {
          setSelectedVehicle(item.id);
          setIsFocus(false);
        }}
      />

      <TouchableOpacity
        className="w-full rounded-lg py-4 flex-row justify-center  mt-6 bg-gra"
        style={{
          backgroundColor: isFullfil() ? "#3422F1" : "rgb(156, 163, 175)",
        }}
        onPress={handleNext}
      >
        <Text
          className="text-lg font-semibold "
          style={{ color: isFullfil() ? "white" : "rgb(75, 85, 99)" }}
        >
          Tiếp
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default DriverInfoRegister;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    padding: 20,
    marginTop: 16,
  },
  dropdown: {
    height: 65,
    borderColor: "#D1D1D1",
    borderWidth: 2,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 20,
    marginTop: 16,
    backgroundColor: "white",
  },
  placeholderStyle: {
    fontSize: 16,
    color: "rgb(156,163,175)",
  },
  selectedTextStyle: {
    fontSize: 16,
    color: "black",
  },
});
