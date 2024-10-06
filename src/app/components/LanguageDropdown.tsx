import { Dropdown } from 'primereact/dropdown';
import { FC } from 'react';
import { APP_LANGUAGE_CHANGE_ENABLE } from '../../envrionment';
import { useTranslation } from 'react-i18next';
import { LanguageInterface } from '../interfaces/language.interface';
import './LanguageDropdown.scss';
import { getGlobalState, setGlobalState } from '../core/redux/hooks/reduxHooks';
import { languageActions } from '../core/redux/language';
import { RootState } from '../core/redux';

const LanguageDropdown: FC = () => {
  const dispatch = setGlobalState();
  const { t } = useTranslation();
  
  // Pobranie aktualnego języka
  const currentLanguage = getGlobalState((state: RootState) => state.language.currentLanguage);
  // Ustawienie nowo wybranego języka
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const languageChange = (language: any) => {
    console.log(language);
    dispatch(languageActions.changeLanguage(language));
  };
  
  // Dostepne języki w aplikacji
  const languages: LanguageInterface[] = [
    {name: 'PL', value: 'pl'},
    {name: 'EN', value: 'en'},
  ];

  // Zmiana języka
  const renderLanguageDropdown = () => {
    if (APP_LANGUAGE_CHANGE_ENABLE) {
      return <Dropdown 
        className='w-100'
        value={currentLanguage} 
        onChange={(e) => languageChange(e.value)} 
        options={languages} 
        optionLabel="name" 
        placeholder={t('language.selectLanguage')}/>;
    } 
  };

  return (
    <>
      <div className='languageSelect'>
        {renderLanguageDropdown()}
      </div>
    </>
  );
};

export default LanguageDropdown;