import express from "express";
const fallRouter = express.Router();
import { fallController } from "../controllers/fall.controller";

fallRouter.get("/", fallController.get);

fallRouter.post("/", fallController.create);

fallRouter.put("/", fallController.update);

export default fallRouter;
