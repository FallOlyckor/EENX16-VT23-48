import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useState } from "react";
import { Image, Text, View } from "react-native";
import logo2 from "../assets/images/logo2.png";
import Button from "../components/Button";
import Container from "../components/Container";
import InputField from "../components/InputField";
import { useAuth } from "../lib/AuthContext";
import { HomeStackParamList } from "./Navigation";

type Props = NativeStackScreenProps<HomeStackParamList, "Login">;

export default function LoginScreen({ route, navigation }: Props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const user = useAuth();

  const login = () => {
    try {
      user.login(email, password);
      console.log("hej");
    } catch (error: any) {
      console.log(error);
    }
  };

  return (
    <Container>
      <View className="bg-white pt-8 pb-2 rounded-xl items-center min-h-fit">
        <Text className="text-3xl">SeniorSecure</Text>
        <View className="w-4/5">
          <Image className="w-24 h-24 mx-auto mt-8" source={logo2} />
          <Text className=" mt-8 text-xl">Email</Text>
          <InputField
            keyboardType="email-address"
            autoComplete="email"
            placeholder="test.test@gmail.com"
            value={email}
            onChangeText={setEmail}
          />

          <Text className="mt-2 text-xl">Lösenord</Text>

          <InputField
            placeholder="test"
            secureTextEntry={true}
            value={password}
            onChangeText={setPassword}
          />

          <Button title="Logga in" onPress={() => login()} />
          <Text
            onPress={() => navigation.navigate("Register", { login })}
            className="self-center mt-8 text-lg underline"
          >
            Register
          </Text>
        </View>
      </View>
    </Container>
  );
}
