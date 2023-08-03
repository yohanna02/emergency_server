import express from "express";
import http from "http";
import ws from "ws";
import dotenv from "dotenv";
import mongoose from "mongoose";
import { EventEmitter } from "events";

import requestModel from "./model/request.model";
import { Request } from "./model/request.model";

dotenv.config();

class MyEmitter extends EventEmitter {}

const myEmitter = new MyEmitter();

const db_url = process.env.DB_URL || "";

mongoose.connect(db_url).then(() => {
    console.log("Connected to DB");
});

const app = express();

app.use(express.json());

app.get("/api/requests", async (req, res) => {
    const requests = requestModel.find();

    res.json(requests);
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
        res.json({success: true, message: "Request made successfully"});
        myEmitter.emit("request", {
            latitude,
            longitude,
            userId,
            note
        });
    } catch (err) {
        res.status(500).json({success: false, message: "Error making request"});
    }
});

const server = http.createServer(app);

const port = process.env.PORT || 3000;

server.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

const webSocketServer = new ws.Server({server});

webSocketServer.on("connection", (ws) => {
    console.log("Web socket connected");

    myEmitter.on("request", (request: Request) => {
        ws.send(JSON.stringify({
            event: "request",
            data: request
        }));
    });
});
