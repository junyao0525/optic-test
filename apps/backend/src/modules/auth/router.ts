import { LoginUserApi } from "@vt/core/apis/app/auth";
import { Router } from "express";
import { createRouteHandler } from "../../utils/createRouteHandler";

import { controllerLoginUser } from "./authController";

const router = Router();

createRouteHandler<LoginUserApi>(
  router,
  "/app/loginUser",
  "POST",
  controllerLoginUser
);

export default router;
