import { MaterialIcons } from "@expo/vector-icons";
import { useState } from "react";
import { Pressable, Text, View, ViewProps } from "react-native";
import Button from "./Button";
import Modal from "./Modal";

interface Props extends ViewProps {
  title: string;
  explanation: string;
}

const InfoBox = ({ title, explanation, ...props }: Props) => {
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <>
      <Modal modalVisible={modalVisible} setModalVisible={setModalVisible}>
        <View className="rounded-xl px-8 py-2 w-5/6 bg-primary flex gap-y-2 ">
          <Text className="text-2xl text-white font-bold">{title}</Text>
          <Text className="text-lg text-white">{explanation}</Text>
          <Button
            onPress={() => setModalVisible(false)}
            title="Stäng"
            className="bg-white py-1 my-2 self-end"
            textProps={{ style: { color: "#6CB6D6" } }}
          />
        </View>
      </Modal>

      <View className="flex-row gap-2 items-center" {...props}>
        <Text className="text-2xl ">{title}</Text>
        <Pressable onPress={() => setModalVisible(true)}>
          <MaterialIcons
            name="help-outline"
            size={30}
            color="#6CB6D6"
            className="ml-2 "
          />
        </Pressable>
      </View>
    </>
  );
};

export default InfoBox;
