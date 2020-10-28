const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const authenticate = require('../authenticate');

const Leaders = require('../models/leaders');

const leaderRouter = express.Router();

leaderRouter.use(bodyParser.json());

leaderRouter.route('/')
.get((req, res, next)=>{
    Leaders.find({})
    .then(
        result => {
            getResponse(res, result);
        },
        err => next(err)
    )
    .catch(err => next(err));
})
.post(authenticate.verifyUser, (req, res, next)=>{
    Leaders.create(req.body)
			.then(
				result => {
					console.log('Leader Created', result);
					getResponse(res, result);
				},
				err => next(err)
			)
			.catch(err => next(err));
})
.put(authenticate.verifyUser, (req, res, next)=>{
    res.statusCode = 403;
    res.end('PUT Operation Not Supported on /leaders');
})
.delete(authenticate.verifyUser, (req, res, next)=>{
    Leaders.remove({})
    .then(
        result => {
            console.log('Leaders have been Deleted', result);
            getResponse(res, result);
        },
        err => next(err)
    )
    .catch(err => next(err));
})

leaderRouter.route('/:leaderId')
    .get((req, res, next) => {
        Leaders.findById(req.params.leaderId)
        .then(
            result => {
                console.log('Here is your Leader', result);
                getResponse(res, result);
            },
            err => next(err)
        )
        .catch(err => next(err));
    })
    .post(authenticate.verifyUser, (req, res, next) => {
        res.statusCode = 403;
    res.end('Post operation not supported on /leaders/ '+ req.params.leaderId);
    })
    .put(authenticate.verifyUser, (req, res, next) => {
        Leaders.findByIdAndUpdate(
			req.params.leaderId,
			{
				$set: req.body
			},
			{ new: true }
		)
			.then(
				result => {
					console.log('Here is your leader', result);
					getResponse(res, result);
				},
				err => next(err)
			)
			.catch(err => next(err));
    })
    .delete(authenticate.verifyUser, (req, res, next) => {
        Leaders.findByIdAndRemove(req.params.leaderId)
        .then(
            result => {
                console.log('Leader has been deleted', result);
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
    

module.exports = leaderRouter;



