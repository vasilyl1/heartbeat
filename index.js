require('dotenv').config();
const fetch = require("node-fetch");
const nodemailer = require('nodemailer');

const currentStamp = () => new Date().toLocaleString();

const sendMail = (req) => {

    let transporter = nodemailer.createTransport({

        // SMTP configuration
        pool: true,
        host: 'smtp.mailgun.org',
        port: 465,
        secure: true, // use TLS
        auth: {
            user: process.env.EMAIL,
            pass: process.env.PASS
        }
    });

    // Define email options
    let mailOptions = {
        from: process.env.EMAIL,
        to: process.env.EMAILTO,
        subject: 'Warning: Production DownTime Alert',
        //text: `Name: ${userName}\nEmail: ${email}\nMessage: ${message}`
        html: `<p> ${req} </p>`
    };

    // Send email
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error:', error);
            return { error: error, response: null };
        } else {
            //console.log('Email sent:', info.response);
            return { error: null, response: info.response };
        }
    });

};

const emailForm = async (req) => {
    try {
        sendMail(req.body);
    }
    catch (err) {
        console.log(err);
    }
};

const main = async () => {

    try {
        const response = await fetch(process.env.PROD, { // ping the app environment
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': process.env.CAPSITE // this is for protection of the server route
            },
            body: JSON.stringify({message:'heartbeat ver. 1.0.0'}),
        });
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        if (data.message !== 'I am alive!') {
            throw new Error('Production returned an unexpected response!');
        }
        console.log('Production is up and running at:', currentStamp());
    } catch (err) {
        console.error(err);
        try {
            await emailForm({body:'Production DownTime Alert ' + err.message + ' ' + currentStamp()});
        } catch (err1) {
            console.error(err1);
        }
    }

};
main();
setInterval(main,3600000); // 1 hour