import { promises as fs } from "fs";
import { pathExists } from "./pathExists";

export const makeDirectory = async (path: string) => {
    if (!(await pathExists(path))) {
        await fs.mkdir(`${process.cwd()}${path}`, { recursive: true });
    }
}
