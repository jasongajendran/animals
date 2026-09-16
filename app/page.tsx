'use client';

import React, { useState, useMemo } from 'react';
import { Search, Sparkles, Shuffle, Play, Square } from 'lucide-react';
import { Header } from '@/components/Header';
import { HabitatTabs } from '@/components/HabitatTabs';
import { AnimalCard } from '@/components/AnimalCard';
import { AnimalDetailModal } from '@/components/AnimalDetailModal';
import { AnimalGuessGame } from '@/components/AnimalGuessGame';
import { ScrollToTop } from '@/components/ScrollToTop';
import { AnimalCelebrationOverlay } from '@/components/AnimalCelebrationOverlay';
import { ANIMALS, HABITATS, Animal, Habitat } from '@/lib/animalsData';
import { audioEngine } from '@/lib/audioEngine';
import { playAnimalCelebration } from '@/lib/animalEffects';

export default function Home() {
  const [currentMode, setCurrentMode] = useState<'gallery' | 'game'>('gallery');
  const [selectedHabitat, setSelectedHabitat] = useState<Habitat['id']>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAnimal, setSelectedAnimal] = useState<Animal | null>(null);

  const [shuffledIds, setShuffledIds] = useState<string[]>([]);
  const [isAutoReading, setIsAutoReading] = useState(false);
  const [autoReadIndex, setAutoReadIndex] = useState(-1);


  const activeHabitat = useMemo(() => {
    return HABITATS.find((h) => h.id === selectedHabitat) || HABITATS[0];
  }, [selectedHabitat]);

  
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


  
  React.useEffect(() => {
    let cancelled = false;
    if (isAutoReading && autoReadIndex >= 0 && autoReadIndex < filteredAnimals.length) {
      const animal = filteredAnimals[autoReadIndex];
      const timer = setTimeout(() => {
        if (cancelled) return;
        setSelectedAnimal(animal);
      }, 0);
      
      // Delay before speaking so modal can open
      const speechTimer = setTimeout(() => {
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

      return () => {
        cancelled = true;
        clearTimeout(timer);
        clearTimeout(speechTimer);
      };
    } else if (isAutoReading && autoReadIndex >= filteredAnimals.length) {
      const resetTimer = setTimeout(() => {
        if (cancelled) return;
        setIsAutoReading(false);
        setAutoReadIndex(-1);
      }, 0);

      return () => {
        cancelled = true;
        clearTimeout(resetTimer);
      };
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

  const handleNextAnimal = () => {
    if (!selectedAnimal) return;
    const currentIndex = ANIMALS.findIndex((a) => a.id === selectedAnimal.id);
    const nextIndex = (currentIndex + 1) % ANIMALS.length;
    setSelectedAnimal(ANIMALS[nextIndex]);
  };

  const handlePrevAnimal = () => {
    if (!selectedAnimal) return;
    const currentIndex = ANIMALS.findIndex((a) => a.id === selectedAnimal.id);
    const prevIndex = (currentIndex - 1 + ANIMALS.length) % ANIMALS.length;
    setSelectedAnimal(ANIMALS[prevIndex]);
  };

  const triggerRandomAnimal = () => {
    const randomAnimal = ANIMALS[Math.floor(Math.random() * ANIMALS.length)];
    setSelectedAnimal(randomAnimal);
    audioEngine.playSparkleSound();
    audioEngine.playAnimalSoundWithName(randomAnimal.id, randomAnimal.name, randomAnimal.soundType);
    playAnimalCelebration(randomAnimal, { x: 0.5, y: 0.5 });
  };

  return (
    <div className={`min-h-screen ${activeHabitat.bgGradient} text-slate-900 transition-colors duration-300 flex flex-col font-sans`}>
      <Header currentMode={currentMode} onModeChange={setCurrentMode} />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-6 flex flex-col">
        {currentMode === 'gallery' ? (
          <>
            {/* Filter and Search Bar */}
            <div className="mb-6 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <HabitatTabs
                selectedHabitat={selectedHabitat}
                onSelectHabitat={(habId) => {
                  setSelectedHabitat(habId);
                  setSearchQuery('');
                }}
              />

              <div className="flex items-center gap-2">
                <div className="relative flex-1 sm:w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    id="input-animal-search"
                    type="text"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 bg-white py-2 pl-9 pr-3 text-sm font-medium text-slate-900 placeholder:text-slate-400 shadow-xs focus:border-amber-500 focus:outline-hidden focus:ring-2 focus:ring-amber-100"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400 hover:text-slate-600"
                    >
                      Clear
                    </button>
                  )}
                </div>

                
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
                  className={`flex items-center justify-center gap-1.5 rounded-xl px-3.5 py-2 text-sm font-semibold shadow-xs border transition-colors ${isAutoReading ? 'bg-rose-50 border-rose-200 text-rose-700 hover:bg-rose-100' : 'bg-white border-slate-200 text-slate-800 hover:bg-slate-50'}`}
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

              </div>
            </div>

            {/* Animals Grid: 1 animal per row on mobile & tablet */}
            {filteredAnimals.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1 xl:grid-cols-2 gap-6 sm:gap-8 max-w-2xl xl:max-w-5xl mx-auto w-full">
                {filteredAnimals.map((animal) => (
                  <AnimalCard
                    key={animal.id}
                    animal={animal}
                    onSelect={(a) => setSelectedAnimal(a)}
                  />
                ))}
              </div>
            ) : (
              <div className="rounded-2xl bg-white p-12 text-center shadow-xs border border-slate-200 my-8">
                <span className="text-4xl">🔍</span>
                <h3 className="mt-3 text-lg font-bold text-slate-900">
                  No animals found
                </h3>
                <p className="mt-1 text-sm text-slate-500">
                  No results for &ldquo;{searchQuery}&rdquo;.
                </p>
                <button
                  onClick={() => setSearchQuery('')}
                  className="mt-4 rounded-xl bg-amber-500 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-600 transition-colors"
                >
                  Show All
                </button>
              </div>
            )}
          </>
        ) : (
          <AnimalGuessGame />
        )}
      </main>

      <AnimalDetailModal
        animal={selectedAnimal}
        onClose={() => {
          setSelectedAnimal(null);
          if (isAutoReading) toggleAutoRead();
        }}
        onNext={handleNextAnimal}
        onPrev={handlePrevAnimal}
      />

      <ScrollToTop />
      <AnimalCelebrationOverlay />
    </div>
  );
}
