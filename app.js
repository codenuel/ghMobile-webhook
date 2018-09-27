// This example uses Express to receive webhooks
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
var winston  = require('winston');
var {Loggly} = require('winston-loggly-bulk');

process.env.SECRET_HASH = "MPESATEST"
const port = process.env.PORT || 80
app.set('port', port);
 
 winston.add(new Loggly({
    inputToken: "ac381028-bf71-46aa-95cf-0aa839749139",
    subdomain: "ikediezendukwe",
    tags: ["Winston-NodeJS"],
    json:true
}));
app.use(bodyParser.urlencoded({extended:false, limit: '10mb'}));
app.use(bodyParser.json());

app.get('/', (req, res) => res.send('Hello Loggly!'))


app.post("/mpesa", function(req, res) {
    // retrieve the signature from the header
    var hash = req.headers["verif-hash"];
    
    if(!hash) {
        // discard the request,only a post with rave signature header gets our attention 
        res.json({status: "error", message: "Hash not provided"})
    }
    
    // Get signature stored as env variable on your server
    const secret_hash = process.env.SECRET_HASH;
    
    // check if signatures match
    
    if(hash !== secret_hash) {
     // silently exit, or check that you are passing the write hash on your server.
     res.json({status: "error", message: "Hash not valid"})
    }
    
    // Retrieve the request's body
    var request_json = req.body;
    console.log(request_json);
    winston.log(request_json);
    res.status(200).send({status:"success"});
  });


app.listen(port, '', () => {
    console.log('App listening on port %s', port);
});