import express from "express";
const messageRouter = express.Router();
import { messageController } from "../controllers/message.controller";

messageRouter.get("/", messageController.get);

messageRouter.get("/:socialSecurityNumber", messageController.getMessages);

messageRouter.post("/", messageController.create);

messageRouter.put("/:id", messageController.update);

messageRouter.delete("/:id", messageController.remove);

export default messageRouter;
