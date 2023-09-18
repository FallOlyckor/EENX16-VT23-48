import { prisma } from "../../prisma/index";
import { parseJwt } from "../utils/TokenHelper";

async function get(socialSecurityNumber: string) {
  await prisma.$connect();

  const sensorUser = await prisma.sensorUser.findFirst({
    where: {
      socialSecurityNumber: socialSecurityNumber,
    },
  });

  if (!sensorUser) throw new Error(`No sensor user found`);

  const chat = await prisma.chat.findFirst({
    where: {
      sensorUserId: sensorUser.id,
    },
  });

  if (!chat) throw new Error(`No chat found`);

  const messages = await prisma.message.findMany({
    where: {
      chatId: chat.id,
    },
    include: {
      sender: true,
    },
  });

  await prisma.$disconnect();

  const res = messages.map((_messsage) => {
    return {
      sender: _messsage.sender.email,
      message: _messsage.text,
      date: _messsage.createdAt,
    };
  });

  return res;
}

async function create(
  message: string,
  socialSecurityNumber: string,
  token: string
) {
  await prisma.$connect();

  const username = token.includes(" ")
    ? parseJwt(token.split(" ")[1])
    : parseJwt(token);

  const user = await prisma.user.findFirst({
    where: { email: username },
  });

  const sensorUser = await prisma.sensorUser.findFirst({
    where: {
      socialSecurityNumber: socialSecurityNumber,
    },
  });

  if (!user) throw new Error(`Could not found user`);

  if (!sensorUser) throw new Error(`Could not find sensorUser`);

  const chat = await prisma.chat.findFirst({
    where: {
      sensorUserId: sensorUser.id,
    },
  });

  if (!chat) throw new Error(`Could not found chat`);

  const newMessage = await prisma.message.create({
    data: {
      text: message,
      chatId: chat.id,
      senderId: user.id,
    },
    include: {
      sender: true,
    },
  });

  await prisma.chat.update({
    where: {
      id: chat.id,
    },
    data: { messages: { connect: { id: newMessage.id } } },
  });

  const res = {
    sender: newMessage.sender.email,
    message: newMessage.text,
    date: newMessage.createdAt,
  };
  await prisma.$disconnect();

  return res;
}
async function update(userId: number, newValues: any) {}

async function remove(id: number) {}

export const messageService = {
  get,
  create,
  update,
  remove,
};
