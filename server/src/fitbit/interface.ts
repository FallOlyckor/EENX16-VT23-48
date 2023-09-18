export type CustomHeartRateZones = {
  caloriesOut: number;
  max: number;
  min: number;
  minutes: number;
  name: string;
};

export type HeartRateZones = {
  caloriesOut: 979.43616;
  max: 86;
  min: 30;
  minutes: 626;
  name: "Out of Range";
};

export interface HrRate {
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
export interface RequestParams {
  url: string;
  method: string;
}

export interface MakeRequestProps extends RequestParams {
  body?: string;
  headers?: HeadersInit;
}
