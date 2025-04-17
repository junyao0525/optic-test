import { DetectFaceApi } from "@vt/core/apis/app/python";
import { Router } from "express";
import { uploadMiddleware } from "../../middlewares/uploadMiddleware";
import { createRouteHandler } from "../../utils/createRouteHandler";
import { controllerDetectFace } from "./pythonController";

const router = Router();

createRouteHandler<DetectFaceApi>(
  router,
  "/app/detect-face",
  "POST",
  uploadMiddleware,
  controllerDetectFace
);

export default router;
