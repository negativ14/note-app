import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { UserModel } from "../models/user.model";
import mongoose, { Types } from "mongoose";

export const authMiddleware = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
        const token = req.headers.authorization as string;
        //console.log(" ye token hai autho wala",req.headers.authorization)

        if (!token) {
            return res.status(401).json({ message: "Unauthorized: No token provided" });
        }

        const JWT_SECRET = process.env.JWT_SECRET || "NEGATIV_SECRET"
        const decoded = jwt.verify(token, JWT_SECRET);
        //console.log("decoded hai ye",decoded);

        if (!decoded || typeof decoded !== "object" || !("_id" in decoded)) {
            console.log("Invalid token");
            return res.status(403).json({ message: "Invalid token" });
        }

        const user = await UserModel.findOne({ _id: decoded._id });
        //console.log("yaha pe",user);

        if (!user) {
            return res.status(404).json({ message: "User not found" })
        }

        req.user = {
            _id: user._id as Types.ObjectId, // Explicit cast for TypeScript
            username: user.username,
            email: user.email,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        };

        next();
    } catch (error) {
        res.status(500).json({
            message: `Server side issue ${error}`
        })
    }
}