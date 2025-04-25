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
})