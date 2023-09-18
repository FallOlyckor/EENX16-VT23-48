import express from "express";
const sensorUserRouter = express.Router();
import { sensorUserController } from "../controllers/sensorUser.controller";

sensorUserRouter.get("/", sensorUserController.get);

sensorUserRouter.get("/:id", sensorUserController.getSpecific);

sensorUserRouter.post("/", sensorUserController.create);

sensorUserRouter.put("/", sensorUserController.update);

sensorUserRouter.delete("/:id", sensorUserController.remove);

export default sensorUserRouter;
