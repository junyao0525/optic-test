import { BaseApi } from "@vt/core/apis/base";
import { RequestHandler, Router } from "express";

export const createRouteHandler = <Api extends BaseApi = BaseApi>(
  router: Router,
  endpoint: Api["Endpoint"],
  method: Api["Method"],
  ...handlers: Array<RequestHandler<Api>>
) => {
  switch (method) {
    case "GET":
      return router.get<
        Api["Endpoint"],
        Api["Params"] extends {} ? Api["Params"] : {},
        Api["Response"] | Api["Error"],
        Api["Body"] extends {} ? Api["Body"] : {},
        Api["Query"] extends {} ? Api["Query"] : {}
      >(endpoint, ...(handlers as any));
    case "POST":
      return router.post<
        Api["Endpoint"],
        Api["Params"] extends {} ? Api["Params"] : {},
        Api["Response"] | Api["Error"],
        Api["Body"] extends {} ? Api["Body"] : {},
        Api["Query"] extends {} ? Api["Query"] : {}
      >(endpoint, ...(handlers as any));
    case "DELETE":
      return router.delete<
        Api["Endpoint"],
        Api["Params"] extends {} ? Api["Params"] : {},
        Api["Response"] | Api["Error"],
        Api["Body"] extends {} ? Api["Body"] : {},
        Api["Query"] extends {} ? Api["Query"] : {}
      >(endpoint, ...(handlers as any));
    case "PUT":
      return router.put<
        Api["Endpoint"],
        Api["Params"] extends {} ? Api["Params"] : {},
        Api["Response"] | Api["Error"],
        Api["Body"] extends {} ? Api["Body"] : {},
        Api["Query"] extends {} ? Api["Query"] : {}
      >(endpoint, ...(handlers as any));
    case "PATCH":
      return router.patch<
        Api["Endpoint"],
        Api["Params"] extends {} ? Api["Params"] : {},
        Api["Response"] | Api["Error"],
        Api["Body"] extends {} ? Api["Body"] : {},
        Api["Query"] extends {} ? Api["Query"] : {}
      >(endpoint, ...(handlers as any));
  }
};
