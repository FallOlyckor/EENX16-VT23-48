import { Foundation, MaterialCommunityIcons } from "@expo/vector-icons";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import {
  ImageSourcePropType,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SensorUser } from "../lib/interfaces";
import { HomeStackParamList } from "../screens/Navigation";

interface Props {
  image?: ImageSourcePropType;
  sensorUser: SensorUser;
  navigation?: NativeStackNavigationProp<HomeStackParamList, "Home">;
}

export default function FallPerson({ image, sensorUser, navigation }: Props) {
  const onPress = () => {
    if (navigation) {
      navigation.navigate("Person", {
        sensorUser: sensorUser,
      });
    }
  };

  return (
    <TouchableOpacity
      activeOpacity={0.6}
      className="bg-white flex-row rounded-xl mt-2 p-2 items-center"
      onPress={onPress}
    >
      <View className="flex-1 flex-row items-center">
        <Foundation name="clipboard-notes" size={40} color="black" />
        <View className="ml-2 font-bold">
          <Text className="text-lg font-bold">{sensorUser.name}</Text>
          <Text className="text-md text-gray-600">{sensorUser.location}</Text>
        </View>
      </View>
      <View className="flex-2 justify-self-end">
        <MaterialCommunityIcons name="exclamation" size={40} color="black" />
      </View>
    </TouchableOpacity>
  );
}
