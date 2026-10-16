'use strict';

// Escape text for safe interpolation into SVG/XML markup and attributes.
// User-supplied lines are rendered as SVG text nodes; without escaping a
// line such as "</text><script>...</script>" would break out of the text
// element and execute when the SVG is opened as a top-level document.
const XML_ESCAPES = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&apos;',
};

const escapeXml = (value) => String(value).replace(/[&<>"']/g, (ch) => XML_ESCAPES[ch]);

const clamp01 = (value) => Math.min(1, Math.max(0, value)).toFixed(4);

const getLineY = ({ multiline, vCenter, intHeight, intSize, linesCount, index }) => {
    if (!multiline) return vCenter ? intHeight / 2 : intHeight * 0.6;
    const lineH = intSize * 1.6;
    const totalH = linesCount * lineH;
    const startY = vCenter ? (intHeight - totalH) / 2 + intSize : intSize + 10;
    return startY + index * lineH;
};

const buildSequenceOpacity = ({ index, slotS, lineDurS, cycleDurS, repeat }) => {
    const startS = index * slotS;
    const endS = startS + lineDurS;
    const fadeS = Math.min(0.12, slotS * 0.08);
    const inS = startS + fadeS;
    const outS = Math.max(inS + 0.02, endS - fadeS);

    return `<animate attributeName="opacity"
        values="0;0;1;1;0;0"
        keyTimes="0;${clamp01(startS / cycleDurS)};${clamp01(inS / cycleDurS)};${clamp01(outS / cycleDurS)};${clamp01(endS / cycleDurS)};1"
        dur="${cycleDurS}s"
        repeatCount="${repeat ? 'indefinite' : '1'}"
        fill="freeze" />`;
};

module.exports = {
    clamp01,
    escapeXml,
    getLineY,
    buildSequenceOpacity,
};
