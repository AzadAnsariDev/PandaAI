import { Router } from "express";
import { authUser } from "../middlewares/auth.middleware.js";
import { compareModel } from "../controllers/compare.controller.js";

const compareRouter = Router()

compareRouter.post("/", compareModel )

export default compareRouter
