import { Response } from "express";
import { TaskService } from "../services/task.service";
import { asyncHandler } from "../utils/asyncHandler";
import { AuthenticatedRequest } from "../middlewares/auth.middleware";

export const createTaskHandler = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const task = await TaskService.createTask(
      req.user!.userId,
      req.body
    );

    res.status(201).json({
      status: "success",
      data: task,
    });
  }
);

export const getTasksHandler = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const tasks = await TaskService.getTasks(req.user!.userId);

    res.status(200).json({
      status: "success",
      data: tasks,
    });
  }
);

export const getTaskByIdHandler = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const task = await TaskService.getTaskById(
      req.user!.userId,
      req.params.id
    );

    if (!task) {
      return res.status(404).json({
        status: "fail",
        message: "Task not found",
      });
    }

    res.status(200).json({
      status: "success",
      data: task,
    });
  }
);

export const updateTaskHandler = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const result = await TaskService.updateTask(
      req.user!.userId,
      req.params.id,
      req.body
    );

    res.status(200).json({
      status: "success",
      data: result,
    });
  }
);

export const deleteTaskHandler = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const result = await TaskService.deleteTask(
      req.user!.userId,
      req.params.id
    );

    res.status(200).json({
      status: "success",
      data: result,
    });
  }
);
