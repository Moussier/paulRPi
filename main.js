const http = require('http');
const url = require('url');
//const gpio = require('onoff').Gpio;

const functions = ["blink", "led0", "led1", "led2"];

http.createServer(function (req, res) {
  res.writeHead(200, {'Content-Type': 'text/html'});
  var q = url.parse(req.url, true).query;
  var func = q.function;
  if(func == null)
    res.end("no parameter found, please type url host:port/?function=<func>");
  switch(func){
    case "blink":
      res.end(func + " blink");
      break;
    case "led0":
      res.end(func + " led0");
      break;
    case "led1":
      res.end(func + " led1");
      break;
    case "led2":
      res.end(func + " led2");
      break;
    default:
      res.end(func + " does not exist");
      break;
  }

}).listen(8080);
