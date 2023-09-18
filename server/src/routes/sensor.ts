import express from "express";
const sensorRouter = express.Router();
import { sensorController } from "../controllers/sensor.controller";

sensorRouter.get("/", sensorController.getFall);

sensorRouter.get("/location", sensorController.getLocation);

sensorRouter.get("/hr", sensorController.getHeartRate);

sensorRouter.get("/ecg", sensorController.getECG);

export default sensorRouter;
