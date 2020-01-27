'use strict';

// Application Dependencies
const cors = require('cors');
const express = require('express');
const mongoose = require('mongoose');
const errorHandler = require('./error-handler');
const chalk = require('chalk');

// Application Setup
const app = express();
const PORT = process.env.PORT;
const router = express.Router();
const MONGODB_URI = process.env.MONGODB_URI;

//Middleware
app.use(cors());
app.use('/api/v1', router);
//TODO:verify that route names are the same and correct paths
require('../route/user-route')(router);
require('../route/logged-in-user')(router);
require('../route/entries-route')(router);
require('../route/user-change-route')(router);
require('../route/target-route')(router);
require('../route/target-entry')(router);
require('../route/change-target-to-user')(router);
require('../route/user-search')(router);
require('../route/deliver-entries-route')(router);
require('../route/inbox-route')(router);
require('../route/send-invite')(router);
require('../route/add-friend-route')(router);
require('../route/dashboard-route')(router);
require('../route/toggle-priority-route')(router);
require('../route/create-notifications-route')(router);
require('../route/clear-inbox-notifications-route')(router);
require('../route/notifications')(router);
require('../route/accept-friend')(router);
require('../route/delete-friend')(router);
require('../route/password-reset')(router);
require('../route/beta-route')(router);
app.all('/{0,}', (req,res) => errorHandler(new Error('Path Error, Route not found'), res));

//Server Controls
const server = module.exports = {};
server.isOn = false;
server.start = () => {
  return new Promise((resolve, reject) => {
    if(server.isOn) return reject(new Error('Server Running. Cannot start server on same port'));
    return server.http = app.listen(PORT, () => {
      console.log(chalk.red(`listening on ${PORT}`));
      server.isOn = true;
      mongoose.connect(MONGODB_URI, { useNewUrlParser: true });
      return resolve(server);
    });
  });
};

server.stop = () => {
  
  return new Promise((resolve, reject) => {

    if(!server.isOn) return reject(new Error('Server Error. Cannot stop server that is not running.'));
    return server.http.close(() => {
      console.log('this is inside server stop');
      server.isOn = false;
      mongoose.disconnect();
      return resolve(server);
    });
  });
};