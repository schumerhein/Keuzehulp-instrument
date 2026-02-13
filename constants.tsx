
import React from 'react';

export const COLORS = {
  dark: '#000000',
  red: '#BC031C',
  redHover: '#a10218',
  light: '#F5F5F5',
  white: '#FFFFFF'
};

export const ICONS = {
  // Stap 1: Types (Nu met prominente pianotoetsen)
  AcousticPiano: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-8 h-8">
      {/* Piano Body (Upright) */}
      <path d="M4 3h16v15H4V3z" strokeLinecap="round" strokeLinejoin="round"/>
      {/* Keyboard Area */}
      <path d="M3 13h18" strokeLinecap="round" strokeLinejoin="round"/>
      {/* Piano Keys (Pianotoetsen) */}
      <path d="M6 13v5M9 13v5M12 13v5M15 13v5M18 13v5" strokeLinecap="round" strokeLinejoin="round"/>
      {/* Upper Panel details */}
      <path d="M8 7h8" strokeLinecap="round" strokeLinejoin="round" opacity="0.3"/>
    </svg>
  ),
  GrandPiano: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-8 h-8">
      {/* Iconic Grand Piano Curve */}
      <path d="M4 12c0-5 4-8 9-8h7v10c0 4-5 5-9 5H4v-7z" strokeLinecap="round" strokeLinejoin="round"/>
      {/* Keyboard Front */}
      <path d="M4 12h11" strokeLinecap="round" strokeLinejoin="round"/>
      {/* Piano Keys (Pianotoetsen in perspective) */}
      <path d="M6 12v3M9 12v3M12 12v3" strokeLinecap="round" strokeLinejoin="round"/>
      {/* Grand Piano Lid line */}
      <path d="M13 4l7 1" strokeLinecap="round" strokeLinejoin="round" opacity="0.5"/>
    </svg>
  ),
  Digital: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-8 h-8">
      <rect x="2" y="8" width="20" height="8" rx="1" />
      <path d="M5 12v4M9 12v4M13 12v4M17 12v4M19 12v4" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M2 11h20" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  Question: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-8 h-8">
      <circle cx="12" cy="12" r="10" />
      <path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3M12 17h.01" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),

  // Stap 2: Niveaus (Muzikale voortgang)
  SkillBeginner: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-8 h-8">
      {/* Enkele kwartnoot */}
      <circle cx="9" cy="17" r="3" />
      <path d="M12 17V4h4" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  SkillIntermediate: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-8 h-8">
      {/* Twee achtste noten aan elkaar */}
      <circle cx="6" cy="17" r="3" />
      <circle cx="16" cy="15" r="3" />
      <path d="M9 17V6l10-2v11" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M9 10l10-2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  SkillAdvanced: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-8 h-8">
      {/* G-sleutel (Treble Clef) */}
      <path d="M12 21V3c0 0-4 1-4 4s4 2 4 5-4 3-4 6 4 3 4 3z" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M12 12c4 0 4-3 4-5s-4-2-4-2" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx="9" cy="18" r="1" />
    </svg>
  ),
  SkillProfessional: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-8 h-8">
      {/* Lier / Klassiek symbool voor meesterschap */}
      <path d="M6 4v12c0 3.3 2.7 6 6 6s6-2.7 6-6V4" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M6 8h12M6 12h12M12 4v18" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M18 4c2 0 3 1 3 3s-1 3-3 3M6 4C4 4 3 5 3 7s1 3 3 3" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),

  // Stap 3: Ruimte
  SpaceSmall: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-8 h-8">
      <rect x="7" y="3" width="10" height="18" rx="2" />
      <path d="M10 7h4M10 11h4M10 15h4" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  SpaceMedium: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-8 h-8">
      <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h12a1 1 0 001-1V10M9 21v-4a2 2 0 012-2h2a2 2 0 012 2v4" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  SpaceLarge: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-8 h-8">
      <path d="M3 21h18M3 10l9-7 9 7v11H3V10z" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M9 21v-8a3 3 0 016 0v8" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),

  // Stap 4: Budget
  Money1: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-8 h-8">
      {/* Portemonnee / Instapbudget */}
      <path d="M20 12V8H6a2 2 0 01-2-2V5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M4 6v12a2 2 0 002 2h14v-4" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M18 12h2a2 2 0 012 2v2a2 2 0 01-2 2h-2v-6z" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  Money2: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-8 h-8">
      <rect x="2" y="6" width="20" height="12" rx="2" />
      <circle cx="12" cy="12" r="2" />
      <path d="M6 12h.01M18 12h.01" strokeLinecap="round" />
    </svg>
  ),
  Money3: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-8 h-8">
      {/* Stapel bankbiljetten / Premium budget */}
      <rect x="4" y="8" width="16" height="10" rx="1" />
      <path d="M2 12h2M20 12h2M4 6h16M6 4h12" strokeLinecap="round" strokeLinejoin="round" opacity="0.4"/>
      <circle cx="12" cy="13" r="2" />
    </svg>
  ),
  Money4: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-8 h-8">
      <path d="M6 3h12l4 6-10 12L2 9l4-6z" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M12 21l4-12M12 21L8 9M2 9h20M6 3l4 6M18 3l-4 6" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),

  // Stap 5: Conditie
  ConditionNew: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-8 h-8">
      <path d="M12 3l2.45 5.51L20.5 9.34l-4.69 4.14 1.45 6.03L12 16.27l-5.26 3.24 1.45-6.03L3.5 9.34l6.05-.83L12 3z" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  ConditionUsed: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-8 h-8">
      <path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  Sparkle: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-8 h-8">
      {/* 'Maakt niet uit' - Open ster of kruisende pijlen voor flexibiliteit */}
      <path d="M8 7h12m0 0l-4-4m4 4l-4 4M16 17H4m0 0l4-4m-4 4l4 4" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),

  // Stap 6: Priorities
  Warm: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-8 h-8">
      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zM12 14c-4.42 0-8 2.58-8 6v2h16v-2c0-3.42-3.58-6-8-6z" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  Bright: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-8 h-8">
      <path d="M9 21h6M12 17v4M7 9a5 5 0 0110 0c0 3-2 4-2 6H9c0-2-2-3-2-6z" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  Design: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-8 h-8">
      <path d="M12 19l7-7 3 3-7 7-3-3zM18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  Compact: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-8 h-8">
      <path d="M4 14l3-3m0 0l-3-3m3 3H2M20 10l-3 3m0 0l3 3m-3-3h5M14 4l-3 3m0 0l-3-3m3 3V2M10 20l3-3m0 0l3 3m-3-3v5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  Value: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-8 h-8">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M9 12l2 2 4-4" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  Silent: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-8 h-8">
      <path d="M3 18v-6a9 9 0 0118 0v6M3 18a2 2 0 002 2h2V14H5a2 2 0 00-2 2zM21 18a2 2 0 01-2 2h-2V14h2a2 2 0 012 2z" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  TopBrand: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-8 h-8">
      <path d="M5 15l-3-8 6 3 4-8 4 8 6-3-3 8H5z" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),

  // Footer / USPs
  Specialist: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  Workshop: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6">
      <path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  Advice: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6">
      <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2v10z" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx="8" cy="10" r="1" fill="currentColor" />
      <circle cx="12" cy="10" r="1" fill="currentColor" />
      <circle cx="16" cy="10" r="1" fill="currentColor" />
    </svg>
  )
};
