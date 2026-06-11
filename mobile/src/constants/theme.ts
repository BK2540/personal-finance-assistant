// ─── Brand ────────────────────────────────────────────────────────────────────
export const COLORS = {
  // Brand
  electric: '#303A95',
  electricInk: '#1A2A7A',
  sky: '#A9D7F3',
  skyInk: '#1A4A6B',
  skyTint: '#DCEDFB',

  // Neutrals
  white: '#FFFFFF',
  ink: '#1E1C1A',
  ink2: '#6B6560',
  ink2Strong: '#57524C',
  parchment: '#F5F0E8',

  // Status
  neon: '#D8E022',
  neonInk: '#5B6B00',
  tangerine: '#F8982E',
  tangerineInk: '#7A3D00',
  deepRed: '#C0253A',

  // Alpha (use with rgba or opacity)
  electric12: 'rgba(48,58,149,0.12)',
  electric08: 'rgba(48,58,149,0.08)',
  borderAlpha: 'rgba(30,28,26,0.10)',

  // Category tints — { bg, glyph }
  categoryFood:          { bg: '#FBE5CE', glyph: '#B5631B' },
  categoryGroceries:     { bg: '#E7EFC0', glyph: '#65710F' },
  categoryTransport:     { bg: '#DCEDFB', glyph: '#2C6E9E' },
  categoryShopping:      { bg: '#ECEAFB', glyph: '#4A3FB0' },
  categoryEntertainment: { bg: '#F8DEE2', glyph: '#A82E40' },
  categoryBills:         { bg: '#DCEDFB', glyph: '#356E96' },
  categorySubscriptions: { bg: '#ECEAFB', glyph: '#5E54B0' },
  categoryHousing:       { bg: '#DEE0F2', glyph: '#303A95' },
};

// ─── Spacing ──────────────────────────────────────────────────────────────────
export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 20,   // screen horizontal padding
  xl: 22,   // card padding
  xxl: 32,
};

// ─── Typography ───────────────────────────────────────────────────────────────
// Font families: Inter (Latin) · Noto Sans Thai (Thai + ฿)
export const FONT_FAMILY = {
  latin: 'Inter',
  thai: 'NotoSansThai',
};

export const FONT_SIZE = {
  amountXL:    40,
  amountHero:  36,
  amountLarge: 30,
  amountMedium:22,
  h1:          28,
  greeting:    26,
  barTitle:    18,
  h2:          18,
  body:        16,
  itemTitle:   15.5,
  label:       14,
  caption:     13,
  overline:    11.5,
  tabLabel:    11,
};

export const FONT_WEIGHT = {
  regular:   '400' as const,
  medium:    '500' as const,
  semibold:  '600' as const,
  bold:      '700' as const,
  extraBold: '800' as const,
};

export const LETTER_SPACING = {
  amountXL:    -1,
  amountHero:  -1,
  amountLarge: -0.8,
  amountMedium: 0,
  h1:          -0.6,
  greeting:    -0.5,
  barTitle:    -0.2,
  h2:          -0.2,
  body:         0,
  itemTitle:    0,
  label:        0,
  caption:      0,
  overline:     0.5,  // UPPERCASE
  tabLabel:     0,
};

// ─── Border Radius ────────────────────────────────────────────────────────────
export const RADIUS = {
  button:    8,
  tile:      12,
  smallCard: 12,
  card:      18,
  pill:      999,
};

// ─── Shadows ──────────────────────────────────────────────────────────────────
export const SHADOW = {
  card: {
    shadowColor: '#1E1C1A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 18,
    elevation: 3,
  },
  button: {
    shadowColor: '#1E1C1A',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 1,
    shadowRadius: 16,
    elevation: 6,
  },
  fab: {
    shadowColor: '#303A95',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.34,
    shadowRadius: 24,
    elevation: 10,
  },
  sheet: {
    shadowColor: '#1E1C1A',
    shadowOffset: { width: 0, height: -10 },
    shadowOpacity: 0.22,
    shadowRadius: 44,
    elevation: 20,
  },
  focusRing: {
    shadowColor: '#303A95',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.16,
    shadowRadius: 3,
    elevation: 0,
  },
};

// ─── Component Specs ──────────────────────────────────────────────────────────

