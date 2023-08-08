import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

import userModel from "../../model/user.model";
import { User } from "../../interface/types";

dotenv.config();

const login = async (req: Request, res: Response) => {
    try {
        type BodyData = Omit<User, "fullName">;
        const body = req.body as BodyData;
        const user = await userModel.findOne({ email: body.email });

        if (!user) {
            res.status(500).json({success: false, message: "Email address or password is incorrect"});    
            return;
        }

        const passwordMatch = await bcrypt.compare(body.password, user.password);
        if (!passwordMatch) {
            res.status(500).json({success: false, message: "Email address or password is incorrect"});    
            return;
        }

        const secret = process.env.JWT_SECRET || "";
        const token = jwt.sign(user.id, secret);
        res.json({success: true, token});
    } catch (err) {
        res.status(500).json({success: false, message: "An Error occured"});
    }
};

export default login;