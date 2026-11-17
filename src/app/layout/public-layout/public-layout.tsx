import { Outlet } from 'react-router';
import { useTranslation } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEarthEurope } from '@fortawesome/free-solid-svg-icons';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shadcn/components/ui/select';
import { i18nService } from '@/core/services/i18n.service';
import { ThemeToggleTwo } from '@/shared/components/ui/theme-toggle-two/theme-toggle-two';

export function PublicLayout() {
  const { t, i18n } = useTranslation();

  const languages = i18nService.supportedLanguages;
  const currentLanguage = i18n.language;

  const onLanguageChange = (value: string) => {
    void i18nService.setLanguage(value);
  };

  return (
    <div className="min-h-screen flex bg-[#eaf3f4] dark:bg-[#162326]">
      {/* LEFT - IMAGE */}
      <div className="absolute inset-0 lg:relative lg:w-1/2 overflow-hidden pointer-events-none lg:pointer-events-auto">
        <img
          src="/assets/images/bg/sign-in-bg.png"
          className="absolute inset-0 w-full h-full object-cover scale-105 hover:scale-110 transition-transform duration-[4000ms]"
          alt="Login background"
        />

        {/* Subtle pulses */}
        <div className="absolute top-40 left-10 w-84 h-84 bg-white/25 blur-3xl rounded-full animate-pulse"></div>
        <div className="absolute bottom-100 right-60 w-50 h-50 bg-white/30 blur-3xl rounded-full animate-pulse"></div>

        {/* Text on the image */}
        <div className="hidden lg:flex relative z-10 flex-col justify-center p-16 text-white h-full">
          <h2 className="font-extrabold tracking-tight leading-[1.05] -ml-6 lg:ml-0 text-white drop-shadow-[0_8px_20px_rgba(0,0,0,0.35)] text-shadow-lg text-[56px] md:text-[72px] lg:text-[96px] xl:text-[120px]">
            {t('auth.slogan.headOne')} <br />
            {t('auth.slogan.headTwo')} <br />
            {t('auth.slogan.headThree')}
          </h2>

          <p className="mt-8 max-w-md text-white leading-relaxed drop-shadow-[0_8px_20px_rgba(0,0,0,0.35)] text-shadow-lg text-base md:text-lg lg:text-xl xl:text-2xl">
            {t('auth.slogan.teaser')}
          </p>
        </div>
      </div>

      {/* RIGHT - FORM */}
      <div className="flex flex-1 items-center justify-center px-6 py-12 relative z-10">
        <div className="w-full max-w-lg">
          <div className="flex justify-between items-center mb-3">
            {/* Language switcher */}
            <div className="flex items-center gap-2">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-white/30 bg-white/60 text-gray-700 backdrop-blur-md dark:border-zinc-700/50 dark:bg-zinc-800/60 dark:text-gray-200">
                <FontAwesomeIcon icon={faEarthEurope} className="text-base" />
              </div>

              <Select value={currentLanguage} onValueChange={onLanguageChange}>
                <SelectTrigger className="h-10! flex-1 cursor-pointer rounded-lg bg-white/60 dark:bg-zinc-800/60">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent position="popper">
                  {languages.map((language) => (
                    <SelectItem key={language} value={language}>
                      {language.toUpperCase()}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Theme switcher */}
            <ThemeToggleTwo />
          </div>

          {/* View content */}
          <div className="animate-[fadeIn_.6s_ease]">
            <div className="backdrop-blur-2xl bg-white/60 dark:bg-zinc-800/60 border border-white/30 dark:border-zinc-700/50 shadow-[0_10px_40px_rgba(0,0,0,0.08)] rounded-2xl p-8">
              <Outlet />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
