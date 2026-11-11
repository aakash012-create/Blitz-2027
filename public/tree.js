// Generate the hand-routed circuit artwork once. The paired traces stay sharp at any size.

const NS = 'http://www.w3.org/2000/svg';

export function circuitTree() {
  const svg = document.createElementNS(NS, 'svg');
  svg.setAttribute('viewBox', '0 0 600 710');
  svg.setAttribute('aria-hidden', 'true');

  let seed = 2027;
  const rnd = () => (
    (seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0) / 4294967296
  );

  let wires = '',
      nodes = '';

  function trace(points, w, col, lit = false) {
    wires += '<polyline points="' +
      points.map(p => p.map(n => n.toFixed(1)).join(',')).join(' ') +
      '" fill="none" stroke="' + col +
      '" stroke-width="' + w +
      '" stroke-linejoin="round"/>';

    const [x, y] = points.at(-1);

    if (lit)
      nodes += '<circle cx="' + x + '" cy="' + y +
        '" r="5" fill="url(#spark)"/><circle cx="' + x + '" cy="' + y +
        '" r="1.25" fill="#fff1c8"/>';
  }

  for (const sign of [-1, 1])
    for (let i = 0; i < 47; i++) {
      const t = i / 46,
            rootX = 300 + sign * (3 + t * 22),
            branchY = 430 - 295 * (1 - t) ** 1.22,
            extent = 10 + t * 235 + (rnd() - .5) * 18;

      const endY = 29 + 310 * t ** 1.65 + rnd() * 24;

      const p0 = [rootX, 503 - Math.min(i, 12) * .25],
            p1 = [rootX, branchY],
            p2 = [rootX + sign * (extent * .32), branchY - extent * .32],
            p3 = [rootX + sign * extent * .54, branchY - extent * .32],
            p4 = [rootX + sign * extent * .73, branchY - extent * .51],
            p5 = [rootX + sign * extent * .84, p4[1]],
            p6 = [rootX + sign * extent, p5[1] - extent * .16];

      const pts = [p0, p1, p2, p3, p4, p5, p6, [p6[0], endY]];

      trace(
        pts,
        .65 + rnd() * .7,
        i % 4 === 0 ? '#ffcd83' : '#bd8668',
        true
      );

      if (i % 2 === 0) {
        const f = p4;

        trace(
          [
            f,
            [f[0], f[1] - 18],
            [f[0] + sign * 9, f[1] - 27],
            [f[0] + sign * 9, f[1] - 43 - rnd() * 40]
          ],
          .8,
          '#d9a17d',
          true
        );
      }
    }

  for (const sign of [-1, 1])
    for (let i = 0; i < 28; i++) {
      const t = i / 27,
            x = 300 + sign * (4 + (i % 12) * 2),
            y = 548 + (i % 5) * 3,
            dx = 20 + 154 * t;

      trace(
        [
          [x, 541],
          [x, y + 10],
          [x + sign * dx * .38, y + 10 + dx * .38],
          [x + sign * dx * .63, y + 10 + dx * .38],
          [x + sign * dx * .79, y + 10 + dx * .54],
          [x + sign * dx, y + 10 + dx * .54],
          [x + sign * dx, y + 25 + dx * .54 + rnd() * 22]
        ],
        .8,
        '#c39078',
        i % 2 === 0
      );
    }

  let pins = '';

  for (let i = 0; i < 14; i++)
    pins += '<path d="M' + (270 + i * 4.6) +
      ' 498v10 m0 34v9" stroke="#d1a16a" stroke-width="1.4"/>';

  for (let i = 0; i < 90; i++)
    nodes += '<circle cx="' + rnd() * 600 +
      '" cy="' + rnd() * 710 +
      '" r="' + (rnd() * 1.2 + .3) +
      '" fill="#e6bc93" opacity="' + (rnd() * .6 + .2) + '"/>';

  svg.innerHTML =
    '<defs><radialGradient id="spark"><stop stop-color="#ffdb94" stop-opacity=".95"/><stop offset="1" stop-color="#ffc37e" stop-opacity="0"/></radialGradient></defs>' +
    wires +
    pins +
    '<rect x="264" y="505" width="72" height="38" rx="4" fill="#241722" stroke="#dfa87b"/><rect x="268" y="509" width="64" height="30" rx="2" fill="none" stroke="#8a644e"/><path d="M303 511l-13 15h9l-4 12 15-18h-10z" fill="#efbe87"/>' +
    nodes;

  return svg;
}