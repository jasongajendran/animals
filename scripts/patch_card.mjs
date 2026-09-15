import fs from 'fs';
const cardPath = 'components/AnimalCard.tsx';
let code = fs.readFileSync(cardPath, 'utf8');

// 1. Change aspect ratio to aspect-video (16/9) or just make it bigger
code = code.replace(
  'className="relative aspect-4/3 w-full overflow-hidden rounded-xl bg-slate-100 cursor-pointer"',
  'className="relative aspect-[3/2] sm:aspect-[16/10] w-full overflow-hidden rounded-xl bg-slate-100 cursor-pointer"'
);

// 2. Adjust title sizes for larger cards
code = code.replace(
  '<h3 className="text-lg font-bold text-slate-900 leading-tight flex items-center gap-1.5">',
  '<h3 className="text-xl sm:text-2xl font-bold text-slate-900 leading-tight flex items-center gap-1.5">'
);

code = code.replace(
  '<span className="text-xl select-none">{animal.emoji}</span>',
  '<span className="text-2xl sm:text-3xl select-none">{animal.emoji}</span>'
);

// 3. Adjust button sizes
code = code.replace(
  'gap-1.5 rounded-xl py-2 px-3 text-xs font-bold transition-all',
  'gap-2 rounded-xl py-2.5 px-4 text-sm font-bold transition-all'
);
code = code.replace(
  'gap-1.5 rounded-xl py-2 px-3 text-xs font-bold transition-all',
  'gap-2 rounded-xl py-2.5 px-4 text-sm font-bold transition-all'
);

code = code.replace(
  'className="h-3.5 w-3.5 animate-spin text-amber-950"',
  'className="h-4 w-4 sm:h-5 sm:w-5 animate-spin text-amber-950"'
);
code = code.replace(
  'className="h-3.5 w-3.5 text-amber-700"',
  'className="h-4 w-4 sm:h-5 sm:w-5 text-amber-700"'
);
code = code.replace(
  'className="h-3.5 w-3.5 text-slate-600"',
  'className="h-4 w-4 sm:h-5 sm:w-5 text-slate-600"'
);

fs.writeFileSync(cardPath, code);
console.log('Successfully patched AnimalCard.tsx');
