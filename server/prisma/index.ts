import { PrismaClient } from "@prisma/client";

export const prisma = new PrismaClient();

async function main() {
  await prisma.$connect();
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });

/*
const deleteAll = async () => {
  await prisma.message.deleteMany();
  await prisma.events.deleteMany();
  await prisma.history.deleteMany();
  await prisma.chat.deleteMany();
  await prisma.fall.deleteMany();
  await prisma.user.deleteMany();
  await prisma.sensorUser.deleteMany();
};

*/
