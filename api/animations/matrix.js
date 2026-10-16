module.exports = (ctx) => {
    const { lines, intSize, intWidth, intHeight, commonStyle, repeat, lineDurS, sequenceOpacity, escapeXml } = ctx;
    const source = lines.join(' ');
    const pool = source.split('').concat(['0','1','#','@','!','$','%','^','&','*']);
    const cols = Math.floor(intWidth / (intSize * 0.6));

    return lines.map((_, i) => {
        let drops = `<g opacity="0">${sequenceOpacity(i)}`;
        for (let c = 0; c < Math.min(cols, 30); c++) {
            const x = c * (intSize * 0.6) + (intSize * 0.3);
            const ch = pool[(c + i) % pool.length];
            // Deterministic pseudo-random delay (same visual scatter, but
            // identical requests produce identical, cacheable output).
            const delay = i * ctx.slotS + (((c * 37 + i * 101) % 100) / 100) * Math.max(0.2, lineDurS * 0.35);
            drops += `<text x="${x}" y="0" style="${commonStyle}" font-size="${Math.max(10, intSize - 4)}px" opacity="0.8">
                <animateTransform attributeName="transform" type="translate" values="0,-${intSize};0,${intHeight + intSize}" dur="${Math.max(0.4, lineDurS * 0.6).toFixed(2)}s" begin="${delay.toFixed(2)}s" repeatCount="${repeat ? 'indefinite' : '1'}" />
                <animate attributeName="opacity" values="0;0.9;0.4;0.9;0" dur="${Math.max(0.35, lineDurS * 0.5).toFixed(2)}s" begin="${delay.toFixed(2)}s" repeatCount="${repeat ? 'indefinite' : '1'}" />
                ${escapeXml(ch)}
            </text>`;
        }
        return `${drops}</g>`;
    }).join('');
};
