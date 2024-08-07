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

const createInvoice = async (
  body: any,
  realmId: string | null,
  accessToken: string
) => {
  const request: HttpRequest = {
    method: HttpMethod.POST,
    url: `${quickbooksCommons.baseUrl}/v3/company/${realmId}/invoice`,
    authentication: {
      type: AuthenticationType.BEARER_TOKEN,
      token: accessToken,
    },
    body: body,
  };
  const response = await httpClient.sendRequest<{ value: object }>(request);
  return response.body;
};

export const createAnInvoiceAction = createAction({
  auth: quickbooksAuth,
  name: 'createAnInvoiceAction',
  displayName: 'Create an Invoice',
  description: 'Creates an Invoice by providing required details',
  props: {
    realmId: quickbooksCommons.realmId,
    customerRefValue: Property.LongText({
      displayName: 'Customer Reference Value',
      required: true,
      description:
        'Query the Customer name list resource to determine the appropriate Customer object for this reference. Use Customer.Id from that object for CustomerRef value',
      validators: [Validators.maxLength(100)],
    }),
    customerRefName: Property.LongText({
      displayName: 'Customer Reference Name',
      required: false,
      description:
        'Query the Customer name list resource to determine the appropriate Customer object for this reference. Use Customer.DisplayName from that object for CustomerRef name',
      validators: [Validators.maxLength(100)],
    }),
    projectRefValue: Property.LongText({
      displayName: 'Project Reference Value',
      required: false,
      description:
        'Reference to the Project ID associated with this transaction',
      validators: [Validators.maxLength(100)],
    }),
    projectRefName: Property.LongText({
      displayName: 'Project Reference Name',
      required: false,
      description:
        'Reference to the Project ID associated with this transaction',
      validators: [Validators.maxLength(100)],
    }),
    currencyRefValue: Property.LongText({
      displayName: 'Currency Reference Value',
      required: false,
      description:
        'Reference to the Project ID associated with this transaction',
      validators: [Validators.maxLength(100)],
    }),
    currencyRefName: Property.LongText({
      displayName: 'Currency Reference Name',
      required: false,
      description:
        'Reference to the Project ID associated with this transaction',
      validators: [Validators.maxLength(100)],
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
    return 'run testing ' + getRealmId;
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
    return 'test testing ' + getRealmId;
  },
});
