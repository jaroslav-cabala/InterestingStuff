export const debounce = <A>(action: (args: A) => void, delayMs: number): typeof action => {
  let timeoutId: number;

  return (actionArgs) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    timeoutId = window.setTimeout(() => action(actionArgs), delayMs);
  };
};


Mon, Jul 20 at 11:45 AM
React+ Typescript + Chakra. I wanna internationalize the application. What is the best practice? There will be a button in the app that changes the language. But also, depending on the url(Domain), correct translations should be loaded into the app on start.

Worked for 44s
For a React + TypeScript SPA, I’d use i18next with react-i18next. It supports React hooks, runtime language switching, pluralization, namespaces, fallbacks, and lazy loading. The official documentation supports loading translation resources dynamically and changing language through the i18n instance. 

The cleanest rule is:

A previously selected language overrides everything.

Otherwise, derive the initial language from the domain.

Otherwise, use the fallback language.

This treats the domain as the default market language, while still respecting the user’s explicit choice.

1. Install packages
pnpm add i18next react-i18next i18next-resources-to-backend
2. Suggested structure
src/
├── i18n/
│   ├── config.ts
│   ├── i18n.ts
│   └── types.d.ts
├── locales/
│   ├── en/
│   │   └── common.json
│   ├── cs/
│   │   └── common.json
│   └── de/
│       └── common.json
├── components/
│   └── LanguageSwitcher.tsx
└── main.tsx
3. Define supported languages and domain mapping
// src/i18n/config.ts

export const supportedLanguages = ["en", "cs", "de"] as const;

export type SupportedLanguage = (typeof supportedLanguages)[number];

type LanguageConfiguration = {
  intlLocale: string;
  direction: "ltr" | "rtl";
  label: string;
};

export const languageConfiguration: Record<
  SupportedLanguage,
  LanguageConfiguration
> = {
  en: {
    intlLocale: "en-US",
    direction: "ltr",
    label: "English",
  },
  cs: {
    intlLocale: "cs-CZ",
    direction: "ltr",
    label: "Čeština",
  },
  de: {
    intlLocale: "de-DE",
    direction: "ltr",
    label: "Deutsch",
  },
};

const LANGUAGE_STORAGE_KEY = "application-language";

const domainLanguages: Record<string, SupportedLanguage> = {
  "example.com": "en",
  "example.cz": "cs",
  "example.de": "de",

  // Useful during development:
  localhost: "en",
};

export function isSupportedLanguage(
  value: string | null | undefined,
): value is SupportedLanguage {
  return (
    value !== null &&
    value !== undefined &&
    supportedLanguages.includes(value as SupportedLanguage)
  );
}

function normalizeHostname(hostname: string): string {
  return hostname.toLowerCase().replace(/^www\./, "");
}

export function getLanguageFromDomain(
  hostname = window.location.hostname,
): SupportedLanguage | undefined {
  const normalizedHostname = normalizeHostname(hostname);

  return domainLanguages[normalizedHostname];
}

export function getInitialLanguage(): SupportedLanguage {
  const storedLanguage = localStorage.getItem(LANGUAGE_STORAGE_KEY);

  if (isSupportedLanguage(storedLanguage)) {
    return storedLanguage;
  }

  return getLanguageFromDomain() ?? "en";
}

export function persistLanguage(language: SupportedLanguage): void {
  localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
}

export function synchronizeDocumentLanguage(
  language: SupportedLanguage,
): void {
  const configuration = languageConfiguration[language];

  document.documentElement.lang = configuration.intlLocale;
  document.documentElement.dir = configuration.direction;
