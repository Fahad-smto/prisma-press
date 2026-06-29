import bcrypt from "bcryptjs";
import jwt, { SignOptions } from "jsonwebtoken";
import { prisma } from "../../lib/prisma";
import { ILogInUser } from "./auth.interface";
import config from "../../config";
import { jwtUtils } from "../../utils/jwt";

const loginUser = async (payload: ILogInUser) => {
    const { email, password } = payload;

    const user = await prisma.user.findUniqueOrThrow({
        where: { email }
    });

    const isPasswordMatched = await bcrypt.compare(password, user.password);

    if (!isPasswordMatched) {
        throw new Error("Invalid credentials");
    }

    const jwtPayload = {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
    };

    const accessToken = jwtUtils.createToken(
        jwtPayload,
        config.jwt_access_secret as string,
        config.jwt_access_expires_in as SignOptions['expiresIn']
    );

    const refreshToken = jwtUtils.createToken(
        jwtPayload,
        config.jwt_refresh_secret as string,
        config.jwt_refresh_expires_in as SignOptions['expiresIn']
    );

    return {
        accessToken,
        refreshToken
    };
};

const refreshToken = async (token: string) => {
    const verifiedResult = jwtUtils.verifyToken(token, config.jwt_refresh_secret as string);

    if (!verifiedResult.success || !verifiedResult.data) {
        throw new Error("Invalid refresh token");
    }

    const { id } = verifiedResult.data;

    const user = await prisma.user.findUniqueOrThrow({
        where: { id }
    });

    if (user.activeStatus === 'BLOCKED') {
        throw new Error('User is blocked');
    }

    const jwtPayload = {
        id,
        name: user.name,
        email: user.email,
        role: user.role
    };

    const accessToken = jwtUtils.createToken(
        jwtPayload,
        config.jwt_access_secret as string,
        config.jwt_access_expires_in as SignOptions['expiresIn']
    );

    return { accessToken };
};

export const authService = {
    loginUser,
    refreshToken
};