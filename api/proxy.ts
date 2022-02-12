import { Handler } from "express";
import request from "request";

export const proxyRoute: Handler = async (req, res) => {
    console.log("Proxy request", req.params.url), ".";
    request.get(req.params.url).pipe(res);
}