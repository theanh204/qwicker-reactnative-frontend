import { View, Text, TextInput, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getRole } from "../../redux/appSlice";
import { SafeAreaView } from "react-native-safe-area-context";
import { ROLE, ROUTES } from "../../constants";
import { addBasicField } from "../../redux/formRegisterSlice";
import Spinner from "react-native-loading-spinner-overlay";
import APIv3, { END_POINTS } from "../../configs/APIv3";
import Toast from "react-native-toast-message";

const AccountRegister = ({ navigation }) => {
  const [username, setUsername] = useState("Shipper");
  const [password, setPassword] = useState("12345678");
  const [email, setEmail] = useState("2151013002anh@ou.edu.vn");
  const [loading, setLoading] = useState(false);

  const role = useSelector(getRole);
  const dispatch = useDispatch();
  const isFullfil = () => {
    return username.length > 0 && password.length > 0 && email.length > 0;
  };
  const handleNext = async () => {
    if (isFullfil()) {
      try {
        setLoading(true);
        const formData = new FormData();
        formData.append("username", username);
        const result1 = await APIv3.post(
          END_POINTS["check-username-exists"],
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        console.log(result1);

        if (result1.data.result.exist) {
          Toast.show({
            type: "error",
            text1: "Tài khoản đã tồn tại",
            text2: "Hãy thử lại với tài khoản khác",
          });
          return;
        }
        formData.delete("username");
        formData.append("email", email);
        formData.append("username", username);
        const result2 = await APIv3.post(
          END_POINTS["check-email-exists"],
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        if (result2.data.result.exist) {
          Toast.show({
            type: "error",
            text1: "Email đã tồn tại",
            text2: "Hãy thử lại với Email khác",
          });
          return;
        }
        dispatch(
          addBasicField({
            username: username,
            password: password,
            email: email,
          })
        );
        // navigation.navigate(ROUTES.CONFIRM_OTP_REGISTER, {
        //   email: email,
        //   username: username,
        // });
        navigation.navigate(ROUTES.DRIVER_INFO_REGISTER);
      } catch (err) {
        setLoading(false);
        console.log(err);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <SafeAreaView className="flex-1 flex-col px-4 py-6">
      <Spinner visible={loading} size="large" animation="fade" />
      <Text className="text-lg font-normal">{`Bước 2/${
        role === ROLE.TRADITIONAL_USER ? "4" : "5"
      }`}</Text>
      <Text className="text-2xl font-semibold">Thông tin tài khoản</Text>

      <View className="flex-col space-y-3 pt-6">
        <View className="rounded-lg border-2 border-[#D1D1D1] p-4 bg-[#FFFFFF]">
          <TextInput
            onChangeText={(txt) => setUsername(txt)}
            placeholderTextColor={"#A5A5A5"}
            placeholder="Tài khoản"
            value={username}
          />
        </View>
        <View className="rounded-lg border-2 border-[#D1D1D1] p-4 bg-[#FFFFFF]">
          <TextInput
            onChangeText={(txt) => setPassword(txt)}
            placeholderTextColor={"#A5A5A5"}
            placeholder="Mật khẩu"
            value={password}
            secureTextEntry={true}
          />
        </View>
        <View className="rounded-lg border-2 border-[#D1D1D1] p-4 bg-[#FFFFFF]">
          <TextInput
            onChangeText={(txt) => setEmail(txt)}
            placeholderTextColor={"#A5A5A5"}
            placeholder="Email"
            value={email}
          />
        </View>
      </View>
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

export default AccountRegister;
