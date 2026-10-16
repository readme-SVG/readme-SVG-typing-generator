module.exports = (ctx) => {
    const { lines, commonStyle, intSize, lineDurS, repeat, center, intWidth, sequenceOpacity, lineY, escapeXml } = ctx;
    return lines.map((line, rowIndex) => {
        const chars = line.split('');
        const charWidth = intSize * 0.62;
        const totalW = chars.length * charWidth;
        const startX = center ? (intWidth - totalW) / 2 : 20;
        return chars.map((ch, i) => {
            const x = startX + i * charWidth;
            const beginS = rowIndex * ctx.slotS + (i / Math.max(chars.length, 1)) * lineDurS * 0.35;
            return `<text x="${x}" y="${lineY(rowIndex)}" style="${commonStyle}" opacity="0">
                ${sequenceOpacity(rowIndex)}
                <animateTransform attributeName="transform" type="translate" values="0,0;0,-${intSize * 0.4};0,0" dur="${Math.max(0.2, lineDurS * 0.45)}s" begin="${beginS.toFixed(3)}s" repeatCount="${repeat ? 'indefinite' : '1'}" />
                ${escapeXml(ch)}
            </text>`;
        }).join('');
    }).join('');
};
