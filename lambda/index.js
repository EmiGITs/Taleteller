/* eslint-disable  func-names */
/* eslint-disable  no-console */
var speechText='Text Failed to download, please retry'; //Variable que almacena el texto sin modificar
var name='Name failed to download, please retry'; //Variable que obtiene el nombre del cuento sin modificar
var Link="Link failed to download, please retry";//Variable que obtiene el link del cuento sin modificar
'use strict';
var KeyValue=100;
var repeater = [];

//PRUEBA GIT
var AWS = require('aws-sdk'),
    mydocumentClient = new AWS.DynamoDB.DocumentClient();
     AWS.config.region = 'us-east-1';
var lambda = new AWS.Lambda();
const Alexa = require('ask-sdk-core');
const LaunchRequestHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'LaunchRequest';
  },
  handle(handlerInput) {
    const speechText = 'Welcome to Tale Teller Beta application. What do you want to do? I can find a random tale for you or you can specify one, if you want to search by genres just tell me';

    return handlerInput.responseBuilder

      .speak(speechText)
      .reprompt(speechText)
      .withSimpleCard('This is a story', speechText)
      .getResponse();
      
      
  },
};

function getSlotValues(filledSlots) { 
    const slotValues = {}; 
    Object.keys(filledSlots).forEach((item) => { 
        const name  = filledSlots[item].name; 
          slotValues[name] = { 
                heardAs: filledSlots[item].value
          };
    }, this); 
    return slotValues; 
} 

const SpecificIntentHandler = {

  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'SpecificIntent';
      
  },
  
  async handle(handlerInput,event, context, callback) {   //ESTA FUNCION SE TRANSFORMO EN ASYNC
  //return StoryIntentHandler.handle(handlerInput,event, context, callback);
      const request = handlerInput.requestEnvelope.request;
       let slotValues = getSlotValues(request.intent.slots); 
      var index = slotValues.Query.heardAs;
      var Result = await InvokeLambda(event,context,callback,index);
      if (Result=="NULL"){
        speechText="I couldn't find that tale, please specify another one or let me find one for you";
        return handlerInput.responseBuilder
        
         .speak(speechText)
         .reprompt(speechText)
         .withSimpleCard(index + ' not found', speechText)
         .getResponse();
      }
      else{
        Link=Result;
        var speechText= await _getSpecificText(event, context, callback,Link);
        return handlerInput.responseBuilder
        
         .speak(speechText)
         .withSimpleCard(index, speechText)
         .getResponse();
      }
  },
};

async function InvokeLambda(event,context,callback,index){
   return new Promise(resolve => {
    setTimeout(() => {
    var params = {
      TableName: 'storyDB',
      IndexName: 'storyName-index',
      KeyConditionExpression: 'storyName = :v_title',
      ExpressionAttributeValues: {
        ':v_title': index
      },
      "ProjectionExpression": "storyLink",
      "ScanIndexForward": false
    };

    var docClient = new AWS.DynamoDB.DocumentClient();

    docClient.query(params, function(err, data) {
       if (err) callback(err);
       else 
          if (data.Count >= 1) resolve(data.Items[0].storyLink);
          else resolve("NULL");
            
          
    });
    }, 0); //Modificar este valor aumenta el timeout
  });
}



const StoryIntentHandler = {

  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'StoryIntent';
  },
  
  async handle(handlerInput,event, context, callback) {   //ESTA FUNCION SE TRANSFORMO EN ASYNC
  console.log("Hey, i entered");
  var i;
  // var speechText = await _getText(event, context, callback); //El resultado del promise Result se almacena en speechText que es el texto del s3 obtenido por GET
  
  var idsArray = [];
  
  for(var j=1; j<4; j++){
    var base = 100*j;
    for(var k=0; k<7; k++){
      idsArray.push(base+k);
    }
  }
  repeater = getRandomFromArray(idsArray, 5);
  var NamesArray = []; //array para almacenar los nombres de los cuentos

  for (i = 0; i < 5; i++) { 
    var KeyValue=repeater[i];
    var result = await _getName(event, context, callback,KeyValue);
    NamesArray.push(result);
  }
  speechText="I have these tales, option 1: "+NamesArray[0]+", option 2: "+NamesArray[1]+", option 3: "+NamesArray[2]+", option 4: "+NamesArray[3]+", option 5: "+NamesArray[4];
    return handlerInput.responseBuilder
     
      .speak(speechText)
      .reprompt(speechText)
      .withSimpleCard('Random Tales', speechText)
      .getResponse();
  },
};

const ChooseIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'ChooseIntent';
  },
  async handle(handlerInput,event, context, callback) {
      const request = handlerInput.requestEnvelope.request;
      let slotValues = getSlotValues(request.intent.slots); 
      var index = slotValues.StoryOption.heardAs;
       if (index>=1 & index<=5) {
          var KeyValue = repeater[index-1];
          var speechText = await _getText(event, context, callback, KeyValue);
          return handlerInput.responseBuilder
                .speak(speechText)
                .withSimpleCard("Tale ",index, speechText)
                .getResponse();
        } else {
             var speechText='Invalid option, specify one between 1 to 5';
             return handlerInput.responseBuilder
                .speak(speechText)
                .reprompt(speechText)
                .withSimpleCard('Invalid option, specify one between 1 to 5', speechText)
                .getResponse();
        }
  },
};

