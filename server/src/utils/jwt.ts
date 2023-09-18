import jwt from "jsonwebtoken";
import createError from "http-errors";
require("dotenv").config();

const accessTokenSecret = process.env.TOKEN_SECRET || "";

export const JWTHelper = {
  signAccessToken(username: string) {
    return new Promise((resolve, reject) => {
      jwt.sign({ username }, accessTokenSecret, {}, (err, token) => {
        if (err) {
          reject(createError.InternalServerError());
        }
        resolve(token);
      });
    });
  },
  verifyAccessToken(token: any) {
    return new Promise((resolve, reject) => {
      jwt.verify(token, accessTokenSecret, (err: any, payload: any) => {
        if (err) {
          const message =
            err.name == "JsonWebTokenError" ? "Unauthorized" : err.message;
          return reject(createError.Unauthorized(message));
        }
        resolve(payload);
      });
    });
  },
};
