import { isAxiosError } from 'axios';
import { credentialsService } from '../services/credentials.service';
import { navigationService } from '../services/navigation.service';
import { authenticationService } from '@/shared/services/authentication/authentication.service';

/**
 * Interceptor handling 401 errors for a logged-in user.
 */
export const authorizedInterceptor = (error: unknown) => {
  // If the user is not logged in, pass the error through.
  if (credentialsService.isAuthenticated() && isAxiosError(error)) {
    // If the user is logged in and the request returns a 401 error.
    if (error.response?.status === 401) {
      // Log out of the application.
      authenticationService.logOut();
      // Redirect to the login page.
      navigationService.navigate('/login');
    }
  }

  return Promise.reject(error);
};
