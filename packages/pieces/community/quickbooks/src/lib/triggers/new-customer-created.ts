import { createTrigger, TriggerStrategy } from '@activepieces/pieces-framework';

export const newCustomerCreated = createTrigger({
  // auth: check https://www.activepieces.com/docs/developers/piece-reference/authentication,
  name: 'newCustomerCreated',
  displayName: 'new customer created',
  description: 'Triggers when a new customer is created',
  props: {},
  sampleData: {},
  type: TriggerStrategy.WEBHOOK,
  async onEnable(context) {
    // implement webhook creation logic
  },
  async onDisable(context) {
    // implement webhook deletion logic
  },
  async run(context) {
    // get verify tokenn fron dashboard
    // on getting resp verify resp and return response body
    return [context.payload.body];
  },
});
