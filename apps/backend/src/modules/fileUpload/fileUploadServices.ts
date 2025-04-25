import { PutObjectCommand } from "@aws-sdk/client-s3";
import { UploadedFile } from "express-fileupload";
import { S3_BUCKET, S3_DOMAIN } from "src/constants/config";
import { s3Client } from "src/constants/s3Bucket";

const domain = S3_DOMAIN;

const aclPermission = {
  private: "private",
  public: "public-read",
} as const;

export type AclPermission = keyof typeof aclPermission;

export const serviceUploadFile = async (
  file: UploadedFile,
  path: string,
  acl: AclPermission = "public",
  metadata?: Record<string, string>
) => {
  // const uploadPath = `${acl}/${path}`;
  const uploadPath = `uploads/${path}`;
  const uploadedPath = `${domain}/${uploadPath}`;
  const body = file.data;

  await s3Client.send(
    new PutObjectCommand({
      Bucket: S3_BUCKET,
      Key: uploadPath,
      ContentType: file.mimetype,
      ACL: aclPermission[acl],
      Body: body,
      Metadata: metadata,
    })
  );

  // if (acl === 'private') {
  //     return serviceGetSignedUrlFromKey(uploadPath);
  // }

  return uploadedPath;
};

// export const controllerGetSignedUrl: RequestHandler<GetSignedUrlApi> = async (req, res) => {
//     try {
//       const result = await serviceGetSignedUrlFromUrl(req.query.key);
//       res.status(200).json({
//         url: result,
//       });
//     } catch (err) {
//       console.error(err);
//       res.status(403).json(Errors.invalidRequest);
//     }
//   };
