const Joi = require('joi');

module.exports.listingSchema = Joi.object({
    listing: Joi.object({                   //here listing is a model name
        title: Joi.string().required(),
        description: Joi.string().required(),
        location: Joi.string().required(),
        country: Joi.string().required(),
        price: Joi.number().required().min(0),
        image: Joi.string().allow("", null),
    }).required()
});

module.exports.reviewSchema = Joi.object({
    review: Joi.object({                   //here review is a model name
        rating: Joi.number().required().min(1).max(5),
        comment: Joi.string().required(),
    }).required()
});