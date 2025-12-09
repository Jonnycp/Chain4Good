import React from 'react';

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
      <img 
        src={icon} 
        alt={label} 
        className="w-4 h-4 object-contain transition-all"
        style={{ filter: isSelected ? 'brightness(0) invert(1)' : 'none' }}
      />
      {label}
    </button>
  );
}