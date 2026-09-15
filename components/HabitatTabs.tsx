'use client';

import React from 'react';
import { motion } from 'motion/react';
import { HABITATS, Habitat } from '@/lib/animalsData';
import { audioEngine } from '@/lib/audioEngine';

interface HabitatTabsProps {
  selectedHabitat: string;
  onSelectHabitat: (id: Habitat['id']) => void;
}

export const HabitatTabs: React.FC<HabitatTabsProps> = ({
  selectedHabitat,
  onSelectHabitat,
}) => {
  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
      {HABITATS.map((habitat) => {
        const isSelected = selectedHabitat === habitat.id;

        return (
          <motion.button
            key={habitat.id}
            id={`tab-habitat-${habitat.id}`}
            whileTap={{ scale: 0.96 }}
            onClick={() => {
              audioEngine.playPopSound(isSelected ? 520 : 480);
              onSelectHabitat(habitat.id);
            }}
            className={`flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-sm font-semibold transition-all ${
              isSelected
                ? 'bg-amber-500 text-white shadow-xs'
                : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            <span className="text-base leading-none">{habitat.emoji}</span>
            <span className="whitespace-nowrap">{habitat.name}</span>
          </motion.button>
        );
      })}
    </div>
  );
};
