import express from "express";
import http from "http";
import ws from "ws";
import dotenv from "dotenv";
import mongoose from "mongoose";
import { EventEmitter } from "events";

import requestModel from "./model/request.model";
import { Request } from "./model/request.model";

dotenv.config();

class MyEmitter extends EventEmitter { }

const myEmitter = new MyEmitter();

const db_url = process.env.DB_URL || "";

mongoose.connect(db_url).then(() => {
    console.log("Connected to DB");
});

const app = express();

app.use(express.json());

app.get("/api/requests", async (req, res) => {
    try {
        const requests = await requestModel.find({ resolved: false });

        res.json(requests);
    } catch (err) {
        res.status(500).json({ success: false, message: "Error Fetching requests" });
    }
});

app.put("/api/resolve", async (req, res) => {
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

app.post("/api/request", async (req, res) => {
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

const server = http.createServer(app);

const port = process.env.PORT || 3000;

server.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

const webSocketServer = new ws.Server({ server });

webSocketServer.on("connection", (ws) => {
    console.log("Web socket connected");

    myEmitter.on("request", (request: Request) => {
        ws.send(JSON.stringify({
            event: "request",
            data: request
        }));
    });
});
