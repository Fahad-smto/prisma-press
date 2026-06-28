import bcrypt from "bcryptjs";
import { prisma } from "../../lib/prisma";
import { ILogInUser } from "./auth.interface"
import config from "../../config";
import jwt, { SignOptions } from "jsonwebtoken"; 
import { jwtUtils } from "../../utils/jwt";

const loginUser =async (payload: ILogInUser)=>{

    const { email, password } = payload;

    

    const user =await prisma.user.findUniqueOrThrow({
        where: { email }
    })

    const isPassWordMatched =await bcrypt.compare(password, user.password);

    if (!isPassWordMatched) {
        throw new Error("Invalid credentials");
    }

    const jwtPayload = {
        name: user.name,
        id: user.id,
        email: user.email,
        role: user.role
    };

    // const accessToken = jwt.sign(jwtPayload, config.jwt_access_secret as string, { expiresIn: config.jwt_access_expires_in as SignOptions['expiresIn'] });

    const accessToken =jwtUtils.createToken(jwtPayload, config.jwt_access_secret as string, config.jwt_access_expires_in as SignOptions['expiresIn']);



    // const refreshToken = jwt.sign(jwtPayload, config.jwt_refresh_secret as string, { expiresIn: config.jwt_refresh_expires_in as SignOptions['expiresIn'] });

    const refreshToken = jwtUtils.createToken(jwtPayload, config.jwt_refresh_secret as string, config.jwt_refresh_expires_in as SignOptions['expiresIn']);
 
    return {
        accessToken,
        refreshToken
    };
}

export const authService = {
    loginUser
}