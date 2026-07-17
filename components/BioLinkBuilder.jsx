'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  Plus, X, Save, Link2, Copy, Check, Loader2, AlertCircle,
  ExternalLink, KeyRound, Sparkles, Palette
} from 'lucide-react';
import { supabase, isValidUsername } from '../lib/supabaseClient';
import { BIO_THEMES } from '../lib/bioThemes';

const THEMES = BIO_THEMES;

function newLinkId() {
  return `link-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function editKeyStorageKey(username) {
  return `askit_bio_edit_key_${username}`;
}

function normalizeUrl(url) {
  if (/^https?:\/\//i.test(url)) return url;
  return `https://${url}`;
}

export default function BioLinkBuilder() {
  const [username, setUsername] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [bioText, setBioText] = useState('');
  const [theme, setTheme] = useState('cream');
  const [links, setLinks] = useState([{ id: newLinkId(), label: '', url: '' }]);

  const [editKey, setEditKey] = useState('');
  const [loadedUsername, setLoadedUsername] = useState('');
  const [status, setStatus] = useState('idle'); // idle | saving | saved | error | loading
  const [errorMsg, setErrorMsg] = useState('');
  const [copied, setCopied] = useState(false);

  const publicUrl = loadedUsername && typeof window !== 'undefined'
    ? `${window.location.origin}/bio/${loadedUsername}`
    : '';

  useEffect(() => {
    if (!username) return;
    const stored = window.localStorage.getItem(editKeyStorageKey(username));
    if (stored) setEditKey(stored);
  }, [username]);

  const handleLoadExisting = useCallback(async () => {
    if (!supabase || !username || !editKey) return;
    setStatus('loading');
    setErrorMsg('');
    const { data, error } = await supabase.rpc('get_bio_page_for_edit', {
      p_username: username,
      p_edit_key: editKey,
    });
    if (error || !data || data.length === 0) {
      setStatus('error');
      setErrorMsg('Could not load that page — check the username and edit key.');
      return;
    }
    const page = data[0];
    setDisplayName(page.display_name || '');
    setBioText(page.bio_text || '');
    setTheme(page.theme || 'cream');
    setLinks(
      Array.isArray(page.links) && page.links.length > 0
        ? page.links.map((l) => ({ id: newLinkId(), label: l.label || '', url: l.url || '' }))
        : [{ id: newLinkId(), label: '', url: '' }]
    );
    setLoadedUsername(username);
    setStatus('idle');
  }, [username, editKey]);

  const addLink = () => setLinks((prev) => [...prev, { id: newLinkId(), label: '', url: '' }]);
  const removeLink = (id) => setLinks((prev) => prev.filter((l) => l.id !== id));
  const updateLink = (id, field, value) =>
    setLinks((prev) => prev.map((l) => (l.id === id ? { ...l, [field]: value } : l)));

  const handleSave = async () => {
    setErrorMsg('');

    if (!supabase) {
      setStatus('error');
      setErrorMsg('Supabase isn\'t configured yet — set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY.');
      return;
    }
    if (!isValidUsername(username)) {
      setStatus('error');
      setErrorMsg('Username must be 3-30 characters: lowercase letters, numbers, and hyphens only.');
      return;
    }
    if (!displayName.trim()) {
      setStatus('error');
      setErrorMsg('Add a display name.');
      return;
    }
    const cleanLinks = links
      .filter((l) => l.label.trim() && l.url.trim())
      .map((l) => ({ label: l.label.trim(), url: normalizeUrl(l.url.trim()) }));

    setStatus('saving');

    let keyToUse = editKey;
    const isFirstSaveForThisUsername = !window.localStorage.getItem(editKeyStorageKey(username));
    if (isFirstSaveForThisUsername && !keyToUse) {
      keyToUse = crypto.randomUUID();
    }

    const { data, error } = await supabase.rpc('save_bio_page', {
      p_username: username,
      p_edit_key: keyToUse,
      p_display_name: displayName.trim(),
      p_bio_text: bioText.trim(),
      p_theme: theme,
      p_links: cleanLinks,
    });

    if (error) {
      setStatus('error');
      if (error.message?.includes('INVALID_EDIT_KEY')) {
        setErrorMsg('This username is already taken by a page you don\'t have the edit key for. Try a different username.');
      } else if (error.message?.includes('duplicate key') || error.code === '23505') {
        setErrorMsg('That username is taken. Try another one.');
      } else {
        setErrorMsg(error.message || 'Something went wrong saving your page.');
      }
      return;
    }

    window.localStorage.setItem(editKeyStorageKey(username), keyToUse);
    setEditKey(keyToUse);
    setLoadedUsername(username);
    setStatus('saved');
    setTimeout(() => setStatus('idle'), 2000);
  };

  const handleCopyLink = async () => {
    if (!publicUrl) return;
    try {
      await navigator.clipboard.writeText(publicUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch (e) {
      /* clipboard unavailable */
    }
  };

  const activeTheme = THEMES[theme];

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_340px]">
      <div className="space-y-6">
        {!supabase && (
          <div className="rounded-xl border border-[#E9C9C0] bg-[#FBF1EE] p-4 flex gap-2.5 text-sm text-[#8A5D4F]">
            <AlertCircle size={16} className="shrink-0 mt-0.5" />
            <p>Supabase isn't connected yet. Set <code>NEXT_PUBLIC_SUPABASE_URL</code> and <code>NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY</code> in your environment, then redeploy. See the README for the one-time SQL setup.</p>
          </div>
        )}

        <div>
          <label className="text-sm font-medium text-[#5B6B57] mb-2 block">Your username (this becomes your link)</label>
          <div className="flex items-center gap-0 rounded-xl border border-[#E4DFD3] bg-white/70 overflow-hidden focus-within:border-[#A8B79D] focus-within:ring-2 focus-within:ring-[#A8B79D]/30 transition">
            <span className="pl-4 text-sm text-[#8A8578] shrink-0">/bio/</span>
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
              placeholder="yourname"
              className="flex-1 bg-transparent px-2 py-3 text-sm outline-none"
            />
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-[#5B6B57] mb-2 block">Display name</label>
            <input
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="e.g. Priya Sharma"
              className="w-full rounded-xl border border-[#E4DFD3] bg-white/70 px-4 py-3 text-sm outline-none focus:border-[#A8B79D] focus:ring-2 focus:ring-[#A8B79D]/30 transition"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-[#5B6B57] mb-2 block">Edit key (only if editing an existing page)</label>
            <div className="flex gap-2">
              <input
                value={editKey}
                onChange={(e) => setEditKey(e.target.value)}
                placeholder="paste your saved edit key"
                className="flex-1 rounded-xl border border-[#E4DFD3] bg-white/70 px-4 py-3 text-sm outline-none focus:border-[#A8B79D] focus:ring-2 focus:ring-[#A8B79D]/30 transition"
              />
              <button
                onClick={handleLoadExisting}
                disabled={!username || !editKey || status === 'loading'}
                title="Load this page"
                className="shrink-0 rounded-xl border border-[#E4DFD3] bg-white px-3 hover:border-[#C9BFE8] disabled:opacity-40 transition"
              >
                {status === 'loading' ? <Loader2 size={16} className="animate-spin" /> : <KeyRound size={16} />}
              </button>
            </div>
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-[#5B6B57] mb-2 block">Bio</label>
          <textarea
            value={bioText}
            onChange={(e) => setBioText(e.target.value)}
            rows={2}
            placeholder="A short line about you…"
            className="w-full rounded-xl border border-[#E4DFD3] bg-white/70 px-4 py-3 text-sm outline-none focus:border-[#A8B79D] focus:ring-2 focus:ring-[#A8B79D]/30 transition resize-none"
          />
        </div>

        <div>
          <p className="text-sm font-medium text-[#5B6B57] mb-3 tracking-wide flex items-center gap-1.5"><Palette size={14} /> THEME</p>
          <div className="flex gap-2.5">
            {Object.entries(THEMES).map(([key, t]) => (
              <button
                key={key}
                onClick={() => setTheme(key)}
                className={`flex items-center gap-2 rounded-xl py-2 px-3.5 border text-xs font-medium transition-all duration-200 ${
                  theme === key ? 'border-[#2B2A28] shadow-sm' : 'border-[#E4DFD3] hover:border-[#C9BFE8]'
                }`}
                style={{ backgroundColor: t.bg, color: t.text }}
              >
                <span className="w-3 h-3 rounded-full" style={{ backgroundColor: t.accent }} />
                {t.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="text-sm font-medium text-[#5B6B57]">Links</label>
            <button
              onClick={addLink}
              className="flex items-center gap-1.5 text-xs font-medium text-[#5B4F8A] hover:text-[#413F6E] transition"
            >
              <Plus size={14} /> Add link
            </button>
          </div>
          <div className="space-y-2.5">
            {links.map((link) => (
              <div key={link.id} className="flex gap-2">
                <input
                  value={link.label}
                  onChange={(e) => updateLink(link.id, 'label', e.target.value)}
                  placeholder="Label, e.g. My Reels"
                  className="w-1/3 rounded-lg border border-[#E4DFD3] bg-white/70 px-3 py-2.5 text-sm outline-none focus:border-[#A8B79D] transition"
                />
                <input
                  value={link.url}
                  onChange={(e) => updateLink(link.id, 'url', e.target.value)}
                  placeholder="https://…"
                  className="flex-1 rounded-lg border border-[#E4DFD3] bg-white/70 px-3 py-2.5 text-sm outline-none focus:border-[#A8B79D] transition"
                />
                <button
                  onClick={() => removeLink(link.id)}
                  className="shrink-0 w-9 rounded-lg text-[#8A7267] hover:bg-[#F3EFEA] transition"
                >
                  <X size={15} className="mx-auto" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {errorMsg && (
          <p className="flex items-start gap-1.5 text-xs text-[#C97B6A]"><AlertCircle size={13} className="mt-0.5 shrink-0" /> {errorMsg}</p>
        )}

        <button
          onClick={handleSave}
          disabled={status === 'saving'}
          className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#2B2A28] text-[#F5F1E8] py-3.5 font-medium hover:bg-[#413F3B] active:scale-[0.97] transition-all duration-200 shadow-md disabled:opacity-60"
        >
          {status === 'saving' ? <Loader2 size={18} className="animate-spin" /> : status === 'saved' ? <Check size={18} /> : <Save size={18} />}
          {status === 'saving' ? 'Saving…' : status === 'saved' ? 'Saved!' : 'Save my page'}
        </button>

        {loadedUsername && (
          <div className="rounded-xl border border-[#A8B79D] bg-[#EEF2EB] p-4 space-y-2.5">
            <p className="text-xs font-bold tracking-wider text-[#5B6B57] flex items-center gap-1.5"><Link2 size={13} /> YOUR LIVE LINK</p>
            <div className="flex items-center gap-2">
              <a href={publicUrl} target="_blank" rel="noreferrer" className="flex-1 text-sm text-[#3A3733] truncate hover:underline flex items-center gap-1.5">
                {publicUrl} <ExternalLink size={12} className="shrink-0" />
              </a>
              <button onClick={handleCopyLink} className="shrink-0 flex items-center gap-1 rounded-lg bg-white border border-[#E4DFD3] px-2.5 py-1.5 text-xs font-medium hover:border-[#A8B79D] transition">
                {copied ? <Check size={12} /> : <Copy size={12} />} {copied ? 'Copied' : 'Copy'}
              </button>
            </div>
            <p className="text-xs text-[#5B6B57] flex items-start gap-1.5">
              <KeyRound size={13} className="mt-0.5 shrink-0" />
              Your edit key is saved in this browser. On another device, use username <strong>{loadedUsername}</strong> + your edit key to make changes.
            </p>
          </div>
        )}
      </div>

      <div className="flex justify-center lg:justify-start">
        <div className="w-full max-w-[280px]">
          <div
            className="rounded-3xl overflow-hidden shadow-2xl border-4 border-white ring-1 ring-black/5 min-h-[500px] p-6 flex flex-col items-center text-center gap-4"
            style={{ backgroundColor: activeTheme.bg, color: activeTheme.text }}
          >
            <div className="w-16 h-16 rounded-full flex items-center justify-center text-lg font-bold" style={{ backgroundColor: activeTheme.accent, color: activeTheme.bg }}>
              {(displayName || username || '?').charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="font-semibold" style={{ fontFamily: '"Fraunces", serif' }}>{displayName || 'Your Name'}</p>
              {bioText && <p className="text-xs opacity-70 mt-1">{bioText}</p>}
            </div>
            <div className="w-full space-y-2 mt-2">
              {links.filter((l) => l.label.trim()).length === 0 ? (
                <p className="text-xs opacity-50 flex items-center justify-center gap-1.5"><Sparkles size={12} /> Add links to see them here</p>
              ) : (
                links.filter((l) => l.label.trim()).map((l) => (
                  <div
                    key={l.id}
                    className="w-full rounded-xl py-3 text-sm font-medium"
                    style={{ backgroundColor: activeTheme.card, border: `1px solid ${activeTheme.accent}55` }}
                  >
                    {l.label}
                  </div>
                ))
              )}
            </div>
          </div>
          <p className="text-center text-xs text-[#8A8578] mt-3">Live preview</p>
        </div>
      </div>
    </div>
  );
}
