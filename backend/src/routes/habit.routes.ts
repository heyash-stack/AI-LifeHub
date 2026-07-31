import { Router } from "express";
import {
  createHabitHandler,
  getHabitsHandler,
  getHabitByIdHandler,
  updateHabitHandler,
  deleteHabitHandler,
} from "../controllers/habit.controller";
import { authenticateUser } from "../middlewares/auth.middleware";

const router = Router();

router.post("/", authenticateUser, createHabitHandler);
router.get("/", authenticateUser, getHabitsHandler);
router.get("/:id", authenticateUser, getHabitByIdHandler);
router.put("/:id", authenticateUser, updateHabitHandler);
router.delete("/:id", authenticateUser, deleteHabitHandler);

export default router;