const mongoose = require('mongoose');

const storeSchema = new mongoose.Schema({
  shop:{
    type: String
  },
  token:{
    type: String
  },
  code:{
    type: String
  },
  hmac:{
    type: String
  },
  created_at:{
    type:Date
  },
  updated_at:{
    type:Date
  }

});

module.exports = mongoose.model('storeCredentialsSchema', storeSchema)