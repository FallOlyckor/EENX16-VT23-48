import { MaterialIcons } from "@expo/vector-icons";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import * as React from "react";
import { Linking, Platform, Text, TouchableOpacity, View } from "react-native";
import MapView from "react-native-maps";
import { MapMarker } from "react-native-maps/lib/MapMarker";
import { PROVIDER_GOOGLE } from "react-native-maps/lib/ProviderConstants";
import Ambulance from "../assets/images/ambulance.png";
import Container from "../components/Container";
import Events from "../components/Events";
import InfoBox from "../components/InfoBox";
import { HomeStackParamList } from "./Navigation";
import Loading from "../components/Loading";
import { useEffect, useState } from "react";
import { BackEndConnection } from "../api/BackendConnection";
import { Fall, EventHistory, Event } from "../lib/interfaces";
import Modal from "../components/Modal";
import { useAuth } from "../lib/AuthContext";

type Props = NativeStackScreenProps<HomeStackParamList, "Person">;

const event: EventHistory = {
  startTime: {
    place: "Ramlat",
  },
  larmed: {
    place: "Larmat",
  },
  larmCentral: {
    place: "Larmcentral",
  },
  ambulance: {
    place: "Ambulans",
  },
  ambulanceOnSpot: {
    place: "Ambulans på plats",
  },
  ambulanceEnRoute: {
    place: "Påväg till sjukhus",
  },
  hospital: {
    place: "Hospital",
  },
};

export default function PersonScreen({ route, navigation }: Props) {
  const { sensorUser } = route.params;
  const [loading, setLoading] = useState(true);
  const [fall, setFall] = useState<Fall>();
  const [events, setEvents] = useState<EventHistory>(event);
  const [popover, setPopover] = useState(false);
  const user = useAuth();

  useEffect(() => {
    BackEndConnection.getFallLocation(sensorUser.socialSecurityNumber)
      .then((res: Fall) => {
        setFall(res);
      })
      .then(() => {
        BackEndConnection.getEvent(sensorUser.socialSecurityNumber).then(
          (res) => {
            const newStartTime = {
              ...events.startTime,
              time: new Date(res.startTime),
            };
            const newLarmed = {
              ...events.larmed,
              time: new Date(res.startTime),
            };
            const newLarmCentral = {
              ...events.larmCentral,
              time: res.larmCentral ? new Date(res.larmCentral) : null,
            };
            const newAmbulance = {
              ...events.ambulance,
              time: res.ambulance ? new Date(res.ambulance) : null,
            };
            const newAmbulanceOnSpot = {
              ...events.ambulanceOnSpot,
              time: res.ambulanceOnSpot ? new Date(res.ambulanceOnSpot) : null,
            };
            const newAmbulanceEnRoute = {
              ...events.ambulanceEnRoute,
              time: res.ambulanceEnRoute
                ? new Date(res.ambulanceEnRoute)
                : null,
            };

            const newHospital = {
              ...events.hospital,
              time: res.hospital ? new Date(res.hospital) : null,
            };

            setEvents({
              startTime: newStartTime,
              larmed: newLarmed,
              larmCentral: newLarmCentral,
              ambulance: newAmbulance,
              ambulanceOnSpot: newAmbulanceOnSpot,
              ambulanceEnRoute: newAmbulanceEnRoute,
              hospital: newHospital,
            });

            setLoading(false);
          }
        );
      });
  }, []);

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
              <View className="flex-row gap-2 w-full items-center">
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

  const call = (number: string | undefined) => {
    if (!number) return;
    let phoneNumber = "";
    if (Platform.OS === "android") {
      phoneNumber = `tel:${number}`;
    } else {
      phoneNumber = `telprompt:${number}`;
    }
    Linking.openURL(phoneNumber);
  };

  if (loading || !events) return <Loading />;

  return (
    <Container className="mb-20">
      <View className="flex-col gap-y-8">
        <View className="bg-primary flex rounded-xl p-4">
          <Text className=" text-2xl font-bold text-white">Sammanfattning</Text>
          <Text className="text-md text-white  mb-2">
            {sensorUser.name} ramlade hemma 15:32
          </Text>
          <Text className="text-md text-white">
            Just nu befinner sig personen på Sahlgrenska sjukhuset
          </Text>
        </View>
        {sensorUser.location && fall && (
          <View>
            <InfoBox
              title="Karta"
              explanation="Den röda 'pinnen' symboliserar vart den anhöriga har ramlat och
            bilen är vart ambulansen är just nu!"
            />
            <MapView
              className="w-full h-72 mt-4"
              initialRegion={{
                longitude: fall.position.longitude,
                latitude: fall.position.latitude,
                latitudeDelta: 0.05,
                longitudeDelta: 0.05,
              }}
              provider={PROVIDER_GOOGLE}
            >
              <MapMarker
                description={sensorUser.name}
                coordinate={{
                  latitude: fall.position.latitude,
                  longitude: fall.position.longitude,
                }}
              />

              <MapMarker
                image={Ambulance}
                description="ambulance"
                coordinate={{
                  latitude: 57.69064949445974,
                  longitude: 11.977717182455386,
                }}
              />
            </MapView>
          </View>
        )}
        <View>
          <InfoBox
            title="Händelseförlopp"
            explanation="Här kan du se i vilket stadie vårdkedjan befinner sig just nu den senaste upplysta pricken är vart den är just nu!"
          />
          <Events
            events={events}
            sensorUser={sensorUser.socialSecurityNumber}
          />
        </View>
        <InfoBox
          title="Kontakta Klas"
          explanation={"Nedan finns en knapp för att ringa klas telefon"}
        />
        <TouchableOpacity
          activeOpacity={0.6}
          className="w-fit bg-primary mt-4 p-4 px-4 rounded-xl "
          onPress={() => call(sensorUser.phoneNr)}
        >
          <View className="flex-row justify-between items-center">
            <Text className="text-xl text-white">Ring:</Text>
            <Text className="text-xl text-white">{sensorUser.phoneNr}</Text>
            <MaterialIcons name="phone-enabled" size={35} color="white" />
          </View>
        </TouchableOpacity>
      </View>
    </Container>
  );
}
