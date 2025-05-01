import { ERRORS } from "../../constants/error";

export type GetUserApi = {
  Endpoint: "/app/user";
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

export type RegisterUserApi = {
  Endpoint: "/app/registerUser";
  Method: "POST";
  Body: {
    name: string;
    email: string;
    dob: string;
    password: string;
  };
  Response: {
    id: bigint | string;
    name: string;
    email: string;
    dob: string;
    createdAt: string;
    updatedAt: string;
  };
  Error: ERRORS["notFound"] | ERRORS["emailExists"];
};

// TODO : Update Users
