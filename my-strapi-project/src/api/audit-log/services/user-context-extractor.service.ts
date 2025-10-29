/**
 * User Context Extractor Service
 * Single Responsibility: Extracts user context from lifecycle events
 */

import { IUserContextExtractor, IUserContext } from '../interfaces';

export class UserContextExtractorService implements IUserContextExtractor {
  public extract(event: any): IUserContext {
    const state = event?.state;

    // Check for admin user
    if (state?.user?.id && state?.user?.email) {
      return {
        userId: String(state.user.id),
        userType: 'admin',
        userEmail: state.user.email,
      };
    }

    // Check for API user
    if (state?.auth?.credentials?.id) {
      return {
        userId: String(state.auth.credentials.id),
        userType: 'api',
        userEmail: state.auth.credentials.email || null,
      };
    }

    // Default to system user
    return {
      userId: null,
      userType: 'system',
      userEmail: null,
    };
  }
}
