import { HabitService } from './habit.service';
import { db } from '../config/db.config';

jest.mock('../config/db.config', () => ({
  db: {
    habit: {
      create: jest.fn(),
      findMany: jest.fn(),
      findFirst: jest.fn(),
      updateMany: jest.fn(),
      deleteMany: jest.fn(),
    },
  },
}));

describe('HabitService', () => {
  const userId = 'user-test-123';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createHabit', () => {
    it('should create a new habit with userId and provided fields', async () => {
      const habitInput = {
        title: 'Morning Yoga',
        description: '20 minutes stretches and breathing',
      };

      const mockCreatedHabit = {
        id: 'habit-1',
        userId,
        ...habitInput,
        completed: false,
        createdAt: new Date(),
      };

      (db.habit.create as jest.Mock).mockResolvedValue(mockCreatedHabit);

      const result = await HabitService.createHabit(userId, habitInput);

      expect(db.habit.create).toHaveBeenCalledWith({
        data: {
          title: habitInput.title,
          description: habitInput.description,
          userId,
        },
      });
      expect(result).toEqual(mockCreatedHabit);
    });
  });

  describe('getHabits', () => {
    it('should fetch habits belonging to user ordered by createdAt descending', async () => {
      const mockHabits = [
        { id: 'habit-1', title: 'Habit 1', userId },
        { id: 'habit-2', title: 'Habit 2', userId },
      ];

      (db.habit.findMany as jest.Mock).mockResolvedValue(mockHabits);

      const result = await HabitService.getHabits(userId);

      expect(db.habit.findMany).toHaveBeenCalledWith({
        where: { userId },
        orderBy: { createdAt: 'desc' },
      });
      expect(result).toHaveLength(2);
      expect(result).toEqual(mockHabits);
    });
  });

  describe('getHabitById', () => {
    it('should return a habit matching id and userId', async () => {
      const mockHabit = { id: 'habit-1', title: 'Reading', userId };
      (db.habit.findFirst as jest.Mock).mockResolvedValue(mockHabit);

      const result = await HabitService.getHabitById(userId, 'habit-1');

      expect(db.habit.findFirst).toHaveBeenCalledWith({
        where: { id: 'habit-1', userId },
      });
      expect(result).toEqual(mockHabit);
    });

    it('should return null if habit is not found', async () => {
      (db.habit.findFirst as jest.Mock).mockResolvedValue(null);

      const result = await HabitService.getHabitById(userId, 'non-existent');

      expect(result).toBeNull();
    });
  });

  describe('updateHabit', () => {
    it('should update habit for specific user and id', async () => {
      (db.habit.updateMany as jest.Mock).mockResolvedValue({ count: 1 });

      const updateData = { completed: true };
      const result = await HabitService.updateHabit(userId, 'habit-1', updateData);

      expect(db.habit.updateMany).toHaveBeenCalledWith({
        where: { id: 'habit-1', userId },
        data: updateData,
      });
      expect(result).toEqual({ count: 1 });
    });
  });

  describe('deleteHabit', () => {
    it('should delete habit for specific user and id', async () => {
      (db.habit.deleteMany as jest.Mock).mockResolvedValue({ count: 1 });

      const result = await HabitService.deleteHabit(userId, 'habit-1');

      expect(db.habit.deleteMany).toHaveBeenCalledWith({
        where: { id: 'habit-1', userId },
      });
      expect(result).toEqual({ count: 1 });
    });
  });
});
