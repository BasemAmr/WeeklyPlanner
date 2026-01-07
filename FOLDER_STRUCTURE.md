# New Folder Structure Documentation

## Overview
This document describes the enterprise-grade folder structure implemented for the Week Planner PWA.

## Structure

```
src/
├── app/                          # Application Layer
│   ├── layouts/                  # Layout components
│   │   ├── AppLayout.tsx         # Main app layout wrapper
│   │   ├── AuthLayout.tsx        # Auth pages layout (future)
│   │   └── OnboardingLayout.tsx  # Onboarding layout
│   └── pages/                    # Future: Page-level components
│
├── features/                     # Feature-based modules
│   ├── week-planner/            # Week planning feature
│   │   ├── components/          # Week-specific components
│   │   │   ├── DayColumn.tsx
│   │   │   ├── DayPicker.tsx
│   │   │   ├── EntryItem.tsx
│   │   │   ├── SliderModeToggle.tsx
│   │   │   └── WeekSelectionModal.tsx
│   │   ├── hooks/               # Week-specific hooks
│   │   │   ├── useWeekData.ts
│   │   │   └── useWeekSlider.ts
│   │   ├── types/               # Week-specific types (future)
│   │   └── utils/               # Week-specific utilities (future)
│   ├── tasks/                   # Future: Task management
│   └── sync/                    # Future: Cloud sync
│
├── shared/                      # Shared across features
│   ├── components/              # Shared UI components
│   │   ├── FieldListView.tsx
│   │   ├── ImportExportPanel.tsx
│   │   ├── ImportPreviewModal.tsx
│   │   ├── SettingsModal.tsx
│   │   └── Onboarding.tsx
│   ├── hooks/                   # Shared custom hooks
│   ├── utils/                   # Shared utilities
│   └── types/                   # Shared TypeScript types
│       └── index.ts             # Main type definitions
│
├── design-system/               # Design System
│   ├── tokens/                  # Design tokens
│   │   ├── colors.ts            # Color palette
│   │   ├── typography.ts        # Font & text styles
│   │   ├── spacing.ts           # Spacing scale
│   │   ├── breakpoints.ts       # Responsive breakpoints
│   │   └── animations.ts        # Animation tokens
│   │
│   ├── foundations/             # Foundation components
│   │   ├── Layout.tsx           # Base layout
│   │   ├── Container.tsx        # Responsive container
│   │   ├── Stack.tsx            # Spacing component
│   │   └── Grid.tsx             # Grid system
│   │
│   ├── components/              # UI Components (from shadcn)
│   │   ├── alert-dialog.tsx
│   │   ├── badge.tsx
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── checkbox.tsx
│   │   ├── collapsible.tsx
│   │   ├── dialog.tsx
│   │   ├── dropdown-menu.tsx
│   │   ├── input.tsx
│   │   └── scroll-area.tsx
│   │
│   └── patterns/                # Complex UI patterns
│       ├── AppShell/            # Application shell
│       ├── BottomSheet/         # Mobile bottom sheet
│       └── OnboardingFlow/      # Onboarding pattern
│
├── lib/                         # Libraries & utilities
│   ├── db/                      # Database layer
│   │   └── database.ts          # IndexedDB wrapper
│   ├── api/                     # Future: API client
│   ├── analytics/               # Future: Analytics
│   ├── pdf/                     # PDF generation
│   ├── shared/                  # Shared lib utilities
│   ├── utils.ts                 # General utilities
│   ├── merge-strategy.ts        # Data merging
│   └── week-analyzer.ts         # Week analysis
│
├── contexts/                    # React contexts
│   └── SettingsContext.tsx      # Global settings
│
├── assets/                      # Static assets
│   ├── fonts/
│   ├── images/
│   └── icons/
│
├── styles/                      # Global styles (existing)
├── types/                       # Root types (legacy, use shared/types)
├── App.tsx                      # Main app component
├── main.tsx                     # Entry point
└── index.css                    # Global CSS
```

## Import Paths

### New Import Structure

```typescript
// Design System
import { Button, Dialog } from '@/design-system/components';
import { Layout, Container, Stack } from '@/design-system/foundations';
import { AppShell, BottomSheet, OnboardingFlow } from '@/design-system/patterns';
import { colors, typography, spacing } from '@/design-system/tokens';

// Features
import { DayColumn, DayPicker, useWeekData } from '@/features/week-planner';

// Shared
import { FieldListView, SettingsModal } from '@/shared/components';
import { Day, Entry, WeekData } from '@/shared/types';

// Libraries
import { getWeek, saveWeek } from '@/lib/db';
import { cn, formatDate } from '@/lib/utils';

// Contexts
import { useSettings } from '@/contexts/SettingsContext';
```

## Migration Guide

### Old → New Imports

| Old Path | New Path |
|----------|----------|
| `@/components/ui/button` | `@/design-system/components` |
| `@/components/DayColumn` | `@/features/week-planner` |
| `@/hooks/useWeekData` | `@/features/week-planner` |
| `@/types` | `@/shared/types` |
| `@/lib/db` | `@/lib/db` (stays same) |

## Benefits

1. **Scalability**: Easy to add new features without cluttering
2. **Maintainability**: Clear separation of concerns
3. **Reusability**: Shared components are clearly identified
4. **Testability**: Feature isolation makes testing easier
5. **Collaboration**: Multiple developers can work without conflicts
6. **Design System**: Centralized design tokens and components

## Notes

- Original files in `src/components/` and `src/hooks/` remain for backwards compatibility
- All new development should use the new structure
- Gradually migrate remaining components to their proper locations
