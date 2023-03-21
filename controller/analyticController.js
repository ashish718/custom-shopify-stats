const {findCredential} = require('../services/db/storeService')
const {orderCount, orderDetails} = require('../services/shopify/order')

exports.revenue = async(req, res, next) => {
    try {
        
        if (!req.query.shop || !req.query.startDate || !req.query.endDate) {
            return res.status(400).json({ message: "require shop, startDate, endDate.."})
        }

       //check store details
       let storeExists = await findCredential({"shop": req.query.shop})
        
       //order count
        let count = await orderCount(storeExists, req.query.startDate, req.query.endDate, "any")
        
        if (count.count <= 0) {
            return res.status(200).json({message: "success", data: {order_count: count.count, revenue: 0}})
        }
        else {
            //order net sum
            let revenue = await orderDetails(storeExists, req.query.startDate, req.query.endDate, "any")
            let total = 0
            revenue.order.forEach(item =>{
                total += item.total_price
            })
            return res.status(200).json({message: "success", data: {order_count: count.count, revenue: total}})
        }


        
       //due to app not approved, limited data retrieve pagination is not covered in this
    //    else{
            //     let i=0
            //     do {
            //         if (i===0) {
            //             url = `https://${storeService[0].shop}/admin/api/2020-07/products.json?limit=250`
            //         }
            //         console.log(url);
            //         let result = await shopifyProductData(shop, url)
            //         if (result) {
            //           var partURL = await result.headers.link.substring(
            //           result.headers.link.lastIndexOf("<") + 1,
            //           result.headers.link.lastIndexOf(">")
            //           );
            //           url = await partURL
            //           console.log(url, "url is");
            //           let data = await result.body.products
            //           shopifyData = await shopifyData.concat(data)
            //           console.log(data.length);
            //           console.log(shopifyData.length, "shopidata length");
            //           i++
            //         }
            //     } while (i<setLoop);
    //    }

       
    } catch (error) {
        next(error)
    }
}