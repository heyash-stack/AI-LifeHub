import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';
import { asyncHandler } from '../utils/asyncHandler';

export const registerHandler = asyncHandler(async (req: Request, res: Response) => {
  const result = await AuthService.register(req.body);
  res.status(201).json({
    status: 'success',
    data: result,
  });
});

export const loginHandler = asyncHandler(async (req: Request, res: Response) => {
  const result = await AuthService.login(req.body);
  res.status(200).json({
    status: 'success',
    data: result,
  });
});

export const refreshHandler = asyncHandler(async (req: Request, res: Response) => {
  const { refreshToken } = req.body;
  const tokens = await AuthService.refreshTokens(refreshToken);
  res.status(200).json({
    status: 'success',
    data: tokens,
  });
});

export const logoutHandler = asyncHandler(async (req: Request, res: Response) => {
  const { refreshToken } = req.body;
  if (refreshToken) {
    await AuthService.logout(refreshToken);
  }
  res.status(200).json({
    status: 'success',
  });
});
