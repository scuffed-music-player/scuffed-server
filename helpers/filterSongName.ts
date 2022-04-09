const flags = [
    ["&quot;", "\""],
    ["&amp;", "&"],
    "[official audio]",
    "(official audio)",
    "full song",
    "(audio)",
    ["&#39;", "'"],
    "(lyrics)",
    "(official music video)",
    "(official music audio)",
    "(official lyric video)",
    "(lyric video)",
    "(official)",
    "(pseudo video)",
    "(official video)",
    "(music video)",
    "()",
    "[]",
    "「amv」",
    "[amv]",
    "[official lyric video]",
    "「 amv 」",
    "⠀",
    "[lyrics / amv]"
];

const recursivelyRemoveDoubleSpaces = (q: string): string => {
    if (q.includes("  ")) {
        return recursivelyRemoveDoubleSpaces(q.replaceAll("  ", " "));
    } else {
        return q;
    }
};

export const filterSongName = (name: string | null) => {
    if (!name) return "lmao idk song lol";

    let n = name.toLowerCase();
    flags.forEach(flag => {
        const replaceArgs: [string, string] = Array.isArray(flag) ? [flag[0], flag[1]] : [flag, ""];
        n = n.replaceAll(...replaceArgs);
    });

    return recursivelyRemoveDoubleSpaces(n).trim();
}