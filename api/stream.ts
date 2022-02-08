import { Handler } from "express";
import ytdl from "ytdl-core";
import { promises as fs } from "fs";
// import { authenticateToken } from "../services/auth";

export const useStreamRoute: () => Handler = () => async (req, res) => {
    // let id: string | undefined;
    // let token: string | undefined;

    // try {
    //     const payload = JSON.parse(Buffer.from(req.params.payload, "base64").toString("utf-8"));
    //     token = payload.token;
    //     id = payload.id;
    // } catch (err) {
    //     return res.status(401).json({
    //         success: false,
    //         message: "Malformed request payload."
    //     })
    // }

    // if (!id || !token) {
    //     return res.status(401).json({
    //         success: false,
    //         message: "Malformed request payload."
    //     });
    // }

    // try {
    //     authenticateToken(token);
    // } catch (err) {
    //     return res.status(401).json({
    //         success: false,
    //         message: "Invalid user token."
    //     });
    // }

    let id = req.params.payload;
    console.log(`Requested stream of song ${id}`);

    try {
        await fs.access(`./saves/${id}.mp3`);
        res.sendFile(`${process.cwd()}/saves/${id}.mp3`);
        console.log(`Serving downloaded song ./saves/${id}.mp3.\n---`);
    } catch (err) {
        console.log(`Starting stream of song ${id}.\n---`);
        ytdl(
            id, {
                quality: "highestaudio",
            }
        )
        .pipe(res)
        .on("end", () => console.log(`Ended stream of song ${id}.\n---`))
        .on("error", error => console.log(`Error streaming song ${id}.`, error, "\n---"));
    }
}