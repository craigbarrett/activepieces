import {
  createAction,
  Property,
  Validators,
} from '@activepieces/pieces-framework';
import { quickbooksAuth } from '../../';

export const createACustomer = createAction({
  auth: quickbooksAuth,
  name: 'createACustomer',
  displayName: 'Create a customer',
  description: 'creates a customer by providing required details',
  props: {
    inputDisplayName: Property.LongText({
      displayName: 'Display Name',
      required: true,
      description:
        'The name of the person or organization as displayed. Must be unique across all Customer, Vendor, and Employee.',
      validators: [Validators.maxLength(500)],
    }),
    suffix: Property.ShortText({
      displayName: 'Suffix',
      required: false,
      description: ' Suffix of the name. For example, Jr.',
      validators: [Validators.maxLength(16)],
    }),
    title: Property.ShortText({
      displayName: 'Title',
      required: false,
      description: 'Title of the person',
      validators: [Validators.maxLength(16)],
    }),
    middleName: Property.LongText({
      displayName: 'Middle Name',
      required: false,
      description: 'Middle name of the person.',
      validators: [Validators.maxLength(100)],
    }),
    familyName: Property.LongText({
      displayName: 'Family Name',
      required: false,
      description: 'Family name or the last name of the person',
      validators: [Validators.maxLength(100)],
    }),
    givenName: Property.LongText({
      displayName: 'Given Name',
      required: false,
      description: 'Given name or first name of a person.',
      validators: [Validators.maxLength(100)],
    }),
  },
  async run({ propsValue, auth }) {
    // fix error on testing the code
    // way to use get and use realmId
    return auth.access_token;
  },
  async test({ auth, propsValue, store }) {
    return 'test me auth hai: ' + JSON.stringify(store);
  },
});

