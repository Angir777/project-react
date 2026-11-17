import i18next from 'i18next';
import swal, {
  type SweetAlertIcon,
  type SweetAlertOptions,
  type SweetAlertResult,
} from 'sweetalert2';

interface CustomOptions {
  confirmButtonTextTranslation?: string;
  cancelButtonTextTranslation?: string;
  titleTranslationKey?: string;
  titleTranslationParams?: Record<string, string | number | boolean>;
}

type SweetAlertOptionsCustom = SweetAlertOptions & CustomOptions;

/**
 * Equivalent of the Angular TranslatedSwalService.
 */
export const translatedSwalService = {
  async show(
    type: SweetAlertIcon,
    translationKey: string,
    translationParams: Record<string, string | number | boolean>,
  ) {
    const translation = i18next.t(translationKey, translationParams);

    await swal.fire({
      icon: type,
      text: translation,
    });
  },

  async showAsync(
    translationKey: string,
    translationParams: Record<string, string | number | boolean>,
    settings: SweetAlertOptionsCustom = {},
  ): Promise<SweetAlertResult> {
    const {
      confirmButtonTextTranslation,
      cancelButtonTextTranslation,
      titleTranslationKey,
      titleTranslationParams,
      ...swalOptions
    } = settings;

    const swalSettings: SweetAlertOptions = {
      icon: 'success',
      text: i18next.t(translationKey, translationParams),
    };

    if (titleTranslationKey != null) {
      swalSettings.title = i18next.t(titleTranslationKey, titleTranslationParams ?? {});
    }

    if (confirmButtonTextTranslation != null) {
      swalSettings.confirmButtonText = i18next.t(confirmButtonTextTranslation);
    }

    if (cancelButtonTextTranslation != null) {
      swalSettings.cancelButtonText = i18next.t(cancelButtonTextTranslation);
    }

    return await swal.fire({
      ...swalSettings,
      ...swalOptions,
    } as SweetAlertOptions);
  },

  close(): void {
    void swal.close();
  },
};
