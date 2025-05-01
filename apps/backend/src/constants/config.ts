/**
 * General Config
 */
export const APP_NAME = process.env.APP_NAME || "vt-backend";
export const isDev = process.env.NODE_ENV === "development"; //when node_env is development then true

export const S3_BUCKET = process.env.S3_BUCKET;
export const S3_DOMAIN = process.env.S3_DOMAIN;
export const S3_REGION = process.env.S3_REGION;
export const S3_ACCESS_KEY_ID = process.env.S3_ACCESS_KEY_ID;
export const S3_SECRET_ACCESS_KEY = process.env.S3_SECRET_ACCESS_KEY;
