import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

import userModel from "../../model/user.model";
import { User } from "../../interface/types";

dotenv.config();

const register = async (req: Request, res: Response) => {
    try {
        const body = req.body as User;
        const user = await userModel.findOne({ email: body.email });

        if (user) {
            res.status(500).json({success: false, message: "Email address already in use"});    
            return;
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(body.password, salt);
        
        const newUser = new userModel({
            fullName: body.fullName,
            email: body.email,
            password: hashedPassword
        });

        const savedUser = await newUser.save();

        const secret = process.env.JWT_SECRET || "";
        const token = jwt.sign(savedUser.id, secret);
        res.json({success: true, token});
    } catch (err) {
        res.status(500).json({success: false, message: "An Error occured"});
    }
};

export default register;