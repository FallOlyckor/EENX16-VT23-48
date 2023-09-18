import { SafeAreaView, ScrollView, View, ViewProps } from "react-native";

const Container = (props: ViewProps) => (
  <SafeAreaView className="flex-1 ">
    <ScrollView className="bg-primaryBg">
      <View className="w-5/6 my-8 mx-auto" {...props} />
    </ScrollView>
  </SafeAreaView>
);

export default Container;
