import server from "./";
const port = process.env.PORT || 8080;

server().then((app) => {
    app.listen(port, () => console.log("Started dev server at port " + port));
});