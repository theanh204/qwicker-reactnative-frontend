import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { ROLE, ROUTES } from "../constants";
import ChooseAccount from "../screens/auth/ChooseAccount";
import DrawerNavigation from "./DrawerNavigation";
import OnbroadingScreen from "../screens/OnbroadingScreen";
import RegisterNavigation from "./RegisterNavigation";
import { useSelector } from "react-redux";
import { getIsUseAppBefore, getRole } from "../redux/appSlice";
import Login from "../screens/auth/Login";
import BottomNavigation from "./BottomNavigation";
import { getBasicUserToken } from "../redux/basicUserSlice";
import { getToken } from "../redux/shipperSlice";
import ResetPasswordNavigation from "./ResetPasswordNavigation";
const Stack = createNativeStackNavigator();
const AuthNavigation = () => {
  const useAppBefore = useSelector(getIsUseAppBefore);
  const role = useSelector(getRole);
  const basisUserToken = useSelector(getBasicUserToken);
  const shipperToken = useSelector(getToken);
  const getIniteRoute = () => {
    if (!useAppBefore) {
      return ROUTES.ONBOARDING;
    }
    // if (role === ROLE.TRADITIONAL_USER && basisUserToken !== "") {
    //   return ROUTES.HOME;
    // }
    // if (role === ROLE.DRIVER && shipperToken !== "") {
    //   return ROUTES.DRIVER_NAVIGATION;
    // }
    return ROUTES.LOGIN;
  };
  return (
    <Stack.Navigator
      initialRouteName={getIniteRoute()}
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name={ROUTES.LOGIN} component={Login} />
      <Stack.Screen name={ROUTES.HOME} component={DrawerNavigation} />
      <Stack.Screen
        name={ROUTES.DRIVER_NAVIGATION}
        component={BottomNavigation}
      />
      <Stack.Screen
        name={ROUTES.REGISTER_NAVIGATE}
        component={RegisterNavigation}
        options={{ title: "" }}
      />
      <Stack.Screen
        name={ROUTES.RESETPASSWORD}
        component={ResetPasswordNavigation}
        options={{ title: "" }}
      />
      <Stack.Screen name={ROUTES.CHOOSEACCOUNT} component={ChooseAccount} />
      <Stack.Screen name={ROUTES.ONBOARDING} component={OnbroadingScreen} />
    </Stack.Navigator>
  );
};

export default AuthNavigation;
