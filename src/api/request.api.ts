import { Router } from "express";
import { EventEmitter } from "events";

import requestModel from "../model/request.model";
import { Request } from "../interface/types";

class MyEmitter extends EventEmitter { }

export const myEmitter = new MyEmitter();

const router = Router();

router.get("/api/requests", async (req, res) => {
    try {
        const requests = await requestModel.find({ resolved: false });

        res.json(requests);
    } catch (err) {
        res.status(500).json({ success: false, message: "Error Fetching requests" });
    }
});

router.put("/api/resolve", async (req, res) => {
    try {
        const { requestId } = req.body as { requestId: string };
        const request = await requestModel.findById(requestId);

        if (!request) {
            res.status(404).json({success: false, message: "Invalid request Id"});
            return;
        }

        request.resolved = true;
        await request.save();

        res.json({success: true, message: "Request resolved successfully"});
    } catch (err) {
        res.status(500).json({ success: false, message: "Error resolving request" });
    }
});

router.post("/api/request", async (req, res) => {
    const { latitude, longitude, userId, note } = req.body as Request;

    const newRequest = new requestModel({
        latitude,
        longitude,
        userId,
        note
    });

    try {
        await newRequest.save();
        res.json({ success: true, message: "Request made successfully" });
        myEmitter.emit("request", {
            latitude,
            longitude,
            userId,
            note
        });
    } catch (err) {
        res.status(500).json({ success: false, message: "Error making request" });
    }
});

export default router;