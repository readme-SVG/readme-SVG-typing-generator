module.exports = (ctx) => {
    const { lines, textX, textAnchor, commonStyle, repeat, lineDurS, intWidth, sequenceOpacity, lineY, escapeXml } = ctx;
    const cx = intWidth / 2;
    return lines.map((line, i) => { const y = lineY(i); return `<text x="${textX}" y="${y}" text-anchor="${textAnchor}" style="${commonStyle}" transform-origin="${cx} ${y}" opacity="0">
        ${sequenceOpacity(i)}
        <animateTransform attributeName="transform" type="scale" values="0.1;1;1;2" keyTimes="0;0.2;0.7;1" additive="sum" dur="${lineDurS}s" begin="${(i * ctx.slotS).toFixed(3)}s" repeatCount="${repeat ? 'indefinite' : '1'}" />
        ${escapeXml(line)}
    </text>`; }).join('');
};
