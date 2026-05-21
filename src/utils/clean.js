export function removeBoilerplate(text) {
    const blacklist = [
        /DEPT\.?\s*OF\s*AIML/i,
        /JNNCE/i,
        /MACHINE\s*LEARNING\s*STUDY\s*MATERIAL/i,
        /Page\s*\d+/i,
    ];

    return text
        .split("\n")
        .filter(line =>
            !blacklist.some(pattern =>
                pattern.test(line)
            )
        )
        .join("\n");
}

export function removeRepeatedLines(text) {
    const lines = text
        .split("\n")
        .map(l => l.trim())
        .filter(Boolean);

    const freq = new Map();

    for (const line of lines) {
        freq.set(line, (freq.get(line) || 0) + 1);
    }

    const threshold = Math.ceil(lines.length * 0.3);

    const cleaned = lines.filter(line => {
        return (freq.get(line) || 0) < threshold;
    });

    return cleaned.join("\n");
}

export function cleanPdfText(text) {
    let cleaned = text;

    cleaned = removeRepeatedLines(cleaned);
    cleaned = removeBoilerplate(cleaned);

    return cleaned;
}