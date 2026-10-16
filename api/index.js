'use strict';

const getAnimation = require('./animations');
const animationMap = require('./animations/index');

// Hard limits that keep a single request from forcing unbounded CPU or
// memory use (very long lines / thousands of lines produce huge SVGs).
const MAX_LINES = 50;
const MAX_LINE_LENGTH = 500;
const MAX_SEPARATOR_LENGTH = 1;

// Query values arrive as strings, but a crafted URL such as
// "?lines[]=x&lines[]=y" (or a duplicated parameter) can produce an array
// or an object. Coerce everything to a plain string before use so that
// string methods below can never throw on unexpected types.
const asString = (value, fallback = '') => {
    if (Array.isArray(value)) return value.length ? asString(value[0], fallback) : fallback;
    if (typeof value === 'string') return value;
    if (typeof value === 'number' || typeof value === 'boolean') return String(value);
    return fallback;
};

// decodeURIComponent throws URIError on malformed sequences such as
// "%E0%A4%A". Fall back to the raw value instead of crashing the request.
const safeDecode = (value) => {
    try {
        return decodeURIComponent(value);
    } catch {
        return value;
    }
};

const clampInt = (value, fallback, min, max) => {
    const parsed = parseInt(value, 10);
    return Number.isFinite(parsed) ? Math.min(Math.max(parsed, min), max) : fallback;
};

// Hex colors: strip anything that is not a hex digit (prevents breaking
// out of the fill attribute) and reject truncated/invalid lengths.
const sanitizeHex = (value, fallback, maxLength) => {
    const hex = asString(value).replace(/[^a-fA-F0-9]/g, '').slice(0, maxLength);
    return [3, 4, 6, 8].includes(hex.length) ? hex : fallback;
};

// letterSpacing is interpolated into a style attribute, so only allow the
// CSS keyword or a plain <number><unit> value. Anything else could break
// out of the attribute (e.g. '"><script>...') and inject markup.
const LETTER_SPACING_PATTERN = /^-?\d+(\.\d+)?(px|em|rem|pt|%)?$/;
const sanitizeLetterSpacing = (value) => {
    const spacing = asString(value, 'normal').trim();
    return spacing === 'normal' || LETTER_SPACING_PATTERN.test(spacing) ? spacing : 'normal';
};

const shuffle = (items) => {
    // Fisher-Yates shuffle on a copy; the caller's array stays untouched.
    const result = items.slice();
    for (let i = result.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
};

module.exports = (req, res) => {
    try {
        if (req.method && req.method !== 'GET' && req.method !== 'HEAD') {
            res.setHeader('Allow', 'GET, HEAD');
            res.status(405).send('Method Not Allowed');
            return;
        }

        const query = req.query || {};

        // The separator must be a single character; an empty or long value
        // would split the input into individual characters or behave
        // unexpectedly, so fall back to the documented default.
        const rawSeparator = asString(query.separator, ';');
        const separator = rawSeparator.length === MAX_SEPARATOR_LENGTH ? rawSeparator : ';';

        // Split first on the raw value so an encoded separator inside a
        // line is not mistaken for a line break, then decode each line.
        const rawLines = asString(query.lines, 'Hello+World!');
        let lines = rawLines
            .split(separator)
            .map((line) => safeDecode(line.replace(/\+/g, ' ')).trim().slice(0, MAX_LINE_LENGTH))
            .filter(Boolean)
            .slice(0, MAX_LINES);

        if (lines.length === 0) lines = ['Hello World!'];
        if (asString(query.random, 'false') === 'true') lines = shuffle(lines);

        const safeW = clampInt(query.width, 435, 50, 1200);
        const safeH = clampInt(query.height, 50, 20, 400);

        const animation = asString(query.animation, 'typing');
        // hasOwnProperty (not a plain lookup) so inherited keys such as
        // "constructor" or "__proto__" cannot resolve to unexpected values.
        const animType = Object.prototype.hasOwnProperty.call(animationMap, animation)
            ? animation
            : 'typing';

        const opts = {
            lines,
            color: sanitizeHex(query.color, '36BCF7', 6),
            size: clampInt(query.size, 20, 8, 120),
            duration: clampInt(query.duration, 5000, 200, 30000),
            pause: clampInt(query.pause, 1000, 0, 10000),
            width: safeW,
            height: safeH,
            font: asString(query.font, 'monospace'),
            background: sanitizeHex(query.background, '00000000', 8),
            center: asString(query.center, 'false') === 'true',
            vCenter: asString(query.vCenter, 'false') === 'true',
            multiline: asString(query.multiline, 'false') === 'true',
            letterSpacing: sanitizeLetterSpacing(query.letterSpacing),
            repeat: asString(query.repeat, 'true') !== 'false',
            random: asString(query.random, 'false') === 'true',
        };

        const svgContent = getAnimation(animType, opts);

        res.setHeader('Content-Type', 'image/svg+xml; charset=utf-8');
        // Defense in depth: even if markup injection ever slipped through,
        // the sandbox directive prevents script execution when the SVG is
        // opened directly in a browser.
        res.setHeader('Content-Security-Policy', "default-src 'none'; sandbox");
        res.setHeader('X-Content-Type-Options', 'nosniff');
        // The SVG is fully determined by the query string (except in
        // random order mode), so let browsers and CDNs cache it instead of
        // regenerating it on every README view.
        res.setHeader(
            'Cache-Control',
            opts.random ? 'no-store' : 'public, max-age=60, s-maxage=3600, stale-while-revalidate=86400'
        );

        res.send(`<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg"
     xmlns:xlink="http://www.w3.org/1999/xlink"
     width="${safeW}"
     height="${safeH}"
     viewBox="0 0 ${safeW} ${safeH}">
    ${svgContent}
</svg>`);
    } catch (err) {
        // Never leak stack traces or internal details to the client.
        console.error('Failed to generate SVG:', err);
        if (!res.headersSent) {
            res.setHeader('Content-Type', 'text/plain; charset=utf-8');
            res.status(500).send('Internal Server Error');
        }
    }
};
