import { Router } from "express";
import { auth } from "../../../middleware/auth";
import * as userController from "../../controller/user";

const userRouter = Router();

userRouter.use("/", auth, userController.getUser);

export default userRouter;
