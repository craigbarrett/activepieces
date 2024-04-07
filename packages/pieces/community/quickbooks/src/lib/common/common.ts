import {
  StoreScope,
  Store,
  Property,
  Validators,
} from '@activepieces/pieces-framework';

export const quickbooksCommons = {
  baseUrl: 'https://sandbox-quickbooks.api.intuit.com',
  getKeyValue: async (
    store: Store,
    clientId: string,
    key: string,
    value: string | undefined
  ) => {
    let getValue = await store.get<string>(clientId + key, StoreScope.PROJECT);
    console.log('key: ', clientId + key);
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
    console.log('getVal: ', getValue);
    return getValue;
  },
  realmId: Property.LongText({
    displayName: 'Realm ID/ Company ID',
    required: false,
    description:
      'Enter Company Id/realm ID that can be obtained can be obtained by visiting https://developer.intuit.com/app/developer/playground',
    validators: [Validators.maxLength(20)],
  }),
  webhookVerifierToken: Property.LongText({
    displayName: 'Webhook Verifier Token',
    required: false,
    description:
      'Enter Webhook Verifier Token, can be obtained by visiting https://developer.intuit.com/app/developer/dashboard then "App Name" => "Production Settings" => Webhooks and then entering your Public-URL of Ngrok',
  }),
};
