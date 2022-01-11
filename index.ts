import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { MongoClient } from "mongodb";

import { useStreamRoute } from "./api/stream";
import { useDataRoute } from "./api/data";
import { useUploadRoute } from "./api/upload";
import { useAlbumsRoute } from "./api/albums";
import { useAlbumRoute } from "./api/album";
import { useLoginRoute } from "./api/login";
import { useSignupRoute } from "./api/signup";
import { authMiddleware } from "./auth";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

const dbConnectionString = `mongodb+srv://admin:${process.env.MONGO_SECRET}@cluster0.uulfu.mongodb.net/db?retryWrites=true&w=majority`;

const init = async () => {
    const client = await MongoClient.connect(dbConnectionString);
    const db = client.db("db");

    app.get("/", (req, res) => res.status(200).json({
        success: true,
        message: "Root of the streaming server! Useful endpoints are at /api <3"
    }));

    const api = express.Router();

    api.get("/stream/:id", useStreamRoute());
    api.get("/data/:query", authMiddleware, useDataRoute());
    api.post("/upload", authMiddleware, useUploadRoute(db));
    api.get("/albums", authMiddleware, useAlbumsRoute(db));
    api.get("/album", authMiddleware, useAlbumRoute(db));
    api.post("/login", useLoginRoute(db));
    api.post("/signup", useSignupRoute(db), useLoginRoute(db));

    app.use("/api", api);

    app.listen(process.env.PORT || 8080, () => console.log(`Started streaming server on port ${process.env.PORT || 8080}`));
};

init();
