export interface RequestParams {
  url: string;
  method: string;
}

type Position = {
  latitude: number;
  longitude: number;
};

export interface MakeRequestProps extends RequestParams {
  body?: string;
  headers?: HeadersInit;
}

export type SensorUser = {
  socialSecurityNumber: string;
  name: string;
  location: string;
  phoneNr: string;
  status:
    | "HOME"
    | "RAMLAT"
    | "LARMAT"
    | "LARMCENTRAL"
    | "AMBULANS"
    | "AMBULANS_ON_SPOT"
    | "ON_ROUTE_TO_HOSPITAL"
    | "HOSPITAL";
};

export type User = {
  email: string;
  role: "STANDARD" | "MEDIC_CENTRAL" | "TRYGGHETSJOUR" | "AMBULANCE_DRIVER";
};

export interface Fall {
  date: Date;
  sensorUser: SensorUser;
  position: Position;
}
export interface Chat {
  sensorUser: SensorUser;
  date: Date;
  members: User[];
}

export interface Event {
  place: string;
  time?: Date | null;
}
export interface EventHistory {
  startTime: Event;
  larmed: Event;
  larmCentral: Event;
  ambulance: Event;
  ambulanceOnSpot: Event;
  ambulanceEnRoute: Event;
  hospital: Event;
}

export interface Message {
  sender: string;
  message: string;
  date?: Date;
}
