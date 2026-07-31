import { Response } from "express";
import { HabitService } from "../services/habit.service";
import { asyncHandler } from "../utils/asyncHandler";
import { AuthenticatedRequest } from "../middlewares/auth.middleware";

export const createHabitHandler = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const habit = await HabitService.createHabit(
      req.user!.userId,
      req.body
    );

    res.status(201).json({
      status: "success",
      data: habit,
    });
  }
);

export const getHabitsHandler = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const habits = await HabitService.getHabits(req.user!.userId);

    res.status(200).json({
      status: "success",
      data: habits,
    });
  }
);

export const getHabitByIdHandler = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const habit = await HabitService.getHabitById(
      req.user!.userId,
      req.params.id
    );

    if (!habit) {
      return res.status(404).json({
        status: "fail",
        message: "Habit not found",
      });
    }

    res.status(200).json({
      status: "success",
      data: habit,
    });
  }
);

export const updateHabitHandler = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const result = await HabitService.updateHabit(
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

export const deleteHabitHandler = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const result = await HabitService.deleteHabit(
      req.user!.userId,
      req.params.id
    );

    res.status(200).json({
      status: "success",
      data: result,
    });
  }
);