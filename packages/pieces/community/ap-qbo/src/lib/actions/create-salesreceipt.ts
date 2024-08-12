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
import { quickbooksCommons, SalesItemLine } from '../common/common';
import { HttpError } from '@activepieces/pieces-common';

const createSalesReceipt = async (
  body: any,
  realmId: string | null,
  accessToken: string
) => {
  const request: HttpRequest = {
    method: HttpMethod.POST,
    url: `${quickbooksCommons.baseUrl}/v3/company/${realmId}/salesreceipt`,
    authentication: {
      type: AuthenticationType.BEARER_TOKEN,
      token: accessToken,
    },
    body: body,
  };
  const response = await httpClient.sendRequest<{ value: object }>(request);
  return response.body;
};

export const createSalesReceiptAction = createAction({
  auth: quickbooksAuth,
  name: 'createSalesReceiptAction',
  displayName: 'Create a Salesreceipt',
  description: 'Creates a Salesreceipt by providing required details',
  props: {
    realmId: quickbooksCommons.realmId,
    salesItemLine: quickbooksCommons.salesItemLine,
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
  async run({ auth, propsValue, store }) {
    return '';
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
    const lineArrayValue = [];
    const salesItemLineArray = propsValue.salesItemLine as SalesItemLine[];
    for (let i = 0; i < salesItemLineArray.length; i++) {
      lineArrayValue.push({
        DetailType: 'SalesItemLineDetail',
        Amount: salesItemLineArray[i].amount,
        Description: salesItemLineArray[i].description,
        SalesItemLineDetail: {
          ItemRef: {
            value: salesItemLineArray[i].itemRefValue,
            name: salesItemLineArray[i].itemRefName,
          },
          DiscountAmt: salesItemLineArray[i].discountAmt,
          ClassRef: {
            value: salesItemLineArray[i].classRefValue,
            name: salesItemLineArray[i].classRefName,
          },
          TaxCodeRef: {
            value: salesItemLineArray[i].taxCodeRefValue,
            name: salesItemLineArray[i].taxCodeRefName,
          },
          MarkupInfo: {
            Percent: salesItemLineArray[i].percentMarkupInfo,
            MarkUpIncomeAccountRef: {
              name: salesItemLineArray[i].markUpIncomeAccountRefName,
              value: salesItemLineArray[i].markUpIncomeAccountRefValue,
            },
          },
          ItemAccountRef: {
            name: salesItemLineArray[i].itemAccountRefName,
            value: salesItemLineArray[i].itemAccountRefValue,
          },
          ServiceDate: salesItemLineArray[i].serviceDate,
          DiscountRate: salesItemLineArray[i].discountRate,
          Qty: salesItemLineArray[i].quantity,
          UnitPrice: salesItemLineArray[i].unitPrice,
        },
      });
    }
    try {
      const requestBody = {
        Line: lineArrayValue,
      };
      return await createSalesReceipt(
        requestBody,
        getRealmId,
        auth.access_token
      );
    } catch (error) {
      if (error instanceof HttpError) {
        const errorBody = error.response.body as any;
        if (errorBody['fault'])
          throw new Error(JSON.stringify(errorBody['fault']['error']));
        else throw new Error(JSON.stringify(errorBody['Fault']['Error']));
      }
      throw error;
    }
  },
});
