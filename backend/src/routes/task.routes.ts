import { Router } from "express";
import {
  createTaskHandler,
  getTasksHandler,
  getTaskByIdHandler,
  updateTaskHandler,
  deleteTaskHandler,
} from "../controllers/task.controller";
import { authenticateUser } from "../middlewares/auth.middleware";

const router = Router();

router.post("/", authenticateUser, createTaskHandler);
router.get("/", authenticateUser, getTasksHandler);
router.get("/:id", authenticateUser, getTaskByIdHandler);
router.put("/:id", authenticateUser, updateTaskHandler);
router.delete("/:id", authenticateUser, deleteTaskHandler);

export default router;
