import { NextFunction, Request, Response, Router } from "express";
import { userController } from "./user.controller";
import config from "../../config";
import { Role } from "../../../generated/prisma/client";
import jwt from "jsonwebtoken";
import httpStatus from "http-status";

const router = Router();

declare global {
    namespace Express {
        interface Request {
            user?: {
                email: string;
                name: string;
                id: string;
                role: Role;
            };
        }
    }
}

router.post("/register", userController.registerUser);

router.get(
    "/me",
    (req: Request, res: Response, next: NextFunction) => {
        try {
            const { accessToken } = req.cookies;

            if (!accessToken) {
                return res
                    .status(httpStatus.UNAUTHORIZED)
                    .json({ error: "No access token provided" });
            }

            const verifiedToken = jwt.verify(
                accessToken,
                config.jwt_access_secret as string
            ) as jwt.JwtPayload;

            const { email, name, id, role } = verifiedToken as {
                email: string;
                name: string;
                id: string;
                role: Role;
            };

            const requiredRoles = [Role.ADMIN, Role.USER, Role.AUTHOR];

            if (!role || !requiredRoles.includes(role)) {
                return res
                    .status(httpStatus.FORBIDDEN)
                    .json({ error: "Access denied" });
            }

            req.user = { email, name, id, role };
            next();
        } catch (error) {
            return res
                .status(httpStatus.UNAUTHORIZED)
                .json({ error: "Invalid or expired token" });
        }
    },
    userController.getUserProfile
);

export const userRoutes = router;