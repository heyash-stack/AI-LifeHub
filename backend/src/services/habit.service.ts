import { db } from "../config/db.config";
import { CreateHabitInput, UpdateHabitInput } from "../models/habit.dto";

export class HabitService {

  static async createHabit(userId: string, data: CreateHabitInput) {
    return await db.habit.create({
      data: {
        title: data.title,
        description: data.description,
        userId,
      },
    });
  }

  static async getHabits(userId: string) {
    return await db.habit.findMany({
      where: {
        userId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  static async getHabitById(userId: string, habitId: string) {
    return await db.habit.findFirst({
      where: {
        id: habitId,
        userId,
      },
    });
  }

  static async updateHabit(
    userId: string,
    habitId: string,
    data: UpdateHabitInput
  ) {
    return await db.habit.updateMany({
      where: {
        id: habitId,
        userId,
      },
      data,
    });
  }

  static async deleteHabit(userId: string, habitId: string) {
    return await db.habit.deleteMany({
      where: {
        id: habitId,
        userId,
      },
    });
  }

}