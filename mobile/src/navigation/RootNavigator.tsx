import { useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { ActivityIndicator, View } from "react-native";
import { useAuthStore } from "../store/authStore";
import AuthStack from "./AuthStack";
import MainTabs from "./MainTabs";
import { COLORS } from "../constants/theme";

export default function RootNavigator() {
  const { token, isLoading, loadToken } = useAuthStore();

  // restore saved token on app launch
  useEffect(() => {
    loadToken();
  }, []);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator color={COLORS.primary} size={"large"} />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {token ? <MainTabs /> : <AuthStack />}
    </NavigationContainer>
  );
}
