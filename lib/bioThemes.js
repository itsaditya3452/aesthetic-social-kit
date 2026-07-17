export const BIO_THEMES = {
  cream: { label: 'Cream', bg: '#F5F1E8', card: '#FFFDF9', text: '#2B2A28', accent: '#A8B79D' },
  lavender: { label: 'Lavender', bg: '#F3EFFA', card: '#FFFFFF', text: '#2B2A28', accent: '#C9BFE8' },
  sage: { label: 'Sage', bg: '#EEF2EB', card: '#FFFFFF', text: '#2B2A28', accent: '#8DA184' },
  charcoal: { label: 'Charcoal', bg: '#1E1C1A', card: '#2B2A28', text: '#F5F1E8', accent: '#E9C9C0' },
};

export function getBioTheme(key) {
  return BIO_THEMES[key] || BIO_THEMES.cream;
}
