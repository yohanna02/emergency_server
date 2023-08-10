import mongoose from "mongoose";

import { Request } from "../interface/types";

const schema = new mongoose.Schema<Request>({
    longitude: {
        type: Number,
        required: true
    },
    latitude: {
        type: Number,
        required: true
    },
    note: {
        type: String
    },
    userId: {
        type: String,
        required: true
    },
    resolved: {
        type: Boolean,
        default: false
    }
}, {timestamps: true});

const model = mongoose.model<Request>("request", schema);
export default model;