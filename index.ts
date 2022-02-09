import express from "express";
import cors from "cors";

import { useStreamRoute } from "./api/stream";
import { useSearchRoute } from "./api/search";
import { useDownloadRoute } from "./api/download";

const app = express();
app.use(express.json());
app.use(cors());

app.get("/", (req, res) => res.status(200).json({
    success: true,
    message: "Root of the streaming server! Useful endpoints are at /api <3"
}));

const api = express.Router();

api.get("/stream/:id", useStreamRoute());
api.get("/download/:id", useDownloadRoute());
api.get("/search/:query", useSearchRoute());

app.use("/api", api);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Started streaming server on port ${PORT}!\n---`));