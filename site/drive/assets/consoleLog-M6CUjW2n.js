const s = `
\u2554\u2550 Manas Bajaj \u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2557
\u2551 Interactive portfolio of Manas Bajaj, BMS (Hons), IIM Sirmaur.
\u2551 Mail     \u21D2 manasbajaj07@gmail.com
\u2551 LinkedIn \u21D2 https://www.linkedin.com/in/manasrbajaj/
\u255A\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u255D

\u2554\u2550 Credits \u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2557
\u2551 Built with Three.js and Rapier physics.
\u2551 Inspired by the portfolio of Bruno Simon (MIT licensed): https://bruno-simon.com
\u255A\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u255D
`;
let o = "", l = [];
const i = { letter: "color: #ffffff; font: 400 1em monospace;", pipe: "color: #D66FFF; font: 400 1em monospace;" };
let e = null;
for (let t = 0; t < s.length; t++) {
  const n = s[t], a = n.match(/[╔║═╗╚╝╔╝]/) ? "pipe" : "letter";
  a !== e && (e = a, o += "%c", l.push(i[e])), o += n;
}
const r = [o, ...l];
export {
  r as default
};
