'use strict';

var KeyValue = 100;

var AWS = require('aws-sdk'),
    mydocumentClient = new AWS.DynamoDB.DocumentClient();




exports.getmystory = function(event, context, callback){
    var params = {
        
        TableName : process.env.TABLE_NAME,
        Key: {
            
    'storyID':KeyValue
   
  }
    };
    mydocumentClient.get(params, function(err, data){
        if(err){
            callback(err ,null);
        }else{
            callback(null, data);
        
        }
    });
}