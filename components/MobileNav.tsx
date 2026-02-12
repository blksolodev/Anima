import React from 'react';
import { NavLink } from 'react-router-dom';
import { APP_NAV_LINKS } from '../constants';

export const MobileNav: React.FC = () => {
  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-[#0D0D14]/90 backdrop-blur-xl border-t border-white/10 z-50 pb-safe">
      <div className="flex justify-around items-center px-2 py-3">
        {APP_NAV_LINKS.map((link) => {
          const Icon = link.icon!;
          return (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) => `
                flex flex-col items-center gap-1 p-2 rounded-lg transition-colors
                ${isActive ? 'text-[#FF6B35]' : 'text-[#A0A0B0]'}
              `}
            >
              <Icon size={24} />
            </NavLink>
          );
        })}
      </div>
    </div>
  );
};