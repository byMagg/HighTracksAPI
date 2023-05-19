const express = require('express');
const path = require('path');
const cors = require('cors');

require('./models/db');
require('dotenv').config();

const apiRouter = require('./routes/index');

const app = express();

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api', apiRouter);

const ctrlAuth = require('./controllers/auth');
ctrlAuth.generateTokenSpotify();

const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Mi API de Tracks',
    version: '1.0.0',
    description: 'Una API para gestionar tracks',
  },
  securityDefinitions: {
    jwt: {
      type: 'apiKey',
      name: 'Authorization',
      in: 'header',
      description: 'Token de autenticación JWT',
    },
  },
  servers: [
    {
      url: '/api',
      description: 'Servidor local',
    },
  ],
};

const options = {
  swaggerDefinition,
  apis: ['./src/routes/*.js',],
};

const swaggerSpec = swaggerJSDoc(options);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use((req, res) => {
  res.status(404).send({
    "error": {
      "code": "404",
      "message": "El recurso solicitado no se encontró en el servidor."
    }
  })
});

module.exports = app;
