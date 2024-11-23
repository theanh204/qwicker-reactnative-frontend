import { NavigationContainer } from "@react-navigation/native";
import AuthNavigation from "./src/navigations/AuthNavigation";
import { Provider } from "react-redux";
import { AlertNotificationRoot } from "react-native-alert-notification";
import { persistor, store } from "./src/redux/store";
import { PersistGate } from "redux-persist/integration/react";
import * as encoding from "text-encoding"; // for websocket
import FetchStaticData from "./src/components/FetchStaticData";
function App() {
  return (
    <Provider store={store}>
      <AlertNotificationRoot>
        <NavigationContainer>
          <FetchStaticData>
            <AuthNavigation />
          </FetchStaticData>
        </NavigationContainer>
      </AlertNotificationRoot>
    </Provider>
  );
}
export default App;
