const nodemailer = require('nodemailer');
const fs = require('fs');

//transporter for mail
var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'coldbeerstudio@gmail.com',
      pass: 'uswg ewug ntym bdfa'
    }
  });


const SendMail = function(email,subject,mailhtmlpath)
{   
    const htmlTemplate = fs.readFileSync(mailhtmlpath,'utf-8');

    var mailOptions = {
        from: 'coldbeerstudio@gmail.com',
        to: email,
        subject: subject,
        html: htmlTemplate
      };

    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });
}


module.exports = SendMail;



  


