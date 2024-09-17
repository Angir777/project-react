import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

interface PrimeButtonLabelProps {
  text: string;
  loader: boolean;
  icon?: JSX.Element | null;
}

/**
 * Tworzy "label" dla buttonu z prime reacta
 * text - Tekst wyświetlany na buttonie
 * loader - Zmienna określająca czy jest ładowanie, czy nie
 * icon - opcjonalna ikona
 *
 * Przykład:
 * <Button label={<PrimeButtonLabel text={t('login.logIn')} loader={isLogging} icon={<FontAwesomeIcon icon={faUser} />} />} severity="success" className="w-100" />
 *
 * @returns
 */
export const PrimeButtonLabel: React.FC<PrimeButtonLabelProps> = ({ text, loader, icon }) => {
  const content = loader ? (
    <>
      <FontAwesomeIcon icon={faSpinner} spin className="me-2" />
      {text}
    </>
  ) : (
    <>
      {icon && <span className="me-2">{icon}</span>}
      {text}
    </>
  );

  return content;
};
