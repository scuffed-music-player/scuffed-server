import { WriteStream as s } from "fs";

export interface WriteStream extends s {
    [Symbol.asyncIterator](): AsyncIterator<number>;
}