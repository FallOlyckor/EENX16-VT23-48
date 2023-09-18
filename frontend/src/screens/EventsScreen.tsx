import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import * as React from "react";
import { Text, View } from "react-native";
import { BackEndConnection } from "../api/BackendConnection";
import Container from "../components/Container";
import FallPerson from "../components/FallPerson";
import InfoBox from "../components/InfoBox";
import Loading from "../components/Loading";
import { Fall } from "../lib/interfaces";
import { EventsStackParamList } from "./Navigation";

type Props = NativeStackScreenProps<EventsStackParamList, "Events">;

export default function EventsScreen({ route, navigation }: Props) {
  const [history, setHistory] = React.useState<Fall[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    BackEndConnection.getHistory()
      .then((res: Fall[]) => {
        setHistory(res);
        setLoading(false);
      })
      .catch((err) => console.log(err));
  }, []);

  if (loading) return <Loading />;

  return (
    <Container>
      <InfoBox
        title="Historik"
        explanation="Här kan du se alla tidigare fall någon av dina anhöriga har råkat ut för"
      />
      <View className="my-4">
        {history.map((fall, key) => (
          <View key={key}>
            <Text className="text-xl font-bold">{`Datum: ${fall.date
              .toString()
              .substring(0, 4)}-${fall.date
              .toString()
              .substring(5, 7)}-${fall.date
              .toString()
              .substring(8, 10)}`}</Text>

            <View>
              <View
                key={key}
                className="my-2 flex-row justify-between items-center"
              >
                <FallPerson sensorUser={fall.sensorUser} />
              </View>
            </View>
          </View>
        ))}
      </View>
    </Container>
  );
}
