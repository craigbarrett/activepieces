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

const createPayment = async (
  body: any,
  realmId: string | null,
  accessToken: string
) => {
  const request: HttpRequest = {
    method: HttpMethod.POST,
    url: `${quickbooksCommons.baseUrl}/v3/company/${realmId}/payment`,
    authentication: {
      type: AuthenticationType.BEARER_TOKEN,
      token: accessToken,
    },
    body: body,
  };
  const response = await httpClient.sendRequest<{ value: object }>(request);
  return response.body;
};

export const createPaymentAction = createAction({
  auth: quickbooksAuth,
  name: 'createPaymentAction',
  displayName: 'Create a Payment',
  description: 'Creates a Payment by providing required details',
  props: {
    realmId: quickbooksCommons.realmId,
    totalAmt: Property.Number({
      displayName: 'Total Amount',
      required: true,
      description:
        'Total amount of the transaction. This includes the total of all the charges, allowances, and taxes.',
    }),
    customerRefValue: Property.LongText({
      displayName: 'Customer Reference Value',
      required: true,
      description:
        'Reference to a customer or job. Query the Customer name list resource to determine the appropriate Customer object for this reference. Use Customer.Id for Customer Reference value',
    }),
    customerRefName: Property.LongText({
      displayName: 'Customer Reference Name',
      required: false,
      description:
        'Reference to a customer or job. Query the Customer name list resource to determine the appropriate Customer object for this reference. Use Customer.DisplayName from that object for Customer Reference Name',
    }),
    projectRefValue: Property.LongText({
      displayName: 'Project Reference Value',
      required: false,
      description:
        'Reference to the Project ID associated with this transaction',
    }),
    projectRefName: Property.LongText({
      displayName: 'Project Reference Name',
      required: false,
      description:
        'Reference to the Project ID associated with this transaction',
    }),
    currencyRefValue: Property.LongText({
      displayName: 'Currency Reference Value',
      required: false,
      description:
        'Reference to the currency in which all amounts on the associated transaction are expressed. This must be defined if multicurrency is enabled for the company.',
    }),
    currencyRefName: Property.LongText({
      displayName: 'Currency Reference Name',
      required: false,
      description:
        'Reference to the currency in which all amounts on the associated transaction are expressed. This must be defined if multicurrency is enabled for the company.',
    }),
  },
  async run({ propsValue, auth, store }) {
    return 'run';
  },
  async test({ propsValue, auth, store }) {
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
      const requestBody: RequestBody = {
        TotalAmt: propsValue.totalAmt,
        CustomerRef: {
          value: propsValue.customerRefValue,
          name: propsValue.customerRefName,
        },
      };
      if (propsValue.projectRefValue) {
        requestBody.ProjectRef = {
          value: propsValue.projectRefValue,
          name: propsValue.projectRefName,
        };
      }
      if (propsValue.currencyRefValue) {
        requestBody.CurrencyRef = {
          value: propsValue.currencyRefValue,
          name: propsValue.currencyRefName,
        };
      }
      return await createPayment(requestBody, getRealmId, auth.access_token);
    } catch (error) {
      if (error instanceof HttpError) {
        const errorBody = error.response.body as any;
        throw new Error(JSON.stringify(errorBody['Fault']['Error']));
      }
      throw error;
    }
  },
});

interface CustomerRef {
  value: string;
  name?: string; // Optional property
}

interface ProjectRef {
  value: string;
  name?: string;
}

interface CurrencyRef {
  value: string;
  name?: string;
}

interface RequestBody {
  TotalAmt: number;
  CustomerRef: CustomerRef;
  ProjectRef?: ProjectRef;
  CurrencyRef?: CurrencyRef;
}
