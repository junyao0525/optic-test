import { AclPermission } from "@vt/backend/src/modules/fileUpload/fileUploadServices";
import { ErrorResponse } from "../base";

type UploadFileType = "profile" | "face-detection";

export type FileUploadAPI = {
  Endpoint: "/app/upload-image";
  Method: "POST";
  Query: {
    type: UploadFileType;
    prefix?: string;
    acl?: AclPermission;
  };
  Body: {
    file: File;
  };
  Response: {
    url: string;
  };
  Error: ErrorResponse;
};
