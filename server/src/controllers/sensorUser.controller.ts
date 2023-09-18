import { sensorUserService } from "../services/sensorUser.service";

const get = async (req: any, res: any) => {
  const token = req.header("authorization");

  try {
    res.json(await sensorUserService.get(token));
  } catch (err) {
    console.error(`Could not get messages`, err);
  }
};
const getSpecific = async (req: any, res: any) => {
  const socialSecurityNumber = req.params.socialSecurityNumber;
  try {
    res.json(await sensorUserService.getSpecific(socialSecurityNumber));
  } catch (err) {
    console.error(`Could not get messages`, err);
  }
};

const create = async (req: any, res: any) => {
  const token = req.header("authorization");

  try {
    res.json(await sensorUserService.create(req.body, token));
  } catch (err) {
    console.error(`Could not create message`, err);
  }
};

const update = async (req: any, res: any) => {
  try {
    res.json(await sensorUserService.update(req.params.id, req.body));
  } catch (err) {
    console.error(`Could not update message`, err);
  }
};

const remove = async (req: any, res: any) => {
  try {
    res.json(await sensorUserService.remove(req.params.id));
  } catch (err) {
    console.error(`Could not delete message`, err);
  }
};

export const sensorUserController = {
  get,
  create,
  update,
  remove,
  getSpecific,
};
