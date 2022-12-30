const fs = require('fs');
const http = require('http');
const requests = require('requests');

const homeFile = fs.readFileSync("home.html", 'utf-8');

const replaceVal = (tempVal, orgVal) => {
    let temperature = tempVal.replace("{%tempval%}", orgVal.current.temp_c);
    temperature = temperature.replace("{%feellike%}", orgVal.current.feelslike_c);
    temperature = temperature.replace("{%cloud%}", orgVal.current.cloud);
    temperature = temperature.replace("{%city%}", orgVal.location.name);
    temperature = temperature.replace("{%country%}", orgVal.location.country);
    temperature = temperature.replace("{%tempstatus%}", orgVal.current.condition.text);
    return temperature;
}

const server = http.createServer((req, res) => {

    if (req.url == "/") {
        requests("http://api.weatherapi.com/v1/current.json?key=%20819e88945c8743b1b4733554222812&q=Nepal&aqi=yes").on("data", (chunk) => {
            const objData = JSON.parse(chunk);
            const arrData = [objData];
            // console.log(arrData[0].current.temp_c);
            const realTimeData = arrData.map((val) =>
                // console.log(val.current.feelslike_c);
                replaceVal(homeFile, val)).join("");
            res.write(realTimeData);
            // console.log(realTimeData);
        })
            .on("end", (err) => {
                if (err) return console.log("Connection closed due to errors!", err);
                res.end();
            });
    }

});
server.listen(8000, '127.0.0.1');