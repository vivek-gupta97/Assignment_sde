const jwt = require('jsonwebtoken');
const db = require('../models/').sequelize;
const response = require('../response/index');
const httpStatus = require('http-status');
const commonService = require('../services/common');
const { env } = require('../constant/environment');
// const constant = require('./constant/auth');
const { custom } = require('joi');

// This function is used for reqValidator API key

exports.verifyApiKey = async (req, res, next) => {
  try {
    const { Project } = db.models;
    const apiKey = req.headers['x-api-key'];
    const ip = req.hostname || req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    const origin = req.headers.origin || req.headers.referer;
    console.log('apiKey', apiKey, 'ip', ip, 'origin', origin);
    return next();
    if (ip == '::1' || (!origin && req.headers['user-agent'].includes('Postman'))) {
      return next(); // for local development on postman
    }

    if (!apiKey) {
      return response.error(req, res, { msgCode: 'MISSING_API_KEY' }, httpStatus.UNAUTHORIZED);
    }

    const project = await commonService.findByCondition(Project, { token: apiKey });
    if (!project) {
      return response.error(req, res, { msgCode: 'INVALID_API_KEY' }, httpStatus.UNAUTHORIZED);
    }

    if (project.status !== 'active') {
      return response.error(req, res, { msgCode: 'INACTIVE_PROJECT' }, httpStatus.UNAUTHORIZED);
    }

    if (project.ip_address !== ip) {
      return response.error(req, res, { msgCode: 'INVALID_IP' }, httpStatus.UNAUTHORIZED);
    }

    // if (project.domain_name !== origin) {
    //   return response.error(req, res, { msgCode: 'INVALID_ORIGIN' }, httpStatus.UNAUTHORIZED);
    // }

    return next();
  } catch (error) {
    return response.error(req, res, { msgCode: 'INTERNAL_SERVER_ERROR' }, httpStatus.INTERNAL_SERVER_ERROR);
  }
};

// This function is used for generate jwt token

exports.generateAuthJwt = (payload) => {
  const { expires_in, ...params } = payload;
  const token = jwt.sign(params, env.SECRET_KEY, { expiresIn: expires_in });
  if (!token) {
    return false;
  }
  return token;
};

exports.verifyUserToken = (req, res, next) => {
  try {
    // let token = req.headers.authorization;
    // if (!token) {
    //   return response.error(req, res, { msgCode: 'MISSING_TOKEN' }, httpStatus.UNAUTHORIZED);
    // }
    // token = token.replace(/^Bearer\s+/, '');

    // jwt.verify(token, env.SECRET_KEY, async (error, decoded) => {
    //   if (error) {
    //     let msgCode = 'INVALID_TOKEN';
    //     if (error.message === constant.JWT_ERROR.EXPIRED) {
    //       msgCode = 'TOKEN_EXPIRED';
    //     }

    //     return response.error(req, res, { msgCode }, httpStatus.UNAUTHORIZED);
    //   }
    //   req.data = decoded;
    //   return next();
    // });
    const content = req.kauth.grant.access_token.content;

    req.data = {
      email: content.email
    }

    return next();

  } catch (err) {
    console.log(err);
    return response.error(req, res, { msgCode: 'INTERNAL_SERVER_ERROR' }, httpStatus.INTERNAL_SERVER_ERROR);
  }
}


