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
    success: boolean;
  };
  Error: ERRORS["notFound"];
};

// no important for now
//TODO : FORGOT PASSWORD
//TODO : CHANGE PASSWORD
