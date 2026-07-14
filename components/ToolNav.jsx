'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Image as ImageIcon, Map, Gift, Clapperboard, Type } from 'lucide-react';

export const TOOL_ROUTES = [
  { href: '/instagram-story-maker', label: 'Story Engine', icon: ImageIcon },
  { href: '/travel-video-maker', label: 'Route Animator', icon: Map },
  { href: '/birthday-gift-maker', label: 'Birthday Gift', icon: Gift },
  { href: '/reels-script-generator', label: 'Script Builder', icon: Clapperboard },
  { href: '/instagram-caption-generator', label: 'Caption Studio', icon: Type },
];

export default function ToolNav() {
  const pathname = usePathname();

  return (
    <nav className="flex gap-2 mb-8 bg-white/50 backdrop-blur-sm border border-[#E4DFD3] rounded-2xl p-1.5 max-w-3xl mx-auto sm:mx-0 overflow-x-auto shadow-sm">
      {TOOL_ROUTES.map((route) => {
        const Icon = route.icon;
        const active = pathname === route.href;
        return (
          <Link
            key={route.href}
            href={route.href}
            className={`flex-1 min-w-[130px] flex items-center justify-center gap-2 rounded-xl py-2.5 px-3 text-sm font-medium transition-all duration-300 ${
              active ? 'bg-[#2B2A28] text-[#F5F1E8] shadow-md scale-[1.01]' : 'text-[#6B665C] hover:bg-white/70'
            }`}
          >
            <Icon size={16} /> {route.label}
          </Link>
        );
      })}
    </nav>
  );
}
