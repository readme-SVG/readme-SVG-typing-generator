module.exports = (ctx) => {
    const { lines, textX, textAnchor, commonStyle, repeat, lineDurS, sequenceOpacity, lineY, escapeXml } = ctx;
    // Deterministic ids: the SVG is a standalone document, so static ids
    // cannot collide, and identical requests produce identical (cacheable) output.
    const filterBase = 'blurFilter';
    const defs = lines.map((_, i) => `<filter id="${filterBase}_${i}">
        <feGaussianBlur stdDeviation="8;0;0;8">
            <animate attributeName="stdDeviation" values="10;0;0;10" keyTimes="0;0.25;0.75;1" dur="${lineDurS}s" begin="${(i * ctx.slotS).toFixed(3)}s" repeatCount="${repeat ? 'indefinite' : '1'}" />
        </feGaussianBlur>
    </filter>`).join('');

    const items = lines.map((line, i) => `<text x="${textX}" y="${lineY(i)}" text-anchor="${textAnchor}" style="${commonStyle}" filter="url(#${filterBase}_${i})" opacity="0">
        ${sequenceOpacity(i)}
        ${escapeXml(line)}
    </text>`).join('');

    return `<defs>${defs}</defs>${items}`;
};
