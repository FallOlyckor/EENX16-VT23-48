import { prisma } from "../../prisma/index";

async function get(socialSecurityNumber: string) {
  await prisma.$connect();

  const sensorUser = await prisma.sensorUser.findUnique({
    where: {
      socialSecurityNumber: socialSecurityNumber,
    },
    include: {
      fall: true,
    },
  });

  if (!sensorUser || !sensorUser.fall) throw new Error(`Sensor user not found`);

  const event = await prisma.events.findFirst({
    where: {
      fallId: sensorUser.fall.id,
    },
  });

  if (!event) throw new Error(`No events found`);

  await prisma.$disconnect();

  return event;
}

async function create(message: any) {}
async function update(socialSecurityNumber: string, place: string) {
  await prisma.$connect();

  const sensorUser = await prisma.sensorUser.findUnique({
    where: {
      socialSecurityNumber: socialSecurityNumber,
    },
    include: {
      fall: true,
    },
  });

  if (!sensorUser || !sensorUser.fall) throw new Error(`Sensor user not found`);

  let event;
  console.log(place);
  if (place === "Larmcentral") {
    event = await prisma.events.update({
      where: {
        fallId: sensorUser.fall.id,
      },
      data: {
        larmCentral: new Date(),
      },
    });
  } else if (place === "Ambulans") {
    event = await prisma.events.update({
      where: {
        fallId: sensorUser.fall.id,
      },
      data: {
        ambulance: new Date(),
      },
    });
  } else if (place === "Ambulans på plats") {
    event = await prisma.events.update({
      where: {
        fallId: sensorUser.fall.id,
      },
      data: {
        ambulanceOnSpot: new Date(),
      },
    });
  } else if (place === "Påväg till sjukhus") {
    event = await prisma.events.update({
      where: {
        fallId: sensorUser.fall.id,
      },
      data: {
        ambulanceEnRoute: new Date(),
      },
    });
  } else if (place === "Hospital") {
    event = await prisma.events.update({
      where: {
        fallId: sensorUser.fall.id,
      },
      data: {
        hospital: new Date(),
      },
    });
  }

  if (!event) throw new Error(`No events found`);

  await prisma.$disconnect();

  return event;
}
async function remove(message: any) {}

export const eventService = {
  get,
  create,
  update,
  remove,
};
