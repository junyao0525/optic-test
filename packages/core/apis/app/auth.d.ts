import { ERRORS } from "../../constants/error";

//TODO : LOGIN
export type LoginUserApi = {
  Endpoint: "/app/loginUser";
  Method: "POST";
  BODY: {
    email: string;
    password: string;
  };
  Response: {
    user: {
      id: number;
      email: string;
      name?: string;
    };
    accessToken: string;
    expiresAt: string;
  };
  Error: ERRORS["notFound"];
};

// no important for now
//TODO : FORGOT PASSWORD
//TODO : CHANGE PASSWORD
