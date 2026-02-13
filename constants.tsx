
import React from 'react';

export const COLORS = {
  dark: '#000000',
  red: '#BC031C',
  redHover: '#a10218',
  light: '#F5F5F5',
  white: '#FFFFFF'
};

export const ICONS = {
  // Step 1: Types
  AcousticPiano: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-8 h-8">
      <path d="M4 10h16v10a2 2 0 01-2 2H6a2 2 0 01-2-2V10z" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M4 10V6a2 2 0 012-2h12a2 2 0 012 2v4M8 10v12M12 10v12M16 10v12" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  GrandPiano: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-8 h-8">
      <path d="M3 11c0-3.866 3.134-7 7-7h10v11a4 4 0 01-4 4H7a4 4 0 01-4-4v-4z" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M3 11h17M7 19v2M17 19v2" strokeLinecap="round" strokeLinejoin="round"/>
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

  // Step 2: Levels
  SkillBeginner: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-8 h-8">
      <path d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  SkillIntermediate: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-8 h-8">
      <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  SkillAdvanced: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-8 h-8">
      <path d="M5 3v18l15-9L5 3z" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M9 7v10l8-5-8-5z" fill="currentColor" fillOpacity="0.2" />
    </svg>
  ),
  SkillProfessional: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-8 h-8">
      <path d="M12 15l-2 5L3 7l9 2 9-2-7 13-2-5z" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx="12" cy="12" r="3" />
    </svg>
  ),

  // Step 3: Space
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

  // Step 4: Budget
  Money1: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-8 h-8">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 8v8M9 12h6" strokeLinecap="round" strokeLinejoin="round"/>
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
      <path d="M12 6V3m4.24 4.24l2.12-2.12M18 12h3m-4.24 4.24l2.12 2.12M12 18v3m-4.24-4.24l-2.12 2.12M6 12H3m4.24-4.24L5.12 5.12" strokeLinecap="round" />
      <circle cx="12" cy="12" r="5" />
    </svg>
  ),
  Money4: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-8 h-8">
      <path d="M6 3h12l4 6-10 12L2 9l4-6z" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M12 21l4-12M12 21L8 9M2 9h20M6 3l4 6M18 3l-4 6" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),

  // Step 5: Condition
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
      <path d="M12 3l1.45 4.51h4.74l-3.84 2.78 1.45 4.51L12 11.92l-3.8 2.88 1.45-4.51-3.84-2.78h4.74L12 3z" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),

  // Step 6: Priorities
  Warm: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-8 h-8">
      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zM12 14c-4.42 0-8 2.58-8 6v2h16v-2c0-3.42-3.58-6-8-6z" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M12 8v4M12 12l2 2" strokeLinecap="round" strokeLinejoin="round" />
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
