module.exports = (ctx) => {
    const { lines, textX, textAnchor, commonStyle, repeat, lineDurS, sequenceOpacity, lineY, escapeXml } = ctx;
    // Deterministic id: the SVG is a standalone document, so a static id
    // cannot collide, and identical requests produce identical (cacheable) output.
    const filterId = 'neonFilter';
    const items = lines.map((line, i) => `<g opacity="0">
        ${sequenceOpacity(i)}
        <text x="${textX}" y="${lineY(i)}" text-anchor="${textAnchor}" style="${commonStyle}" filter="url(#${filterId})" opacity="0.9">
            <animate attributeName="opacity" values="0.5;1;0.5;0.8;1;0.5" dur="${lineDurS}s" begin="${(i * ctx.slotS).toFixed(3)}s" repeatCount="${repeat ? 'indefinite' : '1'}" />
            ${escapeXml(line)}
        </text>
    </g>`).join('');
    return `<defs>
        <filter id="${filterId}" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
    </defs>${items}`;
};
