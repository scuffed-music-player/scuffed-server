import { Handler } from "express";
import request from "request";

export const useProxyRoute: () => Handler = () => async (req, res) => {
    console.log("Proxy request", req.params), ".";
    request.get(req.params.url).pipe(res);
}