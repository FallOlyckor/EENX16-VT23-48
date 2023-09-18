import express from "express";
const eventRouter = express.Router();
import { eventController } from "../controllers/event.controller";

eventRouter.get("/:socialSecurityNumber", eventController.get);

eventRouter.post("/", eventController.create);

eventRouter.put("/", eventController.update);

eventRouter.delete("/", eventController.remove);

export default eventRouter;
