import { StyleSheet, Text, View } from "react-native";
import React, { useEffect } from "react";
import {
  fetchProductCategories,
  fetchVehicles,
  getCategories,
  getVehicles,
} from "../redux/appSlice";
import { useDispatch, useSelector } from "react-redux";
import { unwrapResult } from "@reduxjs/toolkit";

const FetchStaticData = ({ children }) => {
  const dispatch = useDispatch();
  const initVehicles = useSelector(getVehicles);
  const initCategories = useSelector(getCategories);

  useEffect(() => {
    if (initVehicles.length === 0) {
      dispatch(fetchVehicles())
        .then(unwrapResult)
        .then()
        .catch((e) => console.log(e));
    }
    if (initCategories.length === 0) {
      dispatch(fetchProductCategories())
        .then(unwrapResult)
        .then()
        .catch((e) => console.log(e));
    }
  }, []);

  return <>{children}</>;
};

export default FetchStaticData;
