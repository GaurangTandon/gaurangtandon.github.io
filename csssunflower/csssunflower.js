/**
 * @typedef {{ x: number, y: number, id: string, orientation: number }} Mirror
 * @typedef {{ x: number, y: number }} GridPos
 * @typedef {{ x: number, y: number, dir: number }} BeamCell
 */

/** @type {number} */
const CELL_SIZE = 72;
/** @type {number} */
const TRI_SIZE = 48;

/**
 * Radio buttons for each mirror, default-checked to the mirror's orientation.
 * @param {Mirror[]} mirrors
 * @returns {string}
 */
function buildMirrorInputRadios(mirrors) {
  return mirrors.map((mirror) => [0, 1, 2, 3].map(s =>
    `  <input type="radio" name="${mirror.id}" id="${mirror.id}-s${s}"${s === mirror.orientation ? ' checked' : ''}>`
  ).join('\n')).join('\n');
}

/**
 * CSS to handle all four orientations of each mirror.
 * @param {Mirror[]} mirrors
 * @returns {string}
 */
function buildMirrorCSS(mirrors) {
  return mirrors.map(({ id }) => {
    /** @type {string} */
    const steps = [1, 2, 3].map(s => {
      /** @type {number} */
      const deg = s * 90;
      return `  #${id}-s${s}:checked ~ .grid .${id} .triangle { transform: rotate(${deg}deg); }
  #${id}-s${s}:checked ~ .grid .${id} .lnk-0 { display: none; }
  #${id}-s${s}:checked ~ .grid .${id} .lnk-${s} { display: block; }
  #${id}-s${s}:checked ~ .grid .${id} .tri-label { opacity: 0.7; color: #7070a0; }`;
    }).join('\n');

    /** @type {string} */
    const reset = `  #${id}-s0:checked ~ .grid .${id} .triangle { transform: rotate(0deg); }
  #${id}-s0:checked ~ .grid .${id} .lnk-0 { display: block; }
  #${id}-s0:checked ~ .grid .${id} .lnk-1 { display: none; }
  #${id}-s0:checked ~ .grid .${id} .lnk-2 { display: none; }
  #${id}-s0:checked ~ .grid .${id} .lnk-3 { display: none; }
  #${id}-s0:checked ~ .grid .${id} .tri-label { opacity: 0.5; color: #a0a0b8; }`;

    return steps + '\n' + reset;
  }).join('\n');
}

/**
 * HTML to show the mirror icon in one cell.
 * @param {Mirror} mirror
 * @returns {string}
 */
function buildMirrorHTML({ x, y, id }) {
  return `      <div class="cell mirror-cell" style="grid-column:${x + 1}; grid-row:${y + 1};" title="mirror (${x},${y})">
        <div class="tri-wrap ${id}">
          <div class="scene">
            <div class="triangle">
              <div class="shine-beam"></div>
              <div class="shine-edge"></div>
              <div class="dark-edges"></div>
              <div class="bevel"></div>
              <div class="bevel-shadow"></div>
            </div>
            <label for="${id}-s1" class="overlay lnk-0" aria-label="rotate ${id}"></label>
            <label for="${id}-s2" class="overlay lnk-1" aria-label="rotate ${id}"></label>
            <label for="${id}-s3" class="overlay lnk-2" aria-label="rotate ${id}"></label>
            <label for="${id}-s0" class="overlay lnk-3" aria-label="rotate ${id}"></label>
          </div>
        </div>
      </div>`;
}

/**
 * HTML to show the sun icon in one cell.
 * @param {number} x
 * @param {number} y
 * @returns {string}
 */
function buildSunHTML(x, y) {
  /** @type {string} */
  const rays = Array.from({ length: 12 }, (_, i) =>
    `<div class="sun-ray" style="transform:rotate(${i * 30}deg)"></div>`
  ).join('');
  /** @type {string} */
  const innerRays = Array.from({ length: 12 }, (_, i) =>
    `<div class="sun-ray-inner" style="transform:rotate(${i * 30 + 15}deg)"></div>`
  ).join('');
  return `      <div class="cell sun-cell" id="sun-${x}-${y}" style="grid-column:${x + 1}; grid-row:${y + 1};" title="☀ sun">
        <div class="sun">
          <div class="sun-halo"></div>
          <div class="sun-rays">${rays}${innerRays}</div>
          <div class="sun-core">
            <div class="sun-glint"></div>
          </div>
        </div>
      </div>`;
}

/**
 * HTML to show the plant icon in one cell.
 * @param {number} x
 * @param {number} y
 * @returns {string}
 */
function buildPlantHTML(x, y) {
  return `      <div class="cell plant-cell" id="plant-${x}-${y}" style="grid-column:${x + 1}; grid-row:${y + 1};" title="🌻 sunflower">
        <div class="plant">
          <div class="plant-top">
            <div class="flower-head">
              <div class="petal p0"></div>
              <div class="petal p1"></div>
              <div class="petal p2"></div>
              <div class="petal p3"></div>
              <div class="petal p4"></div>
              <div class="petal p5"></div>
              <div class="petal p6"></div>
              <div class="petal p7"></div>
              <div class="flower-center"></div>
            </div>
            <div class="leaf leaf-left"></div>
            <div class="leaf leaf-right"></div>
            <div class="stem"></div>
          </div>
          <div class="pot-rim"></div>
          <div class="pot"></div>
        </div>
      </div>`;
}

/**
 * @param {number} rows
 * @param {number} cols
 * @returns {string}
 */
function buildLightBeams(rows, cols) {
  /** @type {string} */
  let lightBeams = '';
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      lightBeams += `    <div id="l-${row}-${col}-0" class="light-beam light-d" style="grid-column:${col + 1}; grid-row:${row + 1};"></div>\n`;
      lightBeams += `    <div id="l-${row}-${col}-1" class="light-beam light-u" style="grid-column:${col + 1}; grid-row:${row + 1};"></div>\n`;
      lightBeams += `    <div id="l-${row}-${col}-2" class="light-beam light-r" style="grid-column:${col + 1}; grid-row:${row + 1};"></div>\n`;
      lightBeams += `    <div id="l-${row}-${col}-3" class="light-beam light-l" style="grid-column:${col + 1}; grid-row:${row + 1};"></div>\n`;
    }
  }
  return lightBeams;
}

// ── Direction helpers ─────────────────────────────────────────────────────────

/** @type {ReadonlyArray<[number, number]>} */
const DELTAS = [[0, 1], [0, -1], [1, 0], [-1, 0]]; // DOWN, UP, RIGHT, LEFT

/**
 * @param {number} dirIdx  0=DOWN 1=UP 2=RIGHT 3=LEFT
 * @returns {[number, number]}
 */
function getDelta(dirIdx) { return DELTAS[dirIdx]; }

/**
 * For a given incoming direction, return the two possible mirror reflections.
 * @param {number} dirIdx
 * @returns {Array<{orientation: number, outDir: number}>}
 */
function getReflections(dirIdx) {
  /** @type {Record<number, Array<{orientation: number, outDir: number}>>} */
  const TABLE = {
    0: [{ orientation: 0, outDir: 2 }, { orientation: 3, outDir: 3 }],
    1: [{ orientation: 1, outDir: 2 }, { orientation: 2, outDir: 3 }],
    2: [{ orientation: 2, outDir: 0 }, { orientation: 3, outDir: 1 }],
    3: [{ orientation: 0, outDir: 1 }, { orientation: 1, outDir: 0 }],
  };
  return TABLE[dirIdx];
}

/**
 * Build all CSS rules that show light beams based on mirror orientations.
 * Beam IDs: l-{row}-{col}-{0=vertical|1=horizontal}
 *
 * @param {Mirror[]} mirrors
 * @param {number} rows
 * @param {number} cols
 * @param {GridPos[]} suns
 * @param {GridPos[]} plants
 * @returns {string}
 */
