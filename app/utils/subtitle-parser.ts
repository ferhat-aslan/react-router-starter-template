// Subtitle entry structure
export interface SubtitleEntry {
    index: number;
    startTime: string;
    endTime: string;
    text: string;
    style?: string; // For ASS format
}

export type SubtitleFormat = 'srt' | 'vtt' | 'ass';

// Parse time string to milliseconds
function parseTime(timeStr: string, format: SubtitleFormat): number {
    if (format === 'srt' || format === 'vtt') {
        // Format: 00:00:00,000 (SRT) or 00:00:00.000 (VTT)
        const parts = timeStr.replace(',', '.').split(':');
        const hours = parseInt(parts[0]);
        const minutes = parseInt(parts[1]);
        const secondsParts = parts[2].split('.');
        const seconds = parseInt(secondsParts[0]);
        const milliseconds = parseInt(secondsParts[1] || '0');
        return hours * 3600000 + minutes * 60000 + seconds * 1000 + milliseconds;
    } else if (format === 'ass') {
        // Format: 0:00:00.00 (centiseconds)
        const parts = timeStr.split(':');
        const hours = parseInt(parts[0]);
        const minutes = parseInt(parts[1]);
        const secondsParts = parts[2].split('.');
        const seconds = parseInt(secondsParts[0]);
        const centiseconds = parseInt(secondsParts[1] || '0');
        return hours * 3600000 + minutes * 60000 + seconds * 1000 + centiseconds * 10;
    }
    return 0;
}

