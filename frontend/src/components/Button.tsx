import { Text, TextProps, TouchableOpacity, ViewProps } from "react-native";

interface Props extends ViewProps {
  title: string;
  onPress: () => void;
  textProps?: TextProps;
}

export default function Button({ title, onPress, textProps, ...props }: Props) {
  return (
    <TouchableOpacity
      activeOpacity={0.6}
      className="w-fit bg-primary mt-4 p-2 px-8 rounded-full self-center"
      onPress={onPress}
      {...props}
    >
      <Text
        className="color-white text-lg justify-center self-center"
        {...textProps}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
}
