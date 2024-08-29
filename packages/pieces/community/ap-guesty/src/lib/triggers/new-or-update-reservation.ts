import { createTrigger, TriggerStrategy } from '@activepieces/pieces-framework';
import { guestyAuth } from '../..';
import { guestyCommons } from '../common/common';

export const newReservationTrigger = createTrigger({
  auth: guestyAuth,
  name: 'new_reservation',
  displayName: 'New/Updated reservation',
  description: '',
  type: TriggerStrategy.WEBHOOK,
  props: {},
  async onEnable(context) {
    const accessToken = await guestyCommons.getAccessToken(
      context.auth.clientId,
      context.auth.clientSecret
    );
    const options = {
      method: 'POST',
      headers: {
        accept: 'application/json',
        'content-type': 'application/json',
        Authorization: 'Bearer ' + accessToken,
      },
      body: JSON.stringify({
        url: context.webhookUrl,
        events: ['reservation.updated', 'reservation.new'],
      }),
    };
    try {
      const response = await fetch(
        'https://open-api.guesty.com/v1/webhooks',
        options
      );
      const responseBody = await response.json();
      return responseBody;
    } catch (error) {
      throw new Error(JSON.stringify(error));
    }
  },
  async run(context) {
    return [context.payload.body];
  },
  async test(context) {
    return [context.payload.body];
  },
  async onDisable(context) {
    console.log(context);
  },
  sampleData: {},
});
