import { prisma } from "../../prisma/index";
import { parseJwt } from "../utils/TokenHelper";
import { sendPushNotification } from "../utils/notifications";
var jwt = require("jsonwebtoken");

async function get(token: string) {
  await prisma.$connect();

  // const relatives = await prisma.sensorUser.findMany();
  const username = parseJwt(token.split(" ")[1]);

  const user = await prisma.user.findUnique({
    where: { email: username },
  });

  const falls = await prisma.history
    .findUnique({
      where: {
        userId: user?.id,
      },
    })
    .then(async (history) => {
      if (history)
        return await prisma.fall.findMany({
          where: {
            historyIds: {
              hasSome: history.id,
            },
          },
          include: {
            sensorUser: true,
          },
        });
      return [];
    });

  const sensorUserArray = falls
    .filter((fall) => fall.sensorUser) // filter out objects without the sensorUser property
    .map((fall) => fall.sensorUser); // map to an array of only the sensorUser properties

  await prisma.$disconnect();

  return sensorUserArray;
}

async function create(body: any) {
  await prisma.$connect();

  const socialSecurityNumber = body.socialSecurityNumber;

  //UPDATE TO LARMAT
  await prisma.sensorUser.update({
    where: {
      socialSecurityNumber: socialSecurityNumber,
    },
    data: {
      status: "LARMAT",
    },
  });

  const sensorUser = await prisma.sensorUser.findUnique({
    where: {
      socialSecurityNumber: socialSecurityNumber,
    },
    include: {
      users: {
        include: {
          history: true,
        },
      },
    },
  });

  if (!sensorUser) {
    throw new Error(`No SensorUser found with id: ${socialSecurityNumber}`);
  }
  const newFall = await prisma.fall.create({
    data: {
      location: {
        latitude: 57.686016,
        longitude: 11.983084,
      },
      sensorUserId: sensorUser.id,
    },
  });

  const events = await prisma.events.create({
    data: {
      fallId: newFall.id,
    },
  });

  await prisma.history.updateMany({
    where: {
      userId: {
        in: sensorUser.users.map((user) => user.id),
      },
    },
    data: {
      fallsIDs: {
        push: newFall.id,
      },
    },
  });

  await prisma.chat.create({
    data: {
      sensorUserId: sensorUser.id,
      membersIds: {
        set: sensorUser.userIds,
      },
    },
  });
  const users = sensorUser.users;

  const expoPushTokens = users.map((user) => user.expoPushToken);

  sendPushNotification(expoPushTokens, sensorUser.name);
  await prisma.$disconnect();

  return newFall;
}

async function update(userId: number, newValues: any) {}
async function remove(id: number) {}

export const fallService = {
  get,
  create,
  update,
  remove,
};
