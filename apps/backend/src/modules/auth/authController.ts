import { RequestHandler } from "express";
import crypto from "crypto";
import argon2 from "argon2";
import { omit } from "lodash";
import getPrismaInstance from "src/utils/prisma";
import { Errors } from "@vt/core/constants/error";

export const controllerLoginUser: RequestHandler = async (req, res) => {
  try {
    const client = getPrismaInstance();
    const { email, password } = req.body;

    const user = await client.users.findFirst({
      where: { email },
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

    // Generate a random access token
    const accessToken = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour expiry

    // Store the token in DB (you need a table for access tokens)
    await client.accessToken.create({
      data: {
        token: accessToken,
        userId: user.id,
        expiresAt,
      },
    });

    return res.status(200).json({
      user: omit(user, ["password"]),
      accessToken,
      expiresAt,
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(400).json({ error: "Login failed" });
  }
};
