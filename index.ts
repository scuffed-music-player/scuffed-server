import express from "express";
import cors from "cors";

import { streamRoute } from "./api/stream";
import { searchRoute } from "./api/search";
import { playlistRoutes } from "./api/playlists";
import { saveRoutes } from "./api/saves";

import { makeDirectory } from "./helpers/makeDirectory";

(async () => {
    await makeDirectory("/data/songs");
    await makeDirectory("/data/thumbnails");

    const app = express();
    app.use(express.json());
    app.use(cors());

    app.get("/", (req, res) => res.status(200).json({
        success: true,
        message: "Root of the streaming server! Useful endpoints are at /api <3"
    }));

    const api = express.Router();
    api.get("/stream/:id", streamRoute);
    api.get("/search/:query", searchRoute);
    api.use("/playlists", playlistRoutes);
    api.use("/saves", saveRoutes);
    app.use("/api", api);

    app.use("/thumbnails", express.static(`${process.cwd()}/data/thumbnails`));

    const PORT = process.env.PORT || 8080;
    app.listen(PORT, () => console.log(`---\nStarted streaming server on port ${PORT}!\n---`));
})();