function buildLightCSS(mirrors, rows, cols, suns, plants) {
  /** @type {Record<string, number>} */
  const atPos = {};
  for (let i = 0; i < mirrors.length; i++) {
    atPos[`${mirrors[i].x},${mirrors[i].y}`] = i;
  }
  const plantSet = new Set(plants.map(p => `${p.x},${p.y}`));

  // [dx, dy, dstOrs, outDirs, beamDir]
  // dstOrs[k]: mirror orientation receiving light from this direction
  // outDirs[k]: direction index to continue after bouncing off dstOrs[k] mirror
  // beamDir: 0=down, 1=up, 2=right, 3=left
  /** @type {Array<[number, number, number[], number[], number]>} */
  const DIRS = [
    [0,  1, [0, 3], [2, 3], 0],  // DOWN  → beamDir 0
    [0, -1, [1, 2], [2, 3], 1],  // UP    → beamDir 1
    [1,  0, [2, 3], [0, 1], 2],  // RIGHT → beamDir 2
    [-1, 0, [0, 1], [1, 0], 3],  // LEFT  → beamDir 3
  ];

  const INCOMING_HALF = [
    'align-self: start; height: 50%',    // 0 DOWN:  top half
    'align-self: end; height: 50%',      // 1 UP:    bottom half
    'justify-self: start; width: 50%',   // 2 RIGHT: left half
    'justify-self: end; width: 50%',     // 3 LEFT:  right half
  ];
  const OUTGOING_HALF = [
    'align-self: end; height: 50%',      // 0 DOWN:  bottom half
    'align-self: start; height: 50%',    // 1 UP:    top half
    'justify-self: end; width: 50%',     // 2 RIGHT: right half
    'justify-self: start; width: 50%',   // 3 LEFT:  left half
  ];

  /** @type {string[]} */
  const resultRules = [];

  /**
   * Build CSS selector string from sorted selector parts.
   * @param {Array<{mirrorIdx: number, selector: string}>} parts
   * @param {string} beamId
   * @returns {string}
   */
  function toCSS(parts, beamId, clip) {
    const sorted = [...parts].sort((a, b) => a.mirrorIdx - b.mirrorIdx);
    const conditions = sorted.map(p => p.selector).join(' ~ ');
    const props = clip
      ? `display: block; ${clip};`
      : 'display: block;';
    return conditions
      ? `${conditions} ~ .grid #${beamId} { ${props} }`
      : `.grid #${beamId} { ${props} }`;
  }

  /**
   * @param {number} x
   * @param {number} y
   * @param {number} dirIdx
   * @param {Array<{mirrorIdx: number, selector: string}>} parts
   */
  function traverse(x, y, dirIdx, parts) {
    const [dx, dy, dstOrs, outDirs, beamDir] = DIRS[dirIdx];
    const visitedSet = new Set(parts.map(p => p.mirrorIdx));
    let cx = x + dx;
    let cy = y + dy;

    while (cx >= 0 && cx < cols && cy >= 0 && cy < rows) {
      const key = `${cx},${cy}`;
      const mirrorIdx = atPos[key];

      if (mirrorIdx !== undefined) {
        if (visitedSet.has(mirrorIdx)) break; // cycle prevention
        const mirror = mirrors[mirrorIdx];
        for (let k = 0; k < dstOrs.length; k++) {
          const newPart = { mirrorIdx, selector: `#${mirror.id}-s${dstOrs[k]}:checked` };
          parts.push(newPart);
          resultRules.push(toCSS(parts, `l-${cy}-${cx}-${beamDir}`, INCOMING_HALF[beamDir]));
          const outBeamDir = outDirs[k];
          resultRules.push(toCSS(parts, `l-${cy}-${cx}-${outBeamDir}`, OUTGOING_HALF[outBeamDir]));
          traverse(cx, cy, outBeamDir, parts);
          parts.pop();
        }
        break;
      }

      if (plantSet.has(key)) {
        resultRules.push(toCSS(parts, `l-${cy}-${cx}-${beamDir}`, 'opacity: 0'));
        break;
      }

      resultRules.push(toCSS(parts, `l-${cy}-${cx}-${beamDir}`));

      cx += dx;
      cy += dy;
    }
  }

  for (const sun of suns) {
    for (let dirIdx = 0; dirIdx < 4; dirIdx++) {
      traverse(sun.x, sun.y, dirIdx, []);
    }
  }

  return resultRules.join('\n');
}

/**
 * Build the full puzzle HTML document.
 * @param {number} cols
 * @param {number} rows
 * @param {Mirror[]} mirrors
 * @param {GridPos[]} suns
 * @param {GridPos[]} plants
 * @returns {string}
 */
