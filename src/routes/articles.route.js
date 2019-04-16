import { Router } from 'express';

import {
  validateUuid,
  validateRating,
} from './middlewares/validate-input.middleware';
import {
  createComment,
  createThreadedComment,
} from './controllers/comments.controller.js';
import {
  getArticle,
  createArticle,
  likeAnArticle,
  unlikeAnArticle,
  rateArticle,
} from './controllers/articles.controller';
import checkAuthorizedUser from './middlewares/authorized-user.middleware';

const articleRouter = Router();

/**
 * @swagger
 *
 * /api/v1/article:
 *   post:
 *     tags:
 *       - article
 *     description: users can create an article.
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: title
 *         description: the title of the article.
 *         in: body
 *         required: true
 *       - name: description
 *         description: the summary of the article.
 *         in: body
 *         required: true
 *       - name: body
 *         description: the content of the article.
 *         in: body
 *         required: true
 *       - name: images
 *         description: url to all images in the articles. {string} seperated with a comma.
 *         in: body
 *       - name: tags
 *         description: the tag list.
 *         in: body
 *     request:
 *         content:
 *         - application/json
 *         schema:
 *           type: array
 *           items:
 *         $ref: '#/definitions/users'
 *     responses:
 *       201:
 *         description: article created
 *       400:
 *         description: Bad request.
 *       401:
 *         description: Authorization information is missing or invalid.
 *       500:
 *         description: ran
 */
articleRouter.post('/', createArticle);

/**
 * @swagger
 *
 * /:slug/comments:
 *   post:
 *     description: Reset Password
 *     produces:
 *       - application/json
 *     request:
 *         content:
 *         - application/json
 *         schema:
 *           type: array
 *           items:
 *         $ref: '#/definitions/users'
 *     responses:
 *       201:
 *         description: Comment created
 *       400:
 *         description: Bad request.
 *       401:
 *         description: Authorization information is missing or invalid.
 *       404:
 *        description: A user with the specified ID was not found.
 *       5XX:
 *        description: Unexpected error.
 */
articleRouter.post('/:articleId/comments', checkAuthorizedUser, createComment);

/**
 * @swagger
 *
 * /:slug/comments/:commentId/thread:
 *   post:
 *     description: Reset Password
 *     produces:
 *       - application/json
 *     request:
 *         content:
 *         - application/json
 *         schema:
 *           type: array
 *           items:
 *         $ref: '#/definitions/users'
 *     responses:
 *       201:
 *         description: Comment created
 *       400:
 *         description: Bad request.
 *       401:
 *         description: Authorization information is missing or invalid.
 *       404:
 *        description: A user with the specified ID was not found.
 *       5XX:
 *        description: Unexpected error.
 */
articleRouter.post(
  '/:articleId/comments/:commentId/thread',
  checkAuthorizedUser,
  createThreadedComment,
);

/**
 * @swagger
 *
 * /api/v1/article:
 *   post:
 *     tags:
 *       - article
 *     description: users can fetch a single article.
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: articleId
 *         description: the id of the article.
 *         in: params
 *         required: true
 *     request:
 *         content:
 *         - application/json
 *         schema:
 *           type: array
 *           items:
 *         $ref: '#/definitions/article'
 *     responses:
 *       200:
 *         description: article fetched
 *       404:
 *         description: article not found
 *       500:
 *         description: Database error
 */
articleRouter.get('/:articleId', validateUuid, getArticle);
articleRouter.post(
  '/:articleId/rate',
  checkAuthorizedUser,
  validateRating,
  rateArticle,
);

articleRouter.post(
  '/:articleId/rate',
  checkAuthorizedUser,
  validateRating,
  rateArticle,
);

/**
 * @swagger
 *
 * /api/v1/article/:articleId/rate:
 *   post:
 *     tags:
 *       - article
 *     description: users can rate a single article.
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: articleId
 *         description: the id of the article.
 *         in: params
 *         required: true
 *     request:
 *         content:
 *         - application/json
 *         schema:
 *           type: array
 *           items:
 *         $ref: '#/definitions/article'
 *     responses:
 *       200:
 *         description: article rated
 *       404:
 *         description: article not found
 *       500:
 *         description: Database error
 */
articleRouter.post(
  '/:articleId/rate',
  checkAuthorizedUser,
  validateRating,
  rateArticle,
);

/**
 * @swagger
 *
 * /api/v1/article/:articleId/like:
 *   post:
 *     tags:
 *       - article
 *     description: users can like an article.
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: id
 *         description: the id of the user.
 *         from: token in Header
 *         required: true
 *       - name: article id
 *         description: the summary of the article.
 *         in: params
 *         required: true
 *     request:
 *         content:
 *         - application/json
 *         schema:
 *           type: array
 *           items:
 *         $ref: '#/definitions/users'
 *     responses:
 *       200:
 *         description: article liked
 *       400:
 *         description: Bad request.
 *       401:
 *         description: Authorization information is missing or invalid.
 *       500:
 *         description: Server did not process request
 */
articleRouter.post('/:articleId/like', checkAuthorizedUser, likeAnArticle);

/**
 * @swagger
 *
 * /api/v1/article/:articleId/unlike:
 *   post:
 *     tags:
 *       - article
 *     description: users can unlike an article.
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: id
 *         description: the id of the user.
 *         from: token in Header
 *         required: true
 *       - name: article id
 *         description: the summary of the article.
 *         in: params
 *         required: true
 *     request:
 *         content:
 *         - application/json
 *         schema:
 *           type: array
 *           items:
 *         $ref: '#/definitions/users'
 *     responses:
 *       200:
 *         description: article unliked
 *       400:
 *         description: Bad request.
 *       401:
 *         description: Authorization information is missing or invalid.
 *       500:
 *         description: Server did not process request
 */
articleRouter.post('/:articleId/unlike', checkAuthorizedUser, unlikeAnArticle);

export default articleRouter;
