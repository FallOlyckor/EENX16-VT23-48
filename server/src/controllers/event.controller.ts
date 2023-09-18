import { eventService } from "../services/event.service";

const get = async (req: any, res: any) => {
  const socialSecurityNumber = req.params.socialSecurityNumber;
  try {
    res.json(await eventService.get(socialSecurityNumber));
  } catch (err) {
    console.error(`Could not get messages`, err);
  }
};
const create = async (req: any, res: any) => {
  const socialSecurityNumber = req.body.socialSecurityNumber;
  try {
    res.json(await eventService.create(socialSecurityNumber));
  } catch (err) {
    console.error(`Could not get messages`, err);
  }
};
const update = async (req: any, res: any) => {
  const socialSecurityNumber = req.body.socialSecurityNumber;
  const place = req.body.place;

  try {
    res.json(await eventService.update(socialSecurityNumber, place));
  } catch (err) {
    console.error(`Could not get messages`, err);
  }
};
const remove = async (req: any, res: any) => {
  const socialSecurityNumber = req.body.socialSecurityNumber;
  try {
    res.json(await eventService.remove(socialSecurityNumber));
  } catch (err) {
    console.error(`Could not get messages`, err);
  }
};

export const eventController = {
  get,
  create,
  update,
  remove,
};
