import bcrypt from "bcryptjs";
import { prisma } from "../../lib/prisma";
import { ILogInUser } from "./auth.interface"
import config from "../../config";
import jwt, { SignOptions } from "jsonwebtoken"; 

const loginUser =async (payload: ILogInUser)=>{

    const { email, password } = payload;

    const user =await prisma.user.findUniqueOrThrow({
        where: { email }
    })

    const isPassWordMatched =await bcrypt.compare(password, user.password);

    if (!isPassWordMatched) {
        throw new Error("Invalid credentials");
    }

    const accessToken = jwt.sign({ id: user.id, email: user.email ,role: user.role}, config.jwt_access_secret as string, { expiresIn: config.jwt_access_expires_in as SignOptions['expiresIn'] });


    const refreshToken = jwt.sign({ id: user.id, email: user.email ,role: user.role}, config.jwt_refresh_secret as string, { expiresIn: config.jwt_refresh_expires_in as SignOptions['expiresIn'] });
 
    return {
        accessToken,
        refreshToken
    };
}

export const authService = {
    loginUser
}