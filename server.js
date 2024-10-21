// eslint-disable-next-line n/no-path-concat
require('app-module-path').addPath(`${__dirname}/`);
// require('./instrument.js');
// const Sentry = require("@sentry/node");
const express = require('express');
const bodyParser = require('body-parser');
const http = require('http');
// const { host, httpPort } = require("config");
const { errorHandler } = require('./middleware');
const cors = require('cors');
const path = require('path');
const { sequelize } = require('./models/index');
const https = require('https');
const fs = require('fs');
// const cron = require("node-cron");
// const { checkPolicyExpiryAndSendEmail } = require('./app/utils/cron-jobs')

require('dotenv').config();

const app = express();
// const path = require('path');
app.set(path.join(__dirname));
app.use(express.static(__dirname));
app.use(cors());
app.use((req, res, next) => {
  // Website you wish to allow to connect
  res.setHeader('Access-Control-Allow-Origin', '*');

  // Request methods you wish to allow
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PUT, PATCH, DELETE'
  );

  // Request headers you wish to allow
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-Requested-With,content-type'
  );

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader('Access-Control-Allow-Credentials', true);

  // Pass to next layer of middleware
  next();
});

app.use(bodyParser.json({ limit: '2mb' }));
app.use(bodyParser.urlencoded({ extended: true }));

// // Schedule tasks to be run on the server.
// cron.schedule('0 9 * * *', async () => {
//   await checkPolicyExpiryAndSendEmail();
// });

let httpServer;
if (process.env.NODE_SSL == 'ssl') {
  httpServer = https
    .createServer(
      {
        key: fs.readFileSync(process.env.SSL_PRIV_KEY),
        cert: fs.readFileSync(process.env.SSL_CERT_KEY)
      },
      app,
    )
    .listen(process.env.PORT, () => {
      console.info(`Server up successfully - port: ${process.env.PORT}`);
    });
} else {
//   .createServer(
//     {
//       key: fs.readFileSync('/etc/letsencrypt/live/api.gotrust.tech/privkey.pem'),
//       cert: fs.readFileSync('/etc/letsencrypt/live/api.gotrust.tech/fullchain.pem')
//     },
//     app,
//   )
//   .listen(process.env.PORT, () => {
//     console.info(`Server up successfully - port: ${process.env.PORT}`);
//   });
// }else{
  httpServer = http
    .createServer(app.handle.bind(app))
    .listen(process.env.PORT, () => {
      console.info(`Server up successfully - port: ${process.env.PORT}`);
    });
}

// API routes
// const routes = require('./app')
// app.use('/api', require('./app/index'))
app.use('/api', require('./routes/index'));

// app.get("/debug-sentry", function mainHandler(req, res) {
//   throw new Error("My first Sentry error!!");
// });

// app.use(require("./app/index"));

// Error Middleware
app.use(errorHandler.methodNotAllowed);
// app.use(errorHandler.genericErrorHandler);

// Sentry Express request handler
// Sentry.setupExpressErrorHandler(app);

process.on('unhandledRejection', (err) => {
  console.error('possibly unhandled rejection happened');
  console.error(err.message);
  // Sentry.captureException(err);
  // enabledStackTrace && console.error(`stack: ${err.stack}`);
});
// console.log('connection', Sequelize);
// const con = sequelize.connectionManager
// const closeHandler = () => {
//   Object.values(db).forEach((connection) => connection.close());
//   httpServer.close(() => {
//     console.info("Server is stopped successfully");
//     process.exit(0);
//   });
// };

const closeHandler = () => {
  // eslint-disable-next-line no-unused-expressions
  () => sequelize.close();
  httpServer.close(() => {
    console.info('Server is stopped successfully');
    process.exit(0);
  });
};

process.on('SIGTERM', closeHandler);
process.on('SIGINT', closeHandler);
