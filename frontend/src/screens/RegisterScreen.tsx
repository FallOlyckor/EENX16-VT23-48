import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useEffect, useRef, useState } from "react";
import { Text, View, Image, Platform } from "react-native";
import { BackEndConnection } from "../api/BackendConnection";
import Button from "../components/Button";
import Container from "../components/Container";
import InputField from "../components/InputField";
import { useAuth } from "../lib/AuthContext";
import { HomeStackParamList } from "./Navigation";
import logo2 from "../assets/images/logo2.png";

type Props = NativeStackScreenProps<HomeStackParamList, "Register">;
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

async function registerForPushNotificationsAsync(): Promise<string> {
  let token = "";
  if (Device.isDevice) {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      alert("Failed to get push token for push notification!");
      return token;
    }
    token = (await Notifications.getExpoPushTokenAsync()).data;
    console.log(token);
  } else {
    alert("Must use physical device for Push Notifications");
  }

  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }

  return token;
}

export default function RegisterScreen({ route, navigation }: Props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [expoPushToken, setExpoPushToken] = useState<string>("");
  const [notification, setNotification] = useState<
    Notifications.Notification | false
  >(false);
  const notificationListener = useRef<() => void | null>();
  const responseListener =
    useRef<(response: Notifications.NotificationResponse) => void | null>();

  const user = useAuth();

  useEffect(() => {
    registerForPushNotificationsAsync().then((token: string) =>
      setExpoPushToken(token)
    );

    notificationListener.current = () => {
      if (notification) {
        setNotification(notification);
      }
    };

    responseListener.current = (
      response: Notifications.NotificationResponse
    ) => {
      console.log(response);
    };

    const notificationSubscription =
      Notifications.addNotificationReceivedListener(
        notificationListener.current
      );

    const responseSubscription =
      Notifications.addNotificationResponseReceivedListener(
        responseListener.current
      );

    return () => {
      if (notificationSubscription) {
        notificationSubscription.remove();
      }

      if (responseSubscription) {
        responseSubscription.remove();
      }
    };
  }, []);

  const register = () => {
    if (email.length > 0 && password.length > 0) {
      console.log("register");

      BackEndConnection.register(email, password, expoPushToken)

        .then((res) => {
          console.log("register");

          user.setUser({ email: email, token: res.token, role: "STANDARD" });
        })
        .catch((err) => console.log(err));
    }
  };

  return (
    <Container>
      <View className="bg-white py-8 rounded-xl items-center min-h-fit">
        <Text className="text-4xl">Health Care</Text>
        <View className="w-4/5">
          <Image className="w-24 h-24 mx-auto mt-8" source={logo2} />

          <Text className=" mt-8 text-xl">Email</Text>
          <InputField
            placeholder="test.test@gmail.com"
            value={email}
            onChangeText={setEmail}
          />

          <Text className="mt-2 text-xl">Lösenord</Text>
          <InputField
            placeholder="test"
            value={password}
            secureTextEntry={true}
            onChangeText={setPassword}
          />

          <Button title="Registrera" onPress={() => register()} />

          <Text
            onPress={() => navigation.navigate("Login")}
            className="self-center mt-8 text-lg underline"
          >
            Already have account? Login
          </Text>
        </View>
      </View>
    </Container>
  );
}
