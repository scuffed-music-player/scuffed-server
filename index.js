const streamify = require("youtube-audio-stream");
const express = require("express");

const app = express();

app.get("/", (req, res) => res.sendFile(`${__dirname}/app/index.html`));

app.get("/song/:id", async (req, res) => {
    try {
        for await (const chunk of streamify(`http://youtube.com/watch?v=${req.params.id}`)) {
            res.write(chunk);
        }
        res.end("Song finished!")
    } catch (err) {
        if (!res.headersSent) {
            res.writeHead(500);
            res.end("Something goofed! Maybe that song doesn't exist?");
        }
    }
});

app.listen(6969, () => console.log("Listening on port 6969"));
