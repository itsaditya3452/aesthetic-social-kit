'use client';

import React, { useState, useEffect } from 'react';
import BirthdayGiftMaker from './BirthdayGiftMaker';
import BirthdayGiftViewer from './BirthdayGiftViewer';
import { decodeGiftPayload } from '../lib/giftLink';

export default function BirthdayGiftPageClient() {
  const [gift, setGift] = useState(null);

  useEffect(() => {
    const hash = window.location.hash || '';
    if (hash.startsWith('#gift=')) {
      const decoded = decodeGiftPayload(hash.slice('#gift='.length));
      if (decoded) setGift(decoded);
    }
  }, []);

  if (gift) {
    return <BirthdayGiftViewer gift={gift} />;
  }
  return <BirthdayGiftMaker />;
}
