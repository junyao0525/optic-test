import { DetectFaceApi } from "@vt/core/apis/app/python";
import { Router } from "express";
import { createRouteHandler } from "../../utils/createRouteHandler";
import { controllerDetectFace } from "./pythonController";

const router = Router();

createRouteHandler<DetectFaceApi>(
  router,
  "/app/detect-face",
  "POST",
  controllerDetectFace
);

export default router;
