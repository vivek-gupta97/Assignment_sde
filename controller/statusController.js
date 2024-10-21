const response = require('../response');
const httpStatus = require('http-status');
const db = require('../models/index').sequelize;
const commonService = require('../services/common');
// const customerService = require('../services/customer');
const { Op } = require('sequelize');


exports.checkStatus = async (req, res) => {
    const { requestId } = req.params;
    const { Products, Requests } = db.models;
    try {
        const statusResult = await commonService.findByCondition(Requests, {request_id: requestId}, {} );
        if (!statusResult) {
            return response.error(req, res, { msgCode: 'REQUEST_ID_NOT_FOUND' }, httpStatus.BAD_REQUEST);
        }
        const products = await commonService.getList(Products, {request_id: requestId}, {} );
        
        for ( let product of products.rows){
            product.input_image_urls = product.input_image_urls.replace(/\n/g, '').split(',');
        }
        if(!products){
            return response.error(req, res, { msgCode: 'REQUEST_ID_NOT_FOUND' }, httpStatus.BAD_REQUEST);
        }
        const data = {
            status: statusResult.status,
            ...products
        }

        return response.success(req, res, { msgCode:"STATUS_FETCHED" , data : data }, httpStatus.OK);
    } catch (error) {
        console.error('Status Check Error:', error);
        return response.error(req, res, { msgCode: "INTERNAL_SERVER_ERROR" }, httpStatus.INTERNAL_SERVER_ERROR);
    }
};
