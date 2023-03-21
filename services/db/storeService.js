let db = require('../../config/database.js')
let storeCredentialsSchema = require('../../model/storeCredentialsSchema')


  module.exports.saveCredential = async( token,shop, hmac, code, locationId) =>{
  console.log("service log",{token, shop, hmac, code});
  let storeObj = {
    "token": token,
    "shop": shop,
    "hmac": hmac,
    "code": code,
    "locationId":locationId,
    "joining":Date()
  };

  let checkStore = await storeCredentialsSchema.findOne({shop})
    if (checkStore) {
        return storeCredentialsSchema.findOneAndUpdate({shop}, {"$set":storeObj}, { returnNewDocument: true })
        .then(updatedDocument => {
        if(updatedDocument) {
            return updatedDocument
        } else {
           return ("No document matches the provided query.")
        }

        })
        .catch(err => console.error(`Failed to find and update document: ${err}`))

    } else {
    console.log('store !found in DB');
    const storeCredentials = new storeCredentialsSchema({
        token,
        shop,
        hmac,
        code,
        joining: Date()
    });
    let saveStoreCredential = await storeCredentials.save()
    return saveStoreCredential
    }
}


module.exports.findCredential = async (query) =>{

  let storeData = await storeCredentialsSchema.findOne(query)

  if(storeData){
    return storeData
  }
  else{
    return "no store found"
  }
}


