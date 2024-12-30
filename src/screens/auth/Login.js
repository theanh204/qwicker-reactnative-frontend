import { View, Text, Image, TextInput, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { ROLE, ROUTES } from "../../constants";
import { useDispatch, useSelector } from "react-redux";
import { getRole } from "../../redux/appSlice";
import { unwrapResult } from "@reduxjs/toolkit";
import { Entypo } from "@expo/vector-icons";
import Spinner from "react-native-loading-spinner-overlay";
import * as Shipper from "../../redux/shipperSlice";
import * as BasicUser from "../../redux/basicUserSlice";
import { connectWebsocket } from "../../redux/socketSlice";
import Toast from "react-native-toast-message";
import * as Location from "expo-location";

// import { GoogleSignin, GoogleSigninButton, } from "@react-native-google-signin/google-signin";
const Login = ({ navigation }) => {
  const role = useSelector(getRole);
  const [username, setUsername] = useState(
    role === ROLE.TRADITIONAL_USER ? "theanh" : "shipper"
  );
  const [password, setPassword] = useState("12345678");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const handleLogin = () => {
    if (username.length === 0 || password.length === 0) {
      Toast.show({
        type: "error",
        text1: "Vui lòng nhập tài khoản và mật khẩu",
      });
    } else {
      setLoading(true);
      const loginAction =
        role === ROLE.TRADITIONAL_USER
          ? BasicUser.login({ username: username, password: password })
          : Shipper.login({ username: username, password: password });
      dispatch(loginAction)
        .then(unwrapResult)
        .then((res) => {
          // -------------Connect to websocket server--------------
          dispatch(connectWebsocket(res.token.token))
            .then(unwrapResult)
            .then((ws) => {
              setLoading(false);
              if (role === ROLE.TRADITIONAL_USER) {
                navigation.navigate(ROUTES.HOME, {
                  screen: ROUTES.HOME_DRAWER,
                });
              } else {
                // dispatch(
                //   Shipper.setOnline({ ws: ws, shipperId: res.user.accountId })
                // );
                navigation.navigate(ROUTES.DRIVER_NAVIGATION, {
                  screen: ROUTES.FIND_ORDER_DRIVER_TAB,
                });
                // if (res.user.verified) {
                //   navigation.navigate(ROUTES.DRIVER_NAVIGATION, {
                //     screen: ROUTES.FIND_ORDER_DRIVER_TAB,
                //   });
                // } else {
                //   navigation.navigate(ROUTES.REGISTER_NAVIGATE, {
                //     screen: ROUTES.COMPELETE_REGISTER,
                //   });
                // }
              }
            })
            .catch((e) => {
              setLoading(false);
              Toast.show({
                type: "error",
                text1: "Khong the ket noi toi websocket",
                text2: "Hay thu lai sau",
              });
            });
        })
        .catch((e) => {
          console.log(e);
          setLoading(false);

          Toast.show({
            type: "error",
            text1: "Đăng nhập thất bại",
            text2: "Tài khoản hoặc mật khẩu không chính xác",
          });
        });
    }
  };
  const requestLocationPermission = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Quyền truy cập vị trí",
        "Ứng dụng cần quyền truy cập vị trí để tiếp tục",
        [
          {
            text: "OK",
            onPress: async () => {
              // Yêu cầu quyền truy cập vị trí lại
              let { status } =
                await Location.requestForegroundPermissionsAsync();
              if (status === "granted") {
                getLocation();
              } else {
                Alert.alert("Quyền truy cập vị trí không được cấp");
              }
            },
          },
        ]
      );
    }
  };

  useEffect(() => {
    requestLocationPermission();
  }, []);

  // useEffect(() => {
  //     (function () {
  //         GoogleSignin.configure({
  //             webClientId: "297909054584-ec2ra6tq46trk2gvj9ubqsf1rq20q335.apps.googleusercontent.com",
  //             androidClientId: "297909054584-2tm4tc03cuv9iqp3vdmtlusbcrukof88.apps.googleusercontent.com",
  //             iosClientId: "297909054584-gdp0dd9vhljuo9n6sk0q59lope7i0r4v.apps.googleusercontent.com",
  //         });
  //     })()
  // }, []);

  // const handleGoogleSignIn = async () => {
  //     const handleErr = () => {
  //         setLoading(false)
  //         Toast.show({
  //             type: ALERT_TYPE.WARNING,
  //             title: "Đăng nhập thất bại",
  //             textBody: "Hãy thử lại sau ít phút"
  //         })
  //     }
  //     setLoading(true)
  //     try {
  //         await GoogleSignin.hasPlayServices();
  //         const userInfo = await GoogleSignin.signIn();
  //         if (userInfo) {
  //             const res = await GoogleSignin.getTokens();
  //             dispatch(BasicUser.googleLogin(res.accessToken))
  //                 .then(unwrapResult)
  //                 .then(res => {

  //                     navigation.navigate(ROUTES.HOME)
  //                 })
  //                 .catch(e => {
  //                     setLoading(false)
  //                     handleErr()
  //                 })
  //         } else {
  //             handleErr()
  //         }
  //         setLoading(false)
  //     } catch (e) {
  //         setLoading(false)
  //         handleErr()
  //     }
  // };

  return (
    <SafeAreaView className="flex-1 flex-col justify-around h-full relative">
      <Spinner visible={loading} size="large" animation="fade" />
      <View className=" basis-1/6 flex justify-center items-center">
        <Image
          style={{ height: 35, resizeMode: "contain" }}
          source={require("../../assets/images/Logo.png")}
        />
      </View>
      <View className="basis-4/6 items-center ">
        <Text className="text-4xl font-semibold">Đăng nhập</Text>
        <Text className="text-lg font-normal text-gray-500 pt-2">{`( Với tư cách là ${
          role === ROLE.TRADITIONAL_USER ? "thành viên" : "người vận chuyển"
        } )`}</Text>
        <View className="w-full px-5 mt-6 flex-col space-y-4">
          <View className="rounded-lg border-2 border-[#D1D1D1] p-4 bg-white">
            <TextInput
              placeholderTextColor={"#A5A5A5"}
              placeholder="Tài khoản"
              value={username}
              onChangeText={(txt) => setUsername(txt)}
            />
          </View>
          <View className="rounded-lg border-2 border-[#D1D1D1] px-4 bg-white relative">
            <TextInput
              className="my-4"
              placeholderTextColor={"#A5A5A5"}
              placeholder="Mật khẩu"
              value={password}
              onChangeText={(txt) => setPassword(txt)}
              secureTextEntry={!showPassword}
            />
            {showPassword ? (
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-0 translate-y-4"
              >
                <Entypo name="eye" size={20} color="#A5A5A5" />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-0 translate-y-4"
              >
                <Entypo name="eye-with-line" size={20} color="#A5A5A5" />
              </TouchableOpacity>
            )}
          </View>
          <TouchableOpacity
            className={`w-full flex bg-[#3422F1] items-center rounded-lg p-4`}
            onPress={handleLogin}
          >
            <Text className="text-lg font-normal text-white">Đăng nhập</Text>
          </TouchableOpacity>
          {/* {role === ROLE.TRADITIONAL_USER && <View className="flex-col space-y-3">
                        <Text className="text-center text-gray-500 font-medium text-sm py-2">hoặc đăng nhập bằng</Text>
                        <View className="flex items-center">
                            <GoogleSigninButton
                                size={GoogleSigninButton.Size.Icon}
                                color={GoogleSigninButton.Color.Dark}
                                onPress={handleGoogleSignIn}
                            />
                        </View>
                    </View>} */}
        </View>
      </View>
      <View className="basis-1/6 pb-2 flex justify-end">
        <TouchableOpacity
          className="w-ful flex p-1 items-center"
          onPress={() =>
            navigation.navigate(ROUTES.RESETPASSWORD, {
              screen: ROUTES.INPUT_EMAIL_RESETPASSWORD,
            })
          }
        >
          <Text className="text-lg font-bold text-[#3422F1]">
            Quên mật khẩu?
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          className="w-ful flex p-1 items-center"
          onPress={() => navigation.navigate(ROUTES.REGISTER_NAVIGATE)}
        >
          <Text className="text-lg font-bold text-[#3422F1]">
            Bạn chưa có tài khoản?
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          className="w-ful flex p-1 items-center"
          onPress={() => navigation.navigate(ROUTES.CHOOSEACCOUNT)}
        >
          <Text className="text-lg font-bold text-[#3422F1]">
            Đổi tư cách đăng nhập?
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default Login;
