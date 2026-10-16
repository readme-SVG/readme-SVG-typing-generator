module.exports = (ctx) => {
    const { lines, textX, textAnchor, commonStyle, repeat, lineDurS, textColor, sequenceOpacity, lineY, escapeXml } = ctx;
    return lines.map((line, i) => `<text x="${textX}" y="${lineY(i)}" text-anchor="${textAnchor}" style="${commonStyle}" opacity="0">
        ${sequenceOpacity(i)}
        <animate attributeName="fill" values="${textColor};#ff0040;#ff8c00;#ffef00;#00dd44;#0088ff;#7700ff;${textColor}" dur="${lineDurS}s" begin="${(i * ctx.slotS).toFixed(3)}s" repeatCount="${repeat ? 'indefinite' : '1'}" />
        ${escapeXml(line)}
    </text>`).join('');
};
