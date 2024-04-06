# HeartBeat
Node.js command-line application to monitor the status of production environment

## Description

Node.js command-line application queries another production application hosted in the cloud via it's server API and e-mails if the production application is down

## Table of Contents

  [Title](#title)

  [Description](#description)

  [Installation](#installation)

  [Usage](#usage)

  [License](#license)

  [Contributing](#contributing)

  [Tests](#tests)

  [Questions](#questions)

## Installation

Step 1: clone GitHub repository, for that run the following command from the command line prompt (make sure you navigate to the directory of your choice before start cloning): git clone [git@github.com:vasilyl1/heartbeat.git](https://github.com/vasilyl1/heartbeat.git)

Step 2: navigate to the cloned repositary directory, for that run: cd heartbit

Step 3: install the libraries required by the application by running: NPM install

Step 4: launch the app by typing: node index.js 


## Usage

Refer to the example.env file which explains how to configure the environmental variables for the app to run correctly

Command line syntax to run the app:

node index.js 

## Credits

For e-mails, nodemailer library has been used:
https://www.npmjs.com/package/nodemailer

A light-weight module that brings Fetch API to Node.js:
https://www.npmjs.com/package/node-fetch

Mailgun for SMTP provider to send e-mails https://app.mailgun.com/


## License

MIT License

Copyright (c) 2024 vasilyl1

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

## Questions

My GitHub name is vl1. Most of the answers to the questions can be found there, here is the link to my profile at GitHub:

https://github.com/vl1

For additional questions please e-mail to likhovaido@gmail.com

Thank you for your interest in this app.
