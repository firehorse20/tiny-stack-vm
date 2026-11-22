// Tiny stack VM: strict make.fun tiny-stack-vm-01 ISA implementation (see kit vm.mjs).
// Reads $MAKEFUN_INPUT_DIR/<id>/{program,input}.bin, writes $MAKEFUN_OUTPUT_DIR/<id>/{stdout.bin,exit.txt}.
import { mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
const I = process.env.MAKEFUN_INPUT_DIR ?? '/input';
const O = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';
const E = new TextEncoder();
for (const id of readdirSync(I).sort()) {
  const P = readFileSync(join(I, id, 'program.bin'));
  const N = readFileSync(join(I, id, 'input.bin'));
  const n = P.length, D = new Int32Array(256), C = new Int32Array(64), M = new Int32Array(256), o = new Uint8Array(65536);
  let s = 0, c = 0, l = 0, ip = 0, p = 0, t = 0, e = 0;
  L: for (;;) {
    if (t === 1e6) { e = 10; break; }
    if (p < 0 || p >= n) { e = 9; break; }
    const k = P[p];
    if (!(k < 8 || (k > 15 && k < 35 && k !== 31) || (k > 47 && k < 53) || k === 64 || k === 65 || (k > 79 && k < 84))) { e = 5; break; }
    const im = k === 1 ? 1 : k === 2 ? 4 : k > 47 && k < 52 ? 2 : 0;
    if (p + im >= n) { e = 9; break; }
    t++;
    const po = k === 7 ? 3 : (k === 5 || k === 6 || k === 65 || (k > 15 && k < 35 && k !== 23 && k !== 27 && k !== 31)) ? 2 : (k === 3 || k === 4 || k === 23 || k === 27 || (k > 48 && k < 51) || k === 64 || (k > 79 && k < 82) || k === 83) ? 1 : 0;
    const pu = (k === 6 || k === 7) ? 3 : (k === 4 || k === 5) ? 2 : (k === 1 || k === 2 || (k > 15 && k < 35 && k !== 31) || k === 64 || k === 82) ? 1 : 0;
    if (s < po) { e = 2; break; }
    if (s - po + pu > 256) { e = 3; break; }
    const x = p + 1 + im;
    p = x;
    switch (k) {
      case 0: break L;
      case 1: D[s++] = (P[x - 1] << 24) >> 24; break;
      case 2: D[s++] = P[x - 4] | (P[x - 3] << 8) | (P[x - 2] << 16) | (P[x - 1] << 24); break;
      case 3: s--; break;
      case 4: D[s] = D[s - 1]; s++; break;
      case 5: { const v = D[s - 1]; D[s - 1] = D[s - 2]; D[s - 2] = v; break; }
      case 6: D[s] = D[s - 2]; s++; break;
      case 7: { const v = D[s - 3]; D[s - 3] = D[s - 2]; D[s - 2] = D[s - 1]; D[s - 1] = v; break; }
      case 23: D[s - 1] = -D[s - 1] | 0; break;
      case 27: D[s - 1] = ~D[s - 1]; break;
      case 48: p = x + (((P[x - 2] | (P[x - 1] << 8)) << 16) >> 16); break;
      case 49: case 50: {
        const r = ((P[x - 2] | (P[x - 1] << 8)) << 16) >> 16, v = D[--s];
        if ((k === 49) === (v === 0)) p = x + r;
        break;
      }
      case 51:
        if (c === 64) { e = 7; break L; }
        C[c++] = x;
        p = P[x - 2] | (P[x - 1] << 8);
        break;
      case 52:
        if (!c) { e = 8; break L; }
        p = C[--c];
        break;
      case 64: {
        const a = D[s - 1];
        if (a < 0 || a > 255) { e = 6; break L; }
        D[s - 1] = M[a];
        break;
      }
      case 65: {
        const a = D[s - 1], v = D[s - 2];
        if (a < 0 || a > 255) { e = 6; break L; }
        s -= 2;
        M[a] = v;
        break;
      }
      case 80: {
        const b = E.encode(String(D[s - 1]));
        if (l + b.length > 65536) { e = 11; break L; }
        s--;
        o.set(b, l);
        l += b.length;
        break;
      }
      case 81:
        if (l + 1 > 65536) { e = 11; break L; }
        o[l++] = D[--s] & 255;
        break;
      case 82: D[s++] = ip < N.length ? N[ip++] : -1; break;
      case 83: e = D[--s] & 255; break L;
      default: {
        const b = D[s - 1], a = D[s - 2];
        let r = 0;
        switch (k) {
          case 16: r = (a + b) | 0; break;
          case 17: r = (a - b) | 0; break;
          case 18: r = Math.imul(a, b); break;
          case 19:
            if (!b) { e = 4; break L; }
            r = a === -2147483648 && b === -1 ? a : (a / b) | 0;
            break;
          case 20:
            if (!b) { e = 4; break L; }
            r = b === -1 ? 0 : (a % b) | 0;
            break;
          case 21:
            if (!b) { e = 4; break L; }
            r = Math.floor((a >>> 0) / (b >>> 0)) | 0;
            break;
          case 22:
            if (!b) { e = 4; break L; }
            r = ((a >>> 0) % (b >>> 0)) | 0;
            break;
          case 24: r = a & b; break;
          case 25: r = a | b; break;
          case 26: r = a ^ b; break;
          case 28: r = a << (b & 31); break;
          case 29: r = a >> (b & 31); break;
          case 30: r = (a >>> (b & 31)) | 0; break;
          case 32: r = a === b ? 1 : 0; break;
          case 33: r = a < b ? 1 : 0; break;
          default: r = (a >>> 0) < (b >>> 0) ? 1 : 0; break;
        }
        s -= 2;
        D[s++] = r;
        break;
      }
    }
  }
  mkdirSync(join(O, id), { recursive: true });
  writeFileSync(join(O, id, 'stdout.bin'), o.subarray(0, l));
  writeFileSync(join(O, id, 'exit.txt'), e + '\n');
}
