import { User } from "@supabase/supabase-js";
import { Errors } from "@vt/core/constants/error";
import argon2 from "argon2";
import { omit } from "lodash";
import getPrismaInstance from "src/utils/prisma";

//login user
export const controllerLoginUser: RequestHandler = async (req, res) => {
  try {
    const client = getPrismaInstance();

    const { email, password } = req.body;

    const user = await client.users.findFirst({
      where: {
        email: email,
      },
    });
    if (!user) {
      return res.status(400).json(Errors.notFound);
    }
    if (!user.password) {
      throw Errors.invalidRequest;
    }
    const isValid = await argon2.verify(user.password, password);

    if (!isValid) {
      throw Errors.invalidRequest;
    }
    return res.status(200).json({
      user: omit(user, ["password"]) as unknown as User,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json();
  }
};
