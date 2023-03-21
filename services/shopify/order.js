let request = require('request-promise');

module.exports.orderCount = async(storeObj, startDate, endDate, status) => {
  var options = {
    uri: `https://${storeObj.shop}/admin/api/2023-01/orders/count.json?status=${status}&created_at_min=${startDate}&created_at_max=${endDate}`,
    json: true,
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Access-Token" : storeObj.token
    }
  }
  return request
    .get(options)
    .then(response => {
      return response;
    })
    .catch((error) => {
      return(error);
    });
}

module.exports.orderDetails = async(storeObj, startDate, endDate, status) =>{
  var options = {
    uri: `https://${storeObj.shop}/admin/api/2023-01/orders.json?status=${status}&created_at_min=${startDate}&created_at_max=${endDate}&limit=250`,
    json: true,
    resolveWithFullResponse:true,
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Access-Token" : storeObj.token
    }
  }
  return request
    .get(options)
    .then(response => {
      return response.body;
    })
    .catch((error) => {
      return(error);
    });
}

module.exports.orderAnalytics = async()=>{
  try{
    // let reqData = `query {
    //     shopifyqlQuery(query: "FROM orders SHOW sum(net_sales) AS monthly_net_sales GROUP BY month SINCE -3m ORDER BY month") {
    //     __typename
    //     ... on TableResponse {
    //         tableData {
    //         unformattedData
    //         rowData
    //         columns {
    //             name
    //             dataType
    //             displayName
    //         }
    //         }
    //     }
    //     parseErrors {
    //         code
    //         message
    //         range {
    //         start {
    //             line
    //             character
    //         }
    //         end {
    //             line
    //             character
    //         }
    //         }
    //     }
    //     }
    // }`

    // let fetchData = await request.post('https://ashish-noise-test.myshopify.com/admin/api/unstable/graphql.json',
    //     {
    //         headers: {
    //             "Content-Type": "application/graphql",
    //             "X-Shopify-Access-Token" : 'shpua_2393fc89ea9fb859144b7d5e0de4f344'
    //         },
    //         body: reqData
    //     }
    // )

    // console.log(fetchData.headers,"fetch data is ");
}
catch(error){
    console.log(error, "error is -----");
}
}