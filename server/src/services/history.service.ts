import { prisma } from "../../prisma/index";
import { parseJwt } from "../utils/TokenHelper";

async function get(token: string) {
  await prisma.$connect();

  const username = parseJwt(token.split(" ")[1]);

  const user = await prisma.user.findFirst({
    where: { email: username },
  });

  if (!user) throw new Error(`User not found`);

  const historyList = await prisma.history.findUnique({
    where: {
      userId: user.id,
    },
    include: {
      falls: {
        include: {
          sensorUser: true,
        },
      },
      user: true,
    },
  });

  if (!historyList) {
    throw new Error(`history not found`);
  }

  const historyDataList = historyList.falls.map((fall) => {
    return {
      date: fall.createdAt,
      sensorUser: fall.sensorUser,
      position: fall.location,
    };
  });

  await prisma.$disconnect();

  return historyDataList;
}

export const historyService = {
  get,
};
