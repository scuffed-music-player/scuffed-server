import { promises as fs } from "fs";

export const pathExists = async (path: string) => {
    try {
        await fs.access(`${process.cwd()}${path}`);
        return true;
    } catch (error) {
        return false;
    }
}
