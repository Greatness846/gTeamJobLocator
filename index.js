const express = require('express');
const bodyParser = require('body-parser');
const app = express();

const Nexmo = require('nexmo');
const nexmo = new Nexmo({
  apiKey: '1be0d188',
  apiSecret: 'a19666f4552cc9c5'
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));



app.post('/send', (req, res) => {
    // Send SMS

	var userData = req.body;
	
    console.log();
    nexmo.message.sendSms(
    "12035338119", "1" + userData.toNumber, userData.message,
    (err, responseData) => {if (err) {console.log(err)}}
  );

});

const server = app.listen(process.env.port || process.env.PORT || 3000, function(){console.log("Project Running"});