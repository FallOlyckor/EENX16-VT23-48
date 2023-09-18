import express from "express";
const chatRouter = express.Router();
import { chatController } from "../controllers/chat.controller";

chatRouter.get("/", chatController.get);

chatRouter.get("/:id", chatController.get);

chatRouter.post("/", chatController.create);

chatRouter.put("/:id", chatController.update);

chatRouter.delete("/:id", chatController.remove);

export default chatRouter;
