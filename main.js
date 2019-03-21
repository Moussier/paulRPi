const http = require('http');
const url = require('url');
const Gpio = require('onoff').Gpio;
const LED0 = new Gpio(4, 'out');
const LED1 = new Gpio(1, 'out');
const LED2 = new Gpio(2, 'out');
var isBlinking = false;
var blinkInterval;

const functions = ["blink", "led0", "led1", "led2"];

http.createServer(function (req, res) {
  res.writeHead(200, {'Content-Type': 'text/html'});
  var q = url.parse(req.url, true).query;
  var func = q.function;
  if(func == null)
    res.end("no parameter found, please type url host:port/?function=<func>");
  switch(func){
    case "blink":
      blinkInterval = setInterval(blinkLEDs, 1000);
      setTimeout(endBlink, 5000);
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

function blinkLEDs() {
  if(LED0.readSync() == 0){
    LED0.writeSync(1);
    LED1.writeSync(1);
    LED2.writeSync(1);
  }else{
    LED0.writeSync(0);
    LED1.writeSync(0);
    LED2.writeSync(0);
  }
}

function endBlink() {
  clearInterval(blinkInterval);
  LED0.writeSync(0);
  LED1.writeSync(0);
  LED2.writeSync(0);
}
