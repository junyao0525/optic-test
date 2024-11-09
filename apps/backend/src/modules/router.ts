import { Router } from "express";
import UserRouter from "../modules/user/router";

const initailRouter = (router: Router) => {
  router.use(UserRouter);
};

export default initailRouter;
