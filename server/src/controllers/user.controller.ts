import { Request, Response } from "express";
import { userService } from "../services/user.service";

const signIn = async (req: Request, res: Response) => {
  try {
    const result = await userService.signIn(req.body);
    res.status(200).json(result);
  } catch (err: any) {
    if (err.statusCode === 404) {
      res.status(404);
    } else if (err.statusCode === 401) {
      res.status(401);
    } else {
      res.status(500);
    }
    console.log("Error loggin in");
  }
};

const register = async (req: any, res: any) => {
  try {
    res.status(200).json(await userService.register(req.body));
  } catch (err) {
    console.error(`Could not update message`, err);
  }
};

export const userController = {
  signIn,
  register,
};
