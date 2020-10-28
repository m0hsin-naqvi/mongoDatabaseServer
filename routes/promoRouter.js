const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose')
const authenticate = require('../authenticate')

const Promotions = require('../models/promotions');

const promoRouter = express.Router();

promoRouter.use(bodyParser.json());

promoRouter.route('/')
.get((req, res, next)=>{
    Promotions.find({})
    .then(
        result => {
            getResponse(res, result);
        },
        err => next(err)
    )
    .catch(err => next(err));
})
.post(authenticate.verifyUser, (req, res, next)=>{
    Promotions.create(req.body)
			.then(
				result => {
					console.log('Promotion Created', result);
					getResponse(res, result);
				},
				err => next(err)
			)
			.catch(err => next(err));
})
.put(authenticate.verifyUser, (req, res, next)=>{
    res.statusCode = 403;
    res.end('PUT Operation Not Supported on /promotions');
})
.delete(authenticate.verifyUser, (req, res, next)=>{
    Promotions.remove({})
    .then(
        result => {
            console.log('Promotions have been Deleted', result);
            getResponse(res, result);
        },
        err => next(err)
    )
    .catch(err => next(err));
});

promoRouter.route('/:promoId')
    .get((req, res, next) => {
        Promotions.findById(req.params.promoId)
        .then(
            result => {
                console.log('Here is your Promotion', result);
                getResponse(res, result);
            },
            err => next(err)
        )
        .catch(err => next(err));
    })
    .post(authenticate.verifyUser, (req, res, next) => {
        res.statusCode = 403;
    res.end('Post operation not supported on /promotions/ '+ req.params.promoId);
    })
    .put(authenticate.verifyUser, (req, res, next) => {
        Promotions.findByIdAndUpdate(
			req.params.promoId,
			{
				$set: req.body
			},
			{ new: true }
		)
			.then(
				result => {
					console.log('Here is your Promotion', result);
					getResponse(res, result);
				},
				err => next(err)
			)
			.catch(err => next(err));
    })
    .delete(authenticate.verifyUser, (req, res, next) => {
        Promotions.findByIdAndRemove(req.params.promoId)
        .then(
            result => {
                console.log('Promotion has been deleted', result);
                getResponse(res, result);
            },
            err => next(err)
        )
        .catch(err => next(err));    
});

const getResponse = (res, result) => {
	res.statusCode = 200;
	res.setHeader('Content-Type', 'application/json');
	res.json(result);
};


module.exports = promoRouter;



