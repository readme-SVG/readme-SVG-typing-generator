module.exports = (ctx) => {
    const { lines, textX, textAnchor, commonStyle, repeat, lineDurS, sequenceOpacity, lineY, slotS, escapeXml } = ctx;
    return lines.map((line, i) => {
        const beginS = (i * slotS).toFixed(3);
        return `<text x="${textX}" y="${lineY(i)}" text-anchor="${textAnchor}" style="${commonStyle}" opacity="0" transform="scale(0.6)">
            ${sequenceOpacity(i)}
            <animateTransform attributeName="transform" type="scale" values="0.6;1.12;1" dur="${Math.max(0.2, lineDurS * 0.5)}s" begin="${beginS}s" additive="replace" repeatCount="${repeat ? 'indefinite' : '1'}" />
            ${escapeXml(line)}
        </text>`;
    }).join('');
};
