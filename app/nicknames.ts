// Curated reference → collector nickname map (expandable). Shared by the home
// page and the watch detail pages. Keys are normalised (uppercased, spaces
// stripped) at lookup so "310.30.42.50.01.001" etc. match reliably.
export const NICKNAMES: Record<string, string> = {
  '126710BLNR': 'Batman', '126710BLRO': 'Pepsi', '126610LV': 'Kermit',
  '116610LV': 'Hulk', '116500LN': 'Panda', '226570': 'Polar',
  '310.30.42.50.01.001': 'Moonwatch', 'M79030N': 'Black Bay 58',
  '15202': 'Jumbo', 'SBGA211': 'Snowflake', 'SLGH005': 'White Birch',
};

export const nickOf = (ref?: string): string => {
  if (!ref) return '';
  return NICKNAMES[ref.toUpperCase().replace(/\s+/g, '')] || '';
};
