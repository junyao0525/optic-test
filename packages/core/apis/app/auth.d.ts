import { ERRORS } from "../../constants/error";

export type GetUserApi = {
  Endpoint: "/api/user";
  Method: "GET";
  Response: {
    id: bigint | string;
    name: string;
    email: string;
    dob: string;
    createdAt: string;
    updatedAt: string;
  };
  Error: ERRORS["notFound"];
};
