import { useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { credentialsService } from '@/core/services/credentials.service';
import { authenticationService } from '@/shared/services/authentication/authentication.service';
import { toastService } from '@/shared/services/translated-toast/translated-toast.service';
import { parseHttpError } from '@/shared/utils';

export function ConfirmAccount() {
  const navigate = useNavigate();
  const { code } = useParams();

  // Guard against a double call in React StrictMode (dev).
  const requested = useRef<string | null>(null);

  useEffect(() => {
    const redirect = () => {
      if (credentialsService.isAuthenticated()) {
        navigate('/dashboard');
      } else {
        navigate('/login');
      }
    };

    if (code === undefined || code === null) {
      redirect();
      return;
    }

    if (requested.current === code) {
      return;
    }
    requested.current = code;

    authenticationService
      .confirmAccount(code)
      .then(() => {
        toastService.show('success', 'auth.confirmAccount.messages.success.confirmAccountSuccess');
      })
      .catch((error) => {
        const parsed = parseHttpError(error);

        const errorCode = parsed.message;

        toastService.show('error', 'auth.confirmAccount.messages.error.' + errorCode);
      })
      .finally(redirect);
  }, [code, navigate]);

  return (
    <div className="flex flex-col justify-center items-center flex-1 w-full max-w-md mx-auto">
      <FontAwesomeIcon icon={faSpinner} spin />
    </div>
  );
}
