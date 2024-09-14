import { FC, useEffect } from "react";
import { toastActions } from "../../core/redux/toast";
import { useTranslation } from "react-i18next";
import { setGlobalState } from "../../core/redux/hooks/reduxHooks";

const Page403: FC = () => {
  const dispatch = setGlobalState();
  const { t } = useTranslation();

  useEffect(() => {
    const toast = () => {
      dispatch(toastActions.showToast({ severity: 'error', summary: 'Error', detail: t('login.messages.noPermissions') }));
    };

    toast();
  }, []);

  return (
    <>
      <div>403</div>
    </>
  );
};
export default Page403;
