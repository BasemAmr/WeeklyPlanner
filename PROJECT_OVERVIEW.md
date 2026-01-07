# Project Overview

## Project Root
*   `components.json`: Configuration file for shadcn-ui components.
*   `index.html`: Main HTML entry point for the application.
*   `netlify.toml`: Configuration settings for Netlify deployment (headers, build commands).
*   `package.json`: NPM package configuration listing dependencies and scripts.
*   `postcss.config.js`: Configuration for PostCSS, likely used with Tailwind CSS.
*   `tailwind.config.js`: Tailwind CSS configuration file.
*   `tsconfig.json`: Main TypeScript configuration file.
*   `vite.config.ts`: Configuration for the Vite build tool.

## public
*   `_headers`: Netlify headers configuration file.
*   `_redirects`: Netlify redirects configuration file.
*   `manifest.json`: Web App Manifest for PWA functionality.
*   `assets/`: Directory containing static assets like SVG icons.

## src
*   `App.tsx`: Main application component that structures the app layout.
*   `main.tsx`: Entry point that mounts the React application to the DOM.
*   `index.css`: Global CSS styles and Tailwind directives.
*   `types.ts`: TypeScript type definitions (root level).
*   `vite-env.d.ts`: TypeScript declarations for Vite environment variables.

## src/components
*   `DayColumn.tsx`: Displays relevant planner entries for a single day.
*   `DayPicker.tsx`: Component for selecting specific dates.
*   `EntryItem.tsx`: Renders individual planner entries.
*   `FieldListView.tsx`: View component for handling lists of fields/entries.
*   `ImportExportPanel.tsx`: UI panel for importing and exporting tasks/data.
*   `ImportPreviewModal.tsx`: Modal showing a preview of data before import.
*   `Onboarding.tsx`: Steps for initial user onboarding.
*   `SettingsModal.tsx`: Modal dialog for configuring application settings.
*   `SliderModeToggle.tsx`: Toggle switch for changing interaction modes (e.g., slider view).
*   `WeekSelectionModal.tsx`: Modal for choosing a specific week to view.
*   `ui/*.tsx`: Reusable UI components from shadcn/ui (buttons, dialogs, cards, etc.).

## src/contexts
*   `SettingsContext.tsx`: Context provider for managing global application settings state.

## src/hooks
*   `useWeekData.ts`: Hook for fetching and managing weekly planner data.
*   `useWeekSlider.ts`: Hook providing logic for the week navigation slider.

## src/lib
*   `db.ts`: IndexedDB wrapper for local data persistence.
*   `merge-strategy.ts`: Logic for merging imported data with existing records.
*   `utils.ts`: General utility helper functions (e.g. Tailwind class merging).
*   `week-analyzer.ts`: Utilities for analyzing content stats (conflicts, summaries).
*   `pdf/generator.ts`: Logic to generate PDF documents from planner data.
*   `pdf/exporter.ts`: Functions to handle the PDF export process.
*   `pdf/templates/`: Components defining PDF visual layout templates.
*   `shared/data-model.ts`: Definitions related to the core data structure of the app.
*   `shared/markdown-exporter.ts`: Logic for exporting content to Markdown.
*   `shared/markdown-parser.ts`: Parser for converting Markdown content back to app data.
