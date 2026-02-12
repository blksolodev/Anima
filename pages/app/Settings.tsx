import React from 'react';
import { GlassCard } from '../../components/GlassCard';
import { Button } from '../../components/Button';
import { Bell, Lock, Eye, Monitor, LogOut } from 'lucide-react';

export const Settings: React.FC = () => {
  return (
    <div className="w-full max-w-2xl mx-auto pt-6 px-4 md:px-6 pb-20">
      <h1 className="text-2xl font-bold mb-8">Settings</h1>

      <div className="space-y-6">
        {/* Account */}
        <section>
          <h2 className="text-sm font-bold text-[#A0A0B0] uppercase mb-4 tracking-wider">Account</h2>
          <GlassCard className="!p-0 overflow-hidden">
            {[
              { label: 'Push Notifications', icon: Bell, value: 'On' },
              { label: 'Privacy & Safety', icon: Lock, value: '' },
              { label: 'Content Preferences', icon: Eye, value: '' },
              { label: 'Display & Sound', icon: Monitor, value: 'Dark' },
            ].map((item, idx) => (
              <div 
                key={idx} 
                className={`p-4 flex justify-between items-center hover:bg-white/5 cursor-pointer transition-colors ${idx !== 3 ? 'border-b border-white/5' : ''}`}
              >
                <div className="flex items-center gap-3">
                  <item.icon size={20} className="text-[#A0A0B0]" />
                  <span>{item.label}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-[#A0A0B0]">{item.value}</span>
                  <span className="text-[#6B6B7B]">›</span>
                </div>
              </div>
            ))}
          </GlassCard>
        </section>

        {/* Danger Zone */}
        <section>
          <h2 className="text-sm font-bold text-[#EF4444] uppercase mb-4 tracking-wider">Danger Zone</h2>
          <Button variant="ghost" className="w-full justify-start text-[#EF4444] border-[#EF4444]/20 hover:bg-[#EF4444]/10">
            <LogOut size={20} />
            <span className="ml-2">Log Out</span>
          </Button>
        </section>
      </div>
    </div>
  );
};