import React, { useEffect, useState } from "react";
import { Animated, StyleSheet, Text } from "react-native";

interface Props {
  message: string;
  onClose: () => void;
  type?: "successful" | "error";
  duration?: number;
}

const Toast = ({
  message,
  type = "error",
  duration = 3000,
  onClose,
}: Props) => {
  const [visible, setVisible] = useState(true);
  const slideValue = new Animated.Value(-100);

  useEffect(() => {
    Animated.timing(slideValue, {
      toValue: 0,
      duration: 500,
      useNativeDriver: true,
    }).start();

    const timer = setTimeout(() => {
      Animated.timing(slideValue, {
        toValue: -100,
        duration: 500,
        useNativeDriver: true,
      }).start(() => {
        setVisible(false);
        if (onClose) {
          onClose();
        }
      });
    }, duration);

    return () => {
      clearTimeout(timer);
    };
  }, [duration, onClose, slideValue]);

  const backgroundColor = type === "error" ? "red" : "green";

  return (
    <>
      {visible && (
        <Animated.View
          style={[
            styles.container,
            {
              backgroundColor,
              transform: [{ translateY: slideValue }],
            },
          ]}
        >
          <Text style={styles.message}>{message}</Text>
        </Animated.View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 20,
    right: 20,
    padding: 10,
    borderRadius: 5,
    zIndex: 9999,
  },
  message: {
    color: "#fff",
  },
});

export default Toast;
