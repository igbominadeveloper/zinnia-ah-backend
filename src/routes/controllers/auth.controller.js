import {
  comparePassword,
  generateToken,
  errorResponse,
  verifyToken,
  successResponse,
  checkDuplicateUser,
  serverError,
} from '../../utils/helpers.utils';
import models from '../../db/models';
import { sendMailer } from '../../config/mail-config';

const { User } = models;
/**
 * Create A User
 * @param {object} req
 * @param {object} res
 * @returns {object} user object
 */
export async function signup(req, res) {
  const { email, username } = req.body;
  const isDuplicate = await checkDuplicateUser(email, username);
  if (isDuplicate) {
    return errorResponse(
      res,
      409,
      'validation error',
      'Username/Email in use already',
    );
  }
  try {
    const user = await User.create(req.body);
    const tokenPayload = {
      id: user.id,
      email: user.email,
    };
    const token = await generateToken(tokenPayload);
    const url =
      process.env.NODE_ENV === 'test'
        ? `${process.env.LOCAL_URL}/${token}`
        : `${process.env.PRODUCTION_URL}/${token}`;
    const emailDetails = {
      receivers: [`${user.email}`],
      subject: 'Verification email',
      text: '',
      html: `Please click this link to confirm your email: <a href="${url}">${url}</a>`,
    };
    await sendMailer(emailDetails);
    return successResponse(
      res,
      201,
      'Please check your mail to verify your account',
      {
        token,
      },
    );
  } catch (err) {
    return serverError(res, 500, message);
  }
}

/**
 *
 *
 * @export
 * @param {object} req
 * @param {object} res
 * @returns {object} response object
 */
export async function confirmUser(req, res) {
  try {
    const decoded = await verifyToken(req.params.token);
    const { id } = decoded;
    const response = await User.update(
      {
        isEmailVerified: true,
      },
      {
        returning: true,
        where: {
          id,
        },
      },
    );
    const responseData = {
      confirmed: response[1][0].isEmailVerified,
    };
    return successResponse(
      res,
      200,
      'Your account has been verified',
      responseData,
    );
  } catch (err) {
    return serverError(res);
  }
}

/**
 * Redirect location after social login
 * @param {object} req
 * @param {object} res
 * @returns {object} response object
 */
export async function socialController(req, res) {
  const { isNewRecord } = req.user._options;
  const user = req.user.dataValues;

  try {
    const tokenPayload = {
      id: user.id,
      email: user.email,
    };
    const token = await generateToken(tokenPayload);
    if (isNewRecord) {
      return successResponse(
        res,
        201,
        'You have successfully registered however you would need to check your mail to verify your account',
        {
          token,
        },
      );
    }
    return successResponse(res, 200, 'You have successfully logged in', {
      user,
      token,
    });
  } catch (err) {
    return serverError(res);
  }
}

/**
 * Login a User
 * @param {object} req
 * @param {object} res
 * @returns {object} login response
 */
export async function login(req, res) {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({
      where: {
        email,
      },
    });
    if (!user) {
      return errorResponse(res, 404, 'Not found');
    }
    if (!comparePassword(user.password, password)) {
      return errorResponse(res, 400, 'Incorrect Password');
    }
    const { id } = user;
    const token = generateToken({
      id,
      email,
    });
    return successResponse(res, 200, 'You have successfully logged in', {
      user,
      token,
    });
  } catch (error) {
    return serverError(res);
  }
}
