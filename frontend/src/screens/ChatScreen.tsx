import { MaterialIcons } from "@expo/vector-icons";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import * as React from "react";
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { BackEndConnection } from "../api/BackendConnection";
import Loading from "../components/Loading";
import { User, useAuth } from "../lib/AuthContext";
import { Message } from "../lib/interfaces";
import { ChatStackParamList } from "./Navigation";
import * as SecureStore from "expo-secure-store";

type Props = NativeStackScreenProps<ChatStackParamList, "Chat">;

export default function ChatScreen({ route, navigation }: Props) {
  const sensorUser = route.params.sensorUser;
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [sendingMessage, setSendingMessage] = useState(false);

  const user = useAuth();
  const ws = useRef<WebSocket | null>(null);

  useEffect(() => {
    ws.current = new WebSocket("ws://192.168.0.189:8080/");

    ws.current.onopen = () => {
      console.log("Connected");
    };

    ws.current.onclose = (event) => {
      console.log(event.code, event.reason);
    };

    ws.current.onerror = (e) => {
      console.log(e);
    };

    ws.current.onmessage = (event) => {
      const receivedMessage = JSON.parse(event.data) as Message;
      setMessages((prev) => [...prev, receivedMessage]);
    };

    BackEndConnection.getMessages(sensorUser.socialSecurityNumber)
      .then((messages: Message[]) => {
        setMessages(messages);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
      });
    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };
  }, []);

  const sendMessage = async () => {
    const user = await SecureStore.getItemAsync("user")
      .then((res) => {
        if (res) return JSON.parse(res);
      })
      .then((res: User) => {
        if (res) return res;
      });

    const newMessage = {
      message: message,
      socialSecurityNumber: sensorUser.socialSecurityNumber,
      user: user,
    };

    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify(newMessage));
    }
    setMessage("");
  };

  const scrollRef = useRef<ScrollView>(null);

  if (loading || !user.user) return <Loading />;

  return (
    <View className="flex-1">
      <View className="w-full my-4 flex-col justify-center items-center">
        <Text className="text-xl">Anhöriga till</Text>
        <Text className="text-3xl font-bold">{sensorUser.name}</Text>
      </View>
      <SafeAreaView className="h-full mb-8 pb-32 ">
        <ScrollView
          className="mb-12"
          ref={scrollRef}
          onContentSizeChange={() => {
            if (scrollRef.current) scrollRef.current.scrollToEnd();
          }}
        >
          {messages.map((message, key) => (
            <View
              key={key}
              className={`flex-row rounded-full ${
                message.sender === user.user?.email
                  ? "bg-primary self-end"
                  : "bg-white border-2 border-primary self-start"
              }  mx-4 p-1 px-4 my-1`}
            >
              <Text
                className={`text-lg ${
                  message.sender === user.user?.email
                    ? "text-white"
                    : "text-black"
                }`}
              >
                {message.message}
              </Text>
            </View>
          ))}
        </ScrollView>
      </SafeAreaView>

      <View className="bg-primary p-4 w-full absolute bottom-0 flex-row ">
        <TextInput
          value={message}
          className="p-2 rounded-xl bg-white w-72"
          placeholder="Skriv här"
          onChangeText={setMessage}
          onFocus={() => scrollRef.current?.scrollToEnd()}
        />
        {sendingMessage ? (
          <ActivityIndicator className="ml-2" size="large" color="white" />
        ) : (
          <MaterialIcons
            style={{ marginLeft: 8 }}
            name="send"
            size={40}
            color="white"
            onPress={sendMessage}
          />
        )}
      </View>
    </View>
  );
}
