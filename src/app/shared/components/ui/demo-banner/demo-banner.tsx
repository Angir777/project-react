import { useTranslation } from 'react-i18next';

interface DemoBannerProps {
  onClose: () => void;
}

export function DemoBanner({ onClose }: DemoBannerProps) {
  const { t } = useTranslation();

  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 w-[calc(100%-32px)] max-w-[500px] h-[36px] leading-[36px] z-[10000] bg-[#e6f7f6] text-[#2aa198] text-center text-[15px] font-semibold rounded-md border border-[#bfe8e5] shadow-sm">
      <span className="uppercase tracking-wide">{t('main.global.message.info.testBanner')}</span>

      <button
        className="absolute right-3 top-1/2 -translate-y-1/2 text-[20px] leading-none text-[#2aa198] bg-transparent border-none cursor-pointer hover:opacity-70 transition"
        type="button"
        aria-label="Close"
        onClick={onClose}
      >
        ×
      </button>
    </div>
  );
}
