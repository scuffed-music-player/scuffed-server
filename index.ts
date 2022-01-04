import express, { Express } from "express";
import cors from "cors";
import dotenv from "dotenv";
import { google } from "googleapis";
import { MongoClient } from "mongodb";

import { useStreamRoute } from "./api/stream";
import { useDataRoute } from "./api/data";
import { useUploadRoute } from "./api/upload";
import { useAlbumsRoute } from "./api/albums";
import { useAlbumByIdRoute } from "./api/albums/_id";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

const youtube = google.youtube({
    version: "v3",
    auth: process.env.YOUTUBE_API_KEY
});

const dbConnectionString = `mongodb+srv://admin:${process.env.MONGODB_PASSWORD}@cluster0.uulfu.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

export default async () => new Promise<Express>(async (resolve) => {
    const client = await MongoClient.connect(dbConnectionString);
    const db = client.db("db");

    const api = express.Router();

    api.get("/data/:query", useDataRoute(db, youtube));
    api.get("/stream/:id", useStreamRoute());
    api.post("/upload", useUploadRoute(db));
    api.get("/albums", useAlbumsRoute(db));
    api.get("/albums/:id", useAlbumByIdRoute(db))

    app.use("/api", api);

    resolve(app);
});
