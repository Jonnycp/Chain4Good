import React from 'react';
import { Icon } from '@iconify/react';

interface CategoryButtonProps {
  label: string;
  icon: string;
  isSelected: boolean;
  onClick: () => void;
}

export default function CategoryButton({ label, icon, isSelected, onClick }: CategoryButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold transition-all border
        ${isSelected 
          ? 'bg-primary text-white border-transparent shadow-md'
          : 'bg-gray-100 text-gray-600 border-transparent hover:bg-gray-200'
        }
      `}
    >
      <Icon 
        icon={icon} 
        className="w-4 h-4 transition-all"
      />
      {label}
    </button>
  );
}