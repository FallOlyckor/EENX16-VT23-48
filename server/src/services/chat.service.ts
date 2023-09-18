import { Chat } from "@prisma/client";
import { prisma } from "../../prisma/index";
import { userService } from "./user.service";
import { parseJwt } from "../utils/TokenHelper";

async function get(token: string) {
  await prisma.$connect();

  const username = parseJwt(token.split(" ")[1]);

  const user = await prisma.user.findUnique({
    where: { email: username },
  });

  if (!user) throw new Error(`Could not create Chat`);

  const chats = await prisma.chat.findMany({
    where: {
      membersIds: {
        hasSome: user.id,
      },
    },
    include: {
      members: true,
      sensorUser: true,
    },
  });

  await prisma.$disconnect();

  const res = chats.map((chat) => {
    return {
      sensorUser: chat.sensorUser,
      date: chat.createdAt,
      members: chat.members,
    };
  });

  return res;
}

async function create(chat: Chat) {
  await prisma.$connect();
}

async function update(chatId: number, newValues: any) {}

async function remove(id: number) {}

export const chatService = {
  get,
  create,
  update,
  remove,
};
