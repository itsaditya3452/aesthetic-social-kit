'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Image as ImageIcon, Map, Gift, Clapperboard, Type, Youtube, Grid3x3, Link2, FileBadge, Calculator } from 'lucide-react';

export const TOOL_ROUTES = [
  { href: '/instagram-story-maker', label: 'Story Engine', icon: ImageIcon },
  { href: '/travel-video-maker', label: 'Route Animator', icon: Map },
  { href: '/birthday-gift-maker', label: 'Birthday Gift', icon: Gift },
  { href: '/reels-script-generator', label: 'Script Builder', icon: Clapperboard },
  { href: '/instagram-caption-generator', label: 'Caption Studio', icon: Type },
  { href: '/youtube-hook-generator', label: 'YouTube Kit', icon: Youtube },
  { href: '/instagram-grid-planner', label: 'Grid Planner', icon: Grid3x3 },
  { href: '/bio-link-builder', label: 'Bio Link', icon: Link2 },
  { href: '/media-kit-generator', label: 'Media Kit', icon: FileBadge },
  { href: '/influencer-rate-calculator', label: 'Rate Calculator', icon: Calculator },
];

export default function ToolNav() {
  const pathname = usePathname();

  return (
    <nav className="flex gap-2 mb-8 bg-white/50 backdrop-blur-sm border border-[#E4DFD3] rounded-2xl p-1.5 overflow-x-auto shadow-sm no-scrollbar">
      {TOOL_ROUTES.map((route) => {
        const Icon = route.icon;
        const active = pathname === route.href;
        return (
          <Link
            key={route.href}
            href={route.href}
            className={`shrink-0 flex items-center justify-center gap-2 rounded-xl py-2.5 px-4 text-sm font-medium whitespace-nowrap transition-all duration-300 ${
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
