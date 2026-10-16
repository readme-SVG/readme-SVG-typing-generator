module.exports = (ctx) => {
    const { lines, textX, textAnchor, commonStyle, repeat, lineDurS, intSize, sequenceOpacity, lineY, escapeXml } = ctx;
    return lines.map((line, i) => `<text x="${textX}" y="${lineY(i)}" text-anchor="${textAnchor}" style="${commonStyle}" opacity="0">
        ${sequenceOpacity(i)}
        <animateTransform attributeName="transform" type="translate" values="0,${Math.round(intSize * 0.7)};0,0;0,0;0,-${Math.round(intSize * 0.5)}" keyTimes="0;0.2;0.8;1" dur="${lineDurS}s" begin="${(i * ctx.slotS).toFixed(3)}s" repeatCount="${repeat ? 'indefinite' : '1'}" />
        ${escapeXml(line)}
    </text>`).join('');
};
