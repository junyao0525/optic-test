import { GetUserApi } from "@vt/core/apis/app/auth";
import { Errors } from "@vt/core/constants/error";
import getPrismaInstance from "src/utils/prisma";

export const controllerGetUser: RequestHandler<GetUserApi> = async (_, res) => {
  try {
    const client = getPrismaInstance();

    const data = await client.users.findMany();

    if (!data) {
      return res.status(400).json(Errors.notFound);
    }

    return res.status(200).json(data as unknown as GetUserApi["Response"]);
  } catch (error) {
    console.log(error);
    return res.status(400).json();
  }
};
