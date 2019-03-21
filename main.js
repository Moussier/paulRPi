const http = require('http');
const https = require('https');
const url = require('url');
const Gpio = require('onoff').Gpio;
const LED0 = new Gpio(2, 'out');
const LED1 = new Gpio(3, 'out');
const LED2 = new Gpio(4, 'out');
const sunAPI = "https://api.sunrise-sunset.org/json?lat=48.8873983&lng=2.2913023";
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
      blinkInterval = setInterval(blinkLEDs, 100);
      setTimeout(endBlink, 10000);
      res.end(func + " blink");
      break;
    case "led0":
      if(LED0.readSync() == 0)
        LED0.writeSync(1);
      else
        LED0.writeSync(0);
      res.end(func + " led0");
      break;
    case "led1":
    if(LED1.readSync() == 0)
      LED1.writeSync(1);
    else
      LED1.writeSync(0);
      res.end(func + " led1");
      break;
    case "led2":
      if(LED2.readSync() == 0)
        LED2.writeSync(1);
      else
        LED2.writeSync(0);
      res.end(func + " led2");
      break;
    case "nightorday":
      isNightOrDay();
      res.end("test");
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

function isNightOrDay(){
  https.get(sunAPI, (resp) => {
    var data;
    resp.on('data', (chunk) => {
      data = chunk;
      console.log(data);
      return data;
    });

    resp.on('end', () => {
      console.log("end");
    });

    resp.on("error", (err) => {
      console.log("Error: " + err.message);
    });
  });
}
