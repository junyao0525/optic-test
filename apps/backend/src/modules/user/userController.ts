import { GetUserApi, RegisterUserApi } from "@vt/core/apis/app/users";
import { Errors } from "@vt/core/constants/error";
import argon2 from "argon2";
import getPrismaInstance from "src/utils/prisma";

// get user
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

// register user

export const controllerRegisterUser: RequestHandler<RegisterUserApi> = async (
  req,
  res
) => {
  try {
    const client = getPrismaInstance();

    const { name, email, dob, password } = req.body;

    const hashedPassword = await argon2.hash(password);

    const data = await client.users.create({
      data: {
        name: name,
        email: email,
        dob: new Date(dob),
        password: hashedPassword,
      },
    });

    if (!data) {
      return res.status(400).json(Errors.notFound);
    }

    return res.status(200).json(data as unknown as RegisterUserApi["Response"]);
  } catch (error) {
    console.log(error);
    return res.status(400).json();
  }
};
