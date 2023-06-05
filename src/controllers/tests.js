const mongoose = require('mongoose');
const axios = require('axios');
const Track = mongoose.model('Track');
const config = require('../common/config');
const { sendJSONresponse } = require('../common/request');
const TestGenerationService = require('../services/tests-generation');
const configuration = require('../config/config');
const { OpenAIApi } = require('openai');

/* PUT api/tests */
const generateTests = async (req, res) => {
  try {
    const recommendations = await new TestGenerationService(
      new OpenAIApi(configuration.openai)
    ).getTestGeneration(req.body);
    console.log('Recommendations:', recommendations);
    res.send(recommendations);
  } catch (error) {
    console.error(
      `Error al obtener las recomendaciones de canciones: ${error.message}`
    );
    console.error(error);
    sendJSONresponse(res, 400, {
      error: {
        code: '400',
        message:
          'La solicitud es incorrecta. Verifique que la información proporcionada sea válida y esté completa.',
      },
    });
  }
};

module.exports = {
  generateTests,
};
