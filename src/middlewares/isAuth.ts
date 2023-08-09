import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

import userModel from "../model/user.model";

dotenv.config();

export default async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];
        const JWT_SECRET = process.env.JWT_SECRET as string;

        if (token) {
            const decodedToken: any = jwt.verify(token, JWT_SECRET);

            if (decodedToken) {
                const user = await userModel.findById(decodedToken);
                if (user) {
                    res.locals.user = user;
                    next();
                    return;
                }
            }
        }
        res.status(401).json({ succuss: true, message: "Unauthorized" });
    } catch (err) {
        res.status(500).json({ succuss: true, message: "An Error occured" });
    }
}