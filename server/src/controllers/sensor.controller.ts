import { sensorService } from "../services/sensor.service";

const getFall = async (req: any, res: any) => {
  try {
    res.status(200).json(await sensorService.getFall(req.body));
  } catch (err) {
    console.log("Error");
  }
};

const getLocation = async (req: any, res: any) => {
  try {
    res.status(200).json(await sensorService.getLocation(req.body));
  } catch (err) {
    console.error(`Could not get location`, err);
  }
};

const getHeartRate = async (req: any, res: any) => {
  try {
    res.status(200).json(await sensorService.getHr(req.body));
  } catch (err) {
    console.error(`Could not get Heart rate`, err);
  }
};

const getECG = async (req: any, res: any) => {
  try {
    res.status(200).json(await sensorService.getHr(req.body));
  } catch (err) {
    console.error(`Could not get ECG`, err);
  }
};

export const sensorController = {
  getFall,
  getLocation,
  getHeartRate,
  getECG,
};
