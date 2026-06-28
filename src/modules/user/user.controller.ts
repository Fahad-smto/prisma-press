import { NextFunction, Request, RequestHandler, Response } from "express";
import httpStatus from "http-status";
import { userService } from "./user.service";
import { catchAsync } from '../../utils/catchAsync';
import { sendResponse } from "../../utils/sendResponse";
import config from "../../config";
import jwt from "jsonwebtoken";





const getUserProfile: RequestHandler = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.id;

    const {accessToken} = req.cookies 
    console.log('accessToken', accessToken);

    const verifiedToken =jwt.verify(accessToken, config.jwt_access_secret as string) as {id: string, iat: number, exp: number};

    console.log('verifiedToken', verifiedToken);
  

    const user = await userService.getUserProfileFromDB(userId as string);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: 'User profile retrieved successfully',
        data: {
            user
        }
    });
});

// const registerUser = async (req: Request, res: Response) => {
//     try {
//         const payload = req.body;

//         const user = await userService.registerUserIntoDB(payload);

//         res.status(httpStatus.CREATED).json({
//             success: true,
//             statusCode: httpStatus.CREATED,
//             message: "User registered successfully",
//             data: {
//                 user
//             }
//         });
//     } catch (error) {
//         console.log(error);

//         res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
//             success: false,
//             statusCode: httpStatus.INTERNAL_SERVER_ERROR,
//             message: "Failed to register user",
//             error: (error as Error).message
//         })

//     }
// }


const registerUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const payload =req.body;
    const user = await userService.registerUserIntoDB(payload);

    // res.status(httpStatus.CREATED).json({
    //     success: true,
    //     statusCode: httpStatus.CREATED,
    //     message:'user registered successfully',
    //     data: {
    //         user
    //     }
    // })

    sendResponse(res,{
        success: true,
        statusCode: httpStatus.CREATED,
        message: 'User registered successfully',
        data: {
            user
        }
    })
})


export const userController = {
    registerUser,
    getUserProfile
}