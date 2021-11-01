import express, { Handler } from "express";
import cors from "cors";
import keys from "./keys.json";
import ytdl from "ytdl-core";

const app = express();

app.use(cors());

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
    const path = `${__dirname}/static/${req.params.id}.mp3`;
    console.log(path);

    ytdl(req.params.id, {
        quality: "highestaudio",
    }).pipe(res);
});

app.use("/api", api);
app.listen(6969, () => console.log("Listening on port 6969"));
