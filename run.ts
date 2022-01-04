import server from "./";
const port = process.env.PORT || 6969;

server().then((app) => {
    app.listen(6969, () => console.log("Started dev server at port " + port));
});