module.exports = (ctx) => {
    const { lines, textX, textAnchor, commonStyle, repeat, lineDurS, intWidth, sequenceOpacity, lineY, escapeXml } = ctx;
    return lines.map((line, i) => {
        const y = lineY(i);
        const cx = intWidth / 2;
        return `<text x="${textX}" y="${y}" text-anchor="${textAnchor}" style="${commonStyle}" opacity="0">
        ${sequenceOpacity(i)}
        <animateTransform attributeName="transform" type="rotate" values="90 ${cx} ${y};0 ${cx} ${y};0 ${cx} ${y};-90 ${cx} ${y}" keyTimes="0;0.1;0.8;1" dur="${lineDurS}s" begin="${(i * ctx.slotS).toFixed(3)}s" repeatCount="${repeat ? 'indefinite' : '1'}" fill="freeze" />
        ${escapeXml(line)}
    </text>`;
    }).join('');
};
