import { GetUserApi, RegisterUserApi } from "@vt/core/apis/app/users";
import { Router } from "express";
import { createRouteHandler } from "../../utils/createRouteHandler";
import { controllerGetUser, controllerRegisterUser } from "./userController";

const router = Router();

createRouteHandler<GetUserApi>(router, "/app/user", "GET", controllerGetUser);

createRouteHandler<RegisterUserApi>(
  router,
  "/app/registerUser",
  "POST",
  controllerRegisterUser
);

export default router;
