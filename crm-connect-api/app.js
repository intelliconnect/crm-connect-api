"use strict";

const express = require('express');
const compression = require('compression');

const cors = require('cors');

const app = express();


/*app.use(express.static(__dirname));*/
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json({ limit: '1mb' }); //{
const urlEncoded = bodyParser.urlencoded({ limit: '1mb', extended: true }); //
const appPort = require('config').get('APP').apphost;



// all environments
app.set('my_port', process.env.PORT || process.argv[2] || appPort);
app.disable("x-powered-by");



app.use(cors());
app.use(jsonParser);
app.use(urlEncoded);
app.use(compression());

//

app.all("/*", function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST");
    res.header("Access-Control-Allow-Headers", "Cache-Control,Pragma, Origin, Authorization, Content-Type, X-Requested-With,X-XSRF-TOKEN, query,x-access-token");
    next();
});


/************************************************************
 Routes  - Start
 *********************************************************** */

const crmRoutes = require('./router/salescrm.router');
app.use('/api/crm/',crmRoutes);


/************************************************************
 Routes  - End
 *********************************************************** */


// Optional fallthrough error handler
app.use(function onError(err, req, res, next) {
    // The error id is attached to `res.sentry` to be returned
    // and optionally displayed to the user for support.
    res.statusCode = 500;
    //res.end(res.sentry + '\n');
    res.end("system error" + '\n');
});

app.listen(appPort, () => console.log(`Intelliconnect App API is listening on Port ${appPort}!`))

