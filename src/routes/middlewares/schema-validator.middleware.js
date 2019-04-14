import Joi from 'joi';

import { errorResponse } from '../../utils/helpers.utils';
/**
 * @description joi validation schema
 * @param {object} schema
 * @returns {object} {req, res, next}
 */
export default function validateReqBody(schema) {
  return (req, res, next) => {
    const { error } = Joi.validate(req.body, schema, {
      abortEarly: false,
      language: {
        key: '{{key}} ',
      },
    });
    if (error) {
      const validationError = error.details.map(errorItem => errorItem.message);
      return errorResponse(res, 422, 'validation error', validationError);
    }
    return next();
  };
}
