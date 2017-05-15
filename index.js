const express = require('express');
const bodyParser = require('body-parser');
const app = express();

const Nexmo = require('nexmo');
const nexmo = new Nexmo({
  apiKey: '',
  apiSecret: ''
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});


app.post('/send', (req, res) => {
    // Send SMS

	var userData = req.body;
	
    console.log();
    nexmo.message.sendSms(
    "12035338119", "1" + userData.toNumber, userData.message,
    (err, responseData) => {if (err) {console.log(err)}}
  );

});

app.listen(process.env.port || process.env.PORT || 3000, function(){console.log("Project Running")});