exports.verifyAuthToken = async (req, res, next) => {
  try {
    // let token = req.headers.authorization;
    // if (!token) {
    //   return response.error(req, res, { msgCode: 'MISSING_TOKEN' }, httpStatus.UNAUTHORIZED);
    // }
    // token = token.replace(/^Bearer\s+/, '');

    // jwt.verify(token, env.SECRET_KEY, async (error, decoded) => {
    //   if (error) {
    //     let msgCode = 'INVALID_TOKEN';
    //     if (error.message === constant.JWT_ERROR.EXPIRED) {
    //       msgCode = 'TOKEN_EXPIRED';
    //     }

    //     return response.error(req, res, { msgCode }, httpStatus.UNAUTHORIZED);
    //   }
    //   const { DeviceToken } = db.models;
    //   const tokenValidate = await DeviceToken.findOne({
    //     where: { auth_token: token },
    //   });
    //   if (!tokenValidate) {
    //     return response.error(req, res, { msgCode: "INVALID_TOKEN" }, httpStatus.UNAUTHORIZED);
    //     //   return resolve({ status: 0, message: "Invalid token. Please login." });
    //   }
    //   req.data = decoded;
    //   return next();
    // });

    const content = req.kauth.grant.access_token.content;
    const { User, Customer } = db.models;
    // console.log(content);

    const user = await commonService.findByCondition(User, { email: content.email }, ['id', 'customer_id', 'role_id', 'email']);
    if (!user) {
      return response.error(req, res, { msgCode: 'NOT_REGISTERED_ON_GOTRUST' }, httpStatus.UNAUTHORIZED);
    }

    const customer = await commonService.findByCondition(Customer, { id: user.customer_id }, ['status']);
    if (!customer) {
      return response.error(req, res, { msgCode: 'CUSTOMER_NOT_FOUND' }, httpStatus.UNAUTHORIZED);
    }

    if (customer.status !== 'active') {
      return response.error(req, res, { msgCode: 'INACTIVE_CUSTOMER' }, httpStatus.FORBIDDEN);
    }

    req.data = {
      customer_id: user.customer_id,
      roleId: user.role_id,
      email: user.email,
      userId: user.id
    }

    return next();

  } catch (err) {
    console.log(err);
    return response.error(req, res, { msgCode: 'INTERNAL_SERVER_ERROR' }, httpStatus.INTERNAL_SERVER_ERROR);
  }
};

// function to verify user type you can change it

exports.isCompany = (req, res, next) => {
  try {
    const jwtData = req.data;
    if (jwtData.USER_TYPE !== constant.USER_TYPE.COMPANY) {
      return response.success(req, res, { msgCode: 'UNAUTHORIZED' }, httpStatus.UNAUTHORIZED);
    } else {
      req.data = jwtData;
      return next();
    }
  } catch (err) {
    return response.error(req, res, { msgCode: 'INTERNAL_SERVER_ERROR' }, httpStatus.INTERNAL_SERVER_ERROR);
  }
};

exports.isAdmin = (req, res, next) => {
  try {
    // check role
    const jwtData = req.data;
    if (jwtData.USER_TYPE !== constant.USER_TYPE.ADMIN) {
      return response.success(req, res, { msgCode: 'UNAUTHORIZED' }, httpStatus.UNAUTHORIZED);
    } else {
      req.data = jwtData;
      return next();
    }
  } catch (err) {
    return response.error(req, res, { msgCode: 'INTERNAL_SERVER_ERROR' }, httpStatus.INTERNAL_SERVER_ERROR);
  }
};

exports.verifyToken = (req, res, next) => {
  try {
    const token = req.headers.token;
    if (!token) {
      return response.error(req, res, { msgCode: 'MISSING_TOKEN' }, httpStatus.UNAUTHORIZED);
    }
    jwt.verify(token, env.SECRET_KEY, async (error, decoded) => {
      console.log(error);
      if (error) {
        let msgCode = 'INVALID_TOKEN';
        if (error.message === constant.JWT_ERROR.EXPIRED) {
          msgCode = 'TOKEN_EXPIRED';
        }

        return response.error(req, res, { msgCode }, httpStatus.UNAUTHORIZED);
      }
      req.token = decoded;
      return next();
    });
  } catch (err) {
    return response.error(req, res, { msgCode: 'INTERNAL_SERVER_ERROR' }, httpStatus.INTERNAL_SERVER_ERROR);
  }
};
