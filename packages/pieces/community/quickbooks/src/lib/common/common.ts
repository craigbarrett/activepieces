import { StoreScope, Store } from '@activepieces/pieces-framework';

export const quickbooksCommons = {
  baseUrl: 'https://sandbox-quickbooks.api.intuit.com/v3/company',
  getRealmId: async (store: Store, realmId: string | undefined) => {
    let getRealmId = await store.get<string>('realmId', StoreScope.PROJECT);
    if (!getRealmId) {
      if (!realmId) {
        throw new Error('Please provide realmId/companyId to create customer');
      }
      await store.put('realmId', realmId, StoreScope.PROJECT);
      getRealmId = realmId
    } else if(getRealmId && realmId){
      await store.delete('realmId', StoreScope.PROJECT);
      await store.put('realmId', realmId, StoreScope.PROJECT);
      getRealmId = realmId
    }
    return getRealmId;
  },
};
