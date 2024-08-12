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
import { string } from 'pg-format';

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
  salesItemLine: Property.Array({
    displayName: 'Sales Items',
    description: '',
    properties: {
      amount: Property.Number({
        displayName: 'Amount',
        required: true,
      }),
      discountAmt: Property.Number({
        displayName: 'Discount Amount',
        required: false,
        // defaultValue: undefined,
      }),
      description: Property.LongText({
        displayName: 'Description',
        required: false,
        validators: [Validators.maxLength(400)],
        // defaultValue: undefined,
      }),
      itemRefValue: Property.ShortText({
        displayName: 'Item Reference value',
        description: 'Reference value of item in case of updating sales item',
        required: false,
        // defaultValue: undefined,
      }),
      itemRefName: Property.LongText({
        displayName: 'Item Reference name',
        description: 'Reference name of item in case of updating sales item',
        required: false,
        // defaultValue: undefined,
      }),
      classRefValue: Property.LongText({
        displayName: 'Class Reference Value',
        description:
          'Query the Class name list resource to determine the appropriate Class object for this reference. Use Class.Id for Class Reference value',
        required: false,
        // defaultValue: undefined,
      }),
      classRefName: Property.LongText({
        displayName: 'Class Reference Name',
        description:
          'Query the Class name list resource to determine the appropriate Class object for this reference. Use Class.Name from that object for Class Reference Name',
        required: false,
        // defaultValue: undefined,
      }),
      taxCodeRefValue: Property.LongText({
        displayName: 'Tax Code Reference Value',
        description:
          'Reference to the TaxCodefor this item. Query the TaxCode name list resource to determine the appropriate TaxCode object for this reference. Use TaxCode.Id for Tax Code Reference Value',
        required: false,
        // defaultValue: undefined,
      }),
      taxCodeRefName: Property.LongText({
        displayName: 'Tax Code Reference Name',
        description:
          'Reference to the TaxCodefor this item. Query the TaxCode name list resource to determine the appropriate TaxCode object for this reference. Use TaxCode.Name from that object for Tax Code Reference Name',
        required: false,
        // defaultValue: undefined,
      }),
      percentMarkupInfo: Property.LongText({
        displayName: 'Percent (Markup Info)',
        description:
          'Markup amount expressed as a percent of charges already entered in the current transaction. To enter a rate of 10% use 10.0, not 0.01.',
        required: false,
      }),
      markUpIncomeAccountRefValue: Property.LongText({
        displayName: 'MarkUp Income Account Reference Value',
        description: 'The account associated with the markup',
        required: false,
      }),
      markUpIncomeAccountRefName: Property.LongText({
        displayName: 'MarkUp Income Account Reference Name',
        description: 'The account associated with the markup',
        required: false,
      }),
      itemAccountRefValue: Property.LongText({
        displayName: 'Item Account Reference Value',
        description:
          'Available with invoice objects, only, and when there is a linkedtxn of type ReimburseCharge for this object. When ItemRef.Id is set to 1, ItemAccountRef maps to the reimbursable charge account',
        required: false,
      }),
      itemAccountRefName: Property.LongText({
        displayName: 'Item Account Reference Name',
        description:
          'Available with invoice objects, only, and when there is a linkedtxn of type ReimburseCharge for this object. When ItemRef.Id is set to 1, ItemAccountRef maps to the reimbursable charge account',
        required: false,
      }),
      serviceDate: Property.LongText({
        displayName: 'Service Date (yyyy/mm/dd)',
        description: 'Date when the service is performed',
        required: false,
      }),
      discountRate: Property.Number({
        displayName: 'Discount Rate',
        description:
          'The discount rate applied to this line. If both DiscountAmt and DiscountRate are supplied, DiscountRate takes precedence and DiscountAmt is recalculated by QuickBooks services based on amount of DiscountRate.',
        required: false,
      }),
      quantity: Property.Number({
        displayName: 'Quantity',
        description: 'Number of items for the line',
        required: false,
      }),
      unitPrice: Property.Number({
        displayName: 'Unit Price',
        description:
          'Unit price of the subject item as referenced by ItemRef. Corresponds to the Rate column on the QuickBooks Online UI to specify either unit price, a discount, or a tax rate for item. If used for unit price, the monetary value of the service or product, as expressed in the home currency. You can override the unit price of the subject item by supplying a new value with create or update operations. If used for a discount or tax rate, express the percentage as a fraction. For example, specify 0.4 for 40% tax.',
        required: false,
      }),
    },
    required: true,
    defaultValue: [],
  }),
};

export interface QueryCustomerResponse {
  Customer: any[];
}

export type SalesItemLine = {
  amount: number;
  discountAmt?: number;
  description?: string;
  itemRefValue?: string;
  itemRefName?: string;
  classRefValue?: string;
  classRefName?: string;
  taxCodeRefValue?: string;
  taxCodeRefName?: string;
  percentMarkupInfo?: string;
  markUpIncomeAccountRefValue?: string;
  markUpIncomeAccountRefName?: string;
  itemAccountRefValue?: string;
  itemAccountRefName?: string;
  serviceDate?: string;
  discountRate?: number;
  quantity?: number;
  unitPrice?: number;
};
