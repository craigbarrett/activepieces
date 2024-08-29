import { Store, StoreScope } from '@activepieces/pieces-framework';

export const guestyCommons = {
  getKeyValue: async (
    store: Store,
    clientId: string,
    key: string,
    value: string | undefined
  ) => {
    let getValue = await store.get<string>(clientId + key, StoreScope.PROJECT);
    if (!getValue) {
      if (!value) {
        throw new Error('No value passed to store');
      }
      await store.put(clientId + key, value, StoreScope.PROJECT);
      getValue = value;
    } else if (getValue && value) {
      await store.delete(clientId + key, StoreScope.PROJECT);
      await store.put(clientId + key, value, StoreScope.PROJECT);
      getValue = value;
    }
    return getValue;
  },
  getAccessToken: async (clientId: string, clientSecret: string) => {
    const myHeaders = new Headers();
    myHeaders.append('Accept', 'application/json');
    myHeaders.append('Content-Type', 'application/x-www-form-urlencoded');

    const urlencoded = new URLSearchParams();
    urlencoded.append('grant_type', 'client_credentials');
    urlencoded.append('scope', 'open-api');
    urlencoded.append('client_secret', clientSecret);
    urlencoded.append('client_id', clientId);

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
      const responseBody = await request.json();
      return responseBody as AuthResponse;
    } catch (error) {
      throw new Error(JSON.stringify(error));
    }
  },
};

export interface AuthResponse {
  token_type: string;
  expires_in: number;
  access_token: string;
  scope: string;
}
