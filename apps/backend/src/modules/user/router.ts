import { GetUserApi } from "@vt/core/apis/app/auth";
import { Router } from "express";
import { createRouteHandler } from "../../utils/createRouteHandler";
import { controllerGetUser } from "./userController";

const router = Router();

createRouteHandler<GetUserApi>(router, "/app/user", "GET", controllerGetUser);

export default router;
