import express, { Handler } from "express";
import streamify from "youtube-audio-stream";

import { WriteStream } from "./types";
import keys from "./keys.json";

const app = express();

const authenticated: Handler = (req, res, next) => {
    const [u, p] = req.params.auth?.split("-") || ([] as undefined[]);

    if (u && p && keys.users[u as keyof typeof keys.users] == p) {
        next();
    } else {
        res.status(401).json({
            success: false,
            message: "Unauthorized"
        });
    }
}

const api = express.Router();
api.use(authenticated);

app.get("/song/:id", async (req, res) => {
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

app.use("/api/:auth", api);
app.listen(6969, () => console.log("Listening on port 6969"));
