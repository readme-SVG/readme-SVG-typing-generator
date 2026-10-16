module.exports = (ctx) => {
    const { lines, textX, textAnchor, commonStyle, repeat, lineDurS, intSize, textColor, sequenceOpacity, lineY, escapeXml } = ctx;
    return lines.map((line, i) => {
        const dashLen = Math.max(600, line.length * intSize * 0.7);
        return `<text x="${textX}" y="${lineY(i)}" text-anchor="${textAnchor}" style="${commonStyle}" fill="none" stroke="${textColor}" stroke-width="1.5" stroke-dasharray="${dashLen}" stroke-dashoffset="${dashLen}" opacity="0">
            ${sequenceOpacity(i)}
            <animate attributeName="stroke-dashoffset" values="${dashLen};0" dur="${lineDurS}s" begin="${(i * ctx.slotS).toFixed(3)}s" fill="freeze" repeatCount="${repeat ? 'indefinite' : '1'}" />
            <animate attributeName="fill" values="transparent;${textColor}" keyTimes="0;1" dur="${lineDurS}s" begin="${(i * ctx.slotS).toFixed(3)}s" fill="freeze" repeatCount="${repeat ? 'indefinite' : '1'}" />
            ${escapeXml(line)}
        </text>`;
    }).join('');
};
