import { NextFunction, Request, Response, Router } from "express";
import { userController } from "./user.controller";
import config from "../../config";
import { Role } from "../../../generated/prisma/client";
import jwt from "jsonwebtoken";
import httpStatus from "http-status";
import { catchAsync } from "../../utils/catchAsync";
import { jwtUtils } from "../../utils/jwt";
import { auth } from "../../middlewares/auth";

const router = Router();

// declare global {
//     namespace Express {
//         interface Request {
//             user?: {
//                 email: string;
//                 name: string;
//                 id: string;
//                 role: Role;
//             };
//         }
//     }
// }

router.post("/register", userController.registerUser);


// const auth = () => {
//     return catchAsync(async (req: Request, res: Response, next: NextFunction) => {

//         const token = req.cookies.accessToken || req.headers.authorization?.startsWith('Bearer') ? req.headers.authorization?.split(' ')[1] : req.headers.authorization;

//         if (!token) {
//             return res.status(httpStatus.UNAUTHORIZED).json({ error: "No access token provided" });
//         }

//         const verifiedToken = jwtUtils.verifyToken(token, config.jwt_access_secret as string) as jwt.JwtPayload;

//     })
// }


router.get("/me",auth(Role.ADMIN, Role.USER, Role.AUTHOR),userController.getUserProfile);
    // (req: Request, res: Response, next: NextFunction) => {
    //     try {
    //         const { accessToken } = req.cookies;

    //         if (!accessToken) {
    //             return res
    //                 .status(httpStatus.UNAUTHORIZED)
    //                 .json({ error: "No access token provided" });
    //         }

    //         const verifiedToken = jwt.verify(
    //             accessToken,
    //             config.jwt_access_secret as string
    //         ) as jwt.JwtPayload;


    //         if (!verifiedToken.success) {
    //             throw new Error(verifiedToken.error || "Invalid token");
    //         }


    //         const { email, name, id, role } = verifiedToken as {
    //             email: string;
    //             name: string;
    //             id: string;
    //             role: Role;
    //         };

    //         const requiredRoles = [Role.ADMIN, Role.USER, Role.AUTHOR];

    //         if (!role || !requiredRoles.includes(role)) {
    //             return res
    //                 .status(httpStatus.FORBIDDEN)
    //                 .json({ error: "Access denied" });
    //         }

    //         req.user = { email, name, id, role };
    //         next();
    //     } catch (error) {
    //         return res
    //             .status(httpStatus.UNAUTHORIZED)
    //             .json({ error: "Invalid or expired token" });
    //     }
    // },
    // userController.getUserProfile


export const userRoutes = router;