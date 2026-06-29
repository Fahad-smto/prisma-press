import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { authService } from "./auth.service";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status";

const isProd = process.env.NODE_ENV === 'production';

const loginUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const payload = req.body;

    const { accessToken, refreshToken } = await authService.loginUser(payload);

    res.cookie('accessToken', accessToken, {
        httpOnly: true,
        secure: isProd,                       // FIX: must be true if sameSite is 'none'
        sameSite: isProd ? 'none' : 'lax',    // FIX: 'none' over http silently fails
        maxAge: 1000 * 60 * 60 * 24           // FIX: was missing * 60 -> only 24 mins before
    });

    res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: isProd,
        sameSite: isProd ? 'none' : 'lax',
        maxAge: 1000 * 60 * 60 * 24 * 7       // FIX: 7 days, properly calculated
    });

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: 'User logged in successfully',
        data: {
            accessToken,
            refreshToken
        }
    });
});


const refreshToken = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies.refreshToken;   // FIX: renamed local var (was shadowing outer name)

    const { accessToken } = await (authService as any).refreshToken(token);

    res.cookie('accessToken', accessToken, {
        httpOnly: true,
        secure: isProd,
        sameSite: isProd ? 'none' : 'lax',
        maxAge: 1000 * 60 * 60 * 24
    });

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: 'Token refreshed successfully',
        data: {
            accessToken
        }
    });
});


export const authController = {
    loginUser,
    refreshToken
}