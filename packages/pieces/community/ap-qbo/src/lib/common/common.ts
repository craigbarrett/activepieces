import {
  StoreScope,
  Store,
  Property,
  Validators,
} from '@activepieces/pieces-framework';
import {
  httpClient,
  HttpMethod,
  AuthenticationType,
  HttpRequest,
} from '@activepieces/pieces-common';

export const quickbooksCommons = {
  // baseUrl: 'https://quickbooks.api.intuit.com',
  baseUrl: 'https://sandbox-quickbooks.api.intuit.com',
  REALM_ID_STRING: 'realmId',
  VERIFIER_TOKEN_STRING: 'verifierToken',
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
  realmId: Property.LongText({
    displayName: 'Realm ID/ Company ID',
    required: false,
    description:
      'Enter Company Id/realm ID that can be obtained can be obtained by visiting https://developer.intuit.com/app/developer/playground, skip it if provided previously',
    validators: [Validators.maxLength(20)],
  }),
  // webhookVerifierToken: Property.LongText({
  //   displayName: 'Webhook Verifier Token',
  //   required: false,
  //   description:
  //     'Enter Webhook Verifier Token and double check it, can be obtained by visiting https://developer.intuit.com/app/developer/dashboard then "App Name" => "Production Settings" => Webhooks and then entering your Public-URL of Ngrok',
  // }),
  queryAcustomer: async (
    realmId: string,
    accessToken: string,
    lastFetchDateTime: string
  ): Promise<QueryCustomerResponse> => {
    const request: HttpRequest = {
      method: HttpMethod.GET,
      url: `${quickbooksCommons.baseUrl}/v3/company/${realmId}/query`,
      authentication: {
        type: AuthenticationType.BEARER_TOKEN,
        token: accessToken,
      },
      queryParams: {
        query: `select * from Customer Where Metadata.CreateTime > '${lastFetchDateTime}'`,
      },
    };
    const response = await httpClient.sendRequest<{ value: object }>(request);
    return (response.body as any)['QueryResponse'];
  },
};

export interface QueryCustomerResponse {
  Customer: any[];
}