// test me auth hai: {"type":"OAUTH2","access_token":"eyJlbmMiOiJBMTI4Q0JDLUhTMjU2IiwiYWxnIjoiZGlyIn0..RGVTNjeVQ-laG7JR9E27-A.-TltYiDCKx1qGKBQXNqifS3idf1KWjG0cuUj4gPABaAfkNOIDIKtONff_dOEFO7Ab6CBq8KG2pgf-V9Vj6rXntBeQ8vQ1X9dtJvHuc4A8mruf4wuHbz9ioKAKJjzL5Vd8hKnBspGWqNQvr5y0fYjaY-NjK7KIjFe2NbCPxfvMwil0Br-bNkzQiHb1w9paA2nomzOM7eXpewJnKbJPoFLzT0O7eyozUAqWRRuIrFCqNhJUvFgW518GfYNC7PcZrhSI02wtLOdc5QQK5cvnZrcxR4l6ewveRvhgGEZcCI2iiWiU_WYYWVJ_ePnSpv7nF9gdGm3gcGzbBuECj8taxWU4lzn8XMEqQx7ZQAHk9JWC48pud1aw5UP-n7hEab-YoVQ_BFdsu1fMFRNvdjwJk7NzTtQLfSqcc4DiiftwHD94RB8e4LawCwTqzv39AsPeaTs3KXrR3sWzqu7NJzfmRc8-e9WMlhUD8Ch4ke5jWluTvd3Q0HfzJ6ttqwCxFKAihVWyKWoy4Avkcz4VynfIukXtfxQK-WKBNqcy-D0i5qxQRmJZEuWiHN0kg8o2IaC4RNkuGtfPHzkiC9udoojZIgC-smP5P8Ln3YwXUgtrFVqp3R-WSzqD9ujr__eT40q6biA2mvD1jJ9YQ5dqQXriz8durrktaV6luuI2xFX3ni3U820ZLyiaU3doXKUUUdBnaHr6zce6SWIqYzRi-BRrHfHBmiqJJ3dWmZKlOt3QyRnGCw_mRBgF3PASqCg3VEvWp1TprHKwIvlPFqai7l56pB-dNXaMp3V_ydJZ_enO5ScWiXRygco-IvQcfCSXfuDADjJ5FaKqoqYD7xGr4-PcJ17zLQBEjKQvKoArZV_kAOqo2pVmoqhGBQcwLcD8Wss9Lzl.ew-6RdO8EMFLZ7jBOCgpeA","token_type":"bearer","refresh_token":"AB11720206980RClj6zhjTsjQXtnA2WnGaYwANb0NTliMFsWgw","x_refresh_token_expires_in":8718369,"id_token":"eyJraWQiOiJPUElDUFJEMDkxODIwMTQiLCJhbGciOiJSUzI1NiJ9.eyJzdWIiOiIxNDI0ODY0ZC02NzJkLTM1YjQtYTdhMS1kOTFlZTUxNjJhMTEiLCJhdWQiOlsiQUJCZmtGSU8wV3ZMblc1NmdKMmV1anVOOFdKZGFYY1JDd0ZDRXZ2OFRBU1dvNk5ZY08iXSwicmVhbG1pZCI6IjkzNDE0NTE5ODM3MDk4MTkiLCJhdXRoX3RpbWUiOjE3MTE0NzU0NjcsImlzcyI6Imh0dHBzOlwvXC9vYXV0aC5wbGF0Zm9ybS5pbnR1aXQuY29tXC9vcFwvdjEiLCJleHAiOjE3MTE0ODQxODAsImlhdCI6MTcxMTQ4MDU4MH0.T_beH5WAE-XOaYMcc9kZj1b5JS4L0CTUn-GQ42yuixJYc2FVC27eDFcj4J-waEsXqgIYoD53xOM0aVwbyrqr0twkhZQVrlATpNp1KgsNWeeRvxcsIn6XtufACrAyUnTaOstjDw5Yh4DebE-d-PZh2_1ZkeD8y77sSZtBuXxL3gw","expires_in":3600,"data":{"x_refresh_token_expires_in":8718369,"access_token":"eyJlbmMiOiJBMTI4Q0JDLUhTMjU2IiwiYWxnIjoiZGlyIn0..RGVTNjeVQ-laG7JR9E27-A.-TltYiDCKx1qGKBQXNqifS3idf1KWjG0cuUj4gPABaAfkNOIDIKtONff_dOEFO7Ab6CBq8KG2pgf-V9Vj6rXntBeQ8vQ1X9dtJvHuc4A8mruf4wuHbz9ioKAKJjzL5Vd8hKnBspGWqNQvr5y0fYjaY-NjK7KIjFe2NbCPxfvMwil0Br-bNkzQiHb1w9paA2nomzOM7eXpewJnKbJPoFLzT0O7eyozUAqWRRuIrFCqNhJUvFgW518GfYNC7PcZrhSI02wtLOdc5QQK5cvnZrcxR4l6ewveRvhgGEZcCI2iiWiU_WYYWVJ_ePnSpv7nF9gdGm3gcGzbBuECj8taxWU4lzn8XMEqQx7ZQAHk9JWC48pud1aw5UP-n7hEab-YoVQ_BFdsu1fMFRNvdjwJk7NzTtQLfSqcc4DiiftwHD94RB8e4LawCwTqzv39AsPeaTs3KXrR3sWzqu7NJzfmRc8-e9WMlhUD8Ch4ke5jWluTvd3Q0HfzJ6ttqwCxFKAihVWyKWoy4Avkcz4VynfIukXtfxQK-WKBNqcy-D0i5qxQRmJZEuWiHN0kg8o2IaC4RNkuGtfPHzkiC9udoojZIgC-smP5P8Ln3YwXUgtrFVqp3R-WSzqD9ujr__eT40q6biA2mvD1jJ9YQ5dqQXriz8durrktaV6luuI2xFX3ni3U820ZLyiaU3doXKUUUdBnaHr6zce6SWIqYzRi-BRrHfHBmiqJJ3dWmZKlOt3QyRnGCw_mRBgF3PASqCg3VEvWp1TprHKwIvlPFqai7l56pB-dNXaMp3V_ydJZ_enO5ScWiXRygco-IvQcfCSXfuDADjJ5FaKqoqYD7xGr4-PcJ17zLQBEjKQvKoArZV_kAOqo2pVmoqhGBQcwLcD8Wss9Lzl.ew-6RdO8EMFLZ7jBOCgpeA","refresh_token":"AB11720206980RClj6zhjTsjQXtnA2WnGaYwANb0NTliMFsWgw","token_type":"bearer","expires_in":3600},"claimed_at":1711488612,"token_url":"https://oauth.platform.intuit.com/oauth2/v1/tokens/bearer","client_id":"ABBfkFIO0WvLnW56gJ2eujuN8WJdaXcRCwFCEvv8TASWo6NYcO","client_secret":"a4qDyTpEZAY5OdPsQE6KMv5XSzTbdx5cQOIaOCPW","redirect_url":"http://localhost:4200/redirect","grant_type":"authorization_code","authorization_method":"BODY","code":"AB11711480873KR8ZJmaIjp3PFDGrAwDggLQXe7P0eh3pELLYf","scope":"com.intuit.quickbooks.accounting openid profile email phone address"}