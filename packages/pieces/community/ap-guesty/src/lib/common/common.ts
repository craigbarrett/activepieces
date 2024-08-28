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
  doAuthentication: async (auth: A, store: Store) => {
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
      await store.put();
      return true;
    } catch (error) {
      console.log(error);
    }
  },
};
