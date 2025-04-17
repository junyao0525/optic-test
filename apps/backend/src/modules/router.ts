import { Router } from "express";
import AuthRouter from "../modules/auth/router";
import PythonRouter from "../modules/python/router";
import UserRouter from "../modules/user/router";

const initailRouter = (router: Router) => {
  router.use(UserRouter);
  router.use(AuthRouter);
  router.use(PythonRouter);
};

export default initailRouter;
