const fs = require('fs');

let html = fs.readFileSync('index.html', 'utf8');

// Replacements
html = html.replace(/\btext-white\b/g, 'text-cardTitle');
html = html.replace(/\btext-slate-400\b/g, 'text-textMuted');
html = html.replace(/\btext-slate-500\b/g, 'text-textMuted');
html = html.replace(/\btext-slate-350\b/g, 'text-textMuted');
html = html.replace(/\btext-slate-950\b/g, 'text-textMain');
html = html.replace(/\bbg-slate-950\/(40|60|70|80|90)\b/g, 'bg-inputBg');
html = html.replace(/\bbg-slate-950\b/g, 'bg-cardSubBg');
html = html.replace(/\bbg-slate-900\b/g, 'bg-cardSubBg');
html = html.replace(/\bbg-\[\#0a0515\]\/90\b/g, 'bg-glassBg');
html = html.replace(/\bborder-white\/10\b/g, 'border-glassBorder');
html = html.replace(/\bborder-white\/5\b/g, 'border-glassBorder');
html = html.replace(/\bhover:text-white\b/g, 'hover:text-cardTitle');
html = html.replace(/\bhover:bg-slate-900\b/g, 'hover:bg-glassBg');
html = html.replace(/\bhover:bg-slate-950\/(40|60|80|90)\b/g, 'hover:bg-glassBg');
html = html.replace(/\bhover:bg-white\/5\b/g, 'hover:bg-glassBorder');

fs.writeFileSync('index.html', html, 'utf8');
console.log('Fixed index.html');

let js = fs.readFileSync('script.js', 'utf8');
// Fix hardcoded classes in script.js
js = js.replace(/\btext-white\b/g, 'text-cardTitle');
js = js.replace(/\btext-slate-400\b/g, 'text-textMuted');
js = js.replace(/\btext-slate-500\b/g, 'text-textMuted');
js = js.replace(/\bbg-slate-950\/60\b/g, 'bg-inputBg');
js = js.replace(/\bborder-white\/10\b/g, 'border-glassBorder');
js = js.replace(/\bhover:text-white\b/g, 'hover:text-cardTitle');
fs.writeFileSync('script.js', js, 'utf8');
console.log('Fixed script.js');

