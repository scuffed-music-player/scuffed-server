import { Handler } from "express";
import { youtube } from "scrape-youtube";
import { Db } from "mongodb";
import { ISongData } from "../typings";

type ReturnType = (db: Db) => Handler;

export const useDataRoute: ReturnType = (db) => {
    // const searches = db.collection<ISongData & { query: string, fromDb: true }>("searches");

    return async (req, res) => {
        try {
            const query = req.params.query.toLowerCase().trim();

            const searchResults = await youtube.search(query);
            const target = searchResults.videos[0];

            const final: ISongData = {
                id: target.id,
                title: target.title,
                thumbnail: target.thumbnail
            };

            return res.status(200).json({
                success: true,
                song: final
            });
        } catch (err) {
            return res.status(500).json({
                success: false,
                message: "Lol idk something didnt work search something else?"
            });
        }
    };
 
    // return async (req, res) => {
    //     const query = req.params.query.toLowerCase().trim();

    //     // First search database if it's saved:
    //     const dbResult = await searches.findOne({
    //         query
    //     });

    //     if (dbResult) {
    //         return res.status(200).json({
    //             success: true,
    //             song: dbResult
    //         });
    //     }
        
    //     //@ts-ignore
    //     const searchResponse = await youtube.search.list({
    //         q: query,
    //         part: "id,snippet",
    //         maxResults: 1
    //     });
    
    //     // Use API call and save it to DB for later:
    //     //@ts-ignore
    //     const target = searchResponse.data.items?.[0];
        
    //     if (target && target.id?.videoId && target.snippet) {
    //         const final: ISongData = {
    //             title: target.snippet.title || "song lol",
    //             thumbnail: (target.snippet.thumbnails?.high || target.snippet.thumbnails?.default)?.url || "",
    //             id: target.id.videoId
    //         }

    //         await searches.insertOne({
    //             ...final,
    //             query,
    //             fromDb: true
    //         });

    //         return res.status(200).json({
    //             success: true,
    //             song: final
    //         });
    //     } else {
    //         return res.status(404).json({
    //             success: false,
    //             message: "No songs by that search query"
    //         });
    //     }
    // }
}