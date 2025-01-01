import {
  View,
  Text,
  Dimensions,
  TouchableOpacity,
  Image,
  StyleSheet,
} from "react-native";
import React, { useCallback, useEffect, useRef, useState } from "react";
import MapView, { Circle, Marker, Polyline } from "react-native-maps";
import { MaterialIcons, Entypo } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import Spinner from "react-native-loading-spinner-overlay";
import {
  calculateInitialRegion,
  getCurrentLocation,
} from "../../../features/ultils";
import { LOCATION, ROUTES } from "../../../constants";
import { getDirection, getShipperProfile } from "../../../redux/shipperSlice";
import { unwrapResult } from "@reduxjs/toolkit";
var polyline = require("@mapbox/polyline");
const ViewDistance = ({ navigation, route }) => {
  const { vehicle } = useSelector(getShipperProfile);
  const dispatch = useDispatch();
  let {
    startPoint = {
      latitude: 10.842961424758958,
      longitude: 106.62091775432197,
    },
    endPoint = { latitude: 10.822032030791492, longitude: 106.64086921452592 },
    locationType,
    data,
  } = route?.params || {};
  const [loading, setLoading] = useState(false);
  const mapRef = useRef(null);
  const [coordinates, setCoordinates] = useState([]);
  useEffect(() => {
    setLoading(true);
    dispatch(
      getDirection({
        origin: `${startPoint.latitude},${startPoint.longitude}`,
        destination: `${endPoint.latitude},${endPoint.longitude}`,
      })
    )
      .then(unwrapResult)
      .then((res) => {
        const points = polyline
          .decode(res?.overview_polyline?.points)
          .map(([latitude, longitude]) => ({ latitude, longitude }));
        setCoordinates(points);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        console.error(err);
      });
  }, []);

  useEffect(() => {
    if (mapRef.current) {
      mapRef.current.fitToCoordinates([{ ...startPoint }, { ...endPoint }], {
        edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
        animated: true,
      });
    }
  }, [startPoint, endPoint]);

  const handleBack = () => {
    navigation.navigate(ROUTES.PICK_ORDER_DRIVER_TAB, { data: data });
  };

  return (
    <View className="flex-1 relative">
      <Spinner visible={loading} size="large" animation="fade" />
      <MapView
        className="w-full h-full"
        ref={mapRef}
        initialRegion={calculateInitialRegion(startPoint, endPoint)}
      >
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
        <Marker coordinate={endPoint} />

        {coordinates.length > 0 && (
          <Polyline
            strokeWidth={4}
            strokeColor="#3422F1"
            coordinates={coordinates}
          />
        )}
      </MapView>

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
          <Text className="text-base font-bold">{endPoint?.addressLine}</Text>
          <Text className="text text-gray-500">
            {endPoint?.formattedAddress}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ViewDistance;
