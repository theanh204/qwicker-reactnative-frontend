import {
  View,
  Text,
  Dimensions,
  TouchableOpacity,
  Image,
  StyleSheet,
} from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import MapView, { Circle, Marker, Polyline } from "react-native-maps";
import { MaterialIcons, Entypo } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import Spinner from "react-native-loading-spinner-overlay";
import { getCurrentLocation } from "../../../features/ultils";
import { LOCATION, ROUTES } from "../../../constants";
import { getDuration, getShipperProfile } from "../../../redux/shipperSlice";
import { unwrapResult } from "@reduxjs/toolkit";
// import Mapbox from "@rnmapbox/maps";

const { width, height } = Dimensions.get("window");
const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.01;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
const INIT_REGION = {
  latitude: 10.8203378,
  longitude: 106.6788052,
  latitudeDelta: LATITUDE_DELTA,
  longitudeDelta: LONGITUDE_DELTA,
};
const styles = StyleSheet.create({
  page: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    height: 300,
    width: 300,
  },
  map: {
    flex: 1,
  },
});
const ViewDistance = ({ navigation, route }) => {
  let { startPoint, endPoint, locationType, data } = route.params;
  const dispatch = useDispatch();
  const [region, setRegion] = useState();
  const { vehicle } = useSelector(getShipperProfile);
  const [loading, setLoading] = useState(false);
  const [routeCoordinates, setRouteCoordinates] = useState([]);
  const [duration, setDuration] = useState();
  // const fetchData = async () => {
  //   try {
  //     setLoading(true);
  //     setRegion({
  //       latitude: (startPoint.latitude + endPoint.latitude) / 2,
  //       longitude: (startPoint.longitude + endPoint.longitude) / 2,
  //       latitudeDelta: Math.abs(startPoint.latitude - endPoint.latitude) * 1.5,
  //       longitudeDelta:
  //         Math.abs(startPoint.longitude - endPoint.longitude) * 1.5,
  //     });
  //     dispatch(
  //       getDuration({
  //         lat1: startPoint.latitude,
  //         long1: startPoint.longitude,
  //         lat2: endPoint.latitude,
  //         long2: endPoint.longitude,
  //       })
  //     )
  //       .then(unwrapResult)
  //       .then((res) => {
  //         setDuration(res);
  //         const route = res.routeLegs[0].itineraryItems;
  //         const routePath = route.map((route) => ({
  //           latitude: route.maneuverPoint.coordinates[0],
  //           longitude: route.maneuverPoint.coordinates[1],
  //         }));
  //         setRouteCoordinates([
  //           { latitude: startPoint.latitude, longitude: startPoint.longitude },
  //           ...routePath,
  //           { latitude: endPoint.latitude, longitude: endPoint.longitude },
  //         ]);
  //         setLoading(false);
  //       });
  //   } catch (e) {
  //     setLoading(false);
  //     console.log(e);
  //   }
  // };
  // useEffect(() => {
  //   fetchData();
  // }, [locationType, data]);

  const handleBack = () => {
    navigation.navigate(ROUTES.PICK_ORDER_DRIVER_TAB, { data: data });
  };

  return (
    <View className="flex-1 relative">
      <Spinner visible={loading} size="large" animation="fade" />
      {/* <MapView
        className="w-full h-full"
        region={region}
        initialRegion={INIT_REGION}
        // provider={PROVIDER_GOOGLE}
      >
        {duration && (
          <Marker.Animated coordinate={startPoint}>
            <Image
              source={{ uri: vehicle?.icon }}
              style={{
                width: 30,
                height: 30,
              }}
              resizeMode="contain"
            />
          </Marker.Animated>
        )}
        {duration && <Marker coordinate={endPoint} />}

        {routeCoordinates.length > 0 && (
          <Polyline
            strokeWidth={4}
            strokeColor="#3422F1"
            coordinates={routeCoordinates}
          />
        )}
      </MapView> */}

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
        <TouchableOpacity className="basis-10/12 flex-col flex-shrink-0 pl-2">
          <Text className="text-base font-bold">{endPoint.addressLine}</Text>
          <Text className="text text-gray-500">
            {endPoint.formattedAddress}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ViewDistance;
