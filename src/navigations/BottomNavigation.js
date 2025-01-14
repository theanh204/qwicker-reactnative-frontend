import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { ROUTES } from "../constants";
import Wallet from "../screens/Wallet";
import {
  Feather,
  MaterialCommunityIcons,
  AntDesign,
  FontAwesome,
  Ionicons,
} from "@expo/vector-icons";
import Notification from "../screens/Notification";
import PickOrder from "../screens/driver/hideTab/PickOrder";
import DriverProfileNavigation from "./DriverProfileNavigation";
import MyOrderTab from "../screens/driver/myOrderTab";
import FindOrderTab from "../screens/driver/findOrderTab";
import ReviewOrder from "../screens/driver/hideTab/ReviewOrder";
import SearchOrder from "../screens/driver/hideTab/SearchOrder";
import ViewDistance from "../screens/driver/hideTab/ViewDistance";
import ViewOrderBeforeShip from "../screens/driver/hideTab/ViewOrderBeforeShip";
import Routing from "../screens/driver/hideTab/Routing";
import IncomeStatistic from "../screens/driver/imcomeStatisticTab";

const Tab = createBottomTabNavigator();
const BottomNavigation = () => {
  return (
    <Tab.Navigator
      initialRouteName={ROUTES.FIND_ORDER_DRIVER_TAB}
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ color, focused, size }) => {
          if (route.name === ROUTES.FIND_ORDER_DRIVER_TAB) {
            return (
              <Feather
                name="download"
                size={30}
                color={focused ? "#3422F1" : "black"}
              />
            );
          } else if (route.name === ROUTES.ORDER_DRIVER_TAB) {
            return (
              <MaterialCommunityIcons
                name="clipboard-text-multiple-outline"
                size={30}
                color={focused ? "#3422F1" : "black"}
              />
            );
          } else if (route.name === ROUTES.WALLET_DRIVER_TAB) {
            return (
              <AntDesign
                name="wallet"
                size={30}
                color={focused ? "#3422F1" : "black"}
              />
            );
            // } else if (route.name === ROUTES.TASK_DRIVER_TAB) {
            //   return (
            //     <FontAwesome
            //       name="tasks"
            //       size={30}
            //       color={focused ? "#3422F1" : "black"}
            //     />
            //   );
          } else if (route.name === ROUTES.NOTIFICATION_DRIVER_TAB) {
            return (
              <Feather
                name="bell"
                size={30}
                color={focused ? "#3422F1" : "black"}
              />
            );
          } else if (route.name === ROUTES.DRIVER_PROFILE_NAVIGATION) {
            return (
              <Ionicons
                name="person-circle-outline"
                size={30}
                color={focused ? "#3422F1" : "black"}
              />
            );
          }
        },
        tabBarStyle: styles.tabBarStyle,
        tabBarItemStyle: styles.tabBarItemStyle,
        tabBarLabelStyle: styles.tabBarLabelStyle,
        tabBarHideOnKeyboard: true,
        // title: ({ focused }) => (<CustomBottomTabbarItem focused={focused} />)
      })}
    >
      <Tab.Screen
        name={ROUTES.FIND_ORDER_DRIVER_TAB}
        component={FindOrderTab}
        options={() => ({
          headerShown: true,
        })}
      />
      <Tab.Screen
        options={{ title: "Đơn hàng", unmountOnBlur: true }}
        name={ROUTES.ORDER_DRIVER_TAB}
        component={MyOrderTab}
      />
      <Tab.Screen
        options={{ title: "Ví" }}
        name={ROUTES.WALLET_DRIVER_TAB}
        component={Wallet}
      />
      <Tab.Screen
        options={{ title: "Thông báo" }}
        name={ROUTES.NOTIFICATION_DRIVER_TAB}
        component={Notification}
      />
      <Tab.Screen
        name={ROUTES.DRIVER_PROFILE_NAVIGATION}
        component={DriverProfileNavigation}
        options={({ navigation }) => ({
          title: "Tài xế",
        })}
      />
      {/* -------------Hided screen-------------- */}
      <Tab.Screen
        name={ROUTES.PICK_ORDER_DRIVER_TAB}
        component={PickOrder}
        options={({ navigation }) => ({
          tabBarButton: () => null,
          tabBarStyle: { display: "none" },
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => navigation.navigate(ROUTES.FIND_ORDER_DRIVER_TAB)}
              className="ml-4"
            >
              <Ionicons name="arrow-back-sharp" size={24} color="white" />
            </TouchableOpacity>
          ),
          headerShown: true,
          headerTitle: "",
          headerStyle: {
            backgroundColor: "#3422F1",
          },
        })}
      />
      <Tab.Screen
        name={ROUTES.REVIEW_ORDER_DRIVER_TAB}
        component={ReviewOrder}
        options={({ navigation, route }) => ({
          tabBarButton: () => null,
          tabBarStyle: { display: "none" },
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => navigation.navigate(ROUTES.ORDER_DRIVER_TAB)}
              className="ml-4"
            >
              <Ionicons name="arrow-back-sharp" size={24} color="black" />
            </TouchableOpacity>
          ),
          headerRight: () => (
            <Text className="text-lg mr-4 font-normal text-[#3422F1]">
              TRỢ GIÚP
            </Text>
          ),
          headerShown: true,
          headerTitle: route.params?.title,
          headerTitleAlign: "center",
        })}
      />

      <Tab.Screen
        name={ROUTES.VIEW_ORDER_BEFORE_SHIP}
        component={ViewOrderBeforeShip}
        options={({ navigation, route }) => ({
          tabBarButton: () => null,
          unmountOnBlur: true,
          tabBarStyle: { display: "none" },
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => navigation.navigate(ROUTES.ORDER_DRIVER_TAB)}
              className="ml-4"
            >
              <Ionicons name="arrow-back-sharp" size={24} color="black" />
            </TouchableOpacity>
          ),
          headerRight: () => (
            <Text className="text-lg mr-4 font-normal text-[#3422F1]">
              TRỢ GIÚP
            </Text>
          ),
          headerShown: true,
          headerTitle: "",
          headerTitleAlign: "center",
        })}
      />
      <Tab.Screen
        name={ROUTES.DRIVER_INCOME_STATISTIC}
        component={IncomeStatistic}
        options={({ navigation, route }) => ({
          tabBarButton: () => null,
          unmountOnBlur: true,
          tabBarStyle: { display: "none" },
          headerLeft: () => (
            <TouchableOpacity
              onPress={() =>
                navigation.navigate(ROUTES.DRIVER_PROFILE_NAVIGATION)
              }
              className="ml-4"
            >
              <Ionicons name="arrow-back-sharp" size={24} color="black" />
            </TouchableOpacity>
          ),

          headerShown: true,
          headerTitle: "Thống Kê Thu Nhập",
          headerTitleAlign: "center",
        })}
      />
      <Tab.Screen
        name={ROUTES.ROUTING_TAB}
        component={Routing}
        options={({ navigation, route }) => ({
          tabBarButton: () => null,
          tabBarStyle: { display: "none" },
          headerLeft: () => (
            <TouchableOpacity
              onPress={() =>
                navigation.navigate(ROUTES.VIEW_ORDER_BEFORE_SHIP, {
                  data: route.params.data,
                })
              }
              className="ml-4"
            >
              <Ionicons name="arrow-back-sharp" size={24} color="black" />
            </TouchableOpacity>
          ),
          headerRight: () => (
            <Text className="text-lg mr-4 font-normal text-[#3422F1]">
              TRỢ GIÚP
            </Text>
          ),
          unmountOnBlur: true,
          headerShown: true,
          headerTitle: route.params?.title,
          headerTitleAlign: "center",
        })}
      />

      <Tab.Screen
        name={ROUTES.SEARCH_ORDER_DRIVER_TAB}
        component={SearchOrder}
        options={{ headerShown: false, tabBarButton: () => null }}
      />
      <Tab.Screen
        name={ROUTES.DRIVER_VIEW_DISTANCE}
        component={ViewDistance}
        options={{
          headerShown: false,
          tabBarButton: () => null,
          tabBarStyle: { display: "none" },
        }}
      />
    </Tab.Navigator>
  );
};

export default BottomNavigation;
const styles = StyleSheet.create({
  tabBarStyle: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 100,
  },
  tabBarItemStyle: {
    top: 4,
    width: 117,
    marginBottom: 18,
  },
  tabBarLabelStyle: {
    fontSize: 14,
  },
});
