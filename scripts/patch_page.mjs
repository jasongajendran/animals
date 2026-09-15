import fs from 'fs';
const pagePath = 'app/page.tsx';
let code = fs.readFileSync(pagePath, 'utf8');

// 1. Imports
code = code.replace(
  "import { Search, Sparkles } from 'lucide-react';",
  "import { Search, Sparkles, Shuffle, Play, Square } from 'lucide-react';"
);

// 2. State for Shuffle and Auto Read
const stateHooks = `
  const [shuffledIds, setShuffledIds] = useState<string[]>([]);
  const [isAutoReading, setIsAutoReading] = useState(false);
  const [autoReadIndex, setAutoReadIndex] = useState(-1);
`;
code = code.replace(
  "const [selectedAnimal, setSelectedAnimal] = useState<Animal | null>(null);",
  "const [selectedAnimal, setSelectedAnimal] = useState<Animal | null>(null);\n" + stateHooks
);

// 3. Update filteredAnimals to sort based on shuffledIds
const newFilteredAnimals = `
  const filteredAnimals = useMemo(() => {
    let result = ANIMALS.filter((animal) => {
      const matchesCategory = selectedHabitat === 'all' || animal.category === selectedHabitat;
      const matchesSearch =
        searchQuery.trim() === '' ||
        animal.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        animal.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        animal.funFact.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });

    if (shuffledIds.length > 0) {
      result = result.sort((a, b) => {
        const idxA = shuffledIds.indexOf(a.id);
        const idxB = shuffledIds.indexOf(b.id);
        if (idxA === -1 && idxB === -1) return 0;
        if (idxA === -1) return 1;
        if (idxB === -1) return -1;
        return idxA - idxB;
      });
    }
    return result;
  }, [selectedHabitat, searchQuery, shuffledIds]);
`;
code = code.replace(/const filteredAnimals = useMemo\([\s\S]*?\}, \[selectedHabitat, searchQuery\]\);/, newFilteredAnimals);

// 4. Auto Read Effect
const autoReadEffect = `
  React.useEffect(() => {
    let cancelled = false;
    if (isAutoReading && autoReadIndex >= 0 && autoReadIndex < filteredAnimals.length) {
      const animal = filteredAnimals[autoReadIndex];
      setSelectedAnimal(animal);
      
      // Delay before speaking so modal can open
      setTimeout(() => {
        if (cancelled) return;
        audioEngine.speakText(animal.name, 0.95, 1.1, () => {
          if (cancelled) return;
          setTimeout(() => {
            if (cancelled) return;
            audioEngine.playAnimalSound(animal.soundType, () => {
              if (cancelled) return;
              setTimeout(() => {
                if (cancelled) return;
                setAutoReadIndex(prev => prev + 1);
              }, 1200);
            });
          }, 400);
        });
      }, 500);
    } else if (isAutoReading && autoReadIndex >= filteredAnimals.length) {
      setIsAutoReading(false);
      setAutoReadIndex(-1);
    }
    return () => {
      cancelled = true;
    };
  }, [isAutoReading, autoReadIndex, filteredAnimals]);

  const toggleAutoRead = () => {
    if (isAutoReading) {
      setIsAutoReading(false);
      setAutoReadIndex(-1);
      audioEngine.stopSpeaking();
      audioEngine.stopCurrentAudio();
    } else {
      setIsAutoReading(true);
      setAutoReadIndex(0);
    }
  };

  const handleShuffle = () => {
    const ids = [...ANIMALS.map(a => a.id)];
    for (let i = ids.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [ids[i], ids[j]] = [ids[j], ids[i]];
    }
    setShuffledIds(ids);
  };
`;
code = code.replace("const handleNextAnimal = () => {", autoReadEffect + "\n  const handleNextAnimal = () => {");

// 5. Update Buttons (Shuffle, Auto Read, Random)
const buttonsHTML = `
                <button
                  id="btn-shuffle"
                  onClick={handleShuffle}
                  title="Shuffle Animals"
                  className="flex items-center justify-center rounded-xl bg-white p-2.5 shadow-xs border border-slate-200 hover:bg-slate-50 transition-colors"
                >
                  <Shuffle className="h-5 w-5 text-indigo-500" />
                </button>
                <button
                  id="btn-auto-read"
                  onClick={toggleAutoRead}
                  className={\`flex items-center justify-center gap-1.5 rounded-xl px-3.5 py-2 text-sm font-semibold shadow-xs border transition-colors \${isAutoReading ? 'bg-rose-50 border-rose-200 text-rose-700 hover:bg-rose-100' : 'bg-white border-slate-200 text-slate-800 hover:bg-slate-50'}\`}
                >
                  {isAutoReading ? <Square className="h-4 w-4" fill="currentColor" /> : <Play className="h-4 w-4" fill="currentColor" />}
                  <span>{isAutoReading ? 'Stop' : 'Auto Read'}</span>
                </button>
                <button
                  id="btn-random-animal"
                  onClick={triggerRandomAnimal}
                  className="flex items-center justify-center gap-1.5 rounded-xl bg-white px-3.5 py-2 text-sm font-semibold text-slate-800 shadow-xs border border-slate-200 hover:bg-slate-50 transition-colors hidden sm:flex"
                >
                  <Sparkles className="h-4 w-4 text-amber-500" />
                  <span>Random</span>
                </button>
`;
code = code.replace(/<button\s+id="btn-random-animal"[\s\S]*?<\/button>/, buttonsHTML);

// 6. Bigger Animals Layout
code = code.replace(
  'className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-5"',
  'className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6 sm:gap-8"'
);

// 7. Update AnimalDetailModal onClose
code = code.replace(
  'onClose={() => setSelectedAnimal(null)}',
  `onClose={() => {
          setSelectedAnimal(null);
          if (isAutoReading) toggleAutoRead();
        }}`
);

fs.writeFileSync(pagePath, code);
console.log('Successfully patched page.tsx');
