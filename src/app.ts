import express from "express";
import http from "http";
import ws from "ws";
import dotenv from "dotenv";
import mongoose from "mongoose";

import { Request } from "./interface/types";
import apiHandler from "./api";
import { myEmitter } from "./api/request.api";

dotenv.config();

const db_url = process.env.DB_URL || "";

mongoose.connect(db_url).then(() => {
    console.log("Connected to DB");
});

const app = express();

app.use(express.json());

app.use("/api", apiHandler);

app.use("*", (req, res) => {
    res.json({message: "router not found"});
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
