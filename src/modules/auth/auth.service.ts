import bcrypt from "bcryptjs";
import { prisma } from "../../lib/prisma";
import { ILogInUser } from "./auth.interface"

const loginUser =async (payload: ILogInUser)=>{

    const { email, password } = payload;

    const user =await prisma.user.findUniqueOrThrow({
        where: { email }
    })

    const isPassWordMatched =await bcrypt.compare(password, user.password);

    if (!isPassWordMatched) {
        throw new Error("Invalid credentials");
    }

    return user;
}

export const authService = {
    loginUser
}