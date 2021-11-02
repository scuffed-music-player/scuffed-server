import express, { Handler } from "express";
import cors from "cors";
import keys from "./keys.json";
import ytdl from "ytdl-core";
import { google } from "googleapis";

const app = express();

app.use(cors());

const api = express.Router();

const youtube = google.youtube({
    version: "v3",
    auth: keys.YOUTUBE_KEY
});

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
    ytdl(req.params.id, {
        quality: "highestaudio",
    }).pipe(res).on("error", console.log);
});

api.get("/data/:query", async (req, res) => {
    //@ts-ignore
    const searchResponse = await youtube.search.list({
        q: req.params.query,
        part: "id,snippet",
        maxResults: 1
    });

    res.status(200).json(searchResponse.data.items?.[0]);
});

app.use("/api", api);
app.listen(6969, () => console.log("Listening on port 6969"));
