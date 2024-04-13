import { createPiece, PieceAuth } from '@activepieces/pieces-framework';
import { createACustomerAction } from './lib/actions/create-a-customer';
import { newCustomerCreated } from './lib/triggers/new-customer-created';

export const quickbooksAuth = PieceAuth.OAuth2({
  description: '',

  authUrl: 'https://appcenter.intuit.com/connect/oauth2',
  tokenUrl: 'https://oauth.platform.intuit.com/oauth2/v1/tokens/bearer',
  required: true,
  scope: [
    'com.intuit.quickbooks.accounting',
    'openid',
    'profile',
    'email',
    'phone',
    'address',
  ],
});

export const quickbooks = createPiece({
  displayName: 'QuickBooks',
  auth: quickbooksAuth,
  minimumSupportedRelease: '0.20.0',
  logoUrl: 'https://cdn.activepieces.com/pieces/quickbooks.png',
  authors: ['kumarvikramshahi'],
  actions: [createACustomerAction],
  triggers: [newCustomerCreated],
});
