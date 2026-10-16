module.exports = (ctx) => {
    const { lines, textX, textAnchor, commonStyle, repeat, lineDurS, intSize, sequenceOpacity, lineY, slotS, escapeXml } = ctx;
    const offset = (intSize * 0.4).toFixed(2);

    return lines.map((line, i) => {
        const beginS = (i * slotS).toFixed(3);
        return `<text x="${textX}" y="${lineY(i)}" text-anchor="${textAnchor}" style="${commonStyle}" opacity="0">
            ${sequenceOpacity(i)}
            <animateTransform attributeName="transform" type="translate" values="0,${offset};0,-${offset};0,${offset}" dur="${Math.max(0.5, lineDurS * 0.9)}s" begin="${beginS}s" repeatCount="${repeat ? 'indefinite' : '1'}" />
            ${escapeXml(line)}
        </text>`;
    }).join('');
};
