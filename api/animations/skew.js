module.exports = (ctx) => {
    const { lines, textX, textAnchor, commonStyle, repeat, lineDurS, sequenceOpacity, lineY, slotS, escapeXml } = ctx;

    return lines.map((line, i) => {
        const beginS = (i * slotS).toFixed(3);
        return `<text x="${textX}" y="${lineY(i)}" text-anchor="${textAnchor}" style="${commonStyle}" opacity="0">
            ${sequenceOpacity(i)}
            <animateTransform attributeName="transform" type="skewX" values="0;14;-10;0" dur="${Math.max(0.35, lineDurS * 0.65)}s" begin="${beginS}s" repeatCount="${repeat ? 'indefinite' : '1'}" />
            ${escapeXml(line)}
        </text>`;
    }).join('');
};
