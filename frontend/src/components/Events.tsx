import { View, ViewProps, Text, ActivityIndicator } from "react-native";
import { Event, EventHistory } from "../lib/interfaces";
import { useEffect, useState } from "react";
import Loading from "./Loading";
import { useAuth } from "../lib/AuthContext";
import { BackEndConnection } from "../api/BackendConnection";

interface Props extends ViewProps {
  events: EventHistory;
  sensorUser: string;
}

const Events = ({ events, sensorUser, ...props }: Props) => {
  const [event, setEvent] = useState<Event[]>();
  const user = useAuth();
  const [loading, setLoading] = useState(false);
  const [showAdd, setShowAdd] = useState(true);

  const updateEvents = (place: string) => {
    BackEndConnection.updateEvent(sensorUser, place).then((res) => {
      setEvent((prev) => {
        return prev?.map((event) => {
          if (event.place == place) {
            event.time = new Date();
            return event;
          }
          return event;
        });
      });
      setShowAdd(false);
    });
  };

  useEffect(() => {
    const y = Object.entries(events).map(([key, value]) => {
      const x: Event = value as Event;
      if (x.time) {
        return { place: x.place, time: new Date(x.time) } as Event;
      } else {
        return { place: x.place } as Event;
      }
    });

    setEvent(y);
  }, []);

  if (!event?.length) return <Loading />;

  return (
    <View className="w-full bg-white rounded-lg p-4 my-4" {...props}>
      {event.map((currentEvent, key) => (
        <View key={key} className="flex-row items-center justify-between my-4">
          <Text className="text-xl">{currentEvent.place}</Text>
          <View className="flex-row items-center gap-x-2">
            {currentEvent.time && (
              <Text className="text-xl">{`${
                currentEvent.time.getHours().toString().length > 1
                  ? currentEvent.time.getHours()
                  : `0${currentEvent.time.getHours()}`
              }:${
                currentEvent.time.getMinutes().toString().length > 1
                  ? currentEvent.time.getMinutes()
                  : `0${currentEvent.time.getMinutes()}`
              }`}</Text>
            )}
            {showAdd && (
              <>
                {user.user?.role === "MEDIC_CENTRAL" &&
                  currentEvent.place === "Larmcentral" &&
                  currentEvent.time == null && (
                    <View
                      className="bg-primary rounded-md  p-2"
                      onTouchEnd={() => {
                        setLoading(true);
                        updateEvents(currentEvent.place);
                      }}
                    >
                      {loading ? (
                        <ActivityIndicator size="small" color="#fff" />
                      ) : (
                        <Text className="text-white text-md">Done!</Text>
                      )}
                    </View>
                  )}
                {user.user?.role === "AMBULANCE_DRIVER" &&
                  (currentEvent.place === "Ambulans" ||
                    currentEvent.place === "Ambulans på plats" ||
                    currentEvent.place === "Påväg till sjukhus" ||
                    currentEvent.place === "Hospital") &&
                  currentEvent.time == null &&
                  event[key - 1].time != null && (
                    <View
                      className="bg-primary rounded-md  p-2"
                      onTouchEnd={() => {
                        setLoading(true);
                        updateEvents(currentEvent.place);
                      }}
                    >
                      {loading ? (
                        <ActivityIndicator size="small" color="#fff" />
                      ) : (
                        <Text className="text-white text-md">Done!</Text>
                      )}
                    </View>
                  )}
              </>
            )}
            <View
              className={`w-6 h-6 rounded-full ${
                currentEvent.time != undefined ? "bg-primary" : "bg-gray-400"
              }`}
            />
          </View>
        </View>
      ))}
    </View>
  );
};

export default Events;
