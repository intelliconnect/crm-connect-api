"use strict";
/**************************************************
 *
 **************************************************/
const unirest = require('unirest');

class FreshSalesConnect{

    /****************************************************************************************************
     Constructor
     *******************************************************************************************************/
    constructor() {
        this.crminfo = require('config').get('FRESHSALES');

        this.FD_ENDPOINT = this.crminfo.endpoint;
        this.PATH = "/api/sign_in";
        this.URL =  "https://" + this.FD_ENDPOINT + ".freshsales.io"+ this.PATH;


        this.sendBlueEmailModel = require('.././model/SendBlueEmail');
        this.sendblueemail= new this.sendBlueEmailModel;

    }


    /**************************************************************************************************************
     * newlead
     **************************************************************************************************************/
    newlead(param_lead,callback) {
        let self = this;

        let _crmnewleadJSON={
            "lead":
                {
                    "first_name":'',
                    "last_name":param_lead.name,
                    "email":param_lead.email,
                    "owner_id":this.crminfo.newlead_ownerid
                }
        };

        let _postURL = this.crminfo.newlead;
        let _baseCompanyName = this.crminfo.companyname;


        this.getSalesCRMLoginToken(function(error,data){
            if (error)
            {
                callback({"success":false, "Error Connecting CRM":error},null);

            }
            else
            {
                let _registerToken = data.auth_token;
                let _headers = {'Content-Type': 'application/json', 'Authorization': 'Token' +
                        ' token='+_registerToken};

                // Add New Lead
                unirest.post(_postURL)
                    .headers(_headers)
                    .send(_crmnewleadJSON)
                    .end(function (response) {

                        if (param_lead.message.trim().length > 0){
                            self.addnote(response.body.lead.id,param_lead.message,_registerToken);
                            self.sendblueemail.sendemail(response.body.lead.email,response.body.lead.display_name)
                        }


                        let _msg = {
                            "success":"true",
                            "message":"Thank You! You have been successfully registered with "+ _baseCompanyName,
                            "details":{
                                "id":response.body.lead.id,
                                "email":response.body.lead.email,
                                "name":response.body.display_name
                            }
                        };

                        callback(null,_msg)
                    });


            }
        });


    }



    /**************************************************************************************************************
     * getSalesCRMLoginToken
 **************************************************************************************************************/
    getSalesCRMLoginToken(callback) {
        let fields =
            {
                "user":
                    {
                        "email":this.crminfo.connectemailid,
                        "password":this.crminfo.connecttoken
                    }
            };
        unirest.post(this.URL)
            .headers({'Accept': 'application/json', 'Content-Type': 'application/json'})
            .send(fields)
            .end(function (response) {
                if(response.body.login ==="success"){
                    callback(null,response.body)
                }else{
                    callback(
                        {
                            "message:":"Unable to register your request. Please email " + this.crminfo.connectemailid
                        },
                        null);
                }

            });

    }

    /**************************************************************************************************************
     * addnote
     **************************************************************************************************************/
    addnote(param_leadid,param_message,param_registerToken) {

        let fields ={
            "note":{"description":param_message,
            "targetable_type":"Lead",
            "targetable_id":param_leadid
        }
        };

        let _headers = {'Content-Type': 'application/json', 'Authorization': 'Token' +
                ' token='+param_registerToken};


        unirest.post(this.crminfo.newlead_notes)
            .headers(_headers)
            .send(fields)
            .end(function (response) {
                if(response.body.login ==="success"){
                    return;
                    //callback(null,response.body)
                }else{
                    //callback({"message:":"Unable to register your request. Please email" +
                    //        " hello@intelliconnect-tech.com"},null);
                    return;
                }

            });

    }

// Class
};

module.exports = FreshSalesConnect;