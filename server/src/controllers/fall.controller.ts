import { log } from "console";
import { fallService } from "../services/fall.service";

const get = async (req: any, res: any) => {
  const token = req.header("authorization");
  try {
    res.json(await fallService.get(token));
  } catch (err) {
    console.error(`Could not get messages`, err);
  }
};

const create = async (req: any, res: any) => {
  try {
    res.json(await fallService.create(req.body));
  } catch (err) {
    console.error(`Could not create message`, err);
  }
};

const update = async (req: any, res: any) => {
  try {
    res.json(await fallService.update(req.params.id, req.body));
  } catch (err) {
    console.error(`Could not update message`, err);
  }
};

const remove = async (req: any, res: any) => {
  try {
    res.json(await fallService.remove(req.params.id));
  } catch (err) {
    console.error(`Could not delete message`, err);
  }
};

export const fallController = {
  get,
  create,
  update,
  remove,
};
