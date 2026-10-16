module.exports = (ctx) => {
    const { lines, textX, textAnchor, commonStyle, repeat, lineDurS, intSize, sequenceOpacity, lineY, escapeXml } = ctx;
    return lines.map((line, i) => `<text x="${textX}" y="${lineY(i)}" text-anchor="${textAnchor}" style="${commonStyle}" opacity="0">
        ${sequenceOpacity(i)}
        <animateTransform attributeName="transform" type="translate" values="0,0;0,-${Math.round(intSize * 0.45)};0,0;0,-${Math.round(intSize * 0.18)};0,0" keyTimes="0;0.25;0.5;0.75;1" dur="${lineDurS}s" begin="${(i * ctx.slotS).toFixed(3)}s" repeatCount="${repeat ? 'indefinite' : '1'}" />
        ${escapeXml(line)}
    </text>`).join('');
};
