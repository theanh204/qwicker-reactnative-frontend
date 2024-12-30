import { NavigationContainer } from "@react-navigation/native";
import AuthNavigation from "./src/navigations/AuthNavigation";
import { Provider } from "react-redux";
import { AlertNotificationRoot } from "react-native-alert-notification";
import { persistor, store } from "./src/redux/store";
import { PersistGate } from "redux-persist/integration/react";
import * as encoding from "text-encoding"; // for websocket
import FetchStaticData from "./src/components/FetchStaticData";
import Toast, { BaseToast, ErrorToast } from "react-native-toast-message";
function App() {
  return (
    <Provider store={store}>
      <AlertNotificationRoot>
        <NavigationContainer>
          <FetchStaticData>
            <AuthNavigation />
          </FetchStaticData>
        </NavigationContainer>
        <Toast config={toastConfig} />
      </AlertNotificationRoot>
    </Provider>
  );
}
const toastConfig = {
  /*
    Overwrite 'success' type,
    by modifying the existing `BaseToast` component
  */
  success: (props) => (
    <BaseToast
      {...props}
      style={{ borderLeftColor: "green" }}
      contentContainerStyle={{ paddingHorizontal: 15 }}
      text1Style={{
        fontSize: 15,
        fontWeight: "400",
      }}
    />
  ),
  /*
    Overwrite 'error' type,
    by modifying the existing `ErrorToast` component
  */
  error: (props) => (
    <ErrorToast
      {...props}
      text1Style={{
        fontSize: 17,
      }}
      text2Style={{
        fontSize: 15,
      }}
    />
  ),
  /*
    Or create a completely new type - `tomatoToast`,
    building the layout from scratch.

    I can consume any custom `props` I want.
    They will be passed when calling the `show` method (see below)
  */
  tomatoToast: ({ text1, props }) => (
    <View style={{ height: 60, width: "100%", backgroundColor: "tomato" }}>
      <Text>{text1}</Text>
      <Text>{props.uuid}</Text>
    </View>
  ),
};

export default App;
