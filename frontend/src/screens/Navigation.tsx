import { MaterialIcons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import {
  NavigationContainer,
  getFocusedRouteNameFromRoute,
} from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import * as React from "react";
import { LogBox, Text, View } from "react-native";
import { useAuth } from "../lib/AuthContext";
import { SensorUser } from "../lib/interfaces";
import ChatScreen from "./ChatScreen";
import EventsScreen from "./EventsScreen";
import HomeChatScreen from "./HomeChatScreen";
import HomeScreen from "./HomeScreen";
import LoginScreen from "./LoginScreen";
import PersonScreen from "./PersonScreen";
import RegisterScreen from "./RegisterScreen";
import SettingsScreen from "./SettingsScreen";

LogBox.ignoreLogs([
  "Non-serializable values were found in the navigation state",
]);

export type HomeStackParamList = {
  Login: undefined;
  Register: { login: () => void };
  Home: undefined;
  Person: { sensorUser: SensorUser };
  Settings: undefined;
};
export type EventsStackParamList = {
  Events: undefined;
};

export type ChatStackParamList = {
  HomeChat: undefined;
  Chat: { sensorUser: SensorUser };
};

const HomeStack = createNativeStackNavigator<HomeStackParamList>();

const HomeStackScreen = () => {
  return (
    <HomeStack.Navigator initialRouteName="Login">
      <HomeStack.Screen
        name="Home"
        component={HomeScreen}
        options={{
          headerTitle: "SeniorSecure",
          headerTitleAlign: "center",
        }}
      />
      <HomeStack.Screen
        name="Person"
        component={PersonScreen}
        options={({ route }) => ({
          headerTitle: () => (
            <View className="flex items-center">
              <Text className="text-lg">{route.params.sensorUser.name}</Text>
              <Text className="text-md text-gray-600">
                {route.params.sensorUser.location}
              </Text>
            </View>
          ),
          headerTitleAlign: "center",
        })}
      />
      <HomeStack.Screen name="Settings" component={SettingsScreen} />
    </HomeStack.Navigator>
  );
};

const EventStack = createNativeStackNavigator<EventsStackParamList>();

const EventStackScreen = () => {
  return (
    <EventStack.Navigator>
      <EventStack.Screen
        name="Events"
        component={EventsScreen}
        options={{
          headerTitle: () => (
            <View className="flex-col justify-center items-center">
              <Text className="text-xl">SeniorSecure</Text>
              <Text className="text-lg">Historik</Text>
            </View>
          ),
          headerTitleAlign: "center",
        }}
      />
    </EventStack.Navigator>
  );
};

const ChatStack = createNativeStackNavigator<ChatStackParamList>();

const ChatStackScreen = () => {
  return (
    <ChatStack.Navigator>
      <ChatStack.Screen
        name="HomeChat"
        component={HomeChatScreen}
        options={{
          headerTitle: () => (
            <Text className="ml-4 text-2xl">SeniorSecure</Text>
          ),

          headerTitleAlign: "center",
        }}
      />
      <ChatStack.Screen
        name="Chat"
        component={ChatScreen}
        options={{
          headerTitle: () => (
            <Text className="ml-4 text-2xl">SeniorSecure</Text>
          ),

          headerTitleAlign: "center",
        }}
      />
    </ChatStack.Navigator>
  );
};

const Tab = createBottomTabNavigator();
export default function Navigation() {
  const user = useAuth();

  return (
    <NavigationContainer>
      {!user.user ? (
        <HomeStack.Navigator>
          <HomeStack.Group>
            <HomeStack.Screen name="Login" component={LoginScreen} />
            <HomeStack.Screen name="Register" component={RegisterScreen} />
          </HomeStack.Group>
        </HomeStack.Navigator>
      ) : (
        <Tab.Navigator
          screenOptions={{
            headerShown: false,
            tabBarStyle: {
              position: "absolute",
              bottom: 8,
              height: 56,
              padding: 5,
              paddingBottom: 4,
              borderRadius: 32,
              marginHorizontal: 16,
            },
          }}
          initialRouteName="HomeStackScreen"
        >
          <Tab.Screen
            name="Home screen"
            component={HomeStackScreen}
            options={{
              tabBarIcon: ({ focused, color, size }) => {
                return <MaterialIcons name="home" size={size} color={color} />;
              },
            }}
          />
          <Tab.Screen
            name="History"
            component={EventStackScreen}
            options={{
              tabBarIcon: ({ focused, color, size }) => {
                return (
                  <MaterialIcons name="history" size={size} color={color} />
                );
              },
            }}
          />
          <Tab.Screen
            name="Chats"
            component={ChatStackScreen}
            options={({ route }) => ({
              tabBarIcon: ({ focused, color, size }) => {
                return <MaterialIcons name="chat" size={size} color={color} />;
              },

              tabBarStyle: ((route) => {
                const routeName = getFocusedRouteNameFromRoute(route) ?? "";
                if (routeName === "Chat") {
                  return { display: "none" };
                }
                return {
                  position: "absolute",
                  bottom: 8,
                  height: 56,
                  padding: 5,
                  paddingBottom: 4,
                  borderRadius: 32,
                  marginHorizontal: 16,
                };
              })(route),
            })}
          />
        </Tab.Navigator>
      )}
    </NavigationContainer>
  );
}
