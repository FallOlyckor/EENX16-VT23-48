import { chatService } from "../services/chat.service";

const get = async (req: any, res: any) => {
  const token = req.header("authorization");
  try {
    res.json(await chatService.get(token));
  } catch (err) {
    console.error(`Could not get chat`, err);
  }
};

const create = async (req: any, res: any) => {
  try {
    res.json(await chatService.create(req.body));
  } catch (err) {
    console.error(`Could not create chat`, err);
  }
};

const update = async (req: any, res: any) => {
  try {
    res.json(await chatService.update(req.params.id, req.body));
  } catch (err) {
    console.error(`Could not update chat`, err);
  }
};

const remove = async (req: any, res: any) => {
  try {
    res.json(await chatService.remove(req.params.id));
  } catch (err) {
    console.error(`Could not delete chat`, err);
  }
};

export const chatController = {
  get,
  create,
  update,
  remove,
};
