import { FileUploadAPI } from "@vt/core/apis/app/fileUpload";
import { Errors } from "@vt/core/constants/error";
import { UploadedFile } from "express-fileupload";
import { AclPermission, serviceUploadFile } from "./fileUploadServices";

type UploadFileResponse =
  | {
      error: Error;
      data: undefined;
    }
  | {
      data: string;
      error: undefined;
    };

export const uploadFile = async (
  file: UploadedFile,
  path: string,
  acl: AclPermission = "private",
  metadata?: Record<string, string>
): Promise<UploadFileResponse> => {
  try {
    const uploadedFile = await serviceUploadFile(file, path, acl, metadata);
    return {
      error: undefined,
      data: uploadedFile,
    };
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error("failed to upload", err);
    const error = err as Error;
    return {
      error,
      data: undefined,
    };
  }
};

const uploadSingleFile = async (
  file: UploadedFile,
  query: FileUploadAPI["Query"],
  // _id: bigint | number,
  metadata?: Record<string, string>
) => {
  const { acl = "public", type, prefix } = query;
  const paths: string[] = [type];

  if (prefix) {
    paths.push(prefix);
  }

  const nameChunks = file.name.split(".");
  const [filename, ext] = [nameChunks.at(0), nameChunks.at(-1)];
  const now = Date.now();
  paths.push(`${filename}-${now}.${ext}`);

  const path = paths.join("/");
  return await uploadFile(file, path, acl, metadata);
};

// query -> is using for filtering, sorting, and identifying resources (GET requests)
// body -> is used to send data to the server (POST, PUT, PATCH requests)

export const controllerUploadFile: RequestHandler = async (req, res) => {
  const { file } =
    (req.files as { file?: UploadedFile | UploadedFile[] }) || {};
  // const file = req.file;

  const { type, ...metadata } = req.query;

  if (!file || !type) {
    console.error("file not found", file);
    console.error("type not found", type);
    return res.status(400).json(Errors.invalidRequest);
  }

  let response: string = "";

  if (Array.isArray(file)) {
    // ignore, currently not in use
  } else {
    const result = await uploadSingleFile(file, req.query, metadata);
    if (result.error) {
      res.status(400).json(Errors.failedUpUploadFile);
      return;
    }
    response = result.data;
  }
  res.status(200).json({
    url: response,
  });
};
