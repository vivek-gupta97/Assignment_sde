const app = require('express')();
const { verifyApiKey } = require('../middleware/auth');

// app.use(verifyApiKey);
app.use('/v1', require('./v1/index'));
module.exports = app;
