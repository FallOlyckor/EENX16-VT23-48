import { MaterialIcons } from "@expo/vector-icons";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import * as React from "react";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Keyboard,
  Pressable,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { BackEndConnection } from "../api/BackendConnection";
import Button from "../components/Button";
import Container from "../components/Container";
import InputField from "../components/InputField";
import Modal from "../components/Modal";
import Person from "../components/Person";
import { SensorUser } from "../lib/interfaces";
import { HomeStackParamList } from "./Navigation";
import Loading from "../components/Loading";
import FallPerson from "../components/FallPerson";
import { useAuth } from "../lib/AuthContext";
import { useIsFocused } from "@react-navigation/native";

type Props = NativeStackScreenProps<HomeStackParamList, "Home">;

export default function HomeScreen({ route, navigation }: Props) {
  const [modalVisible, setModalVisible] = useState(false);
  const [popover, setPopover] = useState(false);
  const [sensorUsers, setSensorUsers] = useState<SensorUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const user = useAuth();

  const [newPerson, setNewPerson] = useState<SensorUser>({
    name: "",
    socialSecurityNumber: "",
    phoneNr: "",
    location: "",
    status: "HOME",
  });

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <>
          <MaterialIcons
            name="account-circle"
            size={40}
            color="black"
            onPress={() => setPopover(true)}
          />

          <Modal modalVisible={popover} setModalVisible={setPopover}>
            <View className="rounded-xl px-8 py-4  w-4/6 bg-white flex absolute top-12 right-0">
              <View className="flex flex-row gap-2 w-full items-center">
                <MaterialIcons name="settings" size={25} color="black" />
                <Text
                  className="text-xl"
                  onPress={() => navigation.navigate("Settings")}
                >
                  Inställningar
                </Text>
              </View>

              <View
                onTouchEnd={() => user.logout()}
                className="flex flex-row gap-2 my-2 w-full items-center"
              >
                <MaterialIcons name="logout" size={25} color="black" />
                <Text className="text-xl">Sign out</Text>
              </View>
            </View>
          </Modal>
        </>
      ),
    });
  }, [navigation, popover, setPopover]);
  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      BackEndConnection.getSensorUsers()
        .then((res: SensorUser[]) => {
          setSensorUsers(res);
          setLoading(false);
        })
        .catch((err) => console.log(err));
    }
  }, [isFocused]);

  const addNewPerson = () => {
    setAdding(true);

    if (
      newPerson.name.length > 0 &&
      newPerson.socialSecurityNumber.length > 0 &&
      newPerson.phoneNr.length > 0 &&
      newPerson.location.length > 0 &&
      newPerson.status.length > 0
    ) {
      BackEndConnection.addRelative(newPerson)
        .then((res: SensorUser) => {
          setSensorUsers((prev) => [...prev, res]);

          setNewPerson({
            name: "",
            socialSecurityNumber: "",
            phoneNr: "",
            location: "",
            status: "HOME",
          });
        })
        .then(() => setAdding(false));
    }

    setModalVisible(false);
  };

  if (loading) return <Loading />;

  return (
    <Container>
      <View className="flex-row h-10 items-center">
        <Text className="text-2xl">Akut</Text>
        <MaterialIcons name="priority-high" size={30} color="red" />
      </View>
      {sensorUsers
        .filter((user) => user.status !== "HOME")
        .map((relative, key) => (
          <FallPerson key={key} sensorUser={relative} navigation={navigation} />
        ))}

      <Text className="text-2xl mt-8">Anhöriga</Text>

      {sensorUsers
        .filter((user) => user.status === "HOME")
        .map((relative, key) => (
          <Person key={key} sensorUser={relative} navigation={navigation} />
        ))}

      <Modal modalVisible={modalVisible} setModalVisible={setModalVisible}>
        <View className="rounded-xl p-8 w-5/6 bg-white flex gap-y-2">
          <Text className="text-xl ">Namn</Text>
          <InputField
            placeholder="ex. Klas Eriksson"
            onChangeText={(e) => setNewPerson((prev) => ({ ...prev, name: e }))}
          />
          <Text className="text-xl ">Personnummer</Text>
          <InputField
            placeholder="ååååmmdd-xxxx"
            keyboardType="numeric"
            value={newPerson.socialSecurityNumber}
            maxLength={13}
            onChangeText={(e) => {
              if (
                newPerson.socialSecurityNumber.length < e.length &&
                newPerson.socialSecurityNumber.length == 7
              ) {
                setNewPerson((prev) => ({
                  ...prev,
                  socialSecurityNumber: `${e}-`,
                }));
              } else {
                if (e.length == 13) {
                  Keyboard.dismiss();
                }
                setNewPerson((prev) => ({
                  ...prev,
                  socialSecurityNumber: e,
                }));
              }
            }}
          />
          <Text className="text-xl ">Telefonnummer</Text>

          <InputField
            placeholder="ex. 070 123 23 32"
            keyboardType="phone-pad"
            maxLength={10}
            onChangeText={(e) =>
              setNewPerson((prev) => ({ ...prev, phoneNr: e }))
            }
          />
          <Text className="text-xl ">Stad</Text>

          <InputField
            placeholder="ex. Gothenburg"
            onChangeText={(e) =>
              setNewPerson((prev) => ({ ...prev, location: e }))
            }
          />

          <TouchableOpacity
            activeOpacity={0.6}
            className="bg-white flex-row rounded-xl mt-2 p-2 justify-between items-center"
            onPress={() => setModalVisible(false)}
          >
            <View className="w-full flex-row items-center justify-between">
              <View>
                <Text
                  onPress={() => setModalVisible(false)}
                  className="text-xl underline"
                >
                  Avbryt
                </Text>
              </View>
              <Button title="Lägg till" onPress={addNewPerson} />
            </View>
          </TouchableOpacity>
        </View>
      </Modal>
      {adding && (
        <View className="w-full justify-center my-2">
          <ActivityIndicator size="large" color="#6CB6D6" />
        </View>
      )}
      <Pressable onPress={() => setModalVisible(true)}>
        <View className="bg-white flex-row rounded-xl mt-2 p-2 w-full items-center">
          <MaterialIcons name="playlist-add" size={40} color="black" />
          <Text className="text-lg font-bold">Lägg till anhörig</Text>
        </View>
      </Pressable>
    </Container>
  );
}
