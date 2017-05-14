const express = require('express');
const bodyParser = require('body-parser');
const app = express();

const Nexmo = require('nexmo');
const nexmo = new Nexmo({
  apiKey: apiKey,
  apiSecret: apiSecret
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


const server = app.listen(3000);


app.post('/send', (req, res) => {
    // Send SMS

	var userData = req.body;
	
    console.log();
    nexmo.message.sendSms(
    "12035338119", "1" + userData.toNumber, userData.message,
    (err, responseData) => {if (err) {console.log(err)}}
  );
});
