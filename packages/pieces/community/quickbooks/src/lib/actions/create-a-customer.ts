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
import { quickbooksAuth } from '../../';
import { quickbooksCommons } from '../common/common';
import { HttpError } from '@activepieces/pieces-common';

const createCustomer = async (
  body: any,
  realmId: string | null,
  accessToken: string
) => {
  const request: HttpRequest = {
    method: HttpMethod.POST,
    url: `${quickbooksCommons.baseUrl}/${realmId}/customer`,
    authentication: {
      type: AuthenticationType.BEARER_TOKEN,
      token: accessToken,
    },
    body: body,
  };
  const response = await httpClient.sendRequest<{ value: object }>(request);
  return response.body;
};

export const createACustomerAction = createAction({
  auth: quickbooksAuth,
  name: 'createACustomer',
  displayName: 'Create a customer',
  description: 'creates a customer by providing required details',
  props: {
    realmId: Property.LongText({
      displayName: 'Realm ID/ Company ID',
      required: false,
      description:
        'Enter Company Id/realm ID that can be obtained from intuit Oauth Playground',
      validators: [Validators.maxLength(20)],
    }),
    email: Property.LongText({
      displayName: 'email id',
      required: true,
      validators: [Validators.maxLength(100)],
    }),
    primaryPhone: Property.ShortText({
      displayName: 'Phone No.',
      required: true,
      validators: [Validators.maxLength(15)],
    }),
    title: Property.ShortText({
      displayName: 'Title',
      required: false,
      description: 'Title of the person',
      validators: [Validators.maxLength(5)],
    }),
    inputDisplayName: Property.LongText({
      displayName: 'Display Name',
      required: true,
      description:
        'The name of the person or organization as displayed. Must be unique across all Customer, Vendor, and Employee.',
      validators: [Validators.maxLength(100)],
    }),
    givenName: Property.LongText({
      displayName: 'Given Name',
      required: true,
      description: 'Given name or first name of a person.',
      validators: [Validators.maxLength(100)],
    }),
    middleName: Property.LongText({
      displayName: 'Middle Name',
      required: false,
      description: 'Middle name of the person.',
      validators: [Validators.maxLength(50)],
    }),
    familyName: Property.LongText({
      displayName: 'Family Name',
      required: false,
      description: 'Family name or the last name of the person',
      validators: [Validators.maxLength(100)],
    }),
    companyName: Property.LongText({
      displayName: 'Company Name',
      required: true,
      validators: [Validators.maxLength(100)],
    }),
    notes: Property.LongText({
      displayName: 'Notes',
      required: false,
      validators: [Validators.maxLength(200)],
    }),
  },
  async run({ propsValue, auth, store }) {
    const getRealmId = await quickbooksCommons.getRealmId(
      store,
      propsValue.realmId
    );

    try {
      const requestBody = {
        PrimaryEmailAddr: {
          Address: propsValue.email,
        },
        DisplayName: propsValue.inputDisplayName,
        Title: propsValue.title,
        MiddleName: propsValue.middleName,
        Notes: propsValue.notes,
        FamilyName: propsValue.familyName,
        PrimaryPhone: {
          FreeFormNumber: propsValue.primaryPhone,
        },
        CompanyName: propsValue.companyName,
        GivenName: propsValue.givenName,
      };
      return await createCustomer(requestBody, getRealmId, auth.access_token);
    } catch (error) {
      if (error instanceof HttpError) {
        const errorBody = error.response.body as any;
        throw new Error(errorBody['error']['message']);
      }
      throw error;
    }
  },
  async test({ auth, propsValue, store }) {
    const getRealmId = await quickbooksCommons.getRealmId(
      store,
      propsValue.realmId
    );
    try {
      const requestBody = {
        PrimaryEmailAddr: {
          Address: propsValue.email,
        },
        DisplayName: propsValue.inputDisplayName,
        Title: propsValue.title,
        MiddleName: propsValue.middleName,
        Notes: propsValue.notes,
        FamilyName: propsValue.familyName,
        PrimaryPhone: {
          FreeFormNumber: propsValue.primaryPhone,
        },
        CompanyName: propsValue.companyName,
        GivenName: propsValue.givenName,
      };
      return await createCustomer(requestBody, getRealmId, auth.access_token);
    } catch (error) {
      if (error instanceof HttpError) {
        const errorBody = error.response.body as any;
        throw new Error(errorBody['error']['message']);
      }
      throw error;
    }
  },
});
