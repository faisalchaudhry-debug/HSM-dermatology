
import React from 'react';

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  light?: boolean;
  centered?: boolean;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({ title, subtitle, light = false, centered = true }) => {
  return (
    <div className={`mb-12 ${centered ? 'text-center' : 'text-left'}`}>
      {subtitle && (
        <span className="text-amber-500 text-xs font-bold uppercase tracking-[0.2em] block mb-3">
          {subtitle}
        </span>
      )}
      <h2 className={`text-3xl md:text-5xl font-serif mb-4 ${light ? 'text-white' : 'text-neutral-100'}`}>
        {title}
      </h2>
      <div className={`h-1 w-24 gold-gradient rounded-full ${centered ? 'mx-auto' : ''}`}></div>
    </div>
  );
};

export default SectionHeader;
