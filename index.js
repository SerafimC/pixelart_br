const app = require('./config/appConfig.js');
const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/index.html')
});