function getRandomFromArray(arr, n) {
    var result = new Array(n),
        len = arr.length,
        taken = new Array(len);
    if (n > len)
        throw new RangeError("getRandom: more elements taken than available");
    while (n--) {
        var x = Math.floor(Math.random() * len);
        result[n] = arr[x in taken ? taken[x] : x];
        taken[x] = --len in taken ? taken[len] : len;
    }
    return result;
}



function randomIntInc(low, high,repeater) {
     return new Promise(resolve => {
    setTimeout(() => {
      while(repeater.length< 6){
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
    const speechText = "I can search tales by genres or just random tales, if you don't want that i can search specific tales too";

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
      .withSimpleCard('Taleteller exit', speechText)
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

async function _getSpecificText(event, context, callback,Link) { //Función Async que busca el texto del S3 y devuelve el promise resolve
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



async function _getText(event, context, callback, KeyValue) { //Función Async que busca el texto del S3 y devuelve el promise resolve
  var Link = await _getLink(event, context, callback, KeyValue); //El resultado del Result en _getLink se almacena en Link
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
function _getGenres(event, context, callback,KeyValue) {
  return new Promise(resolve => {
    setTimeout(() => {
     var params = {
        
        TableName : process.env.TABLE2_NAME, //Nombre de la tabla, modificarlo en variables de entorno
        ProjectionExpression : "genreName", //Se especifica que atributo de la tabla se esta buscando 
        Key: {
            
    'genreID':KeyValue //storyID es fijo mientras que KeyValue es el ID que se busca, KeyValue se busca en el array Result
   
  }
    };
    mydocumentClient.get(params, function(err, data){
        if(err){
            callback(err ,null);
        }else{
            resolve(data.Item.genreName); //Indica que el resolve sera data.Item.storyName, si se especifica solo Data almacenara el nombre del atributo y el string obtenido
        
        }
    });
    }, 0);
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

function _getLink(event,context,callback,KeyValue) { //Función que busca el link utilizado en _getText por medio del Aws SDK en DynamoDB
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
          //callback(err ,null);
        }
        resolve(data.Item.storyLink); //Indica que el resolve sera data.Item.storyLink, si se especifica solo Data almacenara el nombre del atributo y el string obtenido
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

const GenreIntentHandler = {

  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'GenreIntent';
  },
  
  async handle(handlerInput,event, context, callback) {  
    var i;
    var GenresArray = []; 
    repeater = [1,2,3,4];
    var KeyValue=repeater[i];
    for (i = 0; i < 4; i++) { 
      var KeyValue=repeater[i];
      var result = await _getGenres(event, context, callback,KeyValue);
      GenresArray.push(result);
    }

    //speechText="I have these genres, option 1: "+GenresArray[1]+", option 2: "+GenresArray[2]+", option 3: "+GenresArray[3]+", option 4: "+GenresArray[4];

    speechText="I have these genres: " + GenresArray.join(', ');

      return handlerInput.responseBuilder
     
      .speak(speechText)
      .reprompt(speechText)
      .withSimpleCard('Genres card', speechText)
      .getResponse();
  },
};

const ChooseGenreIntentHandler = {

  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'ChooseGenreIntent';
  },
  
  async handle(handlerInput,event, context, callback) {   //ESTA FUNCION SE TRANSFORMO EN ASYNC
    const request = handlerInput.requestEnvelope.request;
    let genre = request.intent.slots.StoryGenre.resolutions.resolutionsPerAuthority[0].values[0].value; 

    if (genre.id>=1 & genre.id<=3) {
        var i;
        var NamesArray = []; //array para almacenar los nombres de los cuentos
        // var speechText = await _getText(event, context, callback); //El resultado del promise Result se almacena en speechText que es el texto del s3 obtenido por GET
      
        var baseNumber = 100*genre.id;
        var idsArray = [];
        for (var j=0; j<7; j++){
          idsArray.push(baseNumber+j);
        }
        
        repeater = getRandomFromArray(idsArray, 5);
        //await randomIntInc(baseNumber,baseNumber+6,repeater);
      
        for (i = 0; i < 5; i++) { 
          var KeyValue=repeater[i];
          var result = await _getName(event, context, callback,KeyValue);
          NamesArray.push(result);
        }
        speechText="I have these " + genre.name + " texts, option 1: "+NamesArray[0]+", option 2: "+NamesArray[1]+", option 3: "+NamesArray[2]+", option 4: "+NamesArray[3]+", option 5: "+NamesArray[4];
          return handlerInput.responseBuilder
           
            .speak(speechText)
            .reprompt(speechText)
            .withSimpleCard('Select a genre', speechText)
            .getResponse();
        
    } else {
        speechText='Invalid option, specify one between 1 to 3';
        return handlerInput.responseBuilder
          .speak(speechText)
          .reprompt(speechText)
          .withSimpleCard('Invalid option, specify one between 1 to 3', speechText)
          .getResponse();
   }
  },
};

const skillBuilder = Alexa.SkillBuilders.custom();

exports.handler = skillBuilder

  .addRequestHandlers(
    LaunchRequestHandler,
    StoryIntentHandler,
    SpecificIntentHandler,
    GenreIntentHandler,
    ChooseIntentHandler,
    ChooseGenreIntentHandler,
    HelpIntentHandler,
    CancelAndStopIntentHandler,
    SessionEndedRequestHandler
  )
  .addErrorHandlers(ErrorHandler)
.lambda();  
