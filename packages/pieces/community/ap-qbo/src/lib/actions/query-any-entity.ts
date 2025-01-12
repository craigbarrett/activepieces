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

const queryEntity = async (
  realmId: string,
  accessToken: string,
  sqlQuery: string
) => {
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

export const queryAnyEntityAction = createAction({
  auth: quickbooksAuth,
  name: 'queryAnyEntity',
  displayName: 'Query any Entity',
  description: 'Query any Entity using SQL Query',
  props: {
    realmId: Property.LongText({
      displayName: 'Realm ID/ Company ID',
      required: false,
      description:
        'Enter Company Id/realm ID that can be obtained can be obtained by visiting https://developer.intuit.com/app/developer/playground, skip it if provided previously',
      validators: [Validators.maxLength(20)],
    }),
    sqlQuery: Property.LongText({
      displayName: 'SQL Query',
      required: true,
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
    try {
      return await queryEntity(
        getRealmId,
        auth.access_token,
        propsValue.sqlQuery
      );
    } catch (error) {
      if (error instanceof HttpError) {
        const errorBody = error.response.body as any;
        throw new Error(JSON.stringify(errorBody));
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
    try {
      return await queryEntity(
        getRealmId,
        auth.access_token,
        propsValue.sqlQuery
      );
    } catch (error) {
      if (error instanceof HttpError) {
        const errorBody = error.response.body as any;
        throw new Error(JSON.stringify(errorBody));
      }
      throw error;
    }
  },
});
