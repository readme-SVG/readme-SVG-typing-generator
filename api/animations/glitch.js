module.exports = (ctx) => {
    const { lines, textX, textAnchor, commonStyle, repeat, lineDurS, sequenceOpacity, lineY, escapeXml } = ctx;
    return lines.map((line, i) => `<g opacity="0">
        ${sequenceOpacity(i)}
        <text x="${textX}" y="${lineY(i)}" text-anchor="${textAnchor}" style="${commonStyle}" fill="red" opacity="0.4">
            <animateTransform attributeName="transform" type="translate" values="2,0;-2,0;2,1;-2,-1;0,0" dur="${Math.max(0.25, lineDurS * 0.25)}s" begin="${(i * ctx.slotS).toFixed(3)}s" repeatCount="${repeat ? 'indefinite' : '1'}" />
            ${escapeXml(line)}
        </text>
        <text x="${textX}" y="${lineY(i)}" text-anchor="${textAnchor}" style="${commonStyle}" fill="cyan" opacity="0.4">
            <animateTransform attributeName="transform" type="translate" values="-2,0;2,0;-2,-1;2,1;0,0" dur="${Math.max(0.25, lineDurS * 0.25)}s" begin="${(i * ctx.slotS).toFixed(3)}s" repeatCount="${repeat ? 'indefinite' : '1'}" />
            ${escapeXml(line)}
        </text>
        <text x="${textX}" y="${lineY(i)}" text-anchor="${textAnchor}" style="${commonStyle}" opacity="0.9">
            <animateTransform attributeName="transform" type="translate" values="0,0;1,0;-1,0;0,1;0,0" dur="${Math.max(0.35, lineDurS * 0.35)}s" begin="${(i * ctx.slotS).toFixed(3)}s" repeatCount="${repeat ? 'indefinite' : '1'}" />
            ${escapeXml(line)}
        </text>
    </g>`).join('');
};
