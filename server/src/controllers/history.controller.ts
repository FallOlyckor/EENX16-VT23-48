import { historyService } from "../services/history.service";

const get = async (req: any, res: any) => {
  const token = req.header("authorization");

  try {
    res.json(await historyService.get(token));
  } catch (err) {
    console.error(`Could not get messages`, err);
  }
};

export const historyController = {
  get,
};
