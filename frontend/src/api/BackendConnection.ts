import * as SecureStore from "expo-secure-store";
import { User, useAuth } from "../lib/AuthContext";
import { MakeRequestProps, SensorUser } from "../lib/interfaces";

const getMessages = async (socialSecurityNumber: string) => {
  return await makeRequest({
    url: `message/${socialSecurityNumber}`,
    method: "get",
  });
};

const getSensorUsers = async () => {
  return await makeRequest({
    url: "sensorUser",
    method: "get",
  });
};

const getHistory = async () => {
  return await makeRequest({
    url: "history",
    method: "get",
  });
};

const register = async (
  email: string,
  password: string,
  expoPushToken: string
) => {
  return await makeRequest({
    url: "user/register",
    method: "post",
    body: JSON.stringify({
      email: email,
      password: password,
      expoPushToken: expoPushToken,
    }),
  });
};

const signIn = async (email: string, password: string): Promise<any> => {
  return await makeRequest({
    url: "user/signIn",
    method: "post",
    body: JSON.stringify({
      email: email,
      password: password,
    }),
  });
};

const initiateFall = async (socialSecurityNumber: string): Promise<any> => {
  return makeRequest({
    url: "fall",
    method: "post",
    body: JSON.stringify({
      socialSecurityNumber: socialSecurityNumber,
    }),
  });
};

const updateEvent = async (socialSecurityNumber: string, place: string) => {
  return makeRequest({
    url: "event",
    method: "put",
    body: JSON.stringify({
      socialSecurityNumber: socialSecurityNumber,
      place: place,
    }),
  });
};

const sendMessage = async (message: string, socialSecurityNumber: string) => {
  return makeRequest({
    url: "message",
    method: "post",
    body: JSON.stringify({
      message: message,
      socialSecurityNumber: socialSecurityNumber,
    }),
  });
};

const getFalls = async () => {
  return makeRequest({
    url: "fall",
    method: "get",
  });
};
const getChat = async () => {
  return makeRequest({
    url: "chat",
    method: "get",
  });
};
const getEvent = async (socialSecurityNumber: string) => {
  return makeRequest({
    url: `event/${socialSecurityNumber}`,
    method: "get",
  });
};

const getFallLocation = async (socialSecurityNumber: string) => {
  return makeRequest({
    url: `relative/${socialSecurityNumber}`,
    method: "get",
  });
};

const addRelative = async (newRelative: SensorUser) => {
  return makeRequest({
    url: "relative",
    method: "post",
    body: JSON.stringify(newRelative),
  });
};

const makeRequest = async ({
  url,
  method,
  body,
  headers,
}: MakeRequestProps) => {
  //EGEN IP
  const request = "http://192.168.0.190:8000" + "/" + url;
  let requestInit: RequestInit;

  const token = await SecureStore.getItemAsync("user")
    .then((res) => {
      if (res) return JSON.parse(res);
    })
    .then((res: User) => {
      if (res) return res.token;
    });

  if (headers) {
    requestInit = {
      headers,
      method,
      body,
    };
  } else {
    requestInit = {
      headers: {
        Accept: "application/json",
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
      method: method,
      body,
    };
  }
  const res = await fetch(request, requestInit);

  if (res.status == 200) {
    console.log("successful request");
  }

  if (!(res.status === 200)) {
    throw new Error(`${res.status}`);
  }

  const response = await res.json();

  return response;
};

export const BackEndConnection = {
  getMessages,
  signIn,
  register,
  getSensorUsers,
  initiateFall,
  getHistory,
  addRelative,
  getFalls,
  getFallLocation,
  getChat,
  sendMessage,
  getEvent,
  updateEvent,
};
