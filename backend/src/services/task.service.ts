import { db } from "../config/db.config";
import { CreateTaskInput, UpdateTaskInput } from "../models/task.dto";

export class TaskService {
  static async createTask(userId: string, data: CreateTaskInput) {
    return await db.task.create({
      data: {
        title: data.title,
        description: data.description,
        priority: data.priority,
        dueDate: data.dueDate ? new Date(data.dueDate) : undefined,
        userId,
      },
    });
  }

  static async getTasks(userId: string) {
    return await db.task.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });
  }

  static async getTaskById(userId: string, taskId: string) {
    return await db.task.findFirst({
      where: {
        id: taskId,
        userId,
      },
    });
  }

  static async updateTask(userId: string, taskId: string, data: UpdateTaskInput) {
    // Clean up dates for Prisma
    const updateData: any = { ...data };
    if (data.dueDate !== undefined) {
      updateData.dueDate = data.dueDate ? new Date(data.dueDate) : null;
    }

    return await db.task.updateMany({
      where: {
        id: taskId,
        userId,
      },
      data: updateData,
    });
  }

  static async deleteTask(userId: string, taskId: string) {
    return await db.task.deleteMany({
      where: {
        id: taskId,
        userId,
      },
    });
  }
}
