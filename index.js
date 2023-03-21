const express = require("express");
const app = express()
const port = process.env.PORT || 8000
let shopifyAppInstallRoute = require("./routes/shopifyAppInstallRoute");
let analyticRoute = require("./routes/analyticRoute")


app.use('/', shopifyAppInstallRoute)
app.use('/stats', analyticRoute)

app.get('/test', (req, res)=>{
    res.send('live ')
})

app.listen(port, ()=>{
    console.log('server is listening on ' + port)
})
