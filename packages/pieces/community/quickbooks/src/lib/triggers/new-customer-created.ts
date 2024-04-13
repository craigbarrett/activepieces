import {
  createTrigger,
  TriggerStrategy,
  OAuth2PropertyValue,
  StaticPropsValue,
} from '@activepieces/pieces-framework';
import {
  DedupeStrategy,
  Polling,
  pollingHelper,
} from '@activepieces/pieces-common';
import { quickbooksAuth } from '../..';
import { quickbooksCommons } from '../common/common';

const props = {
  realmId: quickbooksCommons.realmId,
};

const polling: Polling<OAuth2PropertyValue, StaticPropsValue<typeof props>> = {
  strategy: DedupeStrategy.TIMEBASED,
  items: async ({ auth, store, propsValue, lastFetchEpochMS }) => {
    const getRealmId = await quickbooksCommons.getKeyValue(
      store,
      (auth as any)?.client_id,
      quickbooksCommons.REALM_ID_STRING,
      propsValue.realmId
    );

    const customerItem = await quickbooksCommons.queryAcustomer(
      getRealmId,
      auth.access_token,
      new Date(lastFetchEpochMS).toISOString()
    );
    return customerItem.Customer?.map((item: any) => ({
      epochMilliSeconds: new Date(item['MetaData']['CreateTime']).getTime(),
      data: item,
    }));
  },
};

export const newCustomerCreated = createTrigger({
  auth: quickbooksAuth,
  name: 'newCustomerCreated',
  displayName: 'new customer created',
  description: 'Triggers when a new customer is created',
  props,
  type: TriggerStrategy.POLLING,
  onEnable: async (context) => {
    const { store, auth, propsValue } = context;
    await pollingHelper.onEnable(polling, { store, auth, propsValue });
  },
  onDisable: async (context) => {
    const { store, auth, propsValue } = context;
    await pollingHelper.onDisable(polling, { store, auth, propsValue });
  },
  run: async (context) => {
    const { store, auth, propsValue } = context;
    return await pollingHelper.poll(polling, { store, auth, propsValue });
  },
  test: async (context) => {
    const { store, auth, propsValue } = context;
    return await pollingHelper.test(polling, { store, auth, propsValue });
  },
  sampleData: {},
});