function buildHTML(cols, rows, mirrors, suns, plants) {
  /** @type {number} */
  const gridW = cols * CELL_SIZE;
  /** @type {number} */
  const gridH = rows * CELL_SIZE;

  const mirrorSet = new Set(mirrors.map(m => `${m.x},${m.y}`));
  const sunSet = new Set(suns.map(s => `${s.x},${s.y}`));

  const specialCells = [
    ...suns.filter(s => !mirrorSet.has(`${s.x},${s.y}`)).map(s => buildSunHTML(s.x, s.y)),
    ...plants.filter(p => !mirrorSet.has(`${p.x},${p.y}`) && !sunSet.has(`${p.x},${p.y}`)).map(p => buildPlantHTML(p.x, p.y)),
  ].join('\n');

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>CSSSunflower</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  input[type="radio"] { position: absolute; opacity: 0; pointer-events: none; }
  :root {
    --cell: min(${CELL_SIZE}px, (100vw - 22px) / ${cols}, (100vh - 22px) / ${rows});
    --tri: calc(var(--cell) * ${TRI_SIZE} / ${CELL_SIZE});
    --s: tan(atan2(var(--cell), ${CELL_SIZE}px));
  }
  html, body {
    min-height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: 'DM Mono', monospace;
    background: #f4f3ee;
  }
  .grid {
    display: grid;
    grid-template-columns: repeat(${cols}, var(--cell));
    grid-template-rows:    repeat(${rows}, var(--cell));
    border: 1px solid #c8c4b8;
    border-radius: 10px;
    overflow: hidden;
    -webkit-user-select: none;
    user-select: none;
    -webkit-touch-callout: none;
    box-shadow:
      0 2px 8px rgba(0,0,0,0.06),
      0 8px 40px rgba(0,0,0,0.10),
      0 1px 2px rgba(0,0,0,0.04);
    background: #f8f7f2;
  }
  .cell {
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px dashed #d0cdc4;
    position: relative;
    background: #f8f7f2;
  }
  .mirror-cell, .sun-cell, .plant-cell {
    border-style: solid;
    border-color: #c8c4b8;
    border: none;
  }
  /* ── Mirror ── */
  .tri-wrap {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
  }
  .tri-label {
    font-size: 9px;
    letter-spacing: 0.15em;
    color: #a0a0b8;
    text-transform: uppercase;
    transition: color 0.4s, opacity 0.4s;
    opacity: 0.5;
  }
  .scene {
    position: relative;
    width:  var(--tri);
    height: var(--tri);
    cursor: pointer;
    filter: drop-shadow(0 3px 10px rgba(80,80,130,0.22)) drop-shadow(0 1px 3px rgba(80,80,130,0.14));
    transition: filter 0.3s;
  }
  .scene:hover {
    filter: drop-shadow(0 5px 18px rgba(80,80,180,0.38)) drop-shadow(0 2px 6px rgba(80,80,180,0.2));
  }
  .triangle {
    width: 100%;
    height: 100%;
    clip-path: polygon(0 0, 0% 100%, 100% 100%);
    transform: rotate(0deg);
    transition: transform 0.5s cubic-bezier(0.77, 0, 0.175, 1);
    position: relative;
    overflow: hidden;
    background: linear-gradient(145deg,
      #cccce0 0%,
      #eeeeff 15%,
      #b0b0cc 30%,
      #f0f0ff 48%,
      #a8a8c8 62%,
      #e4e4f8 78%,
      #c4c4dc 100%
    );
  }
  /* sweep shine beam */
  .shine-beam {
    position: absolute;
    inset: 0;
    background: linear-gradient(108deg,
      transparent 0%,
      transparent 28%,
      rgba(255,255,255,0.9) 44%,
      rgba(255,255,255,0.5) 50%,
      transparent 66%,
      transparent 100%
    );
    animation: mirror-sweep 4.5s ease-in-out infinite;
  }
  /* edge highlight */
  .shine-edge {
    position: absolute;
    inset: 0;
    background: linear-gradient(to bottom right,
      rgba(255,255,255,0.6) 0%,
      transparent 40%
    );
  }
  /* dark non-reflective edges (left + bottom) */
  .dark-edges {
    position: absolute; inset: 0;
    background:
      linear-gradient(to right, rgba(60,60,90,0.5) 0%, rgba(60,60,90,0.15) 6%, transparent 14%),
      linear-gradient(to top,   rgba(60,60,90,0.5) 0%, rgba(60,60,90,0.15) 6%, transparent 14%);
    z-index: 2;
  }
  /* reflective bevel along hypotenuse */
  .bevel {
    position: absolute;
    top: 0; left: 0;
    width: 141.4%;
    height: 8px;
    background: linear-gradient(180deg,
      rgba(255,255,255,0.9) 0%,
      rgba(200,210,240,0.7) 40%,
      rgba(160,170,210,0.3) 70%,
      transparent 100%);
    transform-origin: 0 0;
    transform: rotate(45deg);
    z-index: 3;
  }
  .bevel-shadow {
    position: absolute;
    top: 0; left: 0;
    width: 141.4%;
    height: 2px;
    background: rgba(255,255,255,0.95);
    transform-origin: 0 0;
    transform: rotate(45deg);
    box-shadow: 0 1px 4px rgba(100,110,180,0.4);
    z-index: 4;
  }
  @keyframes mirror-sweep {
    0%, 25% { transform: translateX(-180%) skewX(-6deg); opacity: 0; }
    30%      { opacity: 1; }
    85%, 100% { transform: translateX(220%) skewX(-6deg); opacity: 0; }
  }
  .overlay {
    position: absolute;
    inset: 0;
    display: none;
    cursor: pointer;
    z-index: 10;
  }
  .lnk-0 { display: block; }
  /* ── Sun ── */
  .sun-cell {
    background: radial-gradient(ellipse at 50% 50%, #fffde8 0%, #fff8cc 60%, #ffeea0 100%);
  }
  .sun {
    position: relative;
    width: 76px; height: 76px;
    display: flex; align-items: center; justify-content: center;
    scale: var(--s);
  }
  .sun-halo {
    position: absolute;
    width: 60px; height: 60px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(255,220,60,0.35) 0%, transparent 70%);
    animation: halo-pulse 2.4s ease-in-out infinite;
  }
  .sun-core {
    width: 30px; height: 30px;
    border-radius: 50%;
    background: radial-gradient(circle at 32% 28%, #fffce0, #ffd700 45%, #ff9800 100%);
    box-shadow:
      0 0 0 3px rgba(255,220,60,0.3),
      0 0 14px 5px rgba(255,200,0,0.5),
      0 0 30px 10px rgba(255,210,0,0.25);
    animation: sun-pulse 2.4s ease-in-out infinite;
    position: relative;
    z-index: 2;
  }
  .sun-glint {
    position: absolute;
    top: 5px; left: 6px;
    width: 8px; height: 5px;
    border-radius: 50%;
    background: rgba(255,255,255,0.7);
    transform: rotate(-30deg);
  }
  .sun-rays {
    position: absolute;
    inset: 0;
    animation: sun-spin 14s linear infinite;
  }
  .sun-ray {
    position: absolute;
    left: calc(50% - 1.5px);
    top: 2px;
    width: 3px;
    height: 10px;
    background: linear-gradient(to top, transparent, #ffcc00);
    border-radius: 2px;
    transform-origin: 1.5px 36px;
  }
  .sun-ray-inner {
    position: absolute;
    left: calc(50% - 1px);
    top: 6px;
    width: 2px;
    height: 6px;
    background: linear-gradient(to top, transparent, rgba(255,200,0,0.6));
    border-radius: 1px;
    transform-origin: 1px 32px;
  }
  @keyframes sun-pulse {
    0%, 100% { transform: scale(1); }
    50% {
      transform: scale(1.15);
      box-shadow:
        0 0 0 5px rgba(255,220,60,0.35),
        0 0 22px 9px rgba(255,200,0,0.6),
        0 0 40px 14px rgba(255,210,0,0.3);
    }
  }
  @keyframes halo-pulse {
    0%, 100% { transform: scale(1); opacity: 0.7; }
    50% { transform: scale(1.3); opacity: 1; }
  }
  @keyframes sun-spin {
    to { transform: rotate(360deg); }
  }

  /* ── Plant ── */
  .plant-cell {
    background: radial-gradient(ellipse at 50% 85%, #e4f5da 0%, #f0f9ec 65%, #f6fcf4 100%);
  }
  .plant {
    display: flex;
    flex-direction: column;
    align-items: center;
    scale: var(--s);
  }
  .plant-top {
    position: relative;
    width: 56px;
    height: 64px;
    display: flex;
    align-items: flex-end;
    justify-content: center;
    animation: plant-sway 4.5s ease-in-out infinite;
    transform-origin: center bottom;
  }
  .stem {
    width: 4px;
    height: 36px;
    background: linear-gradient(to top, #587040, #4a9038);
    border-radius: 2px 2px 0 0;
    position: relative;
    z-index: 2;
  }
  .flower-head {
    position: absolute;
    width: 28px;
    height: 28px;
    left: 50%;
    bottom: 30px;
    transform: translateX(-50%);
    z-index: 3;
  }
  .petal {
    position: absolute;
    width: 9px;
    height: 12px;
    background: linear-gradient(to top, #f5b800, #ffe066);
    border-radius: 50% 50% 20% 20%;
    left: 50%;
    top: 50%;
    transform-origin: center bottom;
    box-shadow: inset 0 -2px 3px rgba(180,120,0,0.25);
  }
  .p0 { transform: translate(-50%, -100%) rotate(0deg); }
  .p1 { transform: translate(-50%, -100%) rotate(45deg); }
  .p2 { transform: translate(-50%, -100%) rotate(90deg); }
  .p3 { transform: translate(-50%, -100%) rotate(135deg); }
  .p4 { transform: translate(-50%, -100%) rotate(180deg); }
  .p5 { transform: translate(-50%, -100%) rotate(225deg); }
  .p6 { transform: translate(-50%, -100%) rotate(270deg); }
  .p7 { transform: translate(-50%, -100%) rotate(315deg); }
  .flower-center {
    position: absolute;
    width: 12px;
    height: 12px;
    background: radial-gradient(circle, #8d6e63 40%, #5d4037 100%);
    border-radius: 50%;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    z-index: 1;
    box-shadow: inset 0 1px 2px rgba(0,0,0,0.3);
  }
  .leaf {
    position: absolute;
    border-radius: 50% 0 50% 0;
    z-index: 1;
  }
  .leaf-left {
    width: 18px; height: 11px;
    background: linear-gradient(135deg, #78cc5e, #3e9032);
    right: calc(50%);
    bottom: 18px;
    transform-origin: right bottom;
    animation: leaf-left-sway 4.5s ease-in-out infinite;
    box-shadow: inset -2px -2px 4px rgba(0,0,0,0.15);
  }
  .leaf-right {
    width: 18px; height: 11px;
    background: linear-gradient(225deg, #78cc5e, #3e9032);
    border-radius: 0 50% 0 50%;
    left: calc(50%);
    bottom: 12px;
    transform-origin: left bottom;
    animation: leaf-right-sway 4.5s ease-in-out infinite;
    box-shadow: inset 2px -2px 4px rgba(0,0,0,0.15);
  }
  .pot-rim {
    width: 40px; height: 7px;
    background: linear-gradient(to bottom, #c86040, #b04838);
    border-radius: 3px 3px 0 0;
    position: relative;
    z-index: 3;
  }
  .pot-rim::before {
    content: '';
    position: absolute;
    top: 1px; left: 3px; right: 3px;
    height: 2px;
    background: rgba(255,255,255,0.2);
    border-radius: 2px;
  }
  .pot {
    width: 34px; height: 18px;
    background: linear-gradient(to bottom right, #c05838, #8c3820);
    border-radius: 0 0 7px 7px;
    box-shadow: 0 4px 10px rgba(0,0,0,0.18);
    position: relative;
    overflow: hidden;
  }
  .pot::after {
    content: '';
    position: absolute;
    left: 5px; top: 2px;
    width: 5px; height: 70%;
    background: rgba(255,255,255,0.18);
    border-radius: 3px;
  }
  @keyframes plant-sway {
    0%, 100% { transform: rotate(-4deg); }
    50% { transform: rotate(4deg); }
  }
  @keyframes leaf-left-sway {
    0%, 100% { transform: rotate(-18deg); }
    50% { transform: rotate(2deg); }
  }
  @keyframes leaf-right-sway {
    0%, 100% { transform: rotate(18deg); }
    50% { transform: rotate(-2deg); }
  }
  @keyframes leaf-top-sway {
    0%, 100% { transform: translateX(-50%) rotate(-9deg); }
    50% { transform: translateX(-50%) rotate(9deg) scale(1.06); }
  }

  /* ── Plant lit state ── */
  .plant-cell.plant-lit {
    background: radial-gradient(ellipse at 50% 60%, #fff176 0%, #ffe066 25%, #e4f5da 65%, #f6fcf4 100%);
    transition: background 0.6s ease;
  }
  .plant-cell.plant-lit .plant-top {
    animation: plant-bloom 0.5s cubic-bezier(0.34,1.56,0.64,1) forwards,
               plant-sway-lit 3s ease-in-out infinite 0.5s;
    transform-origin: center bottom;
  }
  .plant-cell.plant-lit .leaf {
    filter: brightness(1.25) saturate(1.6);
    transition: filter 0.4s;
  }
  .plant-cell.plant-lit .petal {
    background: linear-gradient(to top, #ffca28, #fff59d);
    filter: brightness(1.3) saturate(1.4);
    box-shadow: 0 0 6px rgba(255,200,0,0.6), inset 0 -2px 3px rgba(180,120,0,0.2);
    transition: filter 0.4s, box-shadow 0.4s;
  }
  .plant-cell.plant-lit .flower-center {
    background: radial-gradient(circle, #a1887f 30%, #6d4c41 100%);
    box-shadow: 0 0 8px rgba(255,200,0,0.5), inset 0 1px 2px rgba(0,0,0,0.2);
    transition: background 0.4s, box-shadow 0.4s;
  }
  .plant-cell.plant-lit .stem {
    background: linear-gradient(to top, #4a8030, #5cb845);
    box-shadow: 0 0 8px rgba(100,220,50,0.5);
  }
  @keyframes plant-bloom {
    0%   { transform: scale(1) rotate(-4deg); }
    40%  { transform: scale(1.22) rotate(2deg); }
    100% { transform: scale(1.08) rotate(-4deg); }
  }
  @keyframes plant-sway-lit {
    0%, 100% { transform: scale(1.08) rotate(-5deg); }
    50%       { transform: scale(1.08) rotate(5deg); }
  }

  /* ── Light beams ── */
  .light-beam { display: none; pointer-events: none; z-index: 5; }
  .light-d, .light-u {
    align-self: stretch;
    justify-self: center;
    width: calc(var(--cell) * 4 / ${CELL_SIZE});
    border-radius: calc(var(--cell) * 2 / ${CELL_SIZE});
    box-shadow: 0 0 calc(var(--cell) * 10 / ${CELL_SIZE}) calc(var(--cell) * 3 / ${CELL_SIZE}) rgba(255,200,0,0.5), 0 0 calc(var(--cell) * 3 / ${CELL_SIZE}) calc(var(--cell) / ${CELL_SIZE}) rgba(255,240,0,0.8);
    background: repeating-linear-gradient(
      to bottom,
      transparent 0px,
      rgba(255,210,0,0.15) calc(var(--cell) * 6 / ${CELL_SIZE}),
      rgba(255,230,0,0.95) calc(var(--cell) * 11 / ${CELL_SIZE}),
      rgba(255,210,0,0.15) calc(var(--cell) * 16 / ${CELL_SIZE}),
      transparent calc(var(--cell) * 22 / ${CELL_SIZE})
    );
  }
  .light-r, .light-l {
    align-self: center;
    justify-self: stretch;
    height: calc(var(--cell) * 4 / ${CELL_SIZE});
    border-radius: calc(var(--cell) * 2 / ${CELL_SIZE});
    box-shadow: 0 0 calc(var(--cell) * 10 / ${CELL_SIZE}) calc(var(--cell) * 3 / ${CELL_SIZE}) rgba(255,200,0,0.5), 0 0 calc(var(--cell) * 3 / ${CELL_SIZE}) calc(var(--cell) / ${CELL_SIZE}) rgba(255,240,0,0.8);
    background: repeating-linear-gradient(
      to right,
      transparent 0px,
      rgba(255,210,0,0.15) calc(var(--cell) * 6 / ${CELL_SIZE}),
      rgba(255,230,0,0.95) calc(var(--cell) * 11 / ${CELL_SIZE}),
      rgba(255,210,0,0.15) calc(var(--cell) * 16 / ${CELL_SIZE}),
      transparent calc(var(--cell) * 22 / ${CELL_SIZE})
    );
  }
  .light-d { animation: flow-d 0.65s linear infinite; }
  .light-u { animation: flow-u 0.65s linear infinite; }
  .light-r { animation: flow-r 0.65s linear infinite; }
  .light-l { animation: flow-l 0.65s linear infinite; }
  @keyframes flow-d { from { background-position: 0 0; } to { background-position: 0 calc(var(--cell) * 22 / ${CELL_SIZE}); } }
  @keyframes flow-u { from { background-position: 0 0; } to { background-position: 0 calc(var(--cell) * -22 / ${CELL_SIZE}); } }
  @keyframes flow-r { from { background-position: 0 0; } to { background-position: calc(var(--cell) * 22 / ${CELL_SIZE}) 0; } }
  @keyframes flow-l { from { background-position: 0 0; } to { background-position: calc(var(--cell) * -22 / ${CELL_SIZE}) 0; } }

${buildMirrorCSS(mirrors)}
${buildLightCSS(mirrors, rows, cols, suns, plants)}
</style>
</head>
<body>
${buildMirrorInputRadios(mirrors)}
  <div class="grid">
${mirrors.map(buildMirrorHTML).join('\n')}
${specialCells}
${buildLightBeams(rows, cols)}  </div>
</body>
</html>`;
}

// ── Audio ────────────────────────────────────────────────────────────────────

/** @type {AudioContext|null} */
let audioCtx = null;

/** @type {Array<{gain: GainNode, def: {type: OscillatorType, hz: number, detune: number, vol: number, threshold: number}}>|null} */
let audioLayers = null;

/** @type {boolean} */
let plantReached = false;

/** @type {GridPos[]} */
let soundPlants = [];

/** @type {boolean} */
let isMuted = false;



/** @returns {void} */
function initAudio() {
  if (audioCtx) return;
  const AC = window.AudioContext || /** @type {typeof AudioContext} */ (/** @type {any} */ (window).webkitAudioContext);
  if (!AC) return;
  audioCtx = new AC();
  audioLayers = [];
}

/**
 * @param {number} hz
 * @returns {void}
 */
function playNote(hz) {
  if (!audioCtx || isMuted) return;
  const now = audioCtx.currentTime;
  /**
   * @param {number} freq
   * @param {number} vol
   * @param {number} decay
   */
  function partial(freq, vol, decay) {
    const o = audioCtx.createOscillator();
    const g = audioCtx.createGain();
    o.type = 'sine';
    o.frequency.value = freq;
    g.gain.setValueAtTime(vol, now);
    g.gain.exponentialRampToValueAtTime(0.0001, now + decay);
    o.connect(g); g.connect(audioCtx.destination);
    o.start(now); o.stop(now + decay);
    o.onended = () => { o.disconnect(); g.disconnect(); };
  }
  partial(hz, 0.35, 0.9);
  partial(hz * 3.75, 0.08, 0.2);
}

/**
 * @param {Document} iframeDoc
 * @returns {{ visible: number, total: number }}
 */
function countBeams(iframeDoc) {
  const all = iframeDoc.querySelectorAll('.light-beam');
  let visible = 0;
  for (const el of all) {
    if (iframeDoc.defaultView.getComputedStyle(el).display !== 'none') visible++;
  }
  return { visible, total: all.length };
}

/**
 * @param {Document} iframeDoc
 * @returns {boolean}
 */
function isPlantLit(iframeDoc) {
  const view = iframeDoc.defaultView;
  return soundPlants.some(({ x, y }) =>
    [0, 1, 2, 3].some(dir => {
      const el = iframeDoc.getElementById(`l-${y}-${x}-${dir}`);
      return el && view.getComputedStyle(el).display !== 'none';
    })
  );
}

/** @returns {void} */
function playBloom() {
  if (!audioCtx) return;
  const now = audioCtx.currentTime;
  [523.25, 659.25, 784.00, 1046.50].forEach((hz, i) => {
    const t = now + i * 0.08;
    /**
     * @param {number} freq
     * @param {number} vol
     * @param {number} decay
     */
    function partial(freq, vol, decay) {
      const o = audioCtx.createOscillator();
      const g = audioCtx.createGain();
      o.type = 'sine'; o.frequency.value = freq;
      g.gain.setValueAtTime(0, t);
      g.gain.linearRampToValueAtTime(vol, t + 0.01);
      g.gain.exponentialRampToValueAtTime(0.0001, t + decay);
      o.connect(g); g.connect(audioCtx.destination);
      o.start(t); o.stop(t + decay);
      o.onended = () => { o.disconnect(); g.disconnect(); };
    }
    partial(hz, 0.4, 0.7);
    partial(hz * 3.75, 0.06, 0.15);
  });
}

/** @returns {void} */
function playDescend() {
  if (!audioCtx) return;
  const now = audioCtx.currentTime;
  [440.00, 349.23, 293.66].forEach((hz, i) => {
    const t = now + i * 0.09;
    const o = audioCtx.createOscillator();
    const g = audioCtx.createGain();
    o.type = 'sine'; o.frequency.value = hz;
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(0.18, t + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.5);
    o.connect(g); g.connect(audioCtx.destination);
    o.start(t); o.stop(t + 0.5);
    o.onended = () => { o.disconnect(); g.disconnect(); };
  });
}

/**
 * @param {Document} iframeDoc
 * @returns {void}
 */
function updateSound(iframeDoc) {
  if (!audioCtx || isMuted) return;
  const { visible, total } = countBeams(iframeDoc);
  if (total === 0) return;
  const ratio = Math.min(1.0, visible / (total * 0.15));
  const SCALE = [261.63, 293.66, 329.63, 392.00, 440.00,
                 523.25, 587.33, 659.25, 784.00, 880.00];
  const idx = Math.round(ratio * (SCALE.length - 1));
  playNote(SCALE[idx]);

  const reached = isPlantLit(iframeDoc);
  if (reached && !plantReached) {
    plantReached = true;
    playBloom();
    for (const { x, y } of soundPlants) {
      iframeDoc.getElementById(`plant-${x}-${y}`)?.classList.add('plant-lit');
    }
  } else if (!reached && plantReached) {
    plantReached = false;
    playDescend();
    for (const { x, y } of soundPlants) {
      iframeDoc.getElementById(`plant-${x}-${y}`)?.classList.remove('plant-lit');
    }
  }
}

/**
 * Attach sound event listener to the iframe's document.
 * @param {HTMLIFrameElement} iframe
 * @param {GridPos[]} plants
 * @returns {void}
 */
function attachSoundToIframe(iframe, plants) {
  soundPlants = plants;
  plantReached = false;

  if (audioCtx) {
    audioCtx.close();
    audioCtx = null;
    audioLayers = null;
  }

  const iframeDoc = iframe.contentDocument;
  iframeDoc.addEventListener('change', e => {
    if (!(e.target instanceof iframeDoc.defaultView.HTMLInputElement)) return;
    if (e.target.type !== 'radio') return;
    initAudio();
    requestAnimationFrame(() => updateSound(iframeDoc));
  });
}

// ── UI logic ────────────────────────────────────────────────────────────────

/**
 * @param {string} msg
 * @returns {void}
 */
function showError(msg) {
  const el = document.getElementById('error-msg');
  el.textContent = msg;
  el.classList.add('visible');
}

/** @returns {void} */
function clearError() {
  const el = document.getElementById('error-msg');
  el.textContent = '';
  el.classList.remove('visible');
  ['inp-cols', 'inp-rows', 'inp-tris', 'inp-suns', 'inp-plants'].forEach(id => {
    document.getElementById(id).classList.remove('error');
  });
}

/**
 * Parse space-separated "x,y" pairs into GridPos array.
 * @param {string} raw
 * @returns {GridPos[]}
 */
function parsePosInput(raw) {
  return raw.trim().split(/\s+/).map(part => {
    const components = part.split(',');
    if (components.length !== 2) throw new Error(`Invalid position "${part}" — expected x,y`);
    const x = parseInt(components[0], 10);
    const y = parseInt(components[1], 10);
    if (isNaN(x) || isNaN(y)) throw new Error(`Non-integer in position "${part}"`);
    return { x, y };
  });
}

/**
 * Parse space-separated "x,y" or "x,y,o" pairs into Mirror array.
 * @param {string} raw
 * @param {number} cols
 * @param {number} rows
 * @param {GridPos[]} suns
 * @param {GridPos[]} plants
 * @returns {Mirror[]}
 */
function parseMirrorInput(raw, cols, rows, suns, plants) {
  if (!raw.trim()) return [];
  const sunSet = new Set(suns.map(s => `${s.x},${s.y}`));
  const plantSet = new Set(plants.map(p => `${p.x},${p.y}`));
  /** @type {Set<string>} */
  const seen = new Set();
  /** @type {Mirror[]} */
  const mirrors = [];

  for (const part of raw.trim().split(/\s+/)) {
    const components = part.split(',');
    if (components.length < 2 || components.length > 3) {
      throw new Error(`Invalid mirror "${part}" — expected x,y or x,y,o`);
    }
    const x = parseInt(components[0], 10);
    const y = parseInt(components[1], 10);
    const orientation = components.length === 3 ? parseInt(components[2], 10) : 0;

    if (isNaN(x) || isNaN(y)) throw new Error(`Non-integer in "${part}"`);
    if (isNaN(orientation) || orientation < 0 || orientation > 3) {
      throw new Error(`Orientation must be 0–3 in "${part}"`);
    }
    if (x < 0 || x >= cols || y < 0 || y >= rows) {
      throw new Error(`Position (${x},${y}) is outside the ${cols}×${rows} grid`);
    }
    const key = `${x},${y}`;
    if (sunSet.has(key)) throw new Error(`Position (${x},${y}) conflicts with a sun`);
    if (plantSet.has(key)) throw new Error(`Position (${x},${y}) conflicts with a plant`);
    if (seen.has(key)) continue; // deduplicate
    seen.add(key);
    mirrors.push({ x, y, id: `t-${x}-${y}`, orientation });
  }

  return mirrors;
}

/** @returns {void} */
function generate() {
  clearError();

  /** @type {number} */
  const cols = parseInt(document.getElementById('inp-cols').value, 10);
  /** @type {number} */
  const rows = parseInt(document.getElementById('inp-rows').value, 10);
  /** @type {string} */
  const sunsRaw = document.getElementById('inp-suns').value.trim();
  /** @type {string} */
  const plantsRaw = document.getElementById('inp-plants').value.trim();
  /** @type {string} */
  const triRaw = document.getElementById('inp-tris').value.trim();

  if (!cols || isNaN(cols) || cols < 1) {
    document.getElementById('inp-cols').classList.add('error');
    return showError('Cols must be a positive integer.');
  }
  if (!rows || isNaN(rows) || rows < 1) {
    document.getElementById('inp-rows').classList.add('error');
    return showError('Rows must be a positive integer.');
  }

  /** @type {GridPos[]} */
  let suns;
  /** @type {GridPos[]} */
  let plants;

  try {
    suns = sunsRaw ? parsePosInput(sunsRaw) : [{ x: 0, y: 0 }];
    plants = plantsRaw ? parsePosInput(plantsRaw) : [{ x: cols - 1, y: rows - 1 }];
  } catch (e) {
    return showError(/** @type {Error} */ (e).message);
  }

  if (suns.length === 0) return showError('At least one sun is required.');
  if (plants.length === 0) return showError('At least one plant is required.');

  for (const s of suns) {
    if (s.x < 0 || s.x >= cols || s.y < 0 || s.y >= rows) {
      document.getElementById('inp-suns').classList.add('error');
      return showError(`Sun (${s.x},${s.y}) is outside the ${cols}×${rows} grid`);
    }
  }
  for (const p of plants) {
    if (p.x < 0 || p.x >= cols || p.y < 0 || p.y >= rows) {
      document.getElementById('inp-plants').classList.add('error');
      return showError(`Plant (${p.x},${p.y}) is outside the ${cols}×${rows} grid`);
    }
  }

  const sunSet = new Set(suns.map(s => `${s.x},${s.y}`));
  for (const p of plants) {
    if (sunSet.has(`${p.x},${p.y}`)) {
      return showError(`Sun and plant cannot share position (${p.x},${p.y})`);
    }
  }

  if (!triRaw) {
    document.getElementById('inp-tris').classList.add('error');
    return showError('Enter at least one mirror position, e.g. 0,0 1,1');
  }

  /** @type {Mirror[]} */
  let mirrors;
  try {
    mirrors = parseMirrorInput(triRaw, cols, rows, suns, plants);
  } catch (e) {
    document.getElementById('inp-tris').classList.add('error');
    return showError(/** @type {Error} */ (e).message);
  }

  /** @type {string} */
  const html = buildHTML(cols, rows, mirrors, suns, plants);
  /** @type {HTMLIFrameElement} */
  const iframe = /** @type {HTMLIFrameElement} */ (document.getElementById('preview'));
  iframe.onload = () => attachSoundToIframe(iframe, plants);
  iframe.srcdoc = html;
}

// ── URL encoding ─────────────────────────────────────────────────────────────

/**
 * Encode current puzzle state into a compact base64url string in ?p= param.
 * Bit layout: [10:cols-1][10:rows-1][6:numSuns][20*numSuns][6:numPlants][20*numPlants][22*numMirrors]
 * @returns {string}
 */
function encodeStateToURL() {
  const cols = parseInt(document.getElementById('inp-cols').value, 10);
  const rows = parseInt(document.getElementById('inp-rows').value, 10);
  const sunsRaw = document.getElementById('inp-suns').value.trim();
  const plantsRaw = document.getElementById('inp-plants').value.trim();
  const triRaw = document.getElementById('inp-tris').value.trim();

  const suns = sunsRaw ? parsePosInput(sunsRaw) : [{ x: 0, y: 0 }];
  const plants = plantsRaw ? parsePosInput(plantsRaw) : [{ x: cols - 1, y: rows - 1 }];
  const mirrors = parseMirrorInput(triRaw, cols, rows, suns, plants);

  const totalBits = 10 + 10 + 6 + suns.length * 20 + 6 + plants.length * 20 + mirrors.length * 22;
  const bytes = new Uint8Array(Math.ceil(totalBits / 8));
  let bitPos = 0;

  /**
   * @param {number} value
   * @param {number} numBits
   */
  function writeBits(value, numBits) {
    for (let i = numBits - 1; i >= 0; i--) {
      const bit = (value >> i) & 1;
      const byteIdx = Math.floor(bitPos / 8);
      const bitIdx = 7 - (bitPos % 8);
      bytes[byteIdx] |= bit << bitIdx;
      bitPos++;
    }
  }

  writeBits(cols - 1, 10);
  writeBits(rows - 1, 10);
  writeBits(suns.length, 6);
  for (const { x, y } of suns) { writeBits(x, 10); writeBits(y, 10); }
  writeBits(plants.length, 6);
  for (const { x, y } of plants) { writeBits(x, 10); writeBits(y, 10); }
  for (const { x, y, orientation } of mirrors) { writeBits(x, 10); writeBits(y, 10); writeBits(orientation, 2); }

  const b64 = btoa(String.fromCharCode(...bytes))
    .replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
  const url = new URL(location.href);
  url.search = '';
  url.searchParams.set('p', b64);
  return url.toString();
}

/**
 * On startup, read ?p= param and populate inputs. Falls back silently on error.
 * @returns {void}
 */
function loadStateFromURL() {
  try {
    const params = new URLSearchParams(location.search);
    const b64 = params.get('p');
    if (!b64) return;

    const binary = atob(b64.replace(/-/g, '+').replace(/_/g, '/'));
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);

    let bitPos = 0;

    /** @param {number} numBits @returns {number} */
    function readBits(numBits) {
      let value = 0;
      for (let i = numBits - 1; i >= 0; i--) {
        const byteIdx = Math.floor(bitPos / 8);
        const bitIdx = 7 - (bitPos % 8);
        const bit = (bytes[byteIdx] >> bitIdx) & 1;
        value |= bit << i;
        bitPos++;
      }
      return value;
    }

    const cols = readBits(10) + 1;
    const rows = readBits(10) + 1;

    const numSuns = readBits(6);
    /** @type {GridPos[]} */
    const sunsArr = [];
    for (let i = 0; i < numSuns; i++) sunsArr.push({ x: readBits(10), y: readBits(10) });

    const numPlants = readBits(6);
    /** @type {GridPos[]} */
    const plantsArr = [];
    for (let i = 0; i < numPlants; i++) plantsArr.push({ x: readBits(10), y: readBits(10) });

    const usedBits = 10 + 10 + 6 + numSuns * 20 + 6 + numPlants * 20;
    const numMirrors = Math.floor((bytes.length * 8 - usedBits) / 22);
    /** @type {Array<{x:number,y:number,o:number}>} */
    const mirrorsArr = [];
    for (let i = 0; i < numMirrors; i++) {
      mirrorsArr.push({ x: readBits(10), y: readBits(10), o: readBits(2) });
    }

    document.getElementById('inp-cols').value = String(cols);
    document.getElementById('inp-rows').value = String(rows);
    document.getElementById('inp-suns').value = sunsArr.map(s => `${s.x},${s.y}`).join(' ');
    document.getElementById('inp-plants').value = plantsArr.map(p => `${p.x},${p.y}`).join(' ');
    document.getElementById('inp-tris').value = mirrorsArr.map(m => `${m.x},${m.y},${m.o}`).join(' ');
  } catch {
    // fall back silently
  }
}

// ── localStorage ─────────────────────────────────────────────────────────────

const LS_MUTE = 'puzzle-muted';

/** @returns {void} */
function loadMuteFromLocalStorage() {
  try {
    isMuted = localStorage.getItem(LS_MUTE) === 'true';
    document.getElementById('mute').classList.toggle('muted', isMuted);
  } catch { /* ignore */ }
}

/** @returns {void} */
function showSolution() {
  let solutionStr;
  if (currentLevel && PUZZLES[currentLevel]?.solution) {
    solutionStr = PUZZLES[currentLevel].solution;
  } else {
    solutionStr = solvePuzzle();
  }
  if (solutionStr == null) return;

  const iframe = /** @type {HTMLIFrameElement} */ (document.getElementById('preview'));
  const iframeDoc = iframe.contentDocument;

  const triRaw = document.getElementById('inp-tris').value.trim();
  const allMirrors = triRaw.split(/\s+/).map(s => {
    const [x, y] = s.split(',').map(Number);
    return { x, y };
  });

  /** @type {Map<string, number>} */
  const solutionMap = new Map();
  if (solutionStr) {
    for (const s of solutionStr.trim().split(/\s+/)) {
      const [x, y, o] = s.split(',').map(Number);
      solutionMap.set(`${x},${y}`, o ?? 0);
    }
  }

  allMirrors.forEach(({ x, y }, i) => {
    setTimeout(() => {
      const o = solutionMap.get(`${x},${y}`) ?? 0;
      const radio = iframeDoc.getElementById(`t-${x}-${y}-s${o}`);
      if (radio && !/** @type {HTMLInputElement} */ (radio).checked) {
        /** @type {HTMLInputElement} */ (radio).checked = true;
        radio.dispatchEvent(new Event('change', { bubbles: true }));
      }
    }, i * 40);
  });
}

// ── Event handlers ───────────────────────────────────────────────────────────

document.getElementById('generate').addEventListener('click', () => {
  currentLevel = null;
  generate();
  document.getElementById('config-dialog').close();
});

document.getElementById('share').addEventListener('click', () => {
  navigator.clipboard.writeText('https://gaurangtandon.com/csssunflower').then(() => {
    const btn = document.getElementById('share');
    btn.textContent = 'COPIED!';
    setTimeout(() => { btn.textContent = 'SHARE'; }, 1800);
  });
});

document.getElementById('copy-grid').addEventListener('click', () => {
  try {
    const url = encodeStateToURL();
    navigator.clipboard.writeText(url).then(() => {
      const btn = document.getElementById('copy-grid');
      btn.textContent = 'COPIED!';
      setTimeout(() => { btn.textContent = 'Copy Grid Link'; }, 1800);
    });
  } catch {
    showError('Could not encode puzzle state.');
  }
});

document.getElementById('gear').addEventListener('click', () => {
  document.getElementById('config-dialog').showModal();
});

document.getElementById('dialog-close').addEventListener('click', () => {
  document.getElementById('config-dialog').close();
});

document.getElementById('mute').addEventListener('click', () => {
  isMuted = !isMuted;
  document.getElementById('mute').classList.toggle('muted', isMuted);
  try { localStorage.setItem(LS_MUTE, String(isMuted)); } catch { /* ignore */ }
  if (isMuted && audioCtx && audioLayers) {
    const rampEnd = audioCtx.currentTime + 0.08;
    for (const { gain } of audioLayers) gain.gain.linearRampToValueAtTime(0, rampEnd);
  }
});

document.querySelectorAll('input').forEach(inp => {
  inp.addEventListener('keydown', e => { if (e.key === 'Enter') generate(); });
});

// ── Random puzzle generation ─────────────────────────────────────────────────

/**
 * Fisher-Yates shuffle in place.
 * @template T
 * @param {T[]} arr
 * @returns {T[]}
 */
function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/**
 * Check if beam from (mx,my) in direction outDir reaches (px,py) in a straight line.
 * @param {number} mx
 * @param {number} my
 * @param {number} outDir
 * @param {number} px
 * @param {number} py
 * @returns {boolean}
 */
function canReachPlant(mx, my, outDir, px, py) {
  const [dx, dy] = getDelta(outDir);
  if (dx === 0) { // vertical
    return mx === px && (dy > 0 ? py > my : py < my);
  } else { // horizontal
    return my === py && (dx > 0 ? px > mx : px < mx);
  }
}

/**
 * Check that no occupied cell blocks the straight-line path between two points.
 * @param {number} fromX
 * @param {number} fromY
 * @param {number} toX
 * @param {number} toY
 * @param {number} dirIdx
 * @param {Set<string>} occupied
 * @returns {boolean}
 */
function pathClear(fromX, fromY, toX, toY, dirIdx, occupied) {
  const [dx, dy] = getDelta(dirIdx);
  let cx = fromX + dx, cy = fromY + dy;
  while (cx !== toX || cy !== toY) {
    if (occupied.has(`${cx},${cy}`)) return false;
    cx += dx;
    cy += dy;
  }
  return true;
}

/**
 * Generate a random path of exactly k mirrors from sun to plant.
 * @param {number} n  grid size (n×n)
 * @param {number} k  number of mirrors in solution path
 * @param {number} [maxRetries=300]
 * @returns {{mirrors: Array<{x:number,y:number,orientation:number}>, initialDir: number, success: boolean}}
 */
function generateRandomPath(n, k, maxRetries = 300) {
  const sun = { x: 0, y: 0 };
  const plant = { x: n - 1, y: n - 1 };

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    /** @type {Array<{x:number,y:number,orientation:number}>} */
    const mirrors = [];
    const occupied = new Set([`${sun.x},${sun.y}`, `${plant.x},${plant.y}`]);
    let cx = sun.x, cy = sun.y;
    // Start going DOWN or RIGHT randomly
    const initialDir = Math.random() < 0.5 ? 0 : 2;
    let dir = initialDir;
    let failed = false;

    for (let i = 0; i < k; i++) {
      const isLast = i === k - 1;
      const [dx, dy] = getDelta(dir);

      // Collect candidate positions along current direction
      /** @type {Array<{x:number,y:number,orientation:number,outDir:number}>} */
      const candidates = [];
      let nx = cx + dx, ny = cy + dy;
      while (nx >= 0 && nx < n && ny >= 0 && ny < n) {
        if (!occupied.has(`${nx},${ny}`)) {
          for (const { orientation, outDir } of getReflections(dir)) {
            if (isLast) {
              // Last mirror: output must reach plant in straight line, path must be clear
              if (canReachPlant(nx, ny, outDir, plant.x, plant.y) &&
                  pathClear(nx, ny, plant.x, plant.y, outDir, occupied)) {
                candidates.push({ x: nx, y: ny, orientation, outDir });
              }
            } else {
              // Not last: output direction must have room (at least 1 cell in-bounds)
              const [odx, ody] = getDelta(outDir);
              const nextX = nx + odx, nextY = ny + ody;
              if (nextX >= 0 && nextX < n && nextY >= 0 && nextY < n) {
                candidates.push({ x: nx, y: ny, orientation, outDir });
              }
            }
          }
        }
        nx += dx;
        ny += dy;
      }

      if (candidates.length === 0) { failed = true; break; }
      const pick = candidates[Math.floor(Math.random() * candidates.length)];
      mirrors.push({ x: pick.x, y: pick.y, orientation: pick.orientation });
      occupied.add(`${pick.x},${pick.y}`);
      // Mark all beam-path cells between previous position and this mirror as occupied
      // so future mirrors don't block this beam segment
      let bx = cx + dx, by = cy + dy;
      while (bx !== pick.x || by !== pick.y) {
        occupied.add(`${bx},${by}`);
        bx += dx;
        by += dy;
      }
      cx = pick.x;
      cy = pick.y;
      dir = pick.outDir;
    }

    if (!failed) return { mirrors, initialDir, success: true };
  }
  return { mirrors: [], initialDir: 0, success: false };
}

/**
 * Collect all cells on the beam path segments of a solution.
 * @param {Array<{x:number,y:number,orientation:number}>} solutionMirrors
 * @param {{x:number,y:number}} sun
 * @param {{x:number,y:number}} plant
 * @param {number} initialDir  first beam direction from sun
 * @returns {Set<string>}
 */
function getBeamPathCells(solutionMirrors, sun, plant, initialDir) {
  const cells = new Set();
  // Walk through each segment of the solution path
  const waypoints = [sun, ...solutionMirrors, plant];
  let dir = initialDir;
  for (let i = 0; i < waypoints.length - 1; i++) {
    const from = waypoints[i];
    const to = waypoints[i + 1];
    const [dx, dy] = getDelta(dir);
    let cx = from.x + dx, cy = from.y + dy;
    while (cx !== to.x || cy !== to.y) {
      cells.add(`${cx},${cy}`);
      cx += dx;
      cy += dy;
    }
    // Update direction for next segment (mirror at waypoints[i+1] redirects)
    if (i + 1 < waypoints.length - 1) {
      for (const { orientation, outDir } of getReflections(dir)) {
        if (orientation === solutionMirrors[i].orientation) {
          dir = outDir;
          break;
        }
      }
    }
  }
  return cells;
}

/**
 * Place k decoy mirrors at random empty positions, avoiding beam path cells.
 * @param {number} n
 * @param {number} k
 * @param {Array<{x:number,y:number,orientation:number}>} solutionMirrors
 * @param {{x:number,y:number}} sun
 * @param {{x:number,y:number}} plant
 * @param {number} initialDir  first beam direction from sun
 * @returns {Array<{x:number,y:number,orientation:number}>}
 */
function placeDecoys(n, k, solutionMirrors, sun, plant, initialDir) {
  const beamCells = getBeamPathCells(solutionMirrors, sun, plant, initialDir);
  const occupied = new Set([
    `${sun.x},${sun.y}`,
    `${plant.x},${plant.y}`,
    ...solutionMirrors.map(m => `${m.x},${m.y}`),
    ...beamCells,
  ]);
  /** @type {Array<{x:number,y:number}>} */
  const empty = [];
  for (let x = 0; x < n; x++) {
    for (let y = 0; y < n; y++) {
      if (!occupied.has(`${x},${y}`)) empty.push({ x, y });
    }
  }
  shuffle(empty);
  return empty.slice(0, k).map(pos => ({
    x: pos.x, y: pos.y, orientation: Math.floor(Math.random() * 4),
  }));
}

/**
 * Trace beam from (fromX,fromY) in direction dirIdx. Return first mirror/plant hit.
 * @param {number} fromX
 * @param {number} fromY
 * @param {number} dirIdx
 * @param {number} n
 * @param {Map<string, number>} mirrorAt  "x,y" → index in allMirrors
 * @param {{x:number,y:number}} plant
 * @returns {{isPlant: boolean, mirrorIdx?: number}|null}
 */
function traceBeam(fromX, fromY, dirIdx, n, mirrorAt, plant) {
  const [dx, dy] = getDelta(dirIdx);
  let cx = fromX + dx, cy = fromY + dy;
  while (cx >= 0 && cx < n && cy >= 0 && cy < n) {
    if (cx === plant.x && cy === plant.y) return { isPlant: true };
    const key = `${cx},${cy}`;
    if (mirrorAt.has(key)) return { isPlant: false, mirrorIdx: mirrorAt.get(key) };
    cx += dx;
    cy += dy;
  }
  return null; // exited grid
}

/**
 * BFS to find the minimum number of mirrors in any valid sun→plant path.
 * @param {number} n
 * @param {Array<{x:number,y:number}>} allMirrors
 * @param {{x:number,y:number}} sun
 * @param {{x:number,y:number}} plant
 * @returns {number}  minimum mirrors needed, or Infinity if unreachable
 */
function findMinPathLength(n, allMirrors, sun, plant) {
  /** @type {Map<string, number>} */
  const mirrorAt = new Map();
  for (let i = 0; i < allMirrors.length; i++) {
    mirrorAt.set(`${allMirrors[i].x},${allMirrors[i].y}`, i);
  }

  // BFS: state = (mirrorIdx, incomingDir), cost = mirrors bounced
  /** @type {Map<string, number>} */
  const dist = new Map();
  /** @type {Array<{mirrorIdx: number, inDir: number, cost: number}>} */
  const queue = [];

  // Seed: trace from sun in all 4 directions
  for (let dir = 0; dir < 4; dir++) {
    const hit = traceBeam(sun.x, sun.y, dir, n, mirrorAt, plant);
    if (!hit) continue;
    if (hit.isPlant) return 0;
    const key = `${hit.mirrorIdx},${dir}`;
    if (!dist.has(key)) {
      dist.set(key, 1);
      queue.push({ mirrorIdx: hit.mirrorIdx, inDir: dir, cost: 1 });
    }
  }

  let head = 0;
  while (head < queue.length) {
    const { mirrorIdx, inDir, cost } = queue[head++];
    const mirror = allMirrors[mirrorIdx];
    // Skip if we've found a shorter path to this state already
    const stateKey = `${mirrorIdx},${inDir}`;
    if (dist.get(stateKey) < cost) continue;

    for (const { outDir } of getReflections(inDir)) {
      const hit = traceBeam(mirror.x, mirror.y, outDir, n, mirrorAt, plant);
      if (!hit) continue;
      if (hit.isPlant) return cost;
      const nextKey = `${hit.mirrorIdx},${outDir}`;
      const nextCost = cost + 1;
      if (!dist.has(nextKey) || dist.get(nextKey) > nextCost) {
        dist.set(nextKey, nextCost);
        queue.push({ mirrorIdx: hit.mirrorIdx, inDir: outDir, cost: nextCost });
      }
    }
  }
  return Infinity;
}

/**
 * Solve the current puzzle by BFS: find mirror orientations that route light from sun to plant.
 * @returns {string|null}  solution string "x,y,o x,y,o ..." or null if unsolvable
 */
function solvePuzzle() {
  const cols = parseInt(document.getElementById('inp-cols').value, 10);
  const rows = parseInt(document.getElementById('inp-rows').value, 10);
  const sunsRaw = document.getElementById('inp-suns').value.trim();
  const plantsRaw = document.getElementById('inp-plants').value.trim();
  const triRaw = document.getElementById('inp-tris').value.trim();

  const suns = sunsRaw ? parsePosInput(sunsRaw) : [{ x: 0, y: 0 }];
  const plants = plantsRaw ? parsePosInput(plantsRaw) : [{ x: cols - 1, y: rows - 1 }];

  if (!triRaw) return '';

  /** @type {Array<{x:number,y:number}>} */
  const allMirrors = triRaw.split(/\s+/).map(s => {
    const parts = s.split(',').map(Number);
    return { x: parts[0], y: parts[1] };
  });

  const sun = suns[0];
  const plant = plants[0];

  /** @type {Map<string, number>} */
  const mirrorAt = new Map();
  for (let i = 0; i < allMirrors.length; i++) {
    mirrorAt.set(`${allMirrors[i].x},${allMirrors[i].y}`, i);
  }

  /**
   * @param {number} fromX
   * @param {number} fromY
   * @param {number} dirIdx
   * @returns {{isPlant: boolean, mirrorIdx?: number}|null}
   */
  function trace(fromX, fromY, dirIdx) {
    const [dx, dy] = getDelta(dirIdx);
    let cx = fromX + dx, cy = fromY + dy;
    while (cx >= 0 && cx < cols && cy >= 0 && cy < rows) {
      if (cx === plant.x && cy === plant.y) return { isPlant: true };
      const key = `${cx},${cy}`;
      if (mirrorAt.has(key)) return { isPlant: false, mirrorIdx: mirrorAt.get(key) };
      cx += dx;
      cy += dy;
    }
    return null;
  }

  /** @type {Map<string, number>} */
  const dist = new Map();
  /** @type {Map<string, {parentKey: string|null, mirrorIdx: number, orientation: number}>} */
  const prev = new Map();
  /** @type {Array<{mirrorIdx: number, inDir: number, cost: number}>} */
  const queue = [];

  for (let dir = 0; dir < 4; dir++) {
    const hit = trace(sun.x, sun.y, dir);
    if (!hit) continue;
    if (hit.isPlant) return '';
    const key = `${hit.mirrorIdx},${dir}`;
    if (!dist.has(key)) {
      dist.set(key, 1);
      prev.set(key, { parentKey: null, mirrorIdx: -1, orientation: -1 });
      queue.push({ mirrorIdx: hit.mirrorIdx, inDir: dir, cost: 1 });
    }
  }

  let head = 0;
  while (head < queue.length) {
    const { mirrorIdx, inDir, cost } = queue[head++];
    const stateKey = `${mirrorIdx},${inDir}`;
    if (dist.get(stateKey) < cost) continue;
    const mirror = allMirrors[mirrorIdx];

    for (const { orientation, outDir } of getReflections(inDir)) {
      const hit = trace(mirror.x, mirror.y, outDir);
      if (!hit) continue;
      if (hit.isPlant) {
        /** @type {Map<number, number>} */
        const solution = new Map();
        solution.set(mirrorIdx, orientation);
        let current = stateKey;
        while (current !== null && prev.has(current)) {
          const p = prev.get(current);
          if (p.mirrorIdx >= 0) solution.set(p.mirrorIdx, p.orientation);
          current = p.parentKey;
        }
        return [...solution].map(([idx, o]) => `${allMirrors[idx].x},${allMirrors[idx].y},${o}`).join(' ');
      }
      const nextKey = `${hit.mirrorIdx},${outDir}`;
      const nextCost = cost + 1;
      if (!dist.has(nextKey) || dist.get(nextKey) > nextCost) {
        dist.set(nextKey, nextCost);
        prev.set(nextKey, { parentKey: stateKey, mirrorIdx, orientation });
        queue.push({ mirrorIdx: hit.mirrorIdx, inDir: outDir, cost: nextCost });
      }
    }
  }
  return null;
}

/**
 * Build the final puzzle object from a valid path + decoys.
 * @param {number} n
 * @param {Array<{x:number,y:number,orientation:number}>} solutionMirrors
 * @param {Array<{x:number,y:number,orientation:number}>} decoys
 * @returns {{cols:number,rows:number,suns:string,plants:string,tris:string,solution:string}}
 */
function buildPuzzleResult(n, solutionMirrors, decoys) {
  const allMirrorsRandomized = [
    ...solutionMirrors.map(m => ({ x: m.x, y: m.y, orientation: Math.floor(Math.random() * 4) })),
    ...decoys,
  ];
  shuffle(allMirrorsRandomized);
  return {
    cols: n, rows: n, suns: '0,0', plants: `${n - 1},${n - 1}`,
    tris: allMirrorsRandomized.map(m => `${m.x},${m.y}`).join(' '),
    solution: solutionMirrors.map(m => `${m.x},${m.y},${m.orientation}`).join(' '),
  };
}

/**
 * Generate a complete puzzle: path + decoys + validation.
 * For each valid path, tries multiple decoy placements before moving to a new path.
 * Never returns an unvalidated puzzle.
 * @param {number} n
 * @param {number} k
 * @returns {{cols:number,rows:number,suns:string,plants:string,tris:string,solution:string}}
 */
function generatePuzzle(n, k) {
  const sun = { x: 0, y: 0 };
  const plant = { x: n - 1, y: n - 1 };

  for (let pathAttempt = 0; pathAttempt < 100; pathAttempt++) {
    const pathResult = generateRandomPath(n, k);
    if (!pathResult.success) continue;

    // For each valid path, try many decoy placements
    for (let decoyAttempt = 0; decoyAttempt < 30; decoyAttempt++) {
      const decoys = placeDecoys(n, k, pathResult.mirrors, sun, plant, pathResult.initialDir);
      const allPositions = [
        ...pathResult.mirrors.map(m => ({ x: m.x, y: m.y })),
        ...decoys.map(m => ({ x: m.x, y: m.y })),
      ];

      const minPath = findMinPathLength(n, allPositions, sun, plant);
      if (minPath >= k) {
        return buildPuzzleResult(n, pathResult.mirrors, decoys);
      }
    }
  }

  // Final fallback: place decoys far from the solution path to minimize shortcuts.
  // Keep generating until validated — never return unvalidated.
  for (let i = 0; i < 500; i++) {
    const pathResult = generateRandomPath(n, k);
    if (!pathResult.success) continue;
    const decoys = placeDecoys(n, k, pathResult.mirrors, sun, plant, pathResult.initialDir);
    const allPositions = [
      ...pathResult.mirrors.map(m => ({ x: m.x, y: m.y })),
      ...decoys.map(m => ({ x: m.x, y: m.y })),
    ];
    const minPath = findMinPathLength(n, allPositions, sun, plant);
    if (minPath >= k) {
      return buildPuzzleResult(n, pathResult.mirrors, decoys);
    }
  }

  // Absolute last resort: return puzzle with NO decoys (guaranteed valid since
  // the solution path is the only path through the solution mirrors).
  const pathResult = generateRandomPath(n, k, 1000);
  return buildPuzzleResult(n, pathResult.mirrors, []);
}

/**
 * Generate a random puzzle for the given difficulty level.
 * @param {'easy'|'hard'|'random'} level
 * @returns {{cols:number,rows:number,suns:string,plants:string,tris:string,solution:string}}
 */
function generateRandomPuzzle(level) {
  let n, k;
  if (level === 'easy') {
    n = 7; k = 5;
  } else if (level === 'hard') {
    n = 9; k = 11;
  } else {
    n = 5 + Math.floor(Math.random() * 6); // 5..10
    k = n - 1;
  }
  return generatePuzzle(n, k);
}

// ── Difficulty presets ───────────────────────────────────────────────────────

/** @type {Record<string, {cols:number,rows:number,suns:string,plants:string,tris:string,solution:string}>} */
const PUZZLES = {};

/** @type {string|null} */
let currentLevel = 'easy';

/**
 * @param {'easy'|'hard'|'random'} level
 */
function loadDifficulty(level) {
  currentLevel = level;
  const puzzle = generateRandomPuzzle(level);
  PUZZLES[level] = puzzle;
  document.getElementById('inp-cols').value = String(puzzle.cols);
  document.getElementById('inp-rows').value = String(puzzle.rows);
  document.getElementById('inp-suns').value = puzzle.suns;
  document.getElementById('inp-plants').value = puzzle.plants;
  document.getElementById('inp-tris').value = puzzle.tris;
  document.getElementById('easy-btn').classList.toggle('diff-active', level === 'easy');
  document.getElementById('hard-btn').classList.toggle('diff-active', level === 'hard');
  document.getElementById('random-btn').classList.toggle('diff-active', level === 'random');
  generate();
}

document.getElementById('easy-btn').addEventListener('click', () => loadDifficulty('easy'));
document.getElementById('hard-btn').addEventListener('click', () => loadDifficulty('hard'));
document.getElementById('random-btn').addEventListener('click', () => loadDifficulty('random'));

document.getElementById('solution-btn').addEventListener('click', () => showSolution());

document.getElementById('about-btn').addEventListener('click', () =>
  document.getElementById('about-dialog').showModal());
document.getElementById('about-close').addEventListener('click', () =>
  document.getElementById('about-dialog').close());

loadStateFromURL();
loadMuteFromLocalStorage();
if (!new URLSearchParams(location.search).has('p')) {
  loadDifficulty('easy');
} else {
  currentLevel = null;
  generate();
}
