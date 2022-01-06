import typescript from "@rollup/plugin-typescript";
// import commonjs from "@rollup/plugin-commonjs";
// import json from "@rollup/plugin-json";
// import { nodeResolve } from "@rollup/plugin-node-resolve";

export default {
    input: "./index.ts",
    plugins: [
        // commonjs(),
        // json(),
        // nodeResolve(), 
        typescript({
            module: "esnext",
            include: '**/*.{ts,js}'
        })
    ],
    output: {
        dir: "dist",
        format: "cjs"
    },
};