import { MaterialCommunityIcons } from "@expo/vector-icons";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import * as React from "react";
import { useEffect, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { BackEndConnection } from "../api/BackendConnection";
import Container from "../components/Container";
import InfoBox from "../components/InfoBox";
import Loading from "../components/Loading";
import { Chat } from "../lib/interfaces";
import { ChatStackParamList } from "./Navigation";

type Props = NativeStackScreenProps<ChatStackParamList, "HomeChat">;

export default function HomeChatScreen({ route, navigation }: Props) {
  const [acuteChats, setAcuteChats] = useState<Chat[]>([]);
  const [previousChats, setPreviousChats] = useState<Chat[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    BackEndConnection.getChat()
      .then((res: Chat[]) => {
        setAcuteChats(res.filter((x) => x.sensorUser.status !== "HOME"));
        setPreviousChats(res.filter((x) => x.sensorUser.status === "HOME"));

        setLoading(false);
      })
      .catch((err) => console.log(err));
  }, []);

  if (loading) return <Loading />;

  return (
    <Container>
      <InfoBox
        title="Chattar"
        explanation="Här kan du se alla tidigare chattar från de olika fallen som inträffat siffran till vänster indikerar hur många missade meddelanden"
      />
      {acuteChats.length > 0 && (
        <View className="my-2">
          <Text className="text-xl">Aktiva</Text>

          {acuteChats
            .filter((x) => x.sensorUser.status !== "HOME")
            .map((chat, key) => (
              <TouchableOpacity
                key={key}
                onPress={() =>
                  navigation.navigate("Chat", { sensorUser: chat.sensorUser })
                }
              >
                <View className="bg-primary my-2 py-4 px-8 rounded-2xl flex-row items-center justify-between">
                  <View className="flex-col ">
                    <Text className="text-xl text-white">Anhöriga till</Text>
                    <Text className="text-2xl text-white font-bold">
                      {chat.sensorUser.name}
                    </Text>
                  </View>
                  <MaterialCommunityIcons
                    name="account-group"
                    color="white"
                    size={50}
                  />
                </View>
              </TouchableOpacity>
            ))}
        </View>
      )}
      {previousChats.length > 0 && (
        <View className="my-2">
          <Text className="text-xl">Alla</Text>

          {previousChats
            .filter((x) => x.sensorUser.status === "HOME")
            .map((chat, key) => (
              <TouchableOpacity
                key={key}
                onPress={() =>
                  navigation.navigate("Chat", { sensorUser: chat.sensorUser })
                }
              >
                <View className="bg-white my-2 py-4 px-8 border-4 rounded-2xl border-primary flex-row items-center justify-between">
                  <View className="flex-col ">
                    <Text className="text-xl text-primary">Anhöriga till</Text>
                    <Text className="text-2xl text-primary font-bold">
                      {chat.sensorUser.name}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
        </View>
      )}
    </Container>
  );
}
