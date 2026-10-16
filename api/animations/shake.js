module.exports = (ctx) => {
    const { lines, textX, textAnchor, commonStyle, repeat, lineDurS, sequenceOpacity, lineY, escapeXml } = ctx;
    return lines.map((line, i) => `<text x="${textX}" y="${lineY(i)}" text-anchor="${textAnchor}" style="${commonStyle}" opacity="0">
        ${sequenceOpacity(i)}
        <animateTransform attributeName="transform" type="translate" values="0,0;-2,1;2,-1;-3,2;3,-2;-2,1;2,-1;0,0" dur="${Math.max(0.35, lineDurS * 0.22)}s" begin="${(i * ctx.slotS).toFixed(3)}s" repeatCount="${repeat ? 'indefinite' : '1'}" />
        ${escapeXml(line)}
    </text>`).join('');
};
