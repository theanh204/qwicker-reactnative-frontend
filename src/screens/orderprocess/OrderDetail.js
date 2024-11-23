import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  FlatList,
  TouchableHighlight,
} from "react-native";
import React, { useEffect, useReducer, useRef, useState } from "react";
import {
  Feather,
  AntDesign,
  MaterialCommunityIcons,
  FontAwesome,
} from "@expo/vector-icons";
import CheckBox from "react-native-check-box";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import { useDispatch, useSelector } from "react-redux";
import { getProduct, setProduct } from "../../redux/productSlice";

const massType = [
  { id: 1, name: "Nhẹ hơn 10 kg" },
  { id: 2, name: "10 kg đến 30 kg" },
  { id: 3, name: "30 kg đến 50 kg" },
];

const OrderDetail = ({ navigation }) => {
  const dispatch = useDispatch();
  const categories = useSelector(getCategories);
  const initProduct = useSelector(getProduct);
  const inputRef = useRef();
  const [productDetail, updateProductDetail] = useReducer(
    (prve, next) => ({
      ...prve,
      ...next,
    }),
    {
      selectedCategory: initProduct.category,
      checkedMass: initProduct.mass,
      quantity: initProduct.quantity,
      image: initProduct.image,
    }
  );

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
        const uri = result.assets[0]?.uri;
        if (uri) {
          try {
            const base64 = await FileSystem.readAsStringAsync(uri, {
              encoding: FileSystem.EncodingType.Base64,
            });
            updateProductDetail({ image: base64 });
          } catch (readError) {
            console.error("Error reading image as base64:", readError);
          }
        } else {
          console.log("Invalid product data:", result);
        }
      }
    }
  };
  const isFullField = () => {
    const { selectedCategory, checkedMass, quantity, image } = productDetail;
    return selectedCategory && checkedMass && image && Number(quantity) > 0;
  };

  useEffect(() => {
    // Header option
    navigation.setOptions({
      headerLeft: () => (
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <AntDesign name="close" size={24} color="black" />
        </TouchableOpacity>
      ),
    });
  }, []);

  const handleSave = () => {
    if (isFullField()) {
      const { selectedCategory, checkedMass, quantity, image } = productDetail;
      dispatch(
        setProduct({
          categoryId: selectedCategory,
          quantity: quantity,
          mass: checkedMass,
          file: image,
        })
      );
      navigation.goBack();
    }
  };

  return (
    <View className="flex-1 bg-white">
      <ScrollView
        className="flex-1 bg-white py-4 px-4"
        showsVerticalScrollIndicator={false}
      >
        {/*----------------- Product type -----------------*/}
        <View className="flex-col py-3 border-b border-gray-200">
          <View className="flex-row space-x-3 items-center mb-4">
            <Feather name="package" size={24} color="#3422F1" />
            <Text className="text-lg">Loại hàng vận chuyển</Text>
          </View>
          {categories.map((ele) => (
            <TouchableOpacity
              onPress={() =>
                updateProductDetail({
                  selectedCategory:
                    productDetail.selectedCategory === ele.id ? null : ele.id,
                })
              }
              key={ele.id}
              className="flex-row justify-between items-center pl-10"
            >
              <Text>{ele.name}</Text>
              <View>
                <CheckBox
                  style={{ flex: 1, padding: 10 }}
                  onClick={() =>
                    updateProductDetail({
                      selectedCategory:
                        productDetail.selectedCategory === ele.id
                          ? null
                          : ele.id,
                    })
                  }
                  checkedCheckBoxColor="#3422F1"
                  isChecked={productDetail.selectedCategory === ele.id}
                />
              </View>
            </TouchableOpacity>
          ))}
        </View>
        {/*--------------- Quantity-------------- */}
        <TouchableOpacity
          onPress={() => inputRef.current.focus()}
          className="flex-row py-6 border-b border-gray-200 items-center justify-between"
        >
          <View className="flex-row space-x-3 items-center">
            <Feather name="shopping-cart" size={24} color="#3422F1" />
            <Text className="text-lg">Số lượng gói hàng</Text>
          </View>
          <TextInput
            className="text-xl font-semibold px-3 py-[-12]"
            keyboardType="numeric"
            defaultValue="1"
            value={String(productDetail.quantity)}
            onChangeText={(txt) => updateProductDetail({ quantity: txt })}
            ref={inputRef}
          />
        </TouchableOpacity>
        {/* ------------------mass--------------- */}
        <View className="flex-col py-6 border-b border-gray-200">
          <View className="flex-row space-x-3 items-center mb-8">
            <MaterialCommunityIcons
              name="scale-bathroom"
              size={24}
              color="#3422F1"
            />
            <Text className="text-lg">Tổng khối lượng</Text>
          </View>
          <FlatList
            data={massType}
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            renderItem={(c) => (
              <TouchableHighlight
                key={c.item.id}
                underlayColor={"white"}
                className="rounded-3xl py-3 px-8 border border-gray-600 ml-5"
                style={
                  productDetail.checkedMass === c.item.name && {
                    borderBlockColor: "#3422F1",
                    backgroundColor: "rgba(134, 182, 246, 0.4)",
                  }
                }
                onPress={() =>
                  updateProductDetail({
                    checkedMass:
                      productDetail.checkedMass === c.item.name
                        ? null
                        : c.item.name,
                  })
                }
              >
                <Text
                  className="text-black font-medium"
                  style={
                    productDetail.checkedMass === c.item.name && {
                      color: "#3422F1",
                    }
                  }
                >
                  {c.item.name}
                </Text>
              </TouchableHighlight>
            )}
          />
        </View>
        {/* ----------------Product photo -----------*/}
        <View className="flex-col py-6 mb-36">
          <View className="flex-row space-x-3 items-center mb-8">
            <FontAwesome name="photo" size={24} color="#3422F1" />
            <Text className="text-lg">Tải ảnh lên</Text>
          </View>
          <TouchableOpacity
            onPress={pickImage}
            className="flex-col justify-center space-y-2 items-center border border-gray-600 rounded-xl w-24 h-24 ml-10"
            style={
              productDetail.image && { backgroundColor: "rgb(147, 197, 253)" }
            }
          >
            {productDetail.image ? (
              <>
                <AntDesign name="checkcircle" size={24} color="#3422F1" />
                <Text className="font-medium text-[#3422F1]">Đã tải ảnh</Text>
              </>
            ) : (
              <>
                <Feather name="camera" size={24} color="black" />
                <Text className="font-medium">Thêm ảnh</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
      {/* -------------Confirm bottom sheet-------- */}
      <View
        className="h-28 w-full px-4 pt-5 pb-8 flex-col justify-center items-center relative bottom-0 left-0 right-0"
        style={{ backgroundColor: "rgba(209, 213, 219, 0.4)" }}
      >
        <TouchableOpacity
          activeOpacity={1}
          onPress={handleSave}
          className="bg-white rounded-lg h-full w-full flex justify-center items-center"
          style={isFullField() && { backgroundColor: "#3422F1" }}
        >
          <Text
            className="text-lg font-medium"
            style={isFullField() && { color: "white" }}
          >
            Lưu
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default OrderDetail;
