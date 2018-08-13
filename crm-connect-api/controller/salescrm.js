"use strict";

/**************************************************
 *
 **************************************************/

class salescrm{

    /****************************************************************************************************
     Constructor
     *******************************************************************************************************/
    constructor() {
        this.freshSalesModel = require('.././model/FreshSales');
        this.freshSales= new this.freshSalesModel;
    }


    /**************************************************************************************************************
     *newlead
  **************************************************************************************************************/
      newlead(req,res){

        let self = this;
        if (req.is('json') == false)
        {
            res.status(400).send("Invalid Request - Add New Lead");
            return;
        }

        let newLeadJSON = req.body;

        // Count Keys
        if (Object.keys(newLeadJSON).length !== 3) {
            res.status(400).send({"success":false, "error":"Invalid Keys"});
            return;
        }



        // Check All Elements are proper
        if (newLeadJSON.name === undefined || newLeadJSON.email === undefined || newLeadJSON.message === undefined ){
            res.status(400).send({"success":false, "error":"Invalid Keys"});
            return;
        }


        // Validate Data Length
        if (newLeadJSON.name.length > 50 || newLeadJSON.email.length > 50 || newLeadJSON.message.length >200  ){
            res.status(400).send({"success":false, "error":"Invalid Key Length"});
            return;
        }

        // Rebuild JSON for Model
        let _encodednewLeadJSON ={
            "name":newLeadJSON.name.trim(),
            "email":newLeadJSON.email.trim(),
            "message":newLeadJSON.message.trim()
        };



        this.freshSales.newlead(_encodednewLeadJSON,function(error,data){
            if (error)
            {
                res.status(200).send({
                    "success":false,
                    "error":error
                });

            }
            else
            {
                res.status(200).send(data);

            }
        })

    };


}

module.exports = salescrm;