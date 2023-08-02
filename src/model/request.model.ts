import mongoose from "mongoose";

export interface Request {
    longitude: number,
    latitude: number,
    note?: string,
    userId: string
};

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
    }
});

const model = mongoose.model<Request>("request", schema);
export default model;