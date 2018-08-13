"use strict";

const express = require('express');
const compression = require('compression');


const cors = require('cors');


const cluster = require('cluster');
const http = require('http');
const numCPUs = require('os').cpus().length;


const appCluster = express();


// appCluster.use(express.static(__dirname));
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json({ limit: '1mb' }); //{
const urlEncoded = bodyParser.urlencoded({ limit: '1mb', extended: true }); //
const appPort = require('config').get('APP').apphost;



// all environments
appCluster.set('my_port', process.env.PORT || process.argv[2] || appPort);
appCluster.disable("x-powered-by");



appCluster.use(cors());
appCluster.use(jsonParser);
appCluster.use(urlEncoded);
appCluster.use(compression());

//

appCluster.all("/*", function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST");
    res.header("Access-Control-Allow-Headers", "Cache-Control,Pragma, Origin, Authorization, Content-Type, X-Requested-With,X-XSRF-TOKEN, query,x-access-token");
    next();
});


/************************************************************
 Routes  - Start
 *********************************************************** */

const crmRoutes = require('./router/salescrm.router');
appCluster.use('/api/crm/',crmRoutes);


/************************************************************
 Routes  - End
 *********************************************************** */


// Optional fallthrough error handler
appCluster.use(function onError(err, req, res, next) {
    // The error id is attached to `res.sentry` to be returned
    // and optionally displayed to the user for support.
    res.statusCode = 500;
    //res.end(res.sentry + '\n');
    res.end("system error" + '\n');
});




if (cluster.isMaster) {
    // Fork workers.
    for (var i = 0; i < numCPUs; i++) {
        cluster.fork();
    }

    cluster.on('exit', (worker, code, signal) => {
        console.log(`worker ${worker.process.pid} died`);
    });
} else {
    // Workers can share any TCP connection
    // In this case it is an HTTP server
    http.createServer(appCluster)
        .listen(appPort,
            function(){
                let buf = Buffer.from(`Intelliconnect App API is listening on Port ${appPort}!`, 'ascii');
                console.log(buf.toString('ascii'));
            });
}