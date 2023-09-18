import { messageService } from "../services/message.service";

const get = async (req: any, res: any) => {
  const socialSecurityNumber = req.body.socialSecurityNumber;

  try {
    res.json(await messageService.get(socialSecurityNumber));
  } catch (err) {
    console.error(`Could not get messages`, err);
  }
};

const getMessages = async (req: any, res: any) => {
  const socialSecurityNumber = req.params.socialSecurityNumber;

  try {
    res.json(await messageService.get(socialSecurityNumber));
  } catch (err) {
    console.error(`Could not get messages`, err);
  }
};

const create = async (req: any, res: any) => {
  const message = req.body.message;
  const socialSecurityNumber = req.body.socialSecurityNumber;
  const token = req.header("authorization");

  try {
    res.json(await messageService.create(message, token, socialSecurityNumber));
  } catch (err) {
    console.error(`Could not create message`, err);
  }
};

const update = async (req: any, res: any) => {
  try {
    res.json(await messageService.update(req.params.id, req.body));
  } catch (err) {
    console.error(`Could not update message`, err);
  }
};

const remove = async (req: any, res: any) => {
  try {
    res.json(await messageService.remove(req.params.id));
  } catch (err) {
    console.error(`Could not delete message`, err);
  }
};

export const messageController = {
  get,
  create,
  update,
  remove,
  getMessages,
};
