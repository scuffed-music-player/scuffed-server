import express from "express";
import cors from "cors";
import { promises as fs } from "fs";

import { streamRoute } from "./api/stream";
import { searchRoute } from "./api/search";
import { downloadRoute } from "./api/download";
import { proxyRoute } from "./api/proxy";
import { playlistRoutes } from "./api/playlists";

const init = async () => {
    try {
        await fs.access(`${process.cwd()}/data`);
    } catch (error) {
        await fs.mkdir(`${process.cwd()}/data`);
    }

    const app = express();
    app.use(express.json());
    app.use(cors());

    app.get("/", (req, res) => res.status(200).json({
        success: true,
        message: "Root of the streaming server! Useful endpoints are at /api <3"
    }));

    const api = express.Router();

    api.get("/stream/:id", streamRoute);
    api.get("/download/:id", downloadRoute);
    api.get("/search/:query", searchRoute);
    api.get("/proxy/:url", proxyRoute);
    api.use("/playlists", playlistRoutes);

    app.use("/api", api);

    const PORT = process.env.PORT || 8080;
    app.listen(PORT, () => console.log(`Started streaming server on port ${PORT}!\n---`));
}

init();