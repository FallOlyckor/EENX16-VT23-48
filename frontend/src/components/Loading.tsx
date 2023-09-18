import { ActivityIndicator, View } from "react-native";

const Loading = () => {
  return (
    <View className="min-h-full align-middle justify-center">
      <ActivityIndicator size="large" color="#6CB6D6" />
    </View>
  );
};

export default Loading;
