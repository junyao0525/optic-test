import UserRouter from "@src/modules/user/router";
import { Router } from "express";

const initailRouter = (router: Router) => {
  router.use(UserRouter);
};

export default initailRouter;
