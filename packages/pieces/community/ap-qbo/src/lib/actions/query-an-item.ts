import {
  createAction,
  Property,
  Validators,
} from '@activepieces/pieces-framework';
import {
  httpClient,
  HttpMethod,
  AuthenticationType,
  HttpRequest,
} from '@activepieces/pieces-common';
import { quickbooksAuth } from '../..';
import { quickbooksCommons } from '../common/common';
import { HttpError } from '@activepieces/pieces-common';

const queryItem = async (
  itemName: string | undefined,
  stockKeepingUnit: string | undefined,
  numberOfResult: number,
  realmId: string,
  accessToken: string
) => {
  let sqlQuery = '';
  if (itemName && !stockKeepingUnit)
    sqlQuery = `SELECT * FROM Item WHERE Name='${itemName}' maxresults ${numberOfResult}`;
  if (!itemName && stockKeepingUnit)
    sqlQuery = `SELECT * FROM Item WHERE Sku='${stockKeepingUnit}' maxresults ${numberOfResult}`;
  if (itemName && stockKeepingUnit)
    sqlQuery = `SELECT * FROM Item WHERE Name='${itemName}' AND Sku='${stockKeepingUnit}' maxresults ${numberOfResult}`;

  const request: HttpRequest = {
    method: HttpMethod.GET,
    url: `${quickbooksCommons.baseUrl}/v3/company/${realmId}/query?query=${sqlQuery}&minorversion=73`,
    authentication: {
      type: AuthenticationType.BEARER_TOKEN,
      token: accessToken,
    },
  };
  const response = await httpClient.sendRequest<{ value: object }>(request);
  return response.body;
};

export const queryAnItemAction = createAction({
  auth: quickbooksAuth,
  name: 'queryAnItem',
  displayName: 'Query an Item',
  description: 'Query an Item by using Item Name or Stock keeping unit (SKU)',
  props: {
    realmId: Property.LongText({
      displayName: 'Realm ID/ Company ID',
      required: false,
      description:
        'Enter Company Id/realm ID that can be obtained can be obtained by visiting https://developer.intuit.com/app/developer/playground, skip it if provided previously',
      validators: [Validators.maxLength(20)],
    }),
    itemName: Property.LongText({
      displayName: 'Name',
      required: false,
      validators: [Validators.maxLength(100)],
    }),
    itemSku: Property.LongText({
      displayName: 'Stock keeping unit (SKU)',
      required: false,
      validators: [Validators.maxLength(100)],
    }),
    numberOfResult: Property.Number({
      displayName: 'Number of results to fetch',
      required: true,
      defaultValue: 1,
    }),
  },
  async run({ propsValue, auth, store }) {
    let getRealmId: string;
    try {
      getRealmId = await quickbooksCommons.getKeyValue(
        store,
        (auth as any)?.client_id,
        quickbooksCommons.REALM_ID_STRING,
        propsValue.realmId
      );
    } catch (error) {
      throw new Error(
        'Please provide realmId/company Id to move furthur, can be obtained by visiting https://developer.intuit.com/app/developer/playground'
      );
    }
    if (!propsValue.itemName && !propsValue.itemSku) {
      throw new Error(
        'Please provide either Item Name or Stock keeping unit (SKU)'
      );
    }
    try {
      return await queryItem(
        propsValue.itemName,
        propsValue.itemSku,
        propsValue.numberOfResult,
        getRealmId,
        auth.access_token
      );
    } catch (error) {
      if (error instanceof HttpError) {
        const errorBody = error.response.body as any;
        throw new Error(JSON.stringify(errorBody['Fault']['Error']));
      }
      throw error;
    }
  },
  async test({ auth, propsValue, store }) {
    let getRealmId: string;
    try {
      getRealmId = await quickbooksCommons.getKeyValue(
        store,
        (auth as any)?.client_id,
        quickbooksCommons.REALM_ID_STRING,
        propsValue.realmId
      );
    } catch (error) {
      throw new Error(
        'Please provide realmId/company Id to move furthur, can be obtained by visiting https://developer.intuit.com/app/developer/playground'
      );
    }
    if (!propsValue.itemName && !propsValue.itemSku) {
      throw new Error(
        'Please provide either Item Name or Stock keeping unit (SKU)'
      );
    }
    try {
      return await queryItem(
        propsValue.itemName,
        propsValue.itemSku,
        propsValue.numberOfResult,
        getRealmId,
        auth.access_token
      );
    } catch (error) {
      if (error instanceof HttpError) {
        const errorBody = error.response.body as any;
        throw new Error(JSON.stringify(errorBody['Fault']['Error']));
      }
      throw error;
    }
  },
});
