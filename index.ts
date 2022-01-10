import express from "express";
import cors from "cors";
import dotenv from "dotenv";
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

const dbConnectionString = `mongodb+srv://admin:${process.env.MONGO_SECRET}@cluster0.uulfu.mongodb.net/db?retryWrites=true&w=majority`;

export default async () => {
    const client = await MongoClient.connect(dbConnectionString);
    const db = client.db("db");

    app.get("/", (req, res) => res.status(200).json({
        success: true,
    }));

    const api = express.Router();

    api.get("/data/:query", useDataRoute(db));
    api.get("/stream/:id", useStreamRoute());
    api.post("/upload", useUploadRoute(db));
    api.get("/albums", useAlbumsRoute(db));
    api.get("/albums/:id", useAlbumByIdRoute(db))

    app.use("/api", api);

    app.listen(process.env.PORT || 8080, () => console.log(`Started streaming server on port ${process.env.PORT || 8080}`));
};
