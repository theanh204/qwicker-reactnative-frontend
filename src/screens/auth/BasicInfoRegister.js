import { View, Text, TextInput, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { ROLE, ROUTES } from "../../constants";
import { useDispatch, useSelector } from "react-redux";
import { getRole } from "../../redux/appSlice";
import {
  addBasicField,
  resetFormRegisterSlice,
} from "../../redux/formRegisterSlice";

const BasicInfoRegister = ({ navigation }) => {
  const dispatch = useDispatch();
  const [lastName, setLastName] = useState("Nguyen");
  const [firstName, setFirstName] = useState("Anh");
  const role = useSelector(getRole);
  const isFullfil = () => {
    return lastName.length > 0 && firstName.length > 0;
  };

  useEffect(() => {
    dispatch(resetFormRegisterSlice());
  });

  const handleNext = () => {
    if (isFullfil()) {
      dispatch(
        addBasicField({
          firstName: firstName,
          lastName: lastName,
        })
      );
      navigation.navigate(ROUTES.ACCOUNT_REGISTER);
    }
  };

  return (
    <SafeAreaView className="flex-1 flex-col px-4 py-6">
      <Text className="text-lg font-normal">{`Bước 1/${
        role === ROLE.TRADITIONAL_USER ? "4" : "5"
      }`}</Text>
      <Text className="text-2xl font-semibold">Thông tin cơ bản</Text>

      <View className="flex-col space-y-3 pt-6">
        <View className="rounded-lg border-2 border-[#D1D1D1] p-4 bg-[#FFFFFF]">
          <TextInput
            onChangeText={(txt) => setFirstName(txt)}
            placeholderTextColor={"#A5A5A5"}
            placeholder="Tên"
            value={firstName}
          />
        </View>
        <View className="rounded-lg border-2 border-[#D1D1D1] p-4 bg-[#FFFFFF]">
          <TextInput
            onChangeText={(txt) => setLastName(txt)}
            placeholderTextColor={"#A5A5A5"}
            placeholder="Họ"
            value={lastName}
          />
        </View>
      </View>
      <TouchableOpacity
        underlayColor={"rbga(0,0,0,0)"}
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

export default BasicInfoRegister;
