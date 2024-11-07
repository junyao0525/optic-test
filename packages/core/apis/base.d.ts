type SuccessResponse = Record<string, any> | Record<string, any>[];
type ErrorResponse = {
  code: string;
  message: string;
};

export type BaseApi = {
  Endpoint: string;
  Method: "GET" | "POST" | "DELETE" | "PUT" | "PATCH";
  Query?: Record<string, string | number | boolean | undefined>;
  Headers?: Record<string, any>;
  Params?: Record<string, string | number | boolean>;
  Body?: Record<string, any>;
  Response?: SuccessResponse;
  Error: ErrorResponse;
};
