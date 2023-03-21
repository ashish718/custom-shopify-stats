let request = require('request-promise')
let {saveCredential} = require('../../services/db/storeService')


let makeWebook = async (token, shop, hmac, code) => {
  try {

    const forwardingAddress = process.env.SHOPIFY_FORWARD_ADDRESS;
    console.log('makeWebook', { shop, code, hmac, token });

    let saveShopifyCredentials = await saveCredential(token, shop, hmac, code)
    console.log(saveShopifyCredentials, "save store credentials is");

    const webhookUrl = 'https://' + shop + '/admin/api/2022-10/webhooks.json';

    let webhookTopic = ["orders/create", "orders/cancelled"]

    webhookTopic.forEach(async(item, i) => {
      let webhookPayload = {
        webhook: {
          topic: item,
          address: `${forwardingAddress}/webhook/order/store/${shop}/${item}`,
          format: 'json',
        },
      };
      let webhookHeaders = {
        'X-Shopify-Access-Token': token,
        'X-Shopify-Topic': item,
        'X-Shopify-Hmac-Sha256': hmac,
        'X-Shopify-Shop-Domain': shop,
        'X-Shopify-API-Version': '2022-10',
        'Content-Type': 'application/json',
      };
      return await request
        .post(webhookUrl, {
          headers: webhookHeaders,
          json: webhookPayload,
        })

        .then((shopResponse) => {
          console.log('webhook create response is', shopResponse);
          return shopResponse;
        })
        .catch((error) => {
          console.log('webhook utils error-->', error);
          return error
        });
    });
  } catch (e) {
      return e;
  }
};


module.exports.makeWebook = makeWebook