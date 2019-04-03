import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import swaggerJSDoc from 'swagger-jsdoc';
import path from 'path';
import router from './routes';

// Create global app object
const app = express();

// Define Static folder for public assets
app.use(express.static(path.join(__dirname, '../doc')));

// enable use of dotenv config file.
dotenv.config();

// swagger definition
const swaggerDefinition = {
  info: {
    title: 'Authors Haven API',
    version: '1.0.0',
    description: 'Official API Documentation for Authors Haven',
  },
  host: `${process.env.HOST_URL}`,
  basePath: '/',
};

// initialize swagger-jsdoc
const swaggerSpec = swaggerJSDoc({
  swaggerDefinition,
  apis: ['./**/routes/*.js'], // pass all in array
});

app.use(cors());

// Normal express config defaults
app.use(require('morgan')('dev'));

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// serve swagger
app.get('/doc', (req, res) => {
  res.send(swaggerSpec);
});

// API routes
app.use('/api/v1', router);

// finally, let's start our server...
const server = app.listen(process.env.PORT || 3000, () => {
  console.log(`Listening on port ${server.address().port}`);
});

export default app;