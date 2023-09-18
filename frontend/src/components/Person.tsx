import { Foundation } from "@expo/vector-icons";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { ImageSourcePropType, Text, View } from "react-native";
import { SensorUser } from "../lib/interfaces";
import { HomeStackParamList } from "../screens/Navigation";

interface Props {
  image?: ImageSourcePropType;
  sensorUser: SensorUser;
  navigation?: NativeStackNavigationProp<HomeStackParamList, "Home", undefined>;
}

export default function Person({ image, sensorUser, navigation }: Props) {
  return (
    <View className="bg-slate-50 flex-row rounded-xl mt-2 p-2 items-center">
      <Foundation name="clipboard-notes" size={40} color="gray" />
      <View className="ml-2">
        <Text className="text-lg text-gray-400">{sensorUser.name}</Text>
        <Text className="text-md text-gray-400">{sensorUser.location}</Text>
      </View>
    </View>
  );
}
