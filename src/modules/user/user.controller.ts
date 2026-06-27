import { UserCreateArgs } from './../../../generated/prisma/models/User';
import { NextFunction, Request, RequestHandler, Response } from "express";
import httpStatus from "http-status";
import { userService } from "./user.service";


const catchAsync = (fn: RequestHandler) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            await fn(req, res, next);
        } catch (error) {
            next(error)
            res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
                success: false,
                statusCode: httpStatus.INTERNAL_SERVER_ERROR,
                message: "Failed to register user",
                error: (error as Error).message
            })

        }
    }
}



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

    res.status(httpStatus.CREATED).json({
        success: true,
        statusCode: httpStatus.CREATED,
        message:'user registered successfully',
        data: {
            user
        }
    })
})


export const userController = {
    registerUser
}