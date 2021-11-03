import { Handler } from "express";
import ytdl from "ytdl-core";

export const useStreamRoute: () => Handler = () => (req, res) => ytdl(
        req.params.id, {
            quality: "highestaudio",
        }
    )
    .pipe(res)
    .on("error", console.log);