import { SensorUser } from "@prisma/client";
import { prisma } from "../../prisma/index";
import { parseJwt } from "../utils/TokenHelper";

async function get(token: string) {
  await prisma.$connect();

  const username = parseJwt(token.split(" ")[1]);

  const user = await prisma.user.findFirst({
    where: { email: username },
  });

  let relatives: SensorUser[] = [];

  if (!user) {
    throw new Error(`User not found`);
  }

  relatives = await prisma.sensorUser.findMany({
    where: {
      userIds: {
        hasSome: user.id,
      },
    },
  });

  await prisma.$disconnect();

  return relatives;
}
async function getSpecific(_socialSecurityNumber: string) {
  await prisma.$connect();

  const sensorUser = await prisma.sensorUser.findFirst({
    where: {
      socialSecurityNumber: _socialSecurityNumber,
    },
  });

  if (!sensorUser) throw new Error(`No sensorUser found`);

  const fall = await prisma.fall.findFirst({
    where: {
      sensorUserId: sensorUser.id,
    },
  });

  if (!fall) throw new Error(`Person not fallen`);

  const res = {
    sensorUser,
    position: fall.location,
  };

  await prisma.$disconnect();

  return res;
}

async function create(body: SensorUser, token: string) {
  const username = parseJwt(token.split(" ")[1]);

  await prisma.$connect();

  const user = await prisma.user.findFirst({
    where: { email: username },
  });

  if (!user) {
    throw new Error(`not found`);
  }

  const sensorUser = await prisma.sensorUser.upsert({
    where: {
      socialSecurityNumber: body.socialSecurityNumber,
    },
    update: {
      userIds: {
        push: user.id,
      },
    },
    create: {
      socialSecurityNumber: body.socialSecurityNumber,
      userIds: user.id,
      location: body.location,
      phoneNr: body.phoneNr,
      status: "HOME",
      name: body.name,
    },
  });

  await prisma.user.update({
    where: {
      id: user.id,
    },
    data: {
      sensorUsersIDs: {
        push: sensorUser.id,
      },
    },
  });

  return sensorUser;
}
async function update(userId: number, newValues: any) {}

async function remove(id: number) {}

export const sensorUserService = {
  get,
  create,
  update,
  remove,
  getSpecific,
};
