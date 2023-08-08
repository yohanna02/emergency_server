import mongoose from "mongoose";
import { User } from "../interface/types";

const schema = new mongoose.Schema<User>({
    fullName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
});

const model = mongoose.model<User>("user", schema);
export default model;