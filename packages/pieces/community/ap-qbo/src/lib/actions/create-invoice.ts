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
    lineType: Property.StaticDropdown({
      displayName: 'Details Type',
      description: 'Select type details you wanna provide about Invoice',
      required: true,
      options: {
        options: [
          {
            label: 'Sales Item details',
            value: 'SalesItemLine',
          },
          {
            label: 'Invoice Description Only',
            value: 'DescriptionOnlyLine',
          },
        ],
      },
    }),
    lineArray: Property.DynamicProperties({
      description: '',
      displayName: 'Details',
      required: true,
      refreshers: ['lineType'],
      props: async (propsValue) => {
        if (!propsValue['lineType']) return {};
        const descriptionOnlyLineProperties = {
          descriptionOnlyLine: Property.Array({
            displayName: 'Invoice Description Only',
            description: '',
            properties: {
              serviceDate: Property.LongText({
                displayName: 'Service Date (YYYY-MM-DD )',
                description: 'Date when the service is performed',
                required: false,
              }),
              description: Property.LongText({
                displayName: 'Description',
                description: '',
                required: true,
              }),
              taxCodeRefValue: Property.LongText({
                displayName: 'TaxCode Reference Value',
                description:
                  'Reference to the TaxCodefor this item. Query the TaxCode name list resource to determine the appropriate TaxCode object for this reference. Use TaxCode.Id from that object for TaxCode Reference Value',
                required: false,
              }),
              taxCodeRefName: Property.LongText({
                displayName: 'TaxCode Reference Name',
                description:
                  'Reference to the TaxCodefor this item. Query the TaxCode name list resource to determine the appropriate TaxCode object for this reference. Use TaxCode.Name from that object for TaxCode Reference Name',
                required: false,
              }),
            },
            required: true,
            defaultValue: [],
          }),
        };
        const salesItemProperties = {
          salesItemLine: quickbooksCommons.salesItemLine,
        };
        return (propsValue['lineType'] as unknown as string) === 'SalesItemLine'
          ? salesItemProperties
          : descriptionOnlyLineProperties;
      },
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
  async run({ auth, propsValue, store }) {
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
    if (propsValue.lineType == 'SalesItemLine') {
      const salesItemLineArray = propsValue.lineArray[
        'salesItemLine'
      ] as SalesItemLine[];
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
    } else if (propsValue.lineType == 'DescriptionOnlyLine') {
      const descriptionOnlyLineArray = propsValue.lineArray[
        'descriptionOnlyLine'
      ] as DescriptionOnlyLine[];
      for (let i = 0; i < descriptionOnlyLineArray.length; i++) {
        lineArrayValue.push({
          DetailType: 'DescriptionOnly',
          Description: descriptionOnlyLineArray[i].description,
          DescriptionLineDetail: {
            TaxCodeRef: {
              name: descriptionOnlyLineArray[i].taxCodeRefName,
              value: descriptionOnlyLineArray[i].taxCodeRefValue,
            },
            ServiceDate: descriptionOnlyLineArray[i].serviceDate,
          },
        });
      }
    }
    try {
      const requestBody = {
        CustomerRef: {
          value: propsValue.customerRefValue,
          name: propsValue.customerRefName,
        },
        Line: lineArrayValue,
      };
      return await createInvoice(requestBody, getRealmId, auth.access_token);
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
    if (propsValue.lineType == 'SalesItemLine') {
      const salesItemLineArray = propsValue.lineArray[
        'salesItemLine'
      ] as SalesItemLine[];
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
    } else if (propsValue.lineType == 'DescriptionOnlyLine') {
      const descriptionOnlyLineArray = propsValue.lineArray[
        'descriptionOnlyLine'
      ] as DescriptionOnlyLine[];
      for (let i = 0; i < descriptionOnlyLineArray.length; i++) {
        lineArrayValue.push({
          DetailType: 'DescriptionOnly',
          Description: descriptionOnlyLineArray[i].description,
          DescriptionLineDetail: {
            TaxCodeRef: {
              name: descriptionOnlyLineArray[i].taxCodeRefName,
              value: descriptionOnlyLineArray[i].taxCodeRefValue,
            },
            ServiceDate: descriptionOnlyLineArray[i].serviceDate,
          },
        });
      }
    }
    try {
      const requestBody = {
        CustomerRef: {
          value: propsValue.customerRefValue,
          name: propsValue.customerRefName,
        },
        Line: lineArrayValue,
      };
      return await createInvoice(requestBody, getRealmId, auth.access_token);
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

type DescriptionOnlyLine = {
  taxCodeRefValue?: string;
  taxCodeRefName?: string;
  serviceDate?: string;
  description: string;
};
