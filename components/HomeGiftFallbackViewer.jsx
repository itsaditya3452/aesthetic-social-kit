'use client';

import { useState, useEffect } from 'react';
import BirthdayGiftViewer from './BirthdayGiftViewer';
import { decodeGiftPayload } from '../lib/giftLink';

export default function HomeGiftFallbackViewer() {
  const [gift, setGift] = useState(null);

  useEffect(() => {
    const hash = window.location.hash || '';
    if (hash.startsWith('#gift=')) {
      const decoded = decodeGiftPayload(hash.slice('#gift='.length));
      if (decoded) setGift(decoded);
    }
  }, []);

  if (!gift) return null;
  return <BirthdayGiftViewer gift={gift} />;
}
