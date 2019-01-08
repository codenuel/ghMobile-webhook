const express = require('express')
const app = express()
const port = process.env.PORT || 80
process.env.SECRET_HASH = "MPESATEST"
app.set('port', port);

var winston  = require('winston');
var {Loggly} = require('winston-loggly-bulk');
var expressWinston = require('express-winston');
expressWinston.requestWhitelist.push('body');

app.use(expressWinston.logger({
    transports: [
        new winston.transports.Console({
            json: true,
            colorize: true
        }),
        new winston.transports.File({
            filename: 'combined.log',
            level: 'info'
        }),
        winston.add(new Loggly({
            inputToken: "07ad75c3-e7f3-43df-8387-626f9982ee3c",
            subdomain: "joshuakwaku",
            tags: ["Winston-NodeJS"],
            json:true
        }))
    ]
}));

const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.get('/', (req, res) => res.send('Hello World!'))

app.post("/ghmobile", function(req, res) {
    // retrieve the signature from the header
    winston.info(req.body);
    var hash = req.headers["verif-hash"];
    // var data = req.body;
    // console.log(data);
    
    if(!hash) {
        // discard the request,only a post with rave signature header gets our attention.
        // console.log("Hash not provided");
        res.send({status:"error"});
        process.exit(0)
    }
    
    // // Get signature stored as env variable on your server
    const secret_hash = process.env.SECRET_HASH;
    
    // // check if signatures match
    
    if(hash !== secret_hash) {
     // silently exit, or check that you are passing the write hash on your server.
    //  console.log("Hash not valid");
     res.send({status:"error"});
     process.exit(0)
    }
    
    // Retrieve the request's body
    var request_json = req.body;
    // winston.log("info",request_json);
    res.send({status:"success", data:request_json["flwRef"]});
  });

app.listen(port, '', () => {
    console.log('App listening on port %s', port);
});
