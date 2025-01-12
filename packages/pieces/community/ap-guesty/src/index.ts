import {
  createPiece,
  PieceAuth,
  Property,
} from '@activepieces/pieces-framework';
import { newReservationTrigger } from './lib/triggers/new-or-update-reservation';
import { guestyCommons } from './lib/common/common';

const authGuide = `
To obtain your ActiveCampaign API URL and Key, follow these steps:

1. Log in to your ActiveCampaign account.
2. Navigate to **Settings->Developer** section.
3. Under **API Access** ,you'll find your API URL and Key.
`;

export const guestyAuth = PieceAuth.CustomAuth({
  required: true,
  description: authGuide,
  props: {
    clientId: Property.LongText({
      description: '',
      displayName: 'Client Id',
      required: true,
    }),
    clientSecret: Property.LongText({
      description: '',
      displayName: 'Client Secret',
      required: true,
    }),
  },
  validate: async ({ auth }) => {
    try {
      await guestyCommons.getAccessToken(auth.clientId, auth.clientSecret);
      // console.log(accessToken);
      return { valid: true };
    } catch (error) {
      return { valid: false, error: '' };
    }
  },
});

export const apGuesty = createPiece({
  displayName: 'Guesty',
  auth: guestyAuth,
  minimumSupportedRelease: '0.20.0',
  logoUrl: 'https://cdn.activepieces.com/pieces/ap-guesty.png',
  authors: [],
  actions: [],
  triggers: [newReservationTrigger],
});
