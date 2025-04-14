import { Router } from "express";
import AuthRouter from "../modules/auth/router";
import UserRouter from "../modules/user/router";

const initailRouter = (router: Router) => {
  router.use(UserRouter);
  router.use(AuthRouter);
};

export default initailRouter;
