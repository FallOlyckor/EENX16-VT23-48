import express from "express";
const historyRouter = express.Router();
import { historyController } from "../controllers/history.controller";

historyRouter.get("/", historyController.get);

export default historyRouter;
