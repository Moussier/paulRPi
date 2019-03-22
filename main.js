const http = require('http');
const https = require('https');
const url = require('url');
const Gpio = require('onoff').Gpio;
const LED0 = new Gpio(2, 'out');
const LED1 = new Gpio(3, 'out');
const LED2 = new Gpio(4, 'out');
const sunAPI = "https://api.darksky.net/forecast/d8fda5740c09cc8f74251a1575d46954/48.8835,2.3219?exclude=currently,minutely,hourly,alerts,flags";
var blinkInterval;
var sunriseTime;

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
    case "led0": // green led
      if(LED0.readSync() == 0 && isNightOrDay(null) != 0)
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
      isNightOrDay(res);
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

function isNightOrDay(res){
  https.get(sunAPI, (resp) => {
    var data;
    resp.on('data', (chunk) => {
      data = chunk;
      var myObj = JSON.parse(data);
      var sunrise = myObj.daily.data[0].sunriseTime;
      var sunset = myObj.daily.data[0].sunsetTime;
      if(Date.now() / 1000 < sunrise){
        if(res != null)
          res.end("Sun is down, it's too early");
        else
          return 0; // night
      }
      else if (Date.now() / 1000 > sunrise && Date.now() / 1000 < sunset){
        if(res != null)
          res.end("Sun is up, go outside !");
        else
          return 1; // day
      }
      else{
        if(res != null)
          res.end("Sun is down, too late !");
        else
          return 0; // night
      }
    });

    resp.on('end', () => {
      console.log("end");
    });

    resp.on("error", (err) => {
      console.log("Error: " + err.message);
    });
  });
}