export const COMPONENT = {
  primaryButton: {
    height: 44,
    heightCTA: 52,
    bg: COLORS.electric,
    textColor: COLORS.white,
    fontSize: FONT_SIZE.itemTitle,
    fontWeight: FONT_WEIGHT.semibold,
    radius: RADIUS.button,
    iconGap: 8,
    disabledOpacity: 0.5,
    pillRadius: RADIUS.pill,
  },

  secondaryButton: {
    height: 44,
    bg: 'transparent',
    borderWidth: 1.5,
    borderColor: COLORS.electric,
    textColor: COLORS.electric,
    radius: RADIUS.button,
    // variants
    danger: { borderColor: COLORS.deepRed, textColor: COLORS.deepRed },
    ghost:  { bg: COLORS.electric08, textColor: COLORS.electric },
  },

  roundedButton: {
    width: 44,
    height: 44,
    borderRadius: RADIUS.pill,
    backgroundColor: COLORS.white,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    shadowColor: '#1E1C1A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },

  transactionCard: {
    bg: COLORS.white,
    radius: RADIUS.smallCard,
    borderWidth: 0.5,
    borderColor: COLORS.skyTint,
    paddingVertical: 13,
    paddingHorizontal: 16,
    merchantFontSize: FONT_SIZE.itemTitle,
    merchantFontWeight: FONT_WEIGHT.bold,
    merchantColor: COLORS.ink,
    amountFontSize: FONT_SIZE.itemTitle,
    amountFontWeight: FONT_WEIGHT.bold,
    amountColor: COLORS.electric,
    dateFontSize: 12,
    dateColor: COLORS.ink2,
    // row variant (Activity / grouped card)
    rowHeight: 44,
    rowMerchantSize: 16,
    rowMerchantWeight: FONT_WEIGHT.bold,
    rowSubLineSize: 13.5,
    rowSubLineColor: COLORS.ink2Strong,
    rowDividerWidth: 0.5,
  },

  budgetCard: {
    radius: RADIUS.smallCard,
    borderWidth: 0.5,
    borderColor: COLORS.skyTint,
    padding: 16,
    gap: 11,
    glyphColor: COLORS.ink2,
    glyphSize: 20,
    labelFontSize: FONT_SIZE.itemTitle,
    labelFontWeight: FONT_WEIGHT.bold,
    limitCaptionSize: FONT_SIZE.caption,
    statusColors: {
      healthy:  '#4A5000',
      near:     COLORS.tangerineInk,
      over:     COLORS.deepRed,
    },
    nearPill: {
      bg: COLORS.tangerine,
      textColor: COLORS.tangerineInk,
      threshold: 0.9,
    },
    overPill: {
      bg: 'transparent',
      borderWidth: 1,
      borderColor: COLORS.deepRed,
      textColor: COLORS.deepRed,
    },
  },

  aiInsightCard: {
    radius: RADIUS.smallCard,
    radiusLarge: 16,
    padding: 14,
    maxLines: 2,
    variants: {
      electric: { bg: COLORS.electric12, textColor: COLORS.electricInk },
      sky:      { bg: COLORS.sky,        textColor: COLORS.skyInk },
      warning:  {
        bg: COLORS.parchment,
        borderWidth: 0.5,
        borderColor: COLORS.tangerine,
        textColor: COLORS.tangerineInk,
      },
    },
  },

  bottomTabBar: {
    height: 56,
    safeAreaBottom: 26,
    bgColor: 'rgba(255,255,255,0.92)',
    borderTopWidth: 0.5,
    borderTopColor: COLORS.borderAlpha,
    iconSize: 22,
    pillWidth: 50,
    pillHeight: 30,
    labelSize: FONT_SIZE.tabLabel,
    active: {
      color: COLORS.electric,
      pillBg: COLORS.electric12,
      fontWeight: FONT_WEIGHT.bold,
      strokeWidth: 2,
    },
    inactive: {
      color: COLORS.ink2,
      fontWeight: FONT_WEIGHT.medium,
      strokeWidth: 1.7,
    },
  },

  amountDisplay: {
    color: COLORS.electric,
    fontWeight: FONT_WEIGHT.extraBold,
    fontFamily: FONT_FAMILY.thai,
    letterSpacing: -1,
  },

  categoryBadge: {
    bg: COLORS.sky,
    textColor: COLORS.skyInk,
    fontSize: 12,
    fontWeight: FONT_WEIGHT.bold,
    paddingVertical: 4,
    paddingHorizontal: 10,
    radius: RADIUS.pill,
    chipIconSize: 16,
  },

  progressBar: {
    height: 6,
    heightHero: 5,
    radius: RADIUS.pill,
    trackColor: COLORS.parchment,
    fillHealthy:  COLORS.neon,
    fillNear:     COLORS.tangerine,
    fillOver:     COLORS.deepRed,
    fillElectric: COLORS.electric,
    nearThreshold: 0.9,
    overThreshold: 1.0,
  },

  card: {
    bg: COLORS.skyTint,
    radius: RADIUS.card,
    borderWidth: 0.5,
    borderColor: COLORS.skyTint,
    ...SHADOW.card,
  },

  minTouchTarget: 44,
  screenPaddingHorizontal: 20,
  cardPadding: 22,
  sectionGap: 16,
};
