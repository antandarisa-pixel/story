// styletest.js: one key frame of "ชั้นสามครึ่ง" (scene 1, beat 13: Kong draws the door in the air, Nont listens at his
// desk, P'Oy turns with her folder), painted in three looks. Same composition in each, so the sheet compares the medium.
//   style_a  warm gouache wash + thin ink line (the house look of ton-sea)
//   style_b  pen-and-ink notebook: navy line, hatching, two accent colours, a lot of paper showing
//   style_c  cut paper: no outlines, flat saturated shapes with a cast shadow
(() => {
  const STYLES = {
    a: { mode: 'wash', ink: '#3A2A2C', sw: 1, br: 'ink',
      wall: '#EADBC0', wallDk: '#CDB894', floor: '#B88A5E', floorDk: '#8E6844', trim: '#8A6A4A', glass: '#FBEFCB', frame: '#6F8F86',
      sun: '#FFE3A0', sunA: .55, beam: '#FFF0C8', beamOp: 70, desk: '#A8743F', deskDk: '#7E5530', cabinet: '#7C8C86', cabinetDk: '#5C6A66',
      counter: '#6F8F86', counterDk: '#53706A', machine: '#3D3A36', door: '#4F6F5A', shelf: '#8A6A4A', binders: ['#C9584A', '#E8C25A', '#5E7F9A', '#7A9A6A'],
      amber: '#D9A55B', trace: '#F29A3A', paper: '#FBF6EC', fan: '#7A6A58',
      skin: '#F2C9A0', skinDk: '#D9A57C', blush: '#E8897A',
      nonShirt: '#5E7F72', nonPants: '#3A3540', nonHair: '#2B2430', kongHood: '#B8A6D9', kongHoodDk: '#9480BC', kongPants: '#3E4A5C', kongHair: '#3A2E2E',
      oyCardi: '#B5583A', oyTop: '#F1E6D2', oySkirt: '#4A4A56', oyHair: '#33262A', folder: '#E8C25A', shoe: '#5A4036', mug: '#F4EEE2', tool: '#C9584A' },
    b: { mode: 'pen', ink: '#1F2A44', sw: 1.15, br: 'pen',
      wall: '#F6F2E7', wallDk: '#E9E1CF', floor: '#EFE5D0', floorDk: '#D9CBAE', trim: '#F6F2E7', glass: '#FFFBEF', frame: '#F6F2E7',
      sun: '#FFE7B0', sunA: .35, beam: '#FFF6DA', beamOp: 0, desk: '#F2E6D0', deskDk: '#E2D2B4', cabinet: '#E3EAE6', cabinetDk: '#CFD9D4',
      counter: '#DCEAE6', counterDk: '#C7DAD5', machine: '#2A3550', door: '#DCEAE6', shelf: '#F6F2E7', binders: ['#F6F2E7', '#F3D6A8', '#F6F2E7', '#DCEAE6'],
      amber: '#E08A2E', trace: '#E08A2E', paper: '#FFFDF6', fan: '#F6F2E7',
      skin: '#FBEBDD', skinDk: '#F0D4BC', blush: '#F2B8A8',
      nonShirt: '#CFE3DC', nonPants: '#2A3550', nonHair: '#1F2A44', kongHood: '#E4DCF3', kongHoodDk: '#CFC3EA', kongPants: '#2A3550', kongHair: '#1F2A44',
      oyCardi: '#F3C9B4', oyTop: '#FFFDF6', oySkirt: '#2A3550', oyHair: '#1F2A44', folder: '#F3D6A8', shoe: '#1F2A44', mug: '#FFFDF6', tool: '#E08A2E',
      grid: '#9DB6CF' },
    c: { mode: 'paper', ink: null, sw: 0, shadow: '#2A2338',
      wall: '#F4D58D', wallDk: '#E9BE6A', floor: '#C8553D', floorDk: '#A4402D', trim: '#8C3B2A', glass: '#FFF6D6', frame: '#2E5E5A',
      sun: '#FFE9A8', sunA: .45, beam: '#FFF4CF', beamOp: 95, desk: '#8C4A2F', deskDk: '#6E3822', cabinet: '#3F7F7A', cabinetDk: '#2E625E',
      counter: '#264653', counterDk: '#1A333D', machine: '#1D1D2C', door: '#2A9D8F', shelf: '#8C3B2A', binders: ['#E76F51', '#FFFFFF', '#264653', '#2A9D8F'],
      amber: '#F4A261', trace: '#FFFFFF', paper: '#FFFDF2', fan: '#264653',
      skin: '#F6C7A1', skinDk: '#E0A47E', blush: '#EE8A7A',
      nonShirt: '#2A9D8F', nonPants: '#1D1D2C', nonHair: '#1D1D2C', kongHood: '#9B8BD8', kongHoodDk: '#7C6BC0', kongPants: '#264653', kongHair: '#2A1E24',
      oyCardi: '#E76F51', oyTop: '#FFFDF2', oySkirt: '#264653', oyHair: '#2A1E24', folder: '#FFFFFF', shoe: '#1D1D2C', mug: '#FFFFFF', tool: '#E76F51' },
  };
  let S = STYLES.a;

  // ---------- medium ----------
  // character and prop shapes
  function fig(pts, col, o = {}) {
    if (S.mode === 'paper') {
      if (!o.noShadow) paint(pts.map(([x, y]) => [x + 7, y + 9]), { wash: S.shadow, washOp: 70, ink: null, curv: o.curv });
      paint(pts, { wash: col, washOp: o.op ?? 255, ink: null, curv: o.curv });
    } else if (S.mode === 'pen') {
      paint(pts, { wash: col, washOp: o.op ?? 255, ink: o.noLine ? null : S.ink, sw: (o.thin ? .6 : 1) * S.sw, br: 'pen', curv: o.curv });
    } else paint(pts, { wash: col, washOp: o.op ?? 255, ink: o.noLine ? null : S.ink, sw: (o.thin ? .6 : 1) * S.sw, br: 'ink', curv: o.curv });
  }
  // set shapes: flat colour, then a watercolour layer (a), hatching (b) or a cut edge (c)
  function bg(pts, col, o = {}) {
    if (S.mode === 'paper') return fig(pts, col, { ...o, noShadow: o.noShadow ?? true });
    paint(pts, { wash: col, ink: null, curv: o.curv });
    if (S.mode === 'pen') {
      if (o.shade) paint(pts, { hatch: { d: 10, a: o.ha ?? Math.PI / 4, b: 'pen', c: S.ink, w: .55, o: { rand: .2 } }, ink: null, curv: o.curv });
      if (!o.noLine) paint(pts, { ink: S.ink, sw: .8 * S.sw, br: 'pen', curv: o.curv });
    } else {
      paint(pts, { fill: mixCol(col, S.ink, .22), fillOp: o.shade ? 110 : 60, bleed: .18, tex: .7, ink: o.noLine ? null : S.ink, sw: .55, br: 'ink', curv: o.curv });
    }
  }
  const dense = P => P.length > 2 ? P : [P[0], [(P[0][0] + P[1][0]) / 2, (P[0][1] + P[1][1]) / 2], P[1]];
  function line(pts, sw = 1, col) {
    if (S.mode === 'paper') { if (!col) return; const w = Math.max(2.4, sw * 3.2); paint(ribbon(through(dense(pts), 4), w, w), { wash: col, ink: null, curv: .3 }); return; }
    inkLine(dense(pts), sw * S.sw, col || S.ink, S.mode === 'pen' ? 'pen' : 'ink', .5);
  }

  // ---------- people ----------
  // Drawn at feet (x, fy), height h, facing f (1 = right, -1 = left). Local units: 1 = h / 100, y up is negative.
  let X = 0, FY = 0, U = 1, F = 1;
  const L = (x, y) => [X + x * U * F, FY + y * U];
  const LP = a => a.map(([x, y]) => L(x, y));
  const toLocal = ([x, y]) => [(x - X) / (U * F), (y - FY) / U];
  function ik(s, t, L1, L2, bend) {
    const dx = t[0] - s[0], dy = t[1] - s[1], d = Math.min(Math.hypot(dx, dy), L1 + L2 - .01);
    const a = Math.atan2(dy, dx), c = clamp((L1 * L1 + d * d - L2 * L2) / (2 * L1 * d), -1, 1), b = Math.acos(c) * bend;
    const e = [s[0] + Math.cos(a + b) * L1, s[1] + Math.sin(a + b) * L1];
    const k = d / Math.hypot(dx, dy || 1e-6);
    return { e, w: Math.hypot(dx, dy) > L1 + L2 ? [s[0] + dx * k, s[1] + dy * k] : t };
  }
  // an arm from shoulder s to world target tw; upper/fore colours; returns the hand point (world)
  function arm(s, tw, upper, fore, o = {}) {
    const t = toLocal(tw), { e, w } = ik(s, t, 16, 16, o.bend ?? 1);
    const W0 = o.w ?? 7;
    fig(ribbon(LP([s, e]).concat([]), W0 * U, W0 * .85 * U), upper, { curv: .4 });
    fig(ribbon(LP([e, w]), W0 * .85 * U, W0 * .72 * U), fore, { curv: .4 });
    const hw = L(w[0], w[1]);
    if (o.point) {
      const dir = [w[0] - e[0], w[1] - e[1]], n = Math.hypot(dir[0], dir[1]) || 1, tip = [w[0] + dir[0] / n * 6.5, w[1] + dir[1] / n * 6.5];
      fig(ribbon(LP([w, tip]), 2.2 * U, 1.6 * U), S.skin, { thin: true, noShadow: true });
    }
    fig(ellPts(hw[0], hw[1], 3.4 * U, 3.1 * U, 14), S.skin, { thin: true, noShadow: o.noShadow });
    return hw;
  }
  function eyes(hc, look, kind) {
    for (const sx of [-4.3, 4.3]) {
      const [ex, ey] = L(hc[0] + sx + look * 2.2, hc[1] + .5);
      if (kind === 'tired') {
        paint(ellPts(ex, ey + .4 * U, 1.35 * U, 1.0 * U, 10), { wash: S.mode === 'paper' ? '#1D1D2C' : S.ink, ink: null });
        line([[ex - 2.2 * U, ey - .6 * U], [ex, ey - 1.1 * U], [ex + 2.2 * U, ey - .6 * U]], .7);             // heavy lid
        line([[ex - 1.8 * U, ey + 2.3 * U], [ex, ey + 2.8 * U], [ex + 1.8 * U, ey + 2.3 * U]], .45, S.mode === 'paper' ? S.kongHoodDk : mixCol(S.skinDk, S.ink, .35));   // bags
      } else {
        paint(ellPts(ex, ey, 1.35 * U, 1.7 * U, 10), { wash: S.mode === 'paper' ? '#1D1D2C' : S.ink, ink: null });
        if (S.mode !== 'pen') paint(ellPts(ex + .45 * U, ey - .6 * U, .4 * U, .4 * U, 6), { wash: '#FFFFFF', ink: null });
      }
    }
  }
  function brows(hc, look, lift, angle = 0) {
    for (const sx of [-4.3, 4.3]) {
      const cx = hc[0] + sx + look * 2.2, cy = hc[1] - 3.6 - lift, s = Math.sign(sx);
      line([L(cx - 2.2, cy + angle * s), L(cx, cy - .5), L(cx + 2.2, cy - angle * s)], .7, S.mode === 'paper' ? '#1D1D2C' : null);
    }
  }
  function mouth(hc, look, kind) {
    const [mx, my] = L(hc[0] + look * 2, hc[1] + 6.4), c = S.mode === 'paper' ? '#7A2E2A' : null;
    if (kind === 'o') paint(ellPts(mx, my + .4 * U, 1.6 * U, 2 * U, 12), { wash: S.mode === 'paper' ? '#7A2E2A' : mixCol(S.blush, S.ink, .5), ink: S.mode === 'paper' ? null : S.ink, sw: .5 * S.sw, br: S.mode === 'pen' ? 'pen' : 'ink' });
    else if (kind === 'smirk') line([[mx - 2.4 * U, my + .2 * U], [mx, my + .6 * U], [mx + 2.6 * U, my - .7 * U]], .6, c);
    else line([[mx - 2 * U, my], [mx, my + .9 * U], [mx + 2 * U, my]], .6, c);
  }
  function cheeks(hc, look) {
    if (S.mode === 'pen') return;
    for (const sx of [-6.5, 6.5]) { const [x, y] = L(hc[0] + sx + look * 1.5, hc[1] + 3.6); paint(ellPts(x, y, 2.4 * U, 1.3 * U, 10), { wash: S.blush, washOp: 90, ink: null }); }
  }
  function head(hc, look) {
    const [cx, cy] = L(hc[0], hc[1]);
    fig(ellPts(...L(hc[0] - 10.6 * F * 0 - 10.4, hc[1] + 1), 2.2 * U, 3 * U, 10), S.skin, { thin: true });          // ears
    fig(ellPts(...L(hc[0] + 10.4, hc[1] + 1), 2.2 * U, 3 * U, 10), S.skin, { thin: true });
    fig(ellPts(cx, cy, 11 * U, 12.2 * U, 26), S.skin);
    return [cx, cy];
  }
  function neck(hc) { fig(LP([[-3.2, hc[1] + 9], [3.2, hc[1] + 9], [3.6, hc[1] + 16], [-3.6, hc[1] + 16]]), S.skinDk, { thin: true, noShadow: true }); }
  function legs(pants, w = 8.5, gap = 5.5) {
    for (const s of [-1, 1]) {
      fig(ribbon(LP([[s * gap, -44], [s * (gap + .5), -22], [s * (gap + 1), -4]]), w * U, w * .82 * U), pants, { curv: .3 });
      fig(LP([[s * (gap + 1) - 4.2, -5], [s * (gap + 1) + 5.5, -5], [s * (gap + 1) + 6.5, 0], [s * (gap + 1) - 4.8, 0]]), S.shoe, { curv: .4, thin: true });
    }
  }
  function shadowAt(x, y, rx) {
    paint(ellPts(x, y, rx, rx * .16, 20), { wash: S.mode === 'paper' ? S.shadow : mixCol(S.floorDk, S.ink, .4), washOp: S.mode === 'pen' ? 0 : 70, ink: null });
    if (S.mode === 'pen') paint(ellPts(x, y, rx, rx * .16, 20), { hatch: { d: 6, a: 0, b: 'pen', c: S.ink, w: .5 }, ink: null });
  }

  // Nont: tall, lean, muted-green work shirt with rolled sleeves, rectangular glasses, pen behind the ear, screwdriver.
  // Seated behind his desk: drawn in two passes so the desk front can cover his lap.
  function nontBody(x, fy, h) {
    X = x; FY = fy; U = h / 100; F = 1;
    boilSeed('nont-body');
    const hc = [0, -86];
    neck(hc);
    fig(LP([[-14, -71], [14, -71], [15.5, -58], [13.5, -40], [-13.5, -40], [-15.5, -58]]), S.nonShirt, { curv: .45 });
    line(LP([[0, -70], [0, -42]]), .5);                                                        // placket
    line(LP([[-4, -71], [0, -64], [4, -71]]), .6);                                             // collar
    const look = .55;
    head(hc, look);
    boilSeed('nont-hair');
    fig(LP([[-11.6, -86], [-11, -95], [-6, -99.6], [2, -100.4], [9, -98.4], [11.8, -91], [11.6, -84], [8, -91.5], [1, -93], [-6, -91], [-9.6, -86]]), S.nonHair, { curv: .5 });
    eyes(hc, look, 'open'); brows(hc, look, .6, .4); mouth(hc, look, 'smirk'); cheeks(hc, look);
    // rectangular glasses
    for (const sx of [-4.3, 4.3]) { const [gx, gy] = L(hc[0] + sx + look * 2.2, hc[1] + .6); fig(rrPts(gx - 3.4 * U, gy - 2.6 * U, 6.8 * U, 5.2 * U, 1 * U), S.glass, { op: S.mode === 'paper' ? 120 : 60, thin: true, noShadow: true }); }
    line(LP([[hc[0] - 1.4 + look * 2.2, hc[1]], [hc[0] + 1.4 + look * 2.2, hc[1]]]), .5, S.mode === 'paper' ? '#1D1D2C' : null);
    // pen behind the ear
    fig(ribbon(LP([[-12.5, -97], [-7, -84]]), 1.6 * U, 1.4 * U), S.amber, { thin: true });
    return { hc };
  }
  function nontArms(t) {
    boilSeed('nont-arms');
    // back hand flat on the notebook; front hand raised, twirling the screwdriver
    arm([-12.5, -67], L(-9, -53), S.nonShirt, S.skin, { bend: -1 });
    const spin = t * 2.4;
    const hw = arm([12.5, -67], L(19, -78), S.nonShirt, S.skin, { bend: 1 });
    const a = -1.2 + .35 * Math.sin(spin), len = 15 * U;
    const tip = [hw[0] + Math.cos(a) * len, hw[1] + Math.sin(a) * len], butt = [hw[0] - Math.cos(a) * 5 * U, hw[1] - Math.sin(a) * 5 * U];
    line([hw, tip], 1.3, S.mode === 'paper' ? '#BFC7CC' : null);
    fig(ribbon([butt, [hw[0] + Math.cos(a) * 2 * U, hw[1] + Math.sin(a) * 2 * U]], 3.2 * U, 2.6 * U), S.tool, { thin: true });
    fig(ellPts(hw[0], hw[1], 3.4 * U, 3.1 * U, 14), S.skin, { thin: true, noShadow: true });
  }

  // Kong: short, oversized lilac hoodie, a tuft of hair, tired lids and eye bags, a mug in one hand.
  function kong(x, fy, h, t) {
    X = x; FY = fy; U = h / 100; F = -1;
    boilSeed('kong');
    const hc = [0, -84];
    shadowAt(x, fy + 2, 22 * U);
    legs(S.kongPants, 9, 5.2);
    // hood bunched behind the neck
    fig(ellPts(...L(0, -71), 12 * U, 5.5 * U, 18), S.kongHoodDk, { curv: .5 });
    neck(hc);
    fig(LP([[-16, -70], [16, -70], [18.5, -55], [18, -36], [-18, -36], [-18.5, -55]]), S.kongHood, { curv: .45 });
    fig(LP([[-9, -50], [9, -50], [10.5, -39], [-10.5, -39]]), S.kongHoodDk, { thin: true, curv: .3, noShadow: true });   // pocket
    line(LP([[-3, -69], [-3.6, -58]]), .5); line(LP([[3, -69], [3.6, -58]]), .5);                                         // drawstrings
    const look = .7;
    head(hc, look);
    boilSeed('kong-hair');
    fig(LP([[-11.6, -84], [-11.8, -94], [-7, -99], [-1, -100], [1, -107], [3.6, -100.2], [9, -98], [12, -90], [11.4, -83], [7, -91], [0, -92.4], [-7, -90.6], [-10, -85]]), S.kongHair, { curv: .45 });
    eyes(hc, look, 'tired'); brows(hc, look, 1.4, -.5); mouth(hc, look, 'o'); cheeks(hc, look);
    // back hand: the mug at his chest; front hand: tracing the air door
    boilSeed('kong-arms');
    const mh = arm([13.5, -66], L(2, -50), S.kongHood, S.kongHood, { w: 8.5, bend: 1 });
    fig(rrPts(mh[0] - 3 * U, mh[1] - 6 * U, 7 * U, 8 * U, 1.2 * U), S.mug, { thin: true });
    const fh = arm([-13.5, -66], [1096, 540], S.kongHood, S.kongHood, { w: 8.5, bend: -1, point: true });
    return fh;
  }
  // the door Kong is drawing in the air: a trail that ends at his fingertip
  function airDoor(tip) {
    boilSeed('air-door');
    const P = [[1214, 700], [1214, 466], [1104, 466], [tip[0], tip[1]]];
    if (S.mode === 'paper') {
      for (let i = 0; i < 3; i++) { const a = P[i], b = P[i + 1], n = Math.round(Math.hypot(b[0] - a[0], b[1] - a[1]) / 26);
        for (let k = 0; k < n; k += 2) paint(ribbon([[lerp(a[0], b[0], k / n), lerp(a[1], b[1], k / n)], [lerp(a[0], b[0], (k + .5) / n), lerp(a[1], b[1], (k + .5) / n)], [lerp(a[0], b[0], (k + 1) / n), lerp(a[1], b[1], (k + 1) / n)]], 7, 7), { wash: S.trace, ink: null }); }
      paint(ellPts(1196, 590, 6, 6, 10), { wash: S.trace, ink: null });
      return;
    }
    glow(1160, 580, 170, S.trace, S.mode === 'pen' ? .12 : .22);
    for (let i = 0; i < 3; i++) { const a = P[i], b = P[i + 1], n = Math.max(2, Math.round(Math.hypot(b[0] - a[0], b[1] - a[1]) / 24));
      for (let k = 0; k < n; k += 2) inkLine([[lerp(a[0], b[0], k / n), lerp(a[1], b[1], k / n)], [lerp(a[0], b[0], (k + .5) / n), lerp(a[1], b[1], (k + .5) / n)], [lerp(a[0], b[0], (k + 1) / n), lerp(a[1], b[1], (k + 1) / n)]], 1.5, S.trace, S.mode === 'pen' ? 'pen' : 'ink', .5); }
    paint(ellPts(1196, 590, 5, 5, 10), { wash: S.trace, ink: null });                                                    // the knob he imagines
  }

  // P'Oy: neat bob, brick cardigan, glasses on a chain, folder hugged to her chest; turned toward Kong.
  function oy(x, fy, h) {
    X = x; FY = fy; U = h / 100; F = -1;
    boilSeed('oy');
    const hc = [0, -85];
    shadowAt(x, fy + 2, 20 * U);
    legs(S.skin, 6, 4.6);
    fig(LP([[-13, -45], [13, -45], [15.5, -20], [-15.5, -20]]), S.oySkirt, { curv: .3 });                                // skirt
    boilSeed('oy-hair-back');
    fig(LP([[-12.6, -86], [-13.4, -76], [-9, -72.6], [9, -72.6], [13.4, -76], [12.6, -86]]), S.oyHair, { curv: .5 });     // bob, behind
    neck(hc);
    fig(LP([[-14, -71], [14, -71], [15.5, -57], [14, -43], [-14, -43], [-15.5, -57]]), S.oyCardi, { curv: .45 });
    fig(LP([[-4.6, -71], [4.6, -71], [4, -43], [-4, -43]]), S.oyTop, { thin: true, noShadow: true, curv: .2 });
    const look = .85;
    head(hc, look);
    boilSeed('oy-hair');
    fig(LP([[-12.8, -78], [-12.8, -92], [-7, -98.6], [1, -99.8], [8, -98], [12.8, -91], [12.6, -78], [10.6, -80], [9.6, -89], [4, -91.6], [-3, -90.6], [-6, -87], [-10.4, -86], [-10.8, -78]]), S.oyHair, { curv: .5 });
    eyes(hc, look, 'open'); brows(hc, look, 1.8, -.3); mouth(hc, look, 'flat'); cheeks(hc, look);
    // round glasses pushed down the nose, with the chain
    for (const sx of [-4.3, 4.3]) { const [gx, gy] = L(hc[0] + sx + look * 2.2, hc[1] + 2.4); fig(ellPts(gx, gy, 3.2 * U, 3 * U, 16), S.glass, { op: S.mode === 'paper' ? 120 : 50, thin: true, noShadow: true }); }
    line(LP([[-7.6 + look * 2.2, -82], [-10.5, -74], [-7, -66], [0, -62], [7, -66], [9.6, -74]]), .4, S.mode === 'paper' ? '#FFFFFF' : S.amber);
    // the folder, hugged; then both forearms over it
    boilSeed('oy-folder');
    const [fx, fy0] = L(1, -60);
    push(); translate(fx, fy0); rotate(-.12 * F);
    fig(rectPts(-13 * U, -11 * U, 26 * U, 21 * U), S.folder, { thin: true });
    line([[-11 * U, -6 * U], [9 * U, -6 * U]], .4); line([[-11 * U, -2 * U], [6 * U, -2 * U]], .4);
    pop();
    arm([-12.5, -67], L(-6, -55), S.oyCardi, S.oyCardi, { bend: -1, w: 7.5 });
    arm([12.5, -67], L(8, -52), S.oyCardi, S.oyCardi, { bend: 1, w: 7.5 });
  }

  // ---------- set ----------
  function room(t) {
    boilSeed('wall');
    bg(rectPts(-40, -40, W + 80, 900), S.wall, { noLine: true });
    if (S.mode === 'pen') for (let y = 40; y < 860; y += 46) inkLine([[0, y], [W / 2, y + 1], [W, y]], .35, S.grid, 'inkfine', 0);   // notebook ruling
    boilSeed('floor');
    bg([[-40, 860], [W + 40, 860], [W + 40, H + 40], [-40, H + 40]], S.floor, { shade: true, ha: .15 });
    for (let i = 0; i < 7; i++) line([[i * 330 - 120, 1084], [i * 300 - 40, 970], [i * 270 + 40, 862]], .45, S.mode === 'paper' ? S.floorDk : null);
    bg(rectPts(-40, 846, W + 80, 18), S.trim, {});                                                                          // skirting
    // window above the counter, the morning comes through it
    boilSeed('window');
    bg(rectPts(680, 130, 380, 360), S.frame, {});
    bg(rectPts(700, 150, 340, 320), S.glass, { noLine: S.mode !== 'pen' });
    line([[870, 150], [870, 470]], 1.4, S.mode === 'paper' ? S.frame : null); line([[700, 310], [1040, 310]], 1.4, S.mode === 'paper' ? S.frame : null);
    if (S.mode !== 'pen') glow(870, 310, 420, S.sun, S.sunA); else glow(870, 310, 300, S.sun, S.sunA);
    // clock: 8.45 (no numerals)
    boilSeed('clock');
    bg(ellPts(560, 210, 58, 58, 28), S.paper, {});
    for (let i = 0; i < 12; i++) { const a = i * TAU / 12; line([[560 + Math.cos(a) * 46, 210 + Math.sin(a) * 46], [560 + Math.cos(a) * 52, 210 + Math.sin(a) * 52]], .5, S.mode === 'paper' ? S.counter : null); }
    const hA = (8.75 / 12) * TAU - Math.PI / 2, mA = (45 / 60) * TAU - Math.PI / 2;
    line([[560, 210], [560 + Math.cos(hA) * 28, 210 + Math.sin(hA) * 28]], 1.6, S.mode === 'paper' ? S.counter : null);
    line([[560, 210], [560 + Math.cos(mA) * 42, 210 + Math.sin(mA) * 42]], 1.1, S.mode === 'paper' ? S.counter : null);
    // shelf of binders
    boilSeed('shelf');
    for (let i = 0; i < 9; i++) bg(rectPts(1200 + i * 30 + (i > 5 ? 14 : 0), 236 - (i % 3) * 6, 26, 94 + (i % 3) * 6), S.binders[i % 4], {});
    bg(rectPts(1180, 330, 330, 14), S.shelf, {});
    // the fire-escape door (where the story goes)
    boilSeed('fire-door');
    bg(rectPts(1560, 380, 190, 480), S.door, { shade: true, ha: -.9 });
    bg(rectPts(1588, 410, 134, 140), mixCol(S.door, S.glass, .55), {});
    line([[1586, 640], [1724, 640]], 2, S.mode === 'paper' ? S.counterDk : null);
    // ceiling fan, mid-turn
    boilSeed('fan');
    line([[960, -10], [960, 44]], 1.2, S.mode === 'paper' ? S.fan : null);
    for (let i = 0; i < 3; i++) { const a = t * 2.2 + i * TAU / 3, c = Math.cos(a); fig(ellPts(960 + c * 120, 56 + Math.sin(a) * 8, Math.abs(c) * 120 + 12, 9, 16), S.fan, { thin: true }); }
    fig(ellPts(960, 52, 26, 12, 16), S.fan, {});
    // cabinet with the rolled plans on top
    boilSeed('cabinet');
    bg(rectPts(30, 330, 190, 560), S.cabinet, { shade: true, ha: -.9 });
    for (let i = 0; i < 4; i++) { bg(rectPts(46, 350 + i * 132, 158, 116), S.cabinetDk, {}); bg(rectPts(106, 400 + i * 132, 38, 10), S.paper, {}); }
    for (let i = 0; i < 3; i++) fig(ribbon([[60 + i * 22, 318 - i * 8], [196 + i * 6, 300 - i * 10]], 18, 18), i === 1 ? S.glass : mixCol(S.paper, S.frame, .25), { thin: true });
  }
  function beam(t) {
    if (S.beamOp <= 0) {
      boilSeed('beam-pen');
      for (const [a, b] of [[[700, 470], [930, 1080]], [[1040, 470], [1380, 1080]]]) line([a, [lerp(a[0], b[0], .5), lerp(a[1], b[1], .5)], b], .35, S.amber);
      return;
    }
    boilSeed('beam');
    paint([[700, 470], [1040, 470], [1380, 1080], [930, 1080]], { wash: S.beam, washOp: S.beamOp, ink: null });
    for (let i = 0; i < 26; i++) {
      const k = hash(i * 3.1), y = 500 + hash(i * 7.7) * 520, x = lerp(lerp(700, 930, (y - 470) / 610), lerp(1040, 1380, (y - 470) / 610), k);
      const dy = Math.sin(t * .6 + i) * 6;
      paint(ellPts(x, y + dy, 2.4, 2.4, 6), { wash: S.mode === 'paper' ? '#FFFFFF' : S.paper, washOp: 200, ink: null });
    }
  }
  function counterAndMachine(t) {
    boilSeed('counter');
    bg(rectPts(730, 660, 300, 220), S.counter, { shade: true, ha: -.9 });
    bg(rectPts(716, 640, 328, 26), S.counterDk, {});
    fig(rrPts(790, 520, 92, 124, 10), S.machine, {});                                                         // drip machine
    fig(rrPts(806, 590, 60, 50, 8), S.glass, { thin: true, op: 200, noShadow: true });
    fig(rectPts(810, 612, 52, 26), S.amber, { thin: true, noShadow: true });                                  // coffee in the pot
    // the amber scent ribbon: rises from the machine and curls toward Kong (the motif of the whole film)
    boilSeed('scent');
    const R = through([[836, 518], [826, 470], [860, 420], [920, 402], [950, 370], [930, 330], [900, 320]], 8);
    paint(ribbon(R, 18, 3), { wash: S.amber, washOp: S.mode === 'paper' ? 255 : 190, ink: null, curv: .6 });
    if (S.mode === 'pen') inkLine(R, .5, S.amber, 'pen', .6);
  }
  function deskFront() {
    boilSeed('desk');
    bg([[180, 700], [690, 700], [712, 730], [160, 730]], S.desk, {});
    bg(rectPts(170, 730, 532, 170), S.deskDk, { shade: true, ha: .9 });
    bg(rectPts(196, 900, 20, 60), S.deskDk, {}); bg(rectPts(656, 900, 20, 60), S.deskDk, {});
    // notebook, full of numbers (drawn as scribbles) and a desk calendar with one day circled
    boilSeed('notebook');
    fig([[300, 704], [440, 700], [452, 724], [290, 728]], S.paper, { thin: true });
    for (let i = 0; i < 3; i++) line([[310, 708 + i * 5], [360, 707 + i * 5], [420, 706 + i * 5]], .35);
    boilSeed('calendar');
    fig([[560, 656], [640, 652], [650, 714], [556, 716]], S.paper, { thin: true });
    for (let r = 0; r < 3; r++) for (let c = 0; c < 5; c++) paint(rectPts(566 + c * 15, 670 + r * 14, 9, 8), { wash: mixCol(S.paper, S.ink || S.frame, .25), ink: null });
    paint(ellPts(586, 674, 9, 7, 12), { ink: S.mode === 'paper' ? S.tool : S.tool, sw: .8, br: S.mode === 'pen' ? 'pen' : 'ink' });
  }

  function frame(key, t) {
    S = STYLES[key];
    room(t);
    beam(t);
    counterAndMachine(t);
    nontBody(430, 925, 420);
    deskFront();
    X = 430; FY = 925; U = 4.2; F = 1;
    nontArms(t);
    const tip = kong(990, 942, 430, t);
    airDoor(tip);
    oy(1420, 948, 440);
  }
  for (const k of ['a', 'b', 'c']) { LOOPS['style_' + k] = t => frame(k, t); LOOPS['style_' + k].len = 4; }
})();
