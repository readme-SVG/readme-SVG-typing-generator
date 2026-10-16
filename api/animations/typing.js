module.exports = (ctx) => {
    const {
        lines, intSize, intWidth, intHeight, textX, textAnchor, commonStyle,
        textColor, center, repeat, cycleDurS, lineDurS, slotS, sequenceOpacity, clamp01, lineY, escapeXml } = ctx;

    let defs = '';
    let body = '';

    lines.forEach((line, i) => {
        const charWidth = intSize * 0.6;
        const totalLineWidth = Math.ceil(line.length * charWidth) + 24;
        const tx = center ? (intWidth - totalLineWidth) / 2 : 20;
        const startS = i * slotS;

        const typingS = lineDurS * 0.55;
        const holdS = lineDurS * 0.3;
        const eraseS = Math.max(0.08, lineDurS - typingS - holdS);

        const t0 = startS / cycleDurS;
        const t1 = (startS + typingS) / cycleDurS;
        const t2 = (startS + typingS + holdS) / cycleDurS;
        const t3 = (startS + typingS + holdS + eraseS) / cycleDurS;

        const clipId = `clip_t_${i}`;
        defs += `<clipPath id="${clipId}">
            <rect x="${tx}" y="0" width="0" height="${intHeight}">
                <animate attributeName="width"
                    values="0;0;${totalLineWidth};${totalLineWidth};0;0"
                    keyTimes="0;${clamp01(t0)};${clamp01(t1)};${clamp01(t2)};${clamp01(t3)};1"
                    dur="${cycleDurS}s"
                    repeatCount="${repeat ? 'indefinite' : '1'}"
                    fill="freeze" />
            </rect>
        </clipPath>`;

        const cursorValues = `${tx};${tx};${tx + totalLineWidth};${tx + totalLineWidth};${tx + totalLineWidth};${tx + totalLineWidth}`;

        body += `<text x="${textX}" y="${lineY(i)}" text-anchor="${textAnchor}" style="${commonStyle}" clip-path="url(#${clipId})" opacity="0">
            ${sequenceOpacity(i)}
            ${escapeXml(line)}
        </text>
        <rect x="${tx}" y="${lineY(i) - intSize + 4}" width="2" height="${intSize}" fill="${textColor}" opacity="0">
            <animate attributeName="x"
                values="${cursorValues}"
                keyTimes="0;${clamp01(t0)};${clamp01(t1)};${clamp01(t2)};${clamp01(t3)};1"
                dur="${cycleDurS}s"
                repeatCount="${repeat ? 'indefinite' : '1'}"
                fill="freeze" />
            <animate attributeName="opacity"
                values="0;0;1;1;0;0"
                keyTimes="0;${clamp01(t0)};${clamp01(t1)};${clamp01(t2)};${clamp01(t3)};1"
                dur="${cycleDurS}s"
                repeatCount="${repeat ? 'indefinite' : '1'}"
                fill="freeze" />
        </rect>`;
    });

    return `<defs>${defs}</defs>${body}`;
};
