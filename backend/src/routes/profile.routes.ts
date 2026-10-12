import { Router } from "express";
import {
  getProfileHandler,
  updateProfileHandler,
} from "../controllers/profile.controller";
import { authenticateUser } from "../middlewares/auth.middleware";

const router = Router();

router.get("/", authenticateUser, getProfileHandler);
router.put("/", authenticateUser, updateProfileHandler);

export default router;
