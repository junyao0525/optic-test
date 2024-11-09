import { GetUserApi } from "@vt/core/apis/app/auth";

export const controllerGetUser: RequestHandler<GetUserApi> = async (_, res) => {
  try {
    console.log("success");
    return res.status(200).json();
  } catch (error) {
    console.log(error);
    return res.status(400).json();
  }
};
