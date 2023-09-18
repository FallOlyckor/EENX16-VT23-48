import * as React from "react";
import { Platform, Text, View } from "react-native";
import { AuthProvider } from "./src/lib/AuthContext";
import Navigation from "./src/screens/Navigation";

export default function App() {
  return (
    <AuthProvider>
      <View className="flex-1">
        <Navigation />
      </View>
    </AuthProvider>
  );
}
