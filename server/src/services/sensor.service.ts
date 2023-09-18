import { prisma } from "../../prisma";
import { MakeRequestProps } from "../fitbit/interface";

const makeRequest = async ({
  url,
  method,
  body,
  headers,
}: MakeRequestProps) => {
  const request = "https://api.fitbit.com/" + url;
  let requestInit: RequestInit;
  let access_token = "";
  let refresh_token = "";

  await getToken().then((res) => {
    access_token = res.access_token ?? "";
    refresh_token = res.refresh_token ?? "";
  });

  if (access_token === "" || refresh_token === "") {
    console.log("Error getting token");
    return;
  }

  if (headers) {
    requestInit = {
      headers,
      method,
      body,
    };
  } else {
    requestInit = {
      headers: {
        Authorization: "Bearer " + access_token,
      },
      method: method,
      body,
    };
  }

  let res = await fetch(request, requestInit);

  //200 ok 401 dålig token uppdatera och kör igen
  if (res.status == 200) {
    console.log("yeet");
  } else if (res.status == 401) {
    console.log("Refreshing token");
    updateToken(refresh_token);
  }

  const response = await res.json();
  return response;
};

const updateTokenPrisma = async (
  access_token: string,
  refresh_token: string
) => {
  prisma.$connect();

  const test = prisma.fitBit
    .update({
      where: {
        id: "643fb3fe7e6c2eeb1af778a8",
      },
      data: {
        refresh_token: refresh_token,
        access_token: access_token,
      },
    })
    .then((res) => {
      console.log(res);
    });
  prisma.$disconnect();
};

const getToken = async () => {
  return await prisma.fitBit
    .findFirst({ where: { id: "643fb3fe7e6c2eeb1af778a8" } })
    .then((res) => {
      return {
        refresh_token: res?.refresh_token,
        access_token: res?.access_token,
      };
    });
};

const updateToken = async (refresh_token: string) => {
  const client_id = "23QVGV";
  const client_Secret = "4eaeb1ab154f13e1d978bacf03806645";

  const basicAuth = Buffer.from(
    `${client_id}:${client_Secret}`,
    "utf8"
  ).toString("base64");

  const headers = {
    Authorization: `Basic ${basicAuth}`,
    "Content-Type": "application/x-www-form-urlencoded",
  };

  const body = new URLSearchParams({
    grant_type: "refresh_token",
    refresh_token: refresh_token,
  });

  return await fetch("https://api.fitbit.com/oauth2/token", {
    method: "POST",
    headers: headers,
    body: body,
  })
    .then((res) => res.json())
    .then((res) => {
      if (res.access_token && res.refresh_token)
        updateTokenPrisma(res.access_token, res.refresh_token);
    })
    .catch((err) => console.log(err));
};

const getProfile = async (body: any) => {
  return await makeRequest({ url: "1/user/-/profile.json", method: "GET" });
};

const getECG = async (body: any) => {
  return await makeRequest({
    url: "1/user/-/ecg/list.json?afterDate=2023-03-28&limit=1&offset=0&sort=asc",
    method: "GET",
  });
};

const getHr = async (body: any) => {
  return await makeRequest({
    url: "1/user/-/activities/heart/date/2023-03-30/1d.json",
    method: "GET",
  });
};

const getFall = (body: any) => {
  //Data fusion make a fall
  getProfile("").then((res) => console.log(res));
};

getFall("");

const getLocation = (body: any) => {
  //Vet inte om de går att få location
};

export const sensorService = {
  getProfile,
  getHr,
  getFall,
  getLocation,
  getECG,
};
