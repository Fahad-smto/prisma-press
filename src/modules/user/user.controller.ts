import { NextFunction, Request, RequestHandler, Response } from "express";
import httpStatus from "http-status";
import { userService } from "./user.service";
import { catchAsync } from '../../utils/catchAsync';
import { sendResponse } from "../../utils/sendResponse";
import config from "../../config";
import jwt from "jsonwebtoken";





const getUserProfile: RequestHandler = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
   

    // const {accessToken} = req.cookies 
    // console.log('accessToken', accessToken);

    // const verifiedToken =jwt.verify(accessToken, config.jwt_access_secret as string) as jwt.JwtPayload;

    // console.log('verifiedToken', verifiedToken);
    // const userId = verifiedToken.id;

    const user = await userService.getUserProfileFromDB(req.user?.id as string);

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

const updateUserProfile = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.id as string;
    const payload = req.body;

    const updatedUser = await userService.updateUserProfileInDB(userId, payload);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: 'User profile updated successfully',
        data: {
         updatedUser
        }
    });
});

export const userController = {
    registerUser,
    getUserProfile,
    updateUserProfile
}
