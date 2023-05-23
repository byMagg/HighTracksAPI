const openai = require('openai');
const env = require('../common/config');

const config = {
  openai: new openai.Configuration({
    basePath: 'https://dbu104-cnsa.openai.azure.com/openai/deployments/gpt3',
    apiKey: env.OPENAI_KEY,
  }),
};

module.exports = config;
