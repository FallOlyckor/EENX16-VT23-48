import { Dispatch, SetStateAction } from "react";
import {
  Modal as NativeModal,
  ModalProps,
  Pressable,
  TouchableWithoutFeedback,
} from "react-native";

interface Props extends ModalProps {
  modalVisible: boolean;
  setModalVisible: Dispatch<SetStateAction<boolean>>;
}

const Modal = ({ modalVisible, setModalVisible, ...props }: Props) => {
  return (
    <NativeModal
      visible={modalVisible}
      transparent={true}
      style={{ backgroundColor: "black" }}
      onRequestClose={() => {
        setModalVisible(!modalVisible);
      }}
      {...props}
    >
      <Pressable
        className="flex-1 justify-center bg-overlay items-center"
        onPress={() => setModalVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => {}}>
          {props.children}
        </TouchableWithoutFeedback>
      </Pressable>
    </NativeModal>
  );
};

export default Modal;
