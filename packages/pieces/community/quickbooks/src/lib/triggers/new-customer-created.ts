import crypto from 'crypto'
import {
  createTrigger,
  TriggerStrategy,
  Property,
  Validators,
} from '@activepieces/pieces-framework';
import { quickbooksAuth } from '../..';
import { quickbooksCommons } from '../common/common';

export const newCustomerCreated = createTrigger({
  auth: quickbooksAuth,
  name: 'newCustomerCreated',
  displayName: 'new customer created',
  description: 'Triggers when a new customer is created',
  props: {
    realmId: quickbooksCommons.realmId,
    verifierToken: quickbooksCommons.webhookVerifierToken,
  },
  sampleData: {},
  type: TriggerStrategy.WEBHOOK,
  async onEnable(context) {
    // implement webhook creation logic
    // await context.store.put('KEY', 'VALUE', StoreScope.PROJECT);
    let getVerifierToken: string;
    try {
      getVerifierToken = await quickbooksCommons.getKeyValue(
        context.store,
        (context.auth as any)?.client_id,
        'verifierToken',
        context.propsValue.verifierToken
      );
    } catch (error) {
      throw new Error(
        "'Enter Company Id/realm ID that can be obtained can be obtained by visiting https://developer.intuit.com/app/developer/playground'"
      );
    }
  },
  async onDisable(context) {
    // implement webhook deletion logic
  },
  async run(context) {
    // get verify tokenn fron dashboard
    // on getting resp verify resp and return response body

    return [context.payload.body];
  },
  async test(context) {
    // var webhookPayload = JSON.stringify(req.body);
    // console.log('The paylopad is :' + JSON.stringify(req.body));
    // var signature = req.get('intuit-signature');

    // var fields = ['realmId', 'name', 'id', 'operation', 'lastUpdated'];
    // var newLine= "\r\n";

    // // if signature is empty return 401
    // if (!signature) {
    //     return res.status(401).send('FORBIDDEN');
    // }

    // // if payload is empty, don't do anything
    // if (!webhookPayload) {
    //     return res.status(200).send('success');
    // }

    // /**
    //  * Validates the payload with the intuit-signature hash
    //  */
    // var hash = crypto.createHmac('sha256', config.webhooksVerifier).update(webhookPayload).digest('base64');
    // if (signature === hash) {
    //     console.log("The Webhook notification payload is :" + webhookPayload);

    return [context.payload.body];
  }
});
