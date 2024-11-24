import { View, Text, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getRole } from "../../redux/appSlice";
import { SafeAreaView } from "react-native-safe-area-context";
import { ROLE, ROUTES } from "../../constants";
import { Ionicons, AntDesign } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import {
  addBasicField,
  getAdditionalInfo,
  getBasicAccountInfo,
  resetFormRegisterSlice,
} from "../../redux/formRegisterSlice";
import * as FileSystem from "expo-file-system";
import * as Shipper from "../../redux/shipperSlice";
import * as BasicUser from "../../redux/basicUserSlice";
import { unwrapResult } from "@reduxjs/toolkit";
import Spinner from "react-native-loading-spinner-overlay";
import Toast from "react-native-toast-message";

const AvatarRegister = ({ navigation }) => {
  const basicAccountInfo = useSelector(getBasicAccountInfo);
  const additionalInfo = useSelector(getAdditionalInfo);
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const role = useSelector(getRole);
  const dispatch = useDispatch();
  const pickImage = async () => {
    let { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      alert("Permissions denied!");
    } else {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        quality: 0.1,
        base64: true,
      });
      if (!result.canceled) {
        const uri = result.assets[0]?.uri;
        if (uri) {
          try {
            const base64 = await FileSystem.readAsStringAsync(uri, {
              encoding: FileSystem.EncodingType.Base64,
            });
            setImage(base64);
            dispatch(addBasicField({ avatarBase64: base64 }));
          } catch (readError) {
            console.error("Error reading image as base64:", readError);
          }
        } else {
          console.log("Invalid avatar_user data:", result);
        }
      }
    }
  };
  const handleSignUp = () => {
    if (image) {
      setLoading(true);
      if (role === ROLE.TRADITIONAL_USER) {
        dispatch(BasicUser.register(basicAccountInfo))
          .then(unwrapResult)
          .then((res) => {
            setLoading(false);
            navigation.navigate(ROUTES.HOME);
            dispatch(resetFormRegisterSlice());
          })
          .catch((e) => {
            setLoading(false);
            Toast.show({
              type: "error",
              text1: "Đăng ký thất bại",
              text2: e,
            });
          });
      } else {
        dispatch(Shipper.register({ ...basicAccountInfo, ...additionalInfo }))
          .then(unwrapResult)
          .then((res) => {
            setLoading(false);
            dispatch(resetFormRegisterSlice());
            navigation.navigate(ROUTES.COMPELETE_REGISTER);
          })
          .catch((e) => {
            setLoading(false);
            setLoading(false);
            Toast.show({
              type: "error",
              text1: "Đăng ký thất bại",
              text2: e,
            });
          });
      }
    }
  };

  return (
    <SafeAreaView className="flex-1 flex-col px-4 py-6 justify-between">
      <Spinner visible={loading} size="large" animation="fade" />
      <View>
        <Text className="text-lg font-normal">{`Bước ${
          role === ROLE.TRADITIONAL_USER ? "4" : "5"
        }/${role === ROLE.TRADITIONAL_USER ? "4" : "5"}`}</Text>
        <Text className="text-2xl font-semibold">Ảnh đại diện</Text>

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
                {image ? "Đã tải ảnh" : "Tải ảnh"}
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
      <TouchableOpacity
        className="w-full rounded-lg py-4 flex-row justify-center  mt-6 bg-gra"
        style={{
          backgroundColor: image !== null ? "#3422F1" : "rgb(156, 163, 175)",
        }}
        onPress={handleSignUp}
      >
        <Text
          className="text-lg font-semibold "
          style={{ color: image !== null ? "white" : "rgb(75, 85, 99)" }}
        >
          Đăng ký
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default AvatarRegister;
