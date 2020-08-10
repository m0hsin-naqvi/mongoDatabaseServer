const express = require('express');
const bodyParser = require('body-parser');

const Dishes = require('../models/dishes');

const dishRouter = express.Router();

dishRouter.use(bodyParser.json());

dishRouter
	.route('/')
	.get((req, res, next) => {
		Dishes.find({})
			.then(
				result => {
					getResponse(res, result);
				},
				err => next(err)
			)
			.catch(err => next(err));
	})
	.post((req, res, next) => {
		Dishes.create(req.body)
			.then(
				result => {
					console.log('Dish Created', result);
					getResponse(res, result);
				},
				err => next(err)
			)
			.catch(err => next(err));
	})
	.put((req, res, next) => {
		res.statusCode = 403;
		res.end('PUT Operation Not Supported on /dishes');
	})
	.delete((req, res, next) => {
		Dishes.remove({})
			.then(
				result => {
					console.log('Dish has been Deleted', result);
					getResponse(res, result);
				},
				err => next(err)
			)
			.catch(err => next(err));
	});

dishRouter
	.route('/:dishId')
	.get((req, res, next) => {
		Dishes.findById(req.params.dishId)
			.then(
				result => {
					console.log('Here is your dish', result);
					getResponse(res, result);
				},
				err => next(err)
			)
			.catch(err => next(err));
	})
	.post((req, res, next) => {
		res.statusCode = 403;
		res.end('Post operation not supported on /dishes/ ' + req.params.dishId);
	})
	.put((req, res, next) => {
		Dishes.findByIdAndUpdate(
			req.params.dishId,
			{
				$set: req.body
			},
			{ new: true }
		)
			.then(
				result => {
					console.log('Here is your dish', result);
					getResponse(res, result);
				},
				err => next(err)
			)
			.catch(err => next(err));
	})
	.delete((req, res, next) => {
		Dishes.findByIdAndRemove(req.params.dishId)
			.then(
				result => {
					console.log('Dish has been deleted', result);
					getResponse(res, result);
				},
				err => next(err)
			)
			.catch(err => next(err));
	});

dishRouter
	.route('/:dishId/comments')
	.get((req, res, next) => {
		Dishes.findById(req.params.dishId).then(
			result => {
				console.log('Enter in Get Function');
				if (result) {
					getResponse(res, result.comments);
				} else {
					err = new Error('Dish' + req.params.dishId + 'not found');
					err.status = 404;
					return next(err);
				}
			},
            err => next(err)
            .catch((err) => next(err))
		);
	})
	.post((req, res, next) => {
		Dishes.findById(req.params.dishId).then(result => {
			if (result) {
				dishRouter.comments.push(req.body);
				dishRouter.save().then(
					result => {
						getResponse(res, result);
					},
					err => next(err)
				);
			} else {
				err = new Error('Dish' + req.params.dishId + 'not found');
				err.status = 400;
				return next(err);
			}
		}, (err) => next(err))
        .catch((err) => next(err));
	})
	.put((req, res, next) => {
		res.statusCode = 403;
		res.end('PUT operation not supported on /dishes/' + req.params.dishId + '/comments');
	})
	.delete((req, res, next) => {
		Dishes.findById(req.params.dishId).then(result => {
			if (result) {
				for (let i = dish.comments.length - 1; i >= 0; i--) {
					dishRouter.comments.id(dish.comments[i]._id).remove();
				}
				dish.save().then(
					result => {
						getResponse(res, result);
					},
					err => next(err)
				);
			} else {
				err = new Error('Dish' + req.params.dishId + 'not found');
				err.status = 400;
				return next(err);
			}
		}, (err) => next(err))
        .catch((err) => next(err));
	});

dishRouter
	.route('/:dishId/comments/:commentId')
	.get((req, res, next) => {
		Dishes.findById(req.params.dishId).then(
			result => {
				if (result && result.comments.id(req.params.commentId)) {
					getResponse(res, result.comments.id(req.params.commentId));
				} else if (result == null) {
					err = new Error('Dish' + req.params.dishId + 'not found');
					err.status = 404;
					return next(err);
				} else {
					err = new Error('Comment' + req.params.commentId + 'not found');
					err.status = 404;
					return next(err);
				}
			},
            err => next(err)
            .catch((err) => next(err))
		);
	})
	.post((req, res, next) => {
		res.statusCode = 403;
		res.end(
			'POST operation not supported on /dishes/' +
				req.params.dishId +
				'/comments/' +
				req.params.commentId
		);
	})
	.put((req, res, next) => {
		Dishes.findById(req.params.dishId).then(result => {
			if (result && result.comments.id(req.params.commentId)) {
				if (req.body.rating) {
					result.comments.id(req.params.commentId).rating = req.body.rating;
				}

				if (req.body.comment) {
					result.comments.id(req.params.commentId).comment = req.body.comment;
				}

				result.save().then(
					result => {
						getResponse(res, result);
					},
					err => next(err)
				);
			} else if (result == null) {
				err = new Error('Dish' + req.params.dishId + 'not found');
				err.status = 404;
				return next(err);
			} else {
				err = new Error('Comment' + req.params.commentId + 'not found');
				err.status = 404;
				return next(err);
			}
		},  (err)=> next(err))
        .catch((err) => next(err));
	})
	.delete((req, res, next) => {
		Dishes.findById(req.params.dishId).then(result => {
			if (result && result.comments.id(req.params.commentId)) {
				result.comments.id(req.params.commentId).remove();
				result.save().then(
					result => {
						getResponse(res, result);
					},
					err => next(err)
				);
			} else if (result == null) {
				err = new Error('Dish' + req.params.dishId + 'not found');
				err.status = 404;
				return next(err);
			} else {
				err = new Error('Comment' + req.params.commentId + 'not found');
				err.status = 404;
				return next(err);
			}
        }, (err)=> next(err))
        .catch((err) => next(err));
	});

const getResponse = (res, result) => {
	res.statusCode = 200;
	res.setHeader('Content-Type', 'application/json');
	res.json(result);
};

module.exports = dishRouter;
