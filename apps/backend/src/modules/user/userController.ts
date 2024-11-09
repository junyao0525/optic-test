import { GetUserApi } from "@vt/core/apis/app/auth";
import { RequestHandler } from "express";

export const controllerGetUser: RequestHandler<GetUserApi> = async (_, res) => {
  try {
    console.log("success");
    return res.status(200).json("success");
  } catch (error) {
    console.log(error);
    return res.status(400).json(error);
  }
};
