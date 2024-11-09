import { BaseApi } from "@vt/core/apis/base";
import {
  Request as CoreRequest,
  RequestHandler as CoreRequestHandler,
} from "express";

declare global {
  type RequestHandler<Api extends BaseApi = Api> = CoreRequestHandler<
    Api["Params"] extends {} ? Api["Params"] : {},
    Api["Response"] | Api["Error"],
    Api["Body"] extends {} ? Api["Body"] : {},
    Api["Query"] extends {} ? Api["Query"] : {}
  >;

  type ExpressRequest<Api extends BaseApi = Api> = CoreRequest<
    Api["Params"] extends {} ? Api["Params"] : {},
    Api["Response"] | Api["Error"],
    Api["Body"] extends {} ? Api["Body"] : {},
    Api["Query"] extends {} ? Api["Query"] : {}
  >;

  namespace NodeJS {
    interface ProcessEnv {
      APP_NAME: string;
      NODE_ENV: "development" | "production";

      SUPABASE_URL: string;
      SUPABASE_API_KEY: string;
    }
  }

  type DeviceType = "android" | "ios";
}

export {};
