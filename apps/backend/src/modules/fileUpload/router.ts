import { FileUploadAPI } from "@vt/core/apis/app/fileUpload";
import { Router } from "express";
import { createRouteHandler } from "../../utils/createRouteHandler";
import { controllerUploadFile } from "./fileUploadController";

const router = Router();

createRouteHandler<FileUploadAPI>(
  router,
  "/app/upload-image",
  "POST",
  controllerUploadFile
);

export default router;
