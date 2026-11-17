import { useTranslation } from 'react-i18next';
import { Languages } from 'lucide-react';
import { Button } from '@/shadcn/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/shadcn/components/ui/dropdown-menu';
import { i18nService } from '@/core/services/i18n.service';

export function LanguageDropdown() {
  const { t } = useTranslation();

  // Available languages
  const languages = i18nService.supportedLanguages;

  // Current language
  const currentLanguage = i18nService.language;

  // Select language
  const setLanguage = async (language: string | undefined) => {
    if (!language || language === currentLanguage) {
      return;
    }
    await i18nService.setLanguage(language);
    localStorage.setItem('language', language);
    location.reload();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon-sm" aria-label={t('layout.header.languages.title')}>
          <Languages />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="min-w-48 rounded-lg" side="bottom" align="end">
        <DropdownMenuLabel>{t('layout.header.languages.title')}</DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuRadioGroup value={currentLanguage} onValueChange={setLanguage}>
          {languages.map((language) => (
            <DropdownMenuRadioItem key={language} value={language}>
              {t('layout.header.languages.' + language)}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
