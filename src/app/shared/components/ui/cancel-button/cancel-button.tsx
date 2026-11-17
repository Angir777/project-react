import type { MouseEvent, ReactNode } from 'react';
import { Link } from 'react-router';
import { useTranslation } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';

/**
 * OPTIONAL: Usage options
 *
 * Button with the default translation that goes back in history
 * <CancelButton />
 *
 * Button with a specific translation that navigates to a specific page
 * <CancelButton link="/home" label="main.global.button.cancel" />
 *
 * Close the modal
 * <CancelButton label="main.global.button.close" onClick={closeModal} />
 */

interface CancelButtonProps {
  link?: string | null;
  label?: string;
  showIcon?: boolean;
  onClick?: () => void;
}

const classes =
  'inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-md border border-gray-200 text-gray-700 hover:bg-gray-100 transition cursor-pointer dark:border-zinc-800 dark:text-gray-200 dark:hover:bg-zinc-800';

export function CancelButton({
  link = null,
  label = 'main.global.button.goBack',
  showIcon = true,
  onClick,
}: CancelButtonProps) {
  const { t } = useTranslation();

  const content: ReactNode = (
    <>
      {showIcon && <FontAwesomeIcon icon={faArrowLeft} className="text-xs" />}

      <span>{t(label)}</span>
    </>
  );

  const goBack = (event: MouseEvent) => {
    event.preventDefault();

    if (onClick) {
      onClick();
      return;
    }

    window.history.back();
  };

  if (link) {
    return (
      <Link to={link} className={classes}>
        {content}
      </Link>
    );
  }

  return (
    <button type="button" className={classes} onClick={goBack}>
      {content}
    </button>
  );
}
