// castsheets.js: three character-design directions for "ชั้นสามครึ่ง", all painted in style A (warm wash + thin ink),
// each as a model sheet: the cast full-body in their signature poses against head-height guides, and four
// expressions per character. Loops: cast_v1 (round and cute), cast_v2 (TV-cartoon shapes), cast_v3 (anime-leaning).
(() => {
  const C = {
    ink: '#3A2A2C', paper: '#F7EEDC', panel: '#EADBC0', guide: '#CDB894',
    skin: '#F4CBA4', skinDk: '#DDA67E', blush: '#EE8F7E', white: '#FFFDF6', amber: '#D9A55B', tool: '#C9584A', glass: '#FBEFCB',
    nonShirt: '#5E8F7E', nonShirtDk: '#467263', nonPants: '#3A3F52', nonHair: '#2B2430', nonIris: '#5A4030',
    kongHood: '#B8A6D9', kongHoodDk: '#9480BC', kongPants: '#3E4A5C', kongHair: '#3A2E2E', kongIris: '#4A3A5A',
    oyCardi: '#C0623F', oyCardiDk: '#9A4A2E', oyTop: '#F4E9D6', oySkirt: '#4A4A5E', oyHair: '#33262A', oyIris: '#6A3A2A',
    shoe: '#5A4036', mug: '#F4EEE2', folder: '#E8C25A', notebook: '#2F4F5F',
  };
  // Proportions per direction, in units of h / 100 from the feet (y up is negative).
  const VAR = {
    v1: { name: 'แบบ 1 · กลมน่ารัก', note: 'หัวโต ~2.8 ช่วงหัว ตาดำกลมโต ตัวป้อม แขนขาสั้น',
      head: [17, 17.6], hc: -81, sh: -61, hip: -29, arm: [12, 11], armW: 8, handR: 4.3, legW: 9.5, eyes: 'bead', eyeX: 6.6, eyeY: 2.6, eyeS: 1.25, nose: false, brow: .9, hairK: 1.08,
      heights: { non: 1, kong: .9, oy: .94 } },
    v2: { name: 'แบบ 2 · การ์ตูนทีวี', note: '~3.8 ช่วงหัว รูปทรงบอกนิสัย (นนท์ยาวเหลี่ยม ก้องกลม พี่อ้อยทรงลูกแพร์) ตาขาวโต แขนเส้นยาว',
      head: [13, 13.5], hc: -86.5, sh: -70, hip: -40, arm: [16, 15], armW: 4.8, handR: 3.6, legW: 5.2, eyes: 'toon', eyeX: 4.6, eyeY: .4, eyeS: 1.1, nose: true, brow: 1.4, hairK: 1.05,
      heights: { non: 1, kong: .78, oy: .86 } },
    v3: { name: 'แบบ 3 · อนิเมะ', note: '~4.6 ช่วงหัว คางเรียว ตาโตมีม่านตาและประกาย ผมเป็นช่อ',
      head: [10.6, 11.2], hc: -88.8, sh: -75, hip: -46, arm: [18.5, 17], armW: 5.6, handR: 2.9, legW: 6, eyes: 'anime', eyeX: 4.3, eyeY: 1.8, eyeS: 1, nose: true, brow: .7, hairK: 1.1, chin: true,
      heights: { non: 1, kong: .87, oy: .9 } },
  };
  let V = VAR.v1;

  // ---------- local space ----------
  let X = 0, FY = 0, U = 1, F = 1;
  const L = (x, y) => [X + x * U * F, FY + y * U];
  const LP = a => a.map(([x, y]) => L(x, y));
  const toLocal = ([x, y]) => [(x - X) / (U * F), (y - FY) / U];
  const sh = (pts, col, o = {}) => paint(pts, { wash: col, washOp: o.op ?? 255, ink: o.noInk ? null : C.ink, sw: o.sw ?? 1, br: 'ink', curv: o.curv ?? .5 });
  const dense = P => P.length > 2 ? P : [P[0], [(P[0][0] + P[1][0]) / 2, (P[0][1] + P[1][1]) / 2], P[1]];
  const ln = (pts, sw = .8, col = C.ink) => inkLine(dense(pts), sw, col, 'ink', .5);
  function ik(s, t, L1, L2, bend) {
    const dx = t[0] - s[0], dy = t[1] - s[1], D = Math.hypot(dx, dy) || 1e-6, d = Math.min(D, L1 + L2 - .01);
    const a = Math.atan2(dy, dx), b = Math.acos(clamp((L1 * L1 + d * d - L2 * L2) / (2 * L1 * d), -1, 1)) * bend;
    const e = [s[0] + Math.cos(a + b) * L1, s[1] + Math.sin(a + b) * L1];
    return { e, w: [s[0] + dx * d / D, s[1] + dy * d / D] };
  }

  // ---------- face ----------
  // head centre (hx, hy) in world px, unit u, facing f; e = { eyes, brow, mouth, look: [dx, dy] }
  function face(who, hx, hy, u, f, e) {
    const [rx, ry] = V.head, look = e.look || [0, 0], k = V.eyeS;
    const P = (x, y) => [hx + (x + look[0] * 1.6) * u * f, hy + (y + look[1] * 1.2) * u];
    const iris = C[who + 'Iris'];
    for (const s of [-1, 1]) {
      const [ex, ey] = P(s * V.eyeX, V.eyeY);
      const kind = e.eyes || 'open', wide = kind === 'wide' ? 1.25 : 1;
      if (kind === 'happy') { ln([[ex - 2.6 * k * u, ey + .6 * u], [ex, ey - 1.8 * k * u], [ex + 2.6 * k * u, ey + .6 * u]], 1.3 * u / 4); continue; }
      if (kind === 'shut') { ln([[ex - 2.6 * k * u, ey], [ex, ey + 1 * u], [ex + 2.6 * k * u, ey]], 1.1 * u / 4); continue; }
      if (V.eyes === 'bead') {
        sh(ellPts(ex, ey, 2.5 * k * wide * u, 3.1 * k * wide * u, 16), C.ink, { noInk: true });
        paint(ellPts(ex + .9 * u, ey - 1.1 * u, .9 * u, .9 * u, 8), { wash: C.white, ink: null });
        paint(ellPts(ex - .8 * u, ey + 1 * u, .45 * u, .45 * u, 6), { wash: C.white, ink: null });
      } else if (V.eyes === 'toon') {
        sh(ellPts(ex, ey, 2.8 * k * wide * u, 3.6 * k * wide * u, 18), C.white, { sw: .8 });
        const px = ex + look[0] * 1.1 * u * f, py = ey + look[1] * 1.1 * u + .4 * u;
        paint(ellPts(px, py, 1.45 * u * (wide > 1 ? .8 : 1), 1.8 * u * (wide > 1 ? .8 : 1), 12), { wash: C.ink, ink: null });
        paint(ellPts(px + .5 * u, py - .7 * u, .45 * u, .45 * u, 6), { wash: C.white, ink: null });
      } else {
        sh(ellPts(ex, ey + .2 * u, 2.6 * wide * u, 3.2 * wide * u, 18), C.white, { sw: .5, noInk: true });
        const px = ex + look[0] * .9 * u * f, py = ey + look[1] * .9 * u + .5 * u;
        paint(ellPts(px, py, 1.9 * u, 2.6 * u, 14), { wash: iris, ink: null });
        paint(ellPts(px, py + .3 * u, 1 * u, 1.4 * u, 10), { wash: mixCol(iris, C.ink, .6), ink: null });
        paint(ellPts(px + .7 * u, py - 1 * u, .7 * u, .9 * u, 8), { wash: C.white, ink: null });
        paint(ellPts(px - .6 * u, py + 1.2 * u, .35 * u, .35 * u, 6), { wash: C.white, ink: null });
        ln([[ex - 3 * u, ey - 1.6 * u], [ex - .4 * u, ey - 3.3 * wide * u], [ex + 2.9 * u, ey - 2.2 * u]], 1.5 * u / 4);    // upper lash line
      }
      // tired lids (Kong, resting): skin lid over the top of the eye and a bag under it
      if (kind === 'tired') {
        const lw = (V.eyes === 'bead' ? 2.9 : 3.1) * k * u;
        paint([[ex - lw, ey - .2 * u], [ex - lw * .6, ey - 4 * u], [ex + lw * .6, ey - 4 * u], [ex + lw, ey - .2 * u]], { wash: C.skin, ink: null, curv: .4 });
        ln([[ex - lw, ey - .1 * u], [ex, ey - .6 * u], [ex + lw, ey - .1 * u]], 1.1 * u / 4);
        ln([[ex - 2 * u, ey + 3.4 * k * u], [ex, ey + 4 * k * u], [ex + 2 * u, ey + 3.4 * k * u]], .5 * u / 4, mixCol(C.kongHoodDk, C.ink, .3));
      }
    }
    // brows
    const bl = e.brow ?? 0, ba = e.browA ?? 0;
    for (const s of [-1, 1]) {
      const [bx, by] = P(s * V.eyeX, V.eyeY - 4.8 * V.eyeS - bl * 1.6 - (V.eyes === 'toon' ? 1 : 0));
      const tilt = (ba + (e.browOne && s === 1 ? -.8 : 0)) * u;
      ln([[bx - 2.4 * u, by + s * tilt * f], [bx, by - .5 * u], [bx + 2.4 * u, by - s * tilt * f]], V.brow * u / 4);
    }
    // nose
    if (V.nose) { const [nx, ny] = P(.4, V.eyeY + 3.2); ln([[nx, ny - .6 * u], [nx + .7 * u * f, ny + .5 * u], [nx - .2 * u * f, ny + .9 * u]], .5 * u / 4); }
    // mouth
    const [mx, my] = P(0, V.eyeY + (V.eyes === 'bead' ? 6.4 : 6.2));
    const m = e.mouth || 'smile', mw = V.eyes === 'bead' ? 2.2 : 2.6;
    if (m === 'o') sh(ellPts(mx, my + .6 * u, 1.6 * u, 2.1 * u, 12), '#8E3A34', { sw: .6 });
    else if (m === 'grin') sh([[mx - 3.6 * u, my - .4 * u], [mx + 3.6 * u, my - .4 * u], [mx + 2.4 * u, my + 2.6 * u], [mx, my + 3.4 * u], [mx - 2.4 * u, my + 2.6 * u]], '#8E3A34', { sw: .6, curv: .5 });
    else if (m === 'flat') ln([[mx - mw * u, my + .4 * u], [mx, my + .5 * u], [mx + mw * u, my + .3 * u]], .9 * u / 4);
    else if (m === 'smirk') ln([[mx - mw * u, my + .5 * u], [mx + .4 * u * f, my + .8 * u], [mx + (mw + .4) * u * f, my - .7 * u]], .9 * u / 4);
    else ln([[mx - mw * u, my], [mx, my + 1.3 * u], [mx + mw * u, my]], .9 * u / 4);
    // cheeks
    for (const s of [-1, 1]) { const [cx, cy] = P(s * (V.eyeX + 2.6), V.eyeY + 3.6); paint(ellPts(cx, cy, 2.4 * u, 1.3 * u, 10), { wash: C.blush, washOp: e.eyes === 'happy' ? 150 : 95, ink: null }); }
  }

  // hair and head-wear in units of the head radius (x across, y down from the head centre)
  const HAIR = {
    non: { front: [[-1.06, .05], [-1.02, -.6], [-.6, -1.02], [.1, -1.1], [.72, -.95], [1.06, -.5], [1.06, .02], [.86, -.3], [.55, -.62], [.05, -.7], [-.45, -.55], [-.8, -.2]] },
    kong: { front: [[-1.06, .05], [-1.08, -.6], [-.62, -1.0], [-.1, -1.06], [.08, -1.48], [.3, -1.04], [.8, -.9], [1.08, -.45], [1.04, .08], [.78, -.32], [.36, -.5], [-.1, -.42], [-.5, -.5], [-.86, -.16]] },
    oy: { back: [[-1.12, -.2], [-1.2, .55], [-.9, .78], [.9, .78], [1.2, .55], [1.12, -.2]],
      front: [[-1.12, .5], [-1.12, -.5], [-.66, -1.0], [.05, -1.1], [.72, -.98], [1.12, -.52], [1.12, .5], [.92, .52], [.86, -.36], [.5, -.62], [-.2, -.6], [-.6, -.36], [-.92, -.32], [-.94, .52]] },
  };
  function hairPts(list, hx, hy, rx, ry, u, f, spiky) {
    const P = list.map(([x, y]) => [hx + x * rx * V.hairK * u * f, hy + y * ry * V.hairK * u]);
    if (!spiky) return P;
    // anime: break the fringe into points
    const out = [];
    for (let i = 0; i < P.length; i++) { out.push(P[i]); const a = P[i], b = P[(i + 1) % P.length];
      if (i >= P.length - 5 && i < P.length - 1) out.push([(a[0] + b[0]) / 2 + (hash(i) - .5) * 2 * u, (a[1] + b[1]) / 2 + 2.2 * u]); }
    return out;
  }
  // a whole head: ears, face shape, hair, face, glasses
  function head(who, hx, hy, u, f, e) {
    const [rx, ry] = V.head;
    boilSeed('head-' + who + hx);
    if (HAIR[who].back) sh(hairPts(HAIR[who].back, hx, hy, rx, ry, u, f), C[who + 'Hair']);
    for (const s of [-1, 1]) sh(ellPts(hx + s * (rx - .6) * u, hy + 1.2 * u, 2.3 * u, 3.1 * u, 10), C.skin, { sw: .7 });
    const shape = V.chin
      ? [[-rx, -ry * .2], [-rx * .96, -ry * .72], [-rx * .5, -ry], [rx * .5, -ry], [rx * .96, -ry * .72], [rx, -ry * .2], [rx * .82, ry * .5], [rx * .28, ry * .98], [0, ry * 1.04], [-rx * .28, ry * .98], [-rx * .82, ry * .5]].map(([x, y]) => [hx + x * u, hy + y * u])
      : ellPts(hx, hy, rx * u, ry * u, 30);
    sh(shape, C.skin, { sw: 1.1 });
    face(who, hx, hy, u, f, e);
    sh(hairPts(HAIR[who].front, hx, hy, rx, ry, u, f, V.chin), C[who + 'Hair']);
    const look = e.look || [0, 0];
    if (who === 'non') {
      for (const s of [-1, 1]) { const gx = hx + (s * V.eyeX + look[0] * 1.6) * u * f, gy = hy + (V.eyeY + look[1] * 1.2 + .3) * u, gw = 3.6 * V.eyeS * u;
        sh(rrPts(gx - gw, gy - gw * .78, gw * 2, gw * 1.56, gw * .3), C.glass, { op: 50, sw: .9 }); }
      ln([[hx + (-V.eyeX + 3.6 * V.eyeS + look[0] * 1.6) * u * f, hy + (V.eyeY + look[1] * 1.2) * u], [hx + (V.eyeX - 3.6 * V.eyeS + look[0] * 1.6) * u * f, hy + (V.eyeY + look[1] * 1.2) * u]], .8);
      sh(ribbon([[hx - (rx + .8) * u * f, hy - ry * .7 * u], [hx - (rx - 2.6) * u * f, hy + .4 * u]], 1.8 * u, 1.5 * u), C.amber, { sw: .6, curv: 0 });   // pen behind the ear
    }
    if (who === 'oy') {
      for (const s of [-1, 1]) { const gx = hx + (s * V.eyeX + look[0] * 1.6) * u * f, gy = hy + (V.eyeY + look[1] * 1.2 + 1.4) * u, gr = 3.3 * V.eyeS * u;
        sh(ellPts(gx, gy, gr, gr * .92, 16), C.glass, { op: 45, sw: .8 }); }
    }
  }

  // ---------- bodies ----------
  function arm(s, tw, up, fore, o = {}) {
    const t = toLocal(tw), { e, w } = ik(s, t, V.arm[0], V.arm[1], o.bend ?? 1);
    if (V.eyes === 'toon') sh(ribbon(through(LP([s, e, w]), 4), V.armW * U, V.armW * .9 * U), up, { curv: .4 });    // noodle arm
    else { sh(ribbon(LP([s, e]), V.armW * U, V.armW * .88 * U), up, { curv: .4 }); sh(ribbon(LP([e, w]), V.armW * .88 * U, V.armW * .72 * U), fore, { curv: .4 }); }
    const hw = L(w[0], w[1]);
    if (o.point) { const d = [w[0] - e[0], w[1] - e[1]], n = Math.hypot(d[0], d[1]) || 1, tip = [w[0] + d[0] / n * V.handR * 1.9, w[1] + d[1] / n * V.handR * 1.9];
      sh(ribbon(LP([w, tip]), V.handR * .62 * U, V.handR * .5 * U), C.skin, { sw: .7 }); }
    sh(ellPts(hw[0], hw[1], V.handR * U, V.handR * .92 * U, 14), C.skin, { sw: .8 });
    return hw;
  }
  function legs(col, gap, w = V.legW) {
    for (const s of [-1, 1]) {
      sh(ribbon(LP([[s * gap, V.hip + 2], [s * (gap + .3), V.hip / 2], [s * (gap + .6), -3]]), w * U, w * .85 * U), col, { curv: .3 });
      const fx = s * (gap + .6);
      sh(LP([[fx - w * .55, -4.6], [fx + w * .7, -4.6], [fx + w * .95, 0], [fx - w * .65, 0]]), C.shoe, { curv: .4, sw: .8 });
    }
  }
  const torso = (sw, hw, b, top, bot, col) => sh(LP([[-sw, top], [sw, top], [sw + b, (top + bot) / 2], [hw, bot], [-hw, bot], [-sw - b, (top + bot) / 2]]), col, { curv: .45 });
  function neck(top, bot) { sh(LP([[-2.6, top], [2.6, top], [3, bot], [-3, bot]]), C.skinDk, { sw: .6 }); }

  const BODY = {
    non(e, t) {
      const s = V.sh, hp = V.hip, sw = V.eyes === 'toon' ? 9.5 : 11.5;
      legs(C.nonPants, V.eyes === 'bead' ? 5.6 : 4.2);
      neck(V.hc + V.head[1] * .8, s + 2);
      // notebook in the back hand (behind the body), screwdriver twirling in the front one
      const nb = arm([-sw + 1, s + 2.5], L(-sw - 2.5, hp - 4), C.nonShirt, C.skin, { bend: -1 });
      sh(rrPts(nb[0] - 5 * U, nb[1] - 6 * U, 9 * U, 12 * U, 1 * U), C.notebook, { sw: .8 });
      torso(sw, sw - 1.2, 0, s, hp + 2, C.nonShirt);
      ln(LP([[0, s + 1], [0, hp]]), .6); ln(LP([[-3.6, s], [0, s + 5], [3.6, s]]), .7);
      const hw = arm([sw - 1, s + 2.5], L(sw + 5, s - 5), C.nonShirt, C.skin, { bend: 1 });
      const a = -1.25 + .3 * Math.sin(t * 2.4), len = 13 * U;
      ln([hw, [hw[0] + Math.cos(a) * len, hw[1] + Math.sin(a) * len]], 1.3, '#9AA3A8');
      sh(ribbon([[hw[0] - Math.cos(a) * 4.5 * U, hw[1] - Math.sin(a) * 4.5 * U], [hw[0] + Math.cos(a) * 1.5 * U, hw[1] + Math.sin(a) * 1.5 * U]], 3 * U, 2.4 * U), C.tool, { sw: .7, curv: 0 });
      sh(ellPts(hw[0], hw[1], V.handR * U, V.handR * .92 * U, 14), C.skin, { sw: .8 });
    },
    kong(e, t) {
      const s = V.sh, hp = V.hip, sw = V.eyes === 'toon' ? 15 : 14;
      legs(C.kongPants, V.eyes === 'bead' ? 5.4 : 4.6);
      sh(ellPts(...L(0, s), 11 * U, 4.6 * U, 18), C.kongHoodDk, { sw: .9 });          // hood
      neck(V.hc + V.head[1] * .8, s + 2);
      torso(sw, sw + (V.eyes === 'toon' ? 3 : 1.5), V.eyes === 'toon' ? 4 : 2.4, s, hp + 5, C.kongHood);
      sh(LP([[-8, hp - 6], [8, hp - 6], [9.5, hp + 3], [-9.5, hp + 3]]), C.kongHoodDk, { sw: .7, curv: .3 });   // pocket
      ln(LP([[-2.6, s + 1], [-3.2, s + 9]]), .6); ln(LP([[2.6, s + 1], [3.2, s + 9]]), .6);
      const mh = arm([-sw + 1.5, s + 3], L(-2, s + 14), C.kongHood, C.kongHood, { bend: -1 });
      sh(rrPts(mh[0] - 3.4 * U, mh[1] - 6.5 * U, 7.5 * U, 8.5 * U, 1.3 * U), C.mug, { sw: .8 });
    },
    oy(e, t) {
      const s = V.sh, hp = V.hip;
      legs(C.skin, V.eyes === 'bead' ? 4.6 : 3.6, V.legW * .78);
      sh(LP([[-12, hp - 2], [12, hp - 2], [16, (hp + 0) * .45], [-16, (hp + 0) * .45]]), C.oySkirt, { curv: .3 });   // skirt
      neck(V.hc + V.head[1] * .8, s + 2);
      torso(11, 13.5, 1, s, hp, C.oyCardi);
      sh(LP([[-3.8, s], [3.8, s], [3.4, hp], [-3.4, hp]]), C.oyTop, { sw: .6, curv: .2 });
      // the chain of her glasses
      ln(LP([[-V.eyeX - 3, V.hc + V.eyeY + 2], [-V.head[0] - .5, V.hc + V.head[1] * .7], [-6, s + 6], [0, s + 9], [6, s + 6], [V.head[0] + .5, V.hc + V.head[1] * .7], [V.eyeX + 3, V.hc + V.eyeY + 2]]), .5, C.amber);
      // the folder hugged to her chest
      const [fx, fy0] = L(1, s + 13);
      push(); translate(fx, fy0); rotate(-.12);
      sh(rectPts(-12 * U, -10 * U, 24 * U, 19 * U), C.folder, { sw: .9, curv: 0 });
      ln([[-10 * U, -5 * U], [8 * U, -5 * U]], .5); ln([[-10 * U, -1 * U], [5 * U, -1 * U]], .5);
      pop();
      arm([-10.5, s + 2.5], L(-5, s + 15), C.oyCardi, C.oyCardi, { bend: -1 });
      arm([10.5, s + 2.5], L(7, s + 18), C.oyCardi, C.oyCardi, { bend: 1 });
    },
  };
  function person(who, x, fy, h, e, t) {
    X = x; FY = fy; U = h / 100; F = 1;
    boilSeed('body-' + who);
    paint(ellPts(x, fy + 4, 20 * U, 3 * U, 20), { wash: C.guide, washOp: 120, ink: null });   // floor shadow
    BODY[who](e, t);
    X = x; FY = fy; U = h / 100; F = 1;
    const [hx, hy] = L(0, V.hc);
    head(who, hx, hy, U, 1, e);
  }

  // ---------- sheet ----------
  const NAMES = { non: 'นนท์', kong: 'ก้อง', oy: 'พี่อ้อย' };
  const EXPR = [
    ['ปกติ', who => ({ eyes: who === 'kong' ? 'tired' : 'open', mouth: who === 'non' ? 'smirk' : who === 'oy' ? 'flat' : 'smile', look: [.2, 0] })],
    ['ตกใจ', () => ({ eyes: 'wide', brow: 1.4, mouth: 'o' })],
    ['หัวเราะ', () => ({ eyes: 'happy', brow: .8, mouth: 'grin' })],
    ['ครุ่นคิด', () => ({ eyes: 'open', brow: .2, browA: .5, browOne: true, mouth: 'smirk', look: [.6, -.5] })],
  ];
  const label = (txt, x, y, size, col = C.ink) => letter(txt, x, y, size, col, { ink: false, font: `700 ${size}px "Charm", "Patrick Hand", sans-serif`, screen: true });

  function sheet(key, t) {
    V = VAR[key];
    boilSeed('bg');
    paint(rectPts(-40, -40, W + 80, H + 80), { wash: C.paper, ink: null });
    paint(rrPts(1080, 30, 810, 1020, 28), { wash: C.panel, ink: null });
    paint(rrPts(1080, 30, 810, 1020, 28), { fill: mixCol(C.panel, C.guide, .5), fillOp: 60, bleed: .15, tex: .6, ink: null });
    label(V.name, 520, 62, 46);
    label(V.note, 520, 112, 24, mixCol(C.ink, C.paper, .3));
    // full bodies against head-height guides
    const foot = 990, tall = key === 'v1' ? 650 : 760, H0 = tall, headH = 2 * V.head[1] * H0 / 100;
    boilSeed('guides');
    for (let i = 0; i * headH < tall + 10; i++) { const y = foot - i * headH; inkLine([[60, y], [520, y + 1], [1040, y]], .35, C.guide, 'inkfine', 0); label(String(i), 40, y - 14, 18, C.guide); }
    const xs = { non: 210, kong: 520, oy: 860 };
    for (const who of ['non', 'kong', 'oy']) {
      const h = H0 * V.heights[who], e = EXPR[0][1](who);
      if (who === 'kong') { e.eyes = 'open'; e.mouth = 'o'; e.brow = .6; e.look = [.5, -.3]; }
      if (who === 'oy') e.look = [-.5, 0];
      person(who, xs[who], foot, h, e, t);
      label(NAMES[who], xs[who], foot + 46, 34);
    }
    // expressions
    const rows = ['non', 'kong', 'oy'], u = 66 / V.head[1];
    EXPR.forEach(([n], c) => label(n, 1180 + c * 190, 72, 26));
    rows.forEach((who, r) => {
      EXPR.forEach(([, fn], c) => {
        const cx = 1180 + c * 190, cy = 240 + r * 300;
        boilSeed('neck-' + who + c);
        const col = who === 'non' ? C.nonShirt : who === 'kong' ? C.kongHood : C.oyCardi;
        sh(rrPts(cx - 52, cy + V.head[1] * u * .85, 104, 60, 22), col, { sw: .9 });
        head(who, cx, cy, u, 1, fn(who));
      });
    });
  }
  for (const k of ['v1', 'v2', 'v3']) { LOOPS['cast_' + k] = t => sheet(k, t); LOOPS['cast_' + k].len = 4; }
})();
