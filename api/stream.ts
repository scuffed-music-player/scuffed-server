import { Handler } from "express";
import ytdl from "ytdl-core";
// import { authenticateToken } from "../services/auth";

export const useStreamRoute: () => Handler = () => (req, res) => {
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

    ytdl(
        id, {
            quality: "highestaudio",
        }
    )
    .pipe(res)
    .on("error", console.log);
}