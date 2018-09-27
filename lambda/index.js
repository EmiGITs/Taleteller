      /* eslint-disable  func-names */
/* eslint-disable  no-console */
var speechText='Text Failed to download, please retry'; //Variable que almacena el texto sin modificar
var name='Name failed to download, please retry'; //Variable que obtiene el nombre del cuento sin modificar
var Link="Link failed to download, please retry";//Variable que obtiene el link del cuento sin modificar
'use strict';
var KeyValue = 100;


var AWS = require('aws-sdk'),
    mydocumentClient = new AWS.DynamoDB.DocumentClient();
const Alexa = require('ask-sdk-core');
const LaunchRequestHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'LaunchRequest';
  },
  handle(handlerInput) {
    const speechText = 'Welcome to Tale Teller Beta application, specify which tale you want me to read';

    return handlerInput.responseBuilder

      .speak(speechText)
      .reprompt(speechText)
      .withSimpleCard('This is a story', speechText)
      .getResponse();
      
      
  },
};



const StoryIntentHandler = {

  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'StoryIntent';
  },
  
  async handle(handlerInput,event, context, callback) {   //ESTA FUNCION SE TRANSFORMO EN ASYNC
  var i;
  var repeater = []; //array para almacenar los id
  var array = []; //array para almacenar los nombres de los cuentos
  // var speechText = await _getText(event, context, callback); //El resultado del promise Result se almacena en speechText que es el texto del s3 obtenido por GET
  await randomIntInc(100, 109,repeater); //Función que genera 5 numeros aleatorios con los que se van a buscar los cuentos en DynamoDB, almacena estos numeros/id's en el array repeater[]
  for (i = 0; i < 5; i++) {  //For que 
     var KeyValue=repeater[i];
  var result = await _getName(event, context, callback,KeyValue);
 array.push(result);
  }
  console.log(repeater);
  speechText="I have these texts, option 1: "+array[0]+", option 2: "+array[1]+", option 3: "+array[2]+", option 4: "+array[3]+", option 5: "+array[4];
    return handlerInput.responseBuilder
     
      .speak(speechText)
    //  .reprompt(speechText)
      .withSimpleCard('This is a story', speechText)
      .getResponse();
  },
};

function randomIntInc(low, high,repeater) {
     return new Promise(resolve => {
    setTimeout(() => {
      while(repeater.length< 5){
  var randomnumber = Math.floor(Math.random() * (high - low + 1) + low);
    if(repeater.indexOf(randomnumber) > -1) continue;
  repeater[repeater.length]=randomnumber;
        }
        resolve(repeater);
    }, 0);
  });
}


const HelpIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'AMAZON.HelpIntent';
  },
  handle(handlerInput) {
    const speechText = 'You should tell me which tale you want!';

    return handlerInput.responseBuilder
      .speak(speechText)
      .reprompt(speechText)
      .withSimpleCard('Help Card', speechText)
      .getResponse();
  },
};

const CancelAndStopIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && (handlerInput.requestEnvelope.request.intent.name === 'AMAZON.CancelIntent'
        || handlerInput.requestEnvelope.request.intent.name === 'AMAZON.StopIntent');
  },
  handle(handlerInput) {
    const speechText = 'Goodbye!';

    return handlerInput.responseBuilder
      .speak(speechText)
      .withSimpleCard('This is a story', speechText)
      .getResponse();
  },
};

const SessionEndedRequestHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'SessionEndedRequest';
  },
  handle(handlerInput) {
    console.log(`Session ended with reason: ${handlerInput.requestEnvelope.request.reason}`);

    return handlerInput.responseBuilder.getResponse();
  },
};

async function _getText(event, context, callback) { //Función Async que busca el texto del S3 y devuelve el promise resolve
  var Link = await _getLink(event,context,callback); //El resultado del Result en _getLink se almacena en Link
   return new Promise(resolve => {
    setTimeout(() => {
     const https = require("https");
        const url = Link; //Usa el Link recibido de la función _getLink
        https.get(url, res => {
          res.setEncoding("utf8");
          let body = "";
          res.on("data", data => {
            body += data;
          });
          res.on("end", () => {
            resolve(body);
          });
        });
    }, 0); //Modificar este valor aumenta el timeout
  });
  
}

function _getName(event, context, callback,KeyValue) {
  return new Promise(resolve => {
    setTimeout(() => {
     var params = {
        
        TableName : process.env.TABLE_NAME, //Nombre de la tabla, modificarlo en variables de entorno
        ProjectionExpression : "storyName", //Se especifica que atributo de la tabla se esta buscando 
        Key: {
            
    'storyID':KeyValue //storyID es fijo mientras que KeyValue es el ID que se busca, KeyValue se busca en el array Result
   
  }
    };
    mydocumentClient.get(params, function(err, data){
        if(err){
            callback(err ,null);
        }else{
            resolve(data.Item.storyName); //Indica que el resolve sera data.Item.storyName, si se especifica solo Data almacenara el nombre del atributo y el string obtenido
        
        }
    });
    }, 0);
  });
}

function _getLink(event,context,callback) { //Función que busca el link utilizado en _getText por medio del Aws SDK en DynamoDB
   return new Promise(resolve => {
    setTimeout(() => {
   var params = {
        
        TableName : process.env.TABLE_NAME, //Nombre de la tabla, modificarlo en variables de entorno
        ProjectionExpression : "storyLink", //Se especifica que atributo de la tabla se esta buscando 
        Key: {
            
    'storyID':KeyValue //storyID es fijo mientras que KeyValue es el ID que se busca
   
  }
    };
    mydocumentClient.get(params, function(err, data){
        if(err){
            callback(err ,null);
        }else{
            resolve(data.Item.storyLink); //Indica que el resolve sera data.Item.storyLink, si se especifica solo Data almacenara el nombre del atributo y el string obtenido
        
        }
    });
    }, 0); //Modificar este valor aumenta el timeout
  });
}



const ErrorHandler = {
  canHandle() {
    return true;
  },
   async handle(handlerInput, error,event, context, callback) { //ESTA FUNCION SE TRANSFORMO EN ASYNC
    console.log(`Error handled: ${error.message}`);
    return handlerInput.responseBuilder
      .speak('Sorry, I can\'t understand the command. Please say again.')
      .reprompt('Sorry, I can\'t understand the command. Please say again.')
      .getResponse();
  },
};


const skillBuilder = Alexa.SkillBuilders.custom();

exports.handler = skillBuilder

  .addRequestHandlers(
    LaunchRequestHandler,
    StoryIntentHandler,
    //optionIntentHandler,
    HelpIntentHandler,
    CancelAndStopIntentHandler,
    SessionEndedRequestHandler
  )
  .addErrorHandlers(ErrorHandler)
.lambda();
