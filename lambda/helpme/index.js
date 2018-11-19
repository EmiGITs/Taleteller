exports.handler = function(event, context, callback) {
   const request = require('request');
request('https://s5rzc2qwbd.execute-api.us-east-1.amazonaws.com/search-es-api-test/?q='+event.query, { json: true }, (err, res, body) => {
  if (err) { 
      return console.log(err); 
  }
  else{
      if (body.hits.total==0){
          context.succeed(0);
      }
      else{
         var output=(body.hits.hits[0]["_source"].storyLink.S);
        context.succeed(output);
      }
            
  }
});
 
};