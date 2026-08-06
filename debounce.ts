export const debounce = <A>(action: (args: A) => void, delayMs: number): typeof action => {
  let timeoutId: number;

  return (actionArgs) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    timeoutId = window.setTimeout(() => action(actionArgs), delayMs);
  };
};

// src/components/LanguageSwitcher.tsx

import { Button, HStack } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";

import {
  languageConfiguration,
  persistLanguage,
  supportedLanguages,
  synchronizeDocumentLanguage,
  type SupportedLanguage,
} from "../i18n/config";

export function LanguageSwitcher() {
  const { i18n } = useTranslation();

  const activeLanguage = i18n.resolvedLanguage;

  const handleLanguageChange = async (
    language: SupportedLanguage,
  ): Promise<void> => {
    await i18n.changeLanguage(language);

    persistLanguage(language);
    synchronizeDocumentLanguage(language);
  };

  return (
    <HStack>
      {supportedLanguages.map((language) => {
        const selected = activeLanguage === language;

        return (
          <Button
            key={language}
            size="sm"
            variant={selected ? "solid" : "outline"}
            aria-pressed={selected}
            onClick={() => void handleLanguageChange(language)}
          >
            {languageConfiguration[language].label}
          </Button>
        );
      })}
    </HStack>
  );
}
