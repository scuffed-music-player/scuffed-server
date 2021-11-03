import express from "express";
import cors from "cors";

import dotenv from "dotenv";
dotenv.config();

const app = express();
app.use(cors());

import { google } from "googleapis";

const youtube = google.youtube({
    version: "v3",
    auth: process.env.YOUTUBE_API_KEY
});

import { useStreamRoute } from "./api/stream";
import { useDataRoute } from "./api/data";

import { MongoClient } from "mongodb";
const dbConnectionString = `mongodb+srv://admin:${process.env.MONGODB_PASSWORD}@cluster0.uulfu.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

(async () => {
    const client = await MongoClient.connect(dbConnectionString);
    const db = client.db("db");

    const api = express.Router();

    api.get("/data/:query", useDataRoute(db, youtube));
    api.get("/stream/:id", useStreamRoute());

    app.use("/api", api);

    app.listen(6969, () => console.log("Listening on port 6969"));
})();
