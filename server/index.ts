import dotenv from "dotenv";
import express, { Express, Request, Response } from "express";
import { WebSocketServer } from "ws";
import chatRouter from "./src/routes/chat";
import eventRouter from "./src/routes/event";
import fallRouter from "./src/routes/fall";
import historyRouter from "./src/routes/history";
import messageRouter from "./src/routes/message";
import sensorUserRouter from "./src/routes/sensorUser";
import userRouter from "./src/routes/user";
import { messageService } from "./src/services/message.service";

dotenv.config();
const app: Express = express();
const port = process.env.PORT ?? 8000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
const wss = new WebSocketServer({ port: 8080 });

app.use("/message", messageRouter);
app.use("/user", userRouter);
app.use("/chat", chatRouter);
app.use("/sensorUser", sensorUserRouter);
app.use("/fall", fallRouter);
app.use("/history", historyRouter);
app.use("/event", eventRouter);

wss.on("connection", (ws) => {
  ws.on("error", console.error);

  ws.on("message", (message) => {
    const _message = JSON.parse(message.toString());

    const messageText = _message.message;
    const socialSecurityNumber = _message.socialSecurityNumber;
    const token = _message.user.token;
    const email = _message.user.email;

    wss.clients.forEach((client) => {
      const message2 = JSON.stringify({
        sender: email,
        message: messageText.toString(),
      });
      client.send(message2);
    });

    const newMessage = messageService.create(
      messageText,
      socialSecurityNumber,
      token
    );
    console.log(newMessage);
  });
});

app.get("/", (req: Request, res: Response) => {
  res.send({ Status: "Still running" });
});

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
