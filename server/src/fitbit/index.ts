/*
  {"access_token":"",
  "expires_in":28800,
  "refresh_token":"655fbf446543ce2532157bcee1b0ba98f633b32572b64353e6a173567818408f",
  "scope":"cardio_fitness profile sleep nutrition social oxygen_saturation weight heartrate settings location electrocardiogram respiratory_rate temperature activity",
  "token_type":"Bearer","user_id":"BHPVQV"}
*/

type CustomHeartRateZones = {
  caloriesOut: number;
  max: number;
  min: number;
  minutes: number;
  name: string;
};

type HeartRateZones = {
  caloriesOut: 979.43616;
  max: 86;
  min: 30;
  minutes: 626;
  name: "Out of Range";
};

interface HrRate {
  "activities-heart": [
    {
      dateTime: string;
      value: {
        customHeartRateZones: CustomHeartRateZones[];
        heartRateZones: HeartRateZones[];
        restingHeartRate: number;
      };
    }
  ];
}

const access_token =
  "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIyM1FWR1YiLCJzdWIiOiJCSFBWUVYiLCJpc3MiOiJGaXRiaXQiLCJ0eXAiOiJhY2Nlc3NfdG9rZW4iLCJzY29wZXMiOiJyc29jIHJlY2cgcnNldCByb3h5IHJwcm8gcm51dCByc2xlIHJjZiByYWN0IHJsb2MgcnJlcyByd2VpIHJociBydGVtIiwiZXhwIjoxNjgxNzU1NzU5LCJpYXQiOjE2ODE3MjY5NTl9.8lDAh91UCOFHKUskx8N4GYzJmNmdoM1Z7wKX03oUuks";
const refresh_token =
  "655fbf446543ce2532157bcee1b0ba98f633b32572b64353e6a173567818408f";

const getProfile = async () => {
  return await fetch("https://api.fitbit.com/1/user/-/profile.json", {
    method: "GET",
    headers: { Authorization: "Bearer " + access_token },
  })
    .then((res) => res.json())
    .then((res) => console.log(res));
};

const getECG = async () => {
  return await fetch(
    "https://api.fitbit.com/1/user/-/ecg/list.json?afterDate=2023-03-28&limit=1&offset=0&sort=asc",
    {
      method: "GET",
      headers: { Authorization: "Bearer " + access_token },
    }
  )
    .then((res) => res.json())
    .then((res) => console.log(res));
};

const getHr = async () => {
  return fetch(
    "https://api.fitbit.com/1/user/-/activities/heart/date/2023-03-30/1d.json",
    {
      method: "GET",
      headers: { Authorization: "Bearer " + access_token },
    }
  )
    .then((res) => res.json())
    .then((res) => {
      const x: HrRate = res;
      x["activities-heart"][0].value.heartRateZones.map((value) => {
        console.log(value);
      });
    })

    .catch((err) => console.log(err));
};

getProfile();
