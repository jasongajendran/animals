import fs from 'fs';

const audioFilePath = 'lib/audioEngine.ts';
let code = fs.readFileSync(audioFilePath, 'utf8');

// The lines 51 and 58 error is because I inserted monkey and frog which were already there.
// Let's just remove the first 40 lines which define the object, up to "clownfish: "
// Wait, a better way is to deduplicate the map strings.
const startIdx = code.indexOf('const ANIMAL_AUDIO_MAP: Record<string, string> = {');
const endIdx = code.indexOf('};', startIdx);
if (startIdx !== -1 && endIdx !== -1) {
    const mapStr = code.slice(startIdx, endIdx + 2);
    const lines = mapStr.split('\n');
    const seen = new Set();
    const newLines = [];
    // Go from bottom to top to keep original ones or new ones? Let's just keep the first one we see
    for (const line of lines) {
        const match = line.match(/^\s*([a-zA-Z0-9_-]+)\s*:/);
        if (match) {
            const key = match[1];
            if (!seen.has(key)) {
                seen.add(key);
                newLines.push(line);
            }
        } else {
            newLines.push(line);
        }
    }
    code = code.replace(mapStr, newLines.join('\n'));
}

fs.writeFileSync(audioFilePath, code);
