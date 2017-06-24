/**
 * Created by Katha on 24.06.17.
 */

import * as Joi from "joi";

export const createPostModel = Joi.object().keys({
    message: Joi.string().required(),
});

export const updateCollectionModel = Joi.object().keys({
    message: Joi.string().required(),
});