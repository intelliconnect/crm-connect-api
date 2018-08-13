"use strict";
/**************************************************
 *
 **************************************************/
const unirest = require('unirest');

class SendBlueEmail{

    /****************************************************************************************************
     Constructor
     *******************************************************************************************************/
    constructor() {
        this.sendblueinfo = require('config').get('SENDBLUE');

    }


 /**************************************************************************************************************
     * sendemail
     **************************************************************************************************************/
    sendemail(param_newleademail,param_newleadname) {

        let _registerToken = this.sendblueinfo.token;
        let _emailPOSTURL = this.sendblueinfo.email_sendurl;
        let _replytoemail = this.sendblueinfo.email;
        let _greetingstoself = this.sendblueinfo.greetingstoself;
        let _fromemailname = this.sendblueinfo.fromemailname;
        let  _headers = {'Content-Type': 'application/json', 'api-key': _registerToken};


        let _body = { "tags": [ "tran_email" ],
                "sender":
                    {
                        "email": _replytoemail,
                        "name": _fromemailname
                    },
                "to":
                    [ { "email": param_newleademail,
                        "name": param_newleadname } ],
                "bcc": [
                    {
                        "email": _replytoemail,
                        "name": _greetingstoself
                    } ],
                "templateId": 3,
                "replyTo":
                    {
                        "email": _replytoemail,
                        "name": _fromemailname
                    }
        };


        unirest.post(_emailPOSTURL)
            .headers(_headers)
            .send(_body)
            .end(function (response) {
                //console.log(response);
                return;
                // if(response.body.login ==="success"){
                //     return;
                //     //callback(null,response.body)
                // }else{
                //     //callback({"message:":"Unable to register your request. Please email" +
                //     //        " hello@intelliconnect-tech.com"},null);
                //     return;
                // }

            });

    }

// Class
};

module.exports = SendBlueEmail;