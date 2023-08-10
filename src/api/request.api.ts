import { Router } from "express";
import { EventEmitter } from "events";

import requestModel from "../model/request.model";
import { Request } from "../interface/types";
import isAuth from "../middlewares/isAuth";

class MyEmitter extends EventEmitter { }

export const myEmitter = new MyEmitter();

const router = Router();

router.get("/", async (req, res) => {
    try {
        isAuth(req, res, async () => {
            const select = req.query.select;
            if (res.locals.user) {
                const user = res.locals.user;
                const requestdNotResolved = await requestModel.find({ resolved: false, userId: user.id });
                if (select === "all") {
                    const requestdResolved = await requestModel.find({ resolved: true, userId: user.id });
        
                    res.json({ requestdNotResolved, requestdResolved });
                    return;
                }
                res.json(requestdNotResolved);
                return;
            }
            
            
            const requestdNotResolved = await requestModel.find({ resolved: false });
            if (select === "all") {
                const requestdResolved = await requestModel.find({ resolved: true });
    
                res.json({ requestdNotResolved, requestdResolved });
                return;
            }
            res.json(requestdNotResolved);
        }, {respond: false});


    } catch (err) {
        res.status(500).json({ success: false, message: "Error Fetching requests" });
    }
});

router.put("/resolve", async (req, res) => {
    try {
        const { requestId } = req.body as { requestId: string };
        const request = await requestModel.findById(requestId);

        if (!request) {
            res.status(404).json({ success: false, message: "Invalid request Id" });
            return;
        }

        request.resolved = true;
        await request.save();

        res.json({ success: true, message: "Request resolved successfully" });
    } catch (err) {
        res.status(500).json({ success: false, message: "Error resolving request" });
    }
});

router.post("/", isAuth, async (req, res) => {
    const { latitude, longitude, note } = req.body as Request;
    const userId = res.locals.user.id;

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