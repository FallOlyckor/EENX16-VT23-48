import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import * as React from "react";
import { useState } from "react";
import { Keyboard, Switch, Text, View } from "react-native";
import { BackEndConnection } from "../api/BackendConnection";
import Button from "../components/Button";
import Container from "../components/Container";
import Modal from "../components/Modal";
import { HomeStackParamList } from "./Navigation";
import InputField from "../components/InputField";

type Props = NativeStackScreenProps<HomeStackParamList, "Settings">;

export default function SettingsScreen({ route, navigation }: Props) {
  const [darkMode, setDarkMode] = useState(false);
  const [fall, setFall] = useState("");
  const [fallModalVisible, setFallModalVisible] = useState(false);

  const createFall = () => {
    setFallModalVisible(false);
    BackEndConnection.initiateFall(fall)
      .then((res) => {
        console.log(res);
      })
      .catch((err) => console.log(err));
  };

  return (
    <Container>
      <Text className="text-xl">Dark mode</Text>
      <Modal
        modalVisible={fallModalVisible}
        setModalVisible={setFallModalVisible}
      >
        <View className="rounded-xl p-8 w-5/6 bg-white flex gap-y-2">
          <View className="mb-4">
            <Text className="text-xl">SocialSecurityNr</Text>
            <InputField
              placeholder="ååååmmdd-xxxx"
              keyboardType="numeric"
              value={fall}
              maxLength={13}
              onChangeText={(e) => {
                if (fall.length < e.length && fall.length == 8) {
                  setFall((prev) => prev + `-`);
                } else {
                  if (e.length == 13) {
                    Keyboard.dismiss();
                  }
                  setFall(e);
                }
              }}
            />
          </View>
          <Button
            onPress={createFall}
            title="Create fall"
            className="mt-6 self-center"
          />
        </View>
      </Modal>
      <Switch
        className="self-start"
        trackColor={{ false: "#767577", true: "green" }}
        thumbColor="#fff"
        ios_backgroundColor="#3e3e3e"
        onValueChange={() => setDarkMode((prev) => !prev)}
        value={darkMode}
      />
      <Button title="Initiate fall" onPress={() => setFallModalVisible(true)} />
    </Container>
  );
}
