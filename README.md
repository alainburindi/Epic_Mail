# EpicMail

[![Build Status](https://travis-ci.com/alainburindi/Epic_Mail.svg?branch=develop)](https://travis-ci.com/alainburindi/Epic_Mail)
[![Coverage Status](https://coveralls.io/repos/github/alainburindi/Epic_Mail/badge.svg?branch=ch-testtravis)](https://coveralls.io/github/alainburindi/Epic_Mail?branch=ch-testtravis)

Epic_Mail bootcamp challenge

***EpicMail*** is a mailing service that facilitate the exchange messages/information over the internet

> The internet is increasingly becoming an integral part of lives. Ever since the invention of electronic mail by ​Ray Tomlinson​, emails have grown to become the primary medium of exchanging information over the internet between two or more people, until the advent of Instant Messaging (IM) Apps

# Services

  - User Interface to help user enjoy while using the mailing system 
  -  Provide API endpoints to any one in need

### Tech

**EpicMail** uses a number of open source projects to work properly:

* [node.js] - evented I/O for the backend
* [Express] - fast node.js network app framework [@tjholowaychuk]
* [JsonwebToken] -For API authentification

And of course **EpicMail** itself is open source with a [public repository] on GitHub.

### Installation

EpicMail requires [Node.js](https://nodejs.org/) v10.6.+ to run.

Install the dependencies and devDependencies and start the server.

```sh
$ git clone https://github.com/alainburindi/Epic_Mail.git 
$ cd Epic_Mail
$ npm install -d
$ npm start
```

# Usage

 ### For user interface :
visit this link [EpicMail](https://alainburindi.github.io/Epic_Mail/UI)

### For API Endpoints

The system is hosted [here](https://epic-mail-alain.herokuapp.com/)
Following is the list of endpoints
### GET endpoints
* **"/" :** "the list of avalaible endpoints"
* **"/api/v1/messages"** : "all received messages"
  * Headers (param and value)
    * Content-Type : Application/json
    * Token : Bearer + toke got from **/auth/login** or **/auth/signup**
* **"/api/v1/messages/unread"** : "get all unread messages"
  * Headers (param and value)
    * Content-Type : Application/json
    * Token : Bearer + toke got from **/auth/login** or **/auth/sigup**
* **"/api/v1/messages/sent"** : "get all sent messages"
  * Headers (param and value)
    * Content-Type : Application/json
    * Token : Bearer + toke got from **/auth/login** or **/auth/sigup**
* **"/api/v1/messages/:id"** : "get a specific message"
  * Headers (param and value)
    * Content-Type : Application/json
    * Token : Bearer + toke got from **/auth/login** or **/auth/sigup**

### POST endpoints
Make sure to follow this while sending your data using postman or any other system : 
on the body tab select **x-www-form-urlencoded** or on the raw tab  **select JSON(application/json)** and put your data
* **"/api/v1/auth/signup"** : "get registered"
  * Headers (param and value)
    * Content-Type : Application/json
  * Body (param and value)
    * name : "your name"
    * email : "your email"
    * password : "your password"
    * passwordConfirmation : "type the same password"
* **"/api/v1/auth/login"** : "login if registered"
  * Headers (param and value)
    * Content-Type : Application/json
  * Body (param and value)
    * email : "your email"
    * password : "your password"
* **"/api/v1/auth/messages"** : "create/send a message"
  * Headers (param and value)
    * Content-Type : Application/json
    * Token : Bearer + toke got from **/auth/login** or **/auth/sigup**
  * Body (param and value)
    * subject : "the suvject if empty **"no subject"** will be put
    * message : "the content of your message"

### DELETE endpoints
* **"/api/v1/messages/:id"** : "delete a specific message"
  * Headers (param and value)
    * Content-Type : Application/json
    * Token : Bearer + toke got from **/auth/login** or **/auth/sigup**

# License
----

MIT


**Free Software, Andela bootcamp!**