// Format milliseconds to time string
function formatTime(ms: number, format: SubtitleFormat): string {
    const hours = Math.floor(ms / 3600000);
    const minutes = Math.floor((ms % 3600000) / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    const remainder = ms % 1000;

    if (format === 'srt') {
        return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')},${String(remainder).padStart(3, '0')}`;
    } else if (format === 'vtt') {
        return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}.${String(remainder).padStart(3, '0')}`;
    } else if (format === 'ass') {
        const centiseconds = Math.floor(remainder / 10);
        return `${hours}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}.${String(centiseconds).padStart(2, '0')}`;
    }
    return '';
}

// Parse SRT format
function parseSRT(content: string): SubtitleEntry[] {
    const entries: SubtitleEntry[] = [];
    const blocks = content.trim().split(/\n\s*\n/);

    for (const block of blocks) {
        const lines = block.trim().split('\n');
        if (lines.length < 3) continue;

        const index = parseInt(lines[0]);
        const timeLine = lines[1];
        const timeMatch = timeLine.match(/(\d{2}:\d{2}:\d{2},\d{3})\s*-->\s*(\d{2}:\d{2}:\d{2},\d{3})/);

        if (timeMatch) {
            const startTime = timeMatch[1];
            const endTime = timeMatch[2];
            const text = lines.slice(2).join('\n');

            entries.push({ index, startTime, endTime, text });
        }
    }

    return entries;
}

// Parse VTT format
function parseVTT(content: string): SubtitleEntry[] {
    const entries: SubtitleEntry[] = [];
    const lines = content.split('\n');

    // Skip WEBVTT header
    let i = 0;
    while (i < lines.length && !lines[i].includes('-->')) {
        i++;
    }

    let index = 1;
    while (i < lines.length) {
        const line = lines[i].trim();

        if (line.includes('-->')) {
            const timeMatch = line.match(/(\d{2}:\d{2}:\d{2}\.\d{3})\s*-->\s*(\d{2}:\d{2}:\d{2}\.\d{3})/);

            if (timeMatch) {
                const startTime = timeMatch[1];
                const endTime = timeMatch[2];
                const textLines: string[] = [];

                i++;
                while (i < lines.length && lines[i].trim() !== '') {
                    textLines.push(lines[i]);
                    i++;
                }

                const text = textLines.join('\n');
                entries.push({ index, startTime, endTime, text });
                index++;
            }
        }
        i++;
    }

    return entries;
}

// Parse ASS format
function parseASS(content: string): SubtitleEntry[] {
    const entries: SubtitleEntry[] = [];
    const lines = content.split('\n');

    let inEvents = false;
    let formatLine = '';

    for (const line of lines) {
        const trimmed = line.trim();

        if (trimmed === '[Events]') {
            inEvents = true;
            continue;
        }

        if (trimmed.startsWith('[') && trimmed !== '[Events]') {
            inEvents = false;
            continue;
        }

        if (inEvents && trimmed.startsWith('Format:')) {
            formatLine = trimmed.substring(7).trim();
            continue;
        }

        if (inEvents && trimmed.startsWith('Dialogue:')) {
            const dialoguePart = trimmed.substring(9).trim();
            const parts = dialoguePart.split(',');

            if (parts.length >= 10) {
                // ASS format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text
                const startTime = parts[1].trim();
                const endTime = parts[2].trim();
                const style = parts[3].trim();
                const text = parts.slice(9).join(',').trim();

                entries.push({
                    index: entries.length + 1,
                    startTime,
                    endTime,
                    text,
                    style
                });
            }
        }
    }

    return entries;
}

// Write SRT format
function writeSRT(entries: SubtitleEntry[]): string {
    return entries.map((entry, idx) => {
        return `${idx + 1}\n${entry.startTime} --> ${entry.endTime}\n${entry.text}\n`;
    }).join('\n');
}

// Write VTT format
function writeVTT(entries: SubtitleEntry[]): string {
    const header = 'WEBVTT\n\n';
    const body = entries.map((entry) => {
        return `${entry.startTime} --> ${entry.endTime}\n${entry.text}\n`;
    }).join('\n');
    return header + body;
}

// Write ASS format
function writeASS(entries: SubtitleEntry[]): string {
    const header = `[Script Info]
Title: Converted Subtitle
ScriptType: v4.00+

[V4+ Styles]
Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding
Style: Default,Arial,20,&H00FFFFFF,&H000000FF,&H00000000,&H00000000,0,0,0,0,100,100,0,0,1,2,2,2,10,10,10,1

[Events]
Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text
`;

    const body = entries.map((entry) => {
        const style = entry.style || 'Default';
        return `Dialogue: 0,${entry.startTime},${entry.endTime},${style},,0,0,0,,${entry.text}`;
    }).join('\n');

    return header + body;
}

// Detect subtitle format
export function detectFormat(content: string): SubtitleFormat | null {
    const trimmed = content.trim();

    if (trimmed.startsWith('WEBVTT')) {
        return 'vtt';
    }

    if (trimmed.includes('[Script Info]') || trimmed.includes('[Events]')) {
        return 'ass';
    }

    // Check for SRT pattern (number followed by timestamp)
    if (/^\d+\s*\n\d{2}:\d{2}:\d{2},\d{3}\s*-->\s*\d{2}:\d{2}:\d{2},\d{3}/m.test(trimmed)) {
        return 'srt';
    }

    return null;
}

// Parse subtitle file
export function parseSubtitle(content: string, format?: SubtitleFormat): SubtitleEntry[] {
    const detectedFormat = format || detectFormat(content);

    if (!detectedFormat) {
        throw new Error('Unable to detect subtitle format');
    }

    switch (detectedFormat) {
        case 'srt':
            return parseSRT(content);
        case 'vtt':
            return parseVTT(content);
        case 'ass':
            return parseASS(content);
        default:
            throw new Error(`Unsupported format: ${detectedFormat}`);
    }
}

// Write subtitle file
export function writeSubtitle(entries: SubtitleEntry[], format: SubtitleFormat): string {
    switch (format) {
        case 'srt':
            return writeSRT(entries);
        case 'vtt':
            return writeVTT(entries);
        case 'ass':
            return writeASS(entries);
        default:
            throw new Error(`Unsupported format: ${format}`);
    }
}

// Convert between formats
export function convertSubtitle(
    content: string,
    fromFormat: SubtitleFormat,
    toFormat: SubtitleFormat
): string {
    const entries = parseSubtitle(content, fromFormat);

    // Convert time formats if needed
    if (fromFormat !== toFormat) {
        entries.forEach(entry => {
            const startMs = parseTime(entry.startTime, fromFormat);
            const endMs = parseTime(entry.endTime, fromFormat);
            entry.startTime = formatTime(startMs, toFormat);
            entry.endTime = formatTime(endMs, toFormat);
        });
    }

    return writeSubtitle(entries, toFormat);
}
