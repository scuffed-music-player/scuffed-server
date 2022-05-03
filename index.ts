import express from "express";

import { streamRoute } from "./api/stream";
import { searchRoute } from "./api/search";
import { playlistRoutes } from "./api/playlists";
import { saveRoutes } from "./api/saves";
import { proxyRoute } from "./api/proxy";
import { idsRoute } from "./api/ids";

import { makeDirectory } from "./helpers/makeDirectory";

(async () => {
    await makeDirectory("/data/songs");
    await makeDirectory("/data/thumbnails");

    const app = express();
    app.use(express.json());

    const api = express.Router();
    
    api.get("/stream/:id", streamRoute);
    api.get("/search/:query", searchRoute);
    api.use("/playlists", playlistRoutes);
    api.use("/saves", saveRoutes);
    api.get("/proxy/:url", proxyRoute);
    api.post("/ids", idsRoute);

    app.use("/api", api);

    app.use("/thumbnails",
        express.static(`${process.cwd()}/data/thumbnails`));

    app.use("/", express.static(`${process.cwd()}/client/dist`));
    app.get("/", (req, res) => 
        res.sendFile(`${process.cwd()}/client/dist/index.html`)
    );
  
    const PORT = process.env.PORT || 8080;
    app.listen(PORT, () => console.log(`---\nStarted streaming server on port ${PORT}!\n---`));
})();