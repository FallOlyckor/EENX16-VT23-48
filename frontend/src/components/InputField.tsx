import { TextInput, TextInputProps } from "react-native";

const InputField = (props: TextInputProps) => (
  <TextInput
    className="border-2 p-3 pl-4 text-xl border-primary rounded-full"
    {...props}
  />
);

export default InputField;
