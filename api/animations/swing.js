module.exports = (ctx) => {
    const { lines, textX, textAnchor, commonStyle, repeat, lineDurS, sequenceOpacity, lineY, slotS, escapeXml } = ctx;
    return lines.map((line, i) => {
        const beginS = (i * slotS).toFixed(3);
        const swingDur = Math.max(0.4, lineDurS * 0.7).toFixed(3);
        const y = lineY(i);
        return `<text x="${textX}" y="${y}" text-anchor="${textAnchor}" style="${commonStyle}" opacity="0">
            ${sequenceOpacity(i)}
            <animateTransform attributeName="transform" type="rotate" values="-4 ${textX} ${y};4 ${textX} ${y};-3 ${textX} ${y};0 ${textX} ${y}" dur="${swingDur}s" begin="${beginS}s" repeatCount="${repeat ? 'indefinite' : '1'}" />
            ${escapeXml(line)}
        </text>`;
    }).join('');
};
