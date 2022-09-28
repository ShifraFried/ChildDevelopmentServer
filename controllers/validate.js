const Joi = require('joi');

const validateChild = (c) => {
    const schema = Joi.object({
        firstName: Joi.string().min(0).max(50).required(),
        lastName: Joi.string().min(0).max(50).required(),
        id: Joi.string().min(9).max(9).required(),
        email: Joi.string().min(5).max(255).required().email(),
        password: Joi.string().min(5).max(255).required(),
        weightHistory: Joi.array().items({
            age: Joi.number(),
            weight: Joi.number(),
            date: Joi.date().max(new Date()).iso()
        }),
        birthDate: Joi.date().max(new Date()).iso()
    });
    return schema.validate(c);
}

module.exports = validateChild;
