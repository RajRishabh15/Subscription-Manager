const fs = require('fs');
let js = fs.readFileSync('script.js', 'utf8');

// Colors replacement in JS
js = js.replace(/\bbg-slate-950\/(10|20|30|40|50|60|70|80|90)\b/g, 'bg-glassBg');
js = js.replace(/\bbg-slate-950\b/g, 'bg-cardSubBg');
js = js.replace(/\bbg-slate-900\b/g, 'bg-inputBg');
js = js.replace(/\bbg-slate-850\b/g, 'bg-inputBg');

js = js.replace(/\bborder-white\/5\b/g, 'border-glassBorder');
js = js.replace(/\bborder-white\/10\b/g, 'border-glassBorder');
js = js.replace(/\bborder-white\/25\b/g, 'border-glassBorder');

js = js.replace(/\btext-slate-300\b/g, 'text-cardTitle');
js = js.replace(/\btext-slate-350\b/g, 'text-cardTitle');
js = js.replace(/\btext-slate-450\b/g, 'text-textMuted');
js = js.replace(/\btext-slate-550\b/g, 'text-textMuted');
js = js.replace(/\btext-slate-555\b/g, 'text-textMuted');
js = js.replace(/\btext-slate-700\b/g, 'text-textMuted');
js = js.replace(/\btext-slate-750\b/g, 'text-textMuted');
js = js.replace(/\btext-slate-900\b/g, 'text-cardTitle');

fs.writeFileSync('script.js', js, 'utf8');
console.log('Fixed script.js heavily');

