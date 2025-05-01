import { BaseApi } from "../apis/base";

export const Errors = {
  invalidRequest: {
    code: "400",
    message: "Invalid request",
  },
  incorrectPassword: {
    code: "400",
    message: "Incorrect password",
  },
  failedUpUploadFile: {
    code: "400",
    message: "Failed to upload file",
  },
  notFound: {
    code: "404",
    message: "Data not found",
  },
  emailExists: {
    code: "400",
    message: "Email exists",
  },
} as const satisfies {
  [key: string]: BaseApi["Error"];
};

export type ERRORS = typeof Errors;
