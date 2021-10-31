import express, { Handler } from "express";
import streamify from "youtube-audio-stream";

import { WriteStream } from "./types";
import keys from "./keys.json";

const app = express();

const api = express.Router();

const authorized: Handler = (req, res, next) => {
    // console.log(req.params);
    const [u, p] = req.params.auth?.split("$") || ([] as undefined[]);

    if (u && p && keys.users[u as keyof typeof keys.users] == p) {
        next();
    } else {
        res.status(401).json({
            success: false,
            message: "Unauthorized",
            u, p
        });
    }
};

api.get("/stream/:id", async (req, res) => {
    console.log(req.params);
    try {
        for await (const chunk of streamify(`http://youtube.com/watch?v=${req.params.id}`) as WriteStream) {
            res.write(chunk);
        }
        res.status(200).json({
            success: true,
            message: "Song finished!"
        }).end();
    } catch (err) {
        if (!res.headersSent) {
            res.status(500).json({
                success: false,
                message: "Something goofed! Maybe that song doesn't exist?"
            }).end();
        }
    }
});

app.use("/api", api);
app.listen(6969, () => console.log("Listening on port 6969"));
