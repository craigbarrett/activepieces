import { createPiece, PieceAuth } from '@activepieces/pieces-framework';
import { createACustomerAction } from './lib/actions/create-a-customer';
import { newCustomerCreated } from './lib/triggers/new-customer-created';
import { createAnInvoiceAction } from './lib/actions/create-invoice';
import { queryAnItemAction } from './lib/actions/query-an-item';
import { queryAnyEntityAction } from './lib/actions/query-any-entity';
import { createPaymentAction } from './lib/actions/create-payment';
import { createSalesReceiptAction } from './lib/actions/create-salesreceipt';

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
  displayName: 'ap-qbo',
  auth: quickbooksAuth,
  minimumSupportedRelease: '0.20.0',
  logoUrl: 'https://cdn.activepieces.com/pieces/quickbooks.png',
  authors: ['kumarvikramshahi'],
  actions: [
    createACustomerAction,
    createAnInvoiceAction,
    queryAnItemAction,
    queryAnyEntityAction,
    createPaymentAction,
    createSalesReceiptAction,
  ],
  triggers: [newCustomerCreated],
});
