const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const basename = path.basename(__filename);
const { env } = require('../constant/environment');
const node_env = env.NODE_ENV || 'development';
const config = require(path.join(__dirname, '/../config/config.js'))[node_env];
const db = {};
// const sequelize = new Sequelize(config);

const sequelize = new Sequelize(process.env.DB_DATABASE_INFO, null, null, {
  dialect: process.env.DB_DIALECT,
  dialectOptions: {
    // ssl: {
    //   require: true,
    //   rejectUnauthorized: false // <<<<<<< YOU NEED THIS
    // }
  },
  port: process.env.DB_PORT,
  replication: {
    write: {
      host: process.env.WRITE_DB_HOST_INFO,
      username: process.env.DB_USERNAME_INFO,
      password: process.env.DB_PASSWORD_INFO,
      // pool: {},
      pool: { max: 15, idle: 5000, min: 1, evict: 1000, acquire: 5000, dialectOptions: {
        statement_timeout:3000,
        idle_in_transaction_session_timeout:2000
      } }
    },
    read: [
      {
        host: process.env.READ_DB_HOST_INFO,
        username: process.env.DB_USERNAME_INFO,
        password: process.env.DB_PASSWORD_INFO,
        // pool: {},
        pool: { max: 15, idle: 5000, min: 1, evict: 1000, acquire: 5000, dialectOptions: {
          statement_timeout:3000,
          idle_in_transaction_session_timeout:2000
        } }
      },
    ],
  },
});

fs.readdirSync(__dirname).filter(file => {
  return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
}).forEach(file => {
  const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
  db[model.name] = model;
});

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

sequelize.authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch((error) => {
    console.error('Unable to connect to the database:', error.message);
  });

sequelize.sync({ force: false, alter: false, logging: false })
  .then(() => {
    console.log(`DB_NAME & tables created!`);
  }).catch((error) => {
    console.log('catchError>>>>>>>>', error);
  });
db.sequelize = sequelize;
db.Sequelize = Sequelize;
// console.log('================================,', db);
module.exports = db;
