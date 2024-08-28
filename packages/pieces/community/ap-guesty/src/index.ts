import {
  createPiece,
  PieceAuth,
  Property,
} from '@activepieces/pieces-framework';

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
  validate: async ({ auth, propsValue }) => {
    const myHeaders = new Headers();
    myHeaders.append('Accept', 'application/json');
    myHeaders.append('Content-Type', 'application/x-www-form-urlencoded');

    const urlencoded = new URLSearchParams();
    urlencoded.append('grant_type', 'client_credentials');
    urlencoded.append('scope', 'open-api');
    urlencoded.append('client_secret', auth.clientSecret);
    urlencoded.append('client_id', auth.clientId);

    const requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: urlencoded,
    };

    try {
      const request = await fetch(
        'https://open-api.guesty.com/oauth2/token',
        requestOptions
      );
      const respBody = request.json();
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
  triggers: [],
});
