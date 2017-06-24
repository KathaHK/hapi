import * as Joi from "joi";

export const createUserModel = Joi.object().keys({
    email: Joi.string().email().trim().required(),
    name: Joi.string().required(),
    password: Joi.string().trim().required()
});

export const updateUserModel = Joi.object().keys({
    email: Joi.string().email().trim(),
    name: Joi.string(),
    password: Joi.string().trim(),
    following: Joi.string(),
});

export const updateUserModelWithScope = Joi.object().keys({
    email: Joi.string().email().trim(),
    name: Joi.string(),
    password: Joi.string().trim(),
    scope: Joi.array().items(Joi.string()).default([]),
    following: Joi.array().items(Joi.string().hex()).default([]),
});

export const loginUserModel = Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().trim().required()
});

export const updateUserModelFollowing = Joi.object().keys({
    following: Joi.string().hex().required(),
});

export const jwtValidator = Joi.object({'authorization': Joi.string().required()}).unknown();