require('dotenv').config() 

const Primus  = require('primus');
const http    = require('http');
const fs      = require('fs');

const log = require('@ajar/marker')

const {API_PORT,API_HOST} = process.env;

const server = http.createServer((req,res)=> {
        //log the request url
       log.d('req.url: ',req.url);

       res.setHeader('Content-Type', 'text/html');
       fs.createReadStream(__dirname + '/public-chat-client.html').pipe(res);
});

let primus = new Primus(server, {transformer: 'sockjs'});

primus.on('connection', spark => {
  log.d('--> spark.id: ',spark.id);

  spark.on('data', data => {
    log.info('--> message:', data);
    //write incoming message to all connected sockets...
    primus.write(data);
  });
  
});

//start the server
(async ()=> {
  await server.listen(API_PORT,API_HOST);
  log.magenta(`server is live on`,`  ✨ ⚡  http://${API_HOST}:${API_PORT} ✨ ⚡`);  
})().catch(error=> log.error(error))