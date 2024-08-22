require('dotenv').config();
const fetch = require("node-fetch");
const fs = require('fs');
const { spawn } = require('child_process');
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
            body: JSON.stringify({ message: 'heartbeat ver. 1.0.0' }),
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
            await emailForm({ body: 'Production DownTime Alert ' + err.message + ' ' + currentStamp() });
        } catch (err1) {
            console.error(err1);
        }
    }

};

const INACTIVITY_TIMEOUT = 3700000; // 1 hour in milliseconds

let inactivityTimer;
let commandProcess;
let logFile;

// Get the command and keys from environment variables
const command = process.env.COMMAND;
const keys = process.env.KEYS.split(' ');
const logFileName = process.env.LOG_FILE;

// Function to create a new writable stream
const createLogFileStream = () => {
    if (logFile)
        logFile.end(); // Close the previous stream if it exists
    return fs.createWriteStream(logFileName, { flags: 'a' });
};

const resetInactivityTimer = () => {
    clearTimeout(inactivityTimer);
    inactivityTimer = setTimeout(() => {
        console.log('No activity detected for 1 hour, restarting the log tail...');
        restartCommand();
    }, INACTIVITY_TIMEOUT);
};

const restartCommand = () => {
    clearTimeout(inactivityTimer);
    if (commandProcess) {
        commandProcess.stdout.unpipe(logFile);
        commandProcess.stderr.unpipe(logFile);
        commandProcess.removeAllListeners('error');
        commandProcess.removeAllListeners('exit');
        commandProcess.kill(); // Terminate the current process
    };
    runCommand();
};

const runCommand = () => {

    logFile = createLogFileStream(); // Create a new stream for each run

    commandProcess = spawn(command, keys);

    // Pipe the stdout and stderr data to the log file
    commandProcess.stdout.pipe(logFile, { end: false });
    commandProcess.stderr.pipe(logFile, { end: false });

    // Reset inactivity timer on data event (indicating activity)
    commandProcess.stdout.on('data', resetInactivityTimer);
    commandProcess.stderr.on('data', resetInactivityTimer);

    // Handle any errors with the process
    commandProcess.on('error', (error) => {
        console.error(`Error executing command: ${error.message}`);
        restartCommand(); // Re-run the function to try again
    });

    // Handle the process exit to properly clean up
    commandProcess.on('exit', () => {
        commandProcess.stdout.unpipe(logFile);
        commandProcess.stderr.unpipe(logFile);
        logFile.end();
    });

    // Start the inactivity timer
    resetInactivityTimer();
};

main();
setInterval(main, 3600000); // ping every 1 hour
runCommand(); // run the logging