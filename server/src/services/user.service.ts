import { User } from ".prisma/client";
import bcrypt from "bcrypt";
import { prisma } from "../../prisma/index";
import { CustomError } from "../lib/interfaces";
var jwt = require("jsonwebtoken");

const dotenv = require("dotenv");
dotenv.config();

const saltRounds = 8;

const generateAccessToken = (username: string) => {
  return jwt.sign({ username }, process.env.TOKEN_SECRET, { expiresIn: "1h" });
};

const signIn = async (user: User) => {
  await prisma.$connect();
  let error: CustomError;

  try {
    const foundUser = await prisma.user.findFirst({
      where: {
        email: user.email,
      },
    });

    if (!foundUser) {
      error = new Error("User not found");
      error.errorCode = 404;
      throw error;
    }
    const isMatch = bcrypt.compareSync(user.password, foundUser.password);

    await prisma.$disconnect();

    if (isMatch) {
      return {
        email: user.email,
        token: generateAccessToken(foundUser.email),
        role: foundUser.role,
      };
    } else {
      error = new Error("Password is not correct");
      error.errorCode = 401;
      throw error;
    }
  } catch (err) {
    console.log(err);
    error = new Error("Internal server error");
    error.errorCode = 500;
    throw error;
  }
};

const register = async (user: User) => {
  await prisma.$connect();

  user.password = await bcrypt.hash(user.password, saltRounds);

  await prisma.user
    .upsert({
      where: { email: user.email },
      update: {},
      create: {
        email: user.email,
        password: user.password,
        expoPushToken: user.expoPushToken,
        role: "STANDARD",
      },
    })
    .then(async (user) => {
      await prisma.history.create({
        data: {
          userId: user.id,
        },
      });
    });

  await prisma.$disconnect();

  return { email: user.email, token: generateAccessToken(user.email) };
};

export const userService = {
  signIn,
  register,
